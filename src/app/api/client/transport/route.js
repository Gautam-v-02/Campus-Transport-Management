import { NextResponse } from "next/server";
import { drivers } from "@/data/drivers";
import { routes as seedRoutes } from "@/data/routes";
import { shuttles as seedShuttles } from "@/data/shuttles";
import { getClientSessionId } from "@/lib/clientSession";
import { getDatabase } from "@/lib/mongodb";

export const runtime = "nodejs";

function prepareStops(stops = []) {
  return stops
    .map((stop, index) => {
      const sequence = stop.sequence ?? stop.order ?? index + 1;
      return {
        id: stop.id || `STOP-${sequence}`,
        name: typeof stop === "string" ? stop : stop.name,
        sequence,
      };
    })
    .filter((stop) => stop.name)
    .sort((first, second) => first.sequence - second.sequence);
}

export async function GET() {
  const clientId = await getClientSessionId();
  if (!clientId) {
    return NextResponse.json({ error: "Please sign in to view shuttle information." }, { status: 401 });
  }

  try {
    const database = await getDatabase();
    const client = await database.collection("clients").findOne({ id: clientId }, { projection: { _id: 1 } });
    if (!client) {
      return NextResponse.json({ error: "Client account not found." }, { status: 401 });
    }

    const driverIds = drivers.map((driver) => driver.id);
    const shuttleIds = drivers.map((driver) => driver.assignedShuttleId);
    const [savedShuttles, trips, locations] = await Promise.all([
      database.collection("shuttles").find({ id: { $in: shuttleIds } }, { projection: { _id: 0 } }).toArray(),
      database.collection("trips").find({ driverId: { $in: driverIds } }, { projection: { _id: 0 } }).sort({ startTime: -1 }).toArray(),
      database.collection("shuttleLocations").find({ driverId: { $in: driverIds } }, { projection: { _id: 0 } }).sort({ timestamp: -1 }).limit(100).toArray(),
    ]);

    const fleet = drivers.flatMap((driver) => {
      const route = seedRoutes.find((item) => item.id === driver.assignedRouteId);
      const shuttle = seedShuttles.find((item) => item.id === driver.assignedShuttleId);
      if (!route || !shuttle) return [];

      const currentShuttle = {
        ...shuttle,
        ...savedShuttles.find((item) => item.id === shuttle.id),
      };
      const driverTrips = trips.filter((trip) => trip.driverId === driver.id);
      const activeTrip = driverTrips.find((trip) => ["IN_PROGRESS", "DELAYED"].includes(trip.status)) || null;
      const stops = prepareStops(route.stops);
      const completedStops = activeTrip?.completedStops || 0;
      const latestLocation = activeTrip
        ? locations.find((item) => item.driverId === driver.id && item.tripId === activeTrip.id) || null
        : null;

      return [{
        id: route.id,
        routeName: route.routeName,
        name: route.routeName,
        stops,
        driverName: driver.name,
        shuttleId: shuttle.id,
        shuttleNumber: shuttle.shuttleNumber,
        capacity: currentShuttle.capacity,
        occupiedSeats: currentShuttle.occupiedSeats,
        availableSeats: currentShuttle.capacity - currentShuttle.occupiedSeats,
        shuttleStatus: currentShuttle.status,
        status: activeTrip?.status || currentShuttle.status || "AVAILABLE",
        completedStops,
        nextStop: activeTrip ? stops[completedStops]?.name || "Route complete" : null,
        activeTripId: activeTrip?.id || null,
        currentLocation: latestLocation ? {
          latitude: latestLocation.latitude,
          longitude: latestLocation.longitude,
          accuracy: latestLocation.accuracy,
          timestamp: latestLocation.timestamp,
        } : null,
        lastUpdated: latestLocation?.timestamp || currentShuttle.updatedAt || activeTrip?.updatedAt || null,
      }];
    });

    return NextResponse.json({ routes: fleet }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Client transport lookup failed.", error);
    return NextResponse.json({ error: "Could not load shuttle information." }, { status: 503 });
  }
}
