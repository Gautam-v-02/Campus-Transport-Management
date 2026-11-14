import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { shuttles } from "@/data/shuttles";
import { routes } from "@/data/routes";
import { trips as sampleTrips } from "@/data/trips";
import { reports as sampleReports } from "@/data/reports";
import { getDatabase } from "@/lib/mongodb";
import { getDriverSession } from "@/lib/driverSession";

export const runtime = "nodejs";

async function getWorkspaceData(driver, database) {
  const shuttleSeed = shuttles.find((item) => item.id === driver.assignedShuttleId);
  const routeSeed = routes.find((item) => item.id === driver.assignedRouteId);
  if (!shuttleSeed || !routeSeed) throw new Error("Driver assignment is not configured.");

  const shuttleCollection = database.collection("shuttles");
  const routeCollection = database.collection("routes");
  const tripsCollection = database.collection("trips");
  const reportsCollection = database.collection("reports");

  await Promise.all([
    shuttleCollection.updateOne({ id: shuttleSeed.id }, { $setOnInsert: shuttleSeed }, { upsert: true }),
    routeCollection.updateOne({ id: routeSeed.id }, { $setOnInsert: routeSeed }, { upsert: true }),
    ...sampleTrips.filter((trip) => trip.driverId === driver.id).map((trip) =>
      tripsCollection.updateOne({ id: trip.id }, { $setOnInsert: trip }, { upsert: true })),
    ...sampleReports.filter((report) => report.driverId === driver.id).map((report) =>
      reportsCollection.updateOne({ id: report.id }, { $setOnInsert: report }, { upsert: true })),
  ]);

  const [shuttle, route, driverTrips, driverReports, latestLocation] = await Promise.all([
    shuttleCollection.findOne({ id: driver.assignedShuttleId }, { projection: { _id: 0 } }),
    routeCollection.findOne({ id: driver.assignedRouteId }, { projection: { _id: 0 } }),
    tripsCollection.find({ driverId: driver.id }, { projection: { _id: 0 } }).sort({ startTime: -1 }).toArray(),
    reportsCollection.find({ driverId: driver.id }, { projection: { _id: 0 } }).sort({ reportedAt: -1 }).toArray(),
    database.collection("shuttleLocations").findOne(
      { driverId: driver.id, shuttleId: driver.assignedShuttleId },
      { projection: { _id: 0 }, sort: { timestamp: -1 } },
    ),
  ]);

  return { driver: { id: driver.id, name: driver.name, email: driver.email }, shuttle, route, trips: driverTrips, reports: driverReports, latestLocation };
}

export async function GET() {
  const driver = await getDriverSession();
  if (!driver) return NextResponse.json({ error: "Driver session expired. Sign in again." }, { status: 401 });

  try {
    const database = await getDatabase();
    return NextResponse.json(await getWorkspaceData(driver, database));
  } catch (error) {
    console.error("Driver workspace database operation failed.", error);
    return NextResponse.json({ error: "Could not load the driver workspace. Check the MongoDB connection and database permissions." }, { status: 503 });
  }
}

export async function POST(request) {
  const driver = await getDriverSession();
  if (!driver) return NextResponse.json({ error: "Driver session expired. Sign in again." }, { status: 401 });

  let body;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid workspace request." }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "A valid workspace action is required." }, { status: 400 });
  }

  try {
    const database = await getDatabase();
    const tripCollection = database.collection("trips");
    const shuttle = shuttles.find((item) => item.id === driver.assignedShuttleId);
    const tripId = typeof body.tripId === "string" && body.tripId.length <= 100 ? body.tripId : "";

    if (body.action === "stop") {
      const activeTrip = await tripCollection.findOne({ id: tripId, driverId: driver.id, status: "IN_PROGRESS" });
      if (!activeTrip) return NextResponse.json({ error: "No active trip was found." }, { status: 409 });
      const route = routes.find((item) => item.id === activeTrip.routeId);
      const totalStops = route?.stops.length || 0;
      if (activeTrip.completedStops >= totalStops) {
        return NextResponse.json({ error: "All stops are already marked as reached." }, { status: 409 });
      }
      const result = await tripCollection.updateOne(
        { id: tripId, driverId: driver.id, status: "IN_PROGRESS", completedStops: activeTrip.completedStops },
        { $inc: { completedStops: 1 }, $set: { updatedAt: new Date() } },
      );
      if (!result.modifiedCount) return NextResponse.json({ error: "Trip progress changed. Refresh and try again." }, { status: 409 });
      return NextResponse.json({ completedStops: Math.min(activeTrip.completedStops + 1, route?.stops.length || activeTrip.completedStops + 1) });
    }

    if (body.action === "resume") {
      if (!tripId) return NextResponse.json({ error: "A valid trip ID is required." }, { status: 400 });
      const result = await tripCollection.updateOne({ id: tripId, driverId: driver.id, status: "DELAYED" }, { $set: { status: "IN_PROGRESS", updatedAt: new Date() } });
      if (!result.matchedCount) return NextResponse.json({ error: "The trip status changed. Refresh and try again." }, { status: 409 });
      return NextResponse.json({ status: "IN_PROGRESS" });
    }

    if (body.action === "report") {
      const report = body.report;
      const categories = ["TRAFFIC_CONGESTION", "VEHICLE_BREAKDOWN", "ROAD_BLOCKAGE", "WEATHER_CONDITIONS", "OTHER"];
      if (!report || typeof report !== "object" || !categories.includes(report.category)
        || typeof report.description !== "string" || report.description.length > 1000
        || !Number.isInteger(report.estimatedDelayMinutes) || report.estimatedDelayMinutes < 1 || report.estimatedDelayMinutes > 240
        || !tripId || report.tripId !== tripId) {
        return NextResponse.json({ error: "Incident details are invalid." }, { status: 400 });
      }
      const activeTrip = await tripCollection.findOne({ id: tripId, driverId: driver.id, status: { $in: ["IN_PROGRESS", "DELAYED"] } });
      if (!activeTrip) return NextResponse.json({ error: "Incident reports require an active trip." }, { status: 409 });
      const savedReport = {
        id: randomUUID(), driverId: driver.id, tripId,
        category: report.category, description: report.description,
        estimatedDelayMinutes: report.estimatedDelayMinutes, reportedAt: new Date(),
      };
      await database.collection("reports").insertOne(savedReport);
      let status = activeTrip.status;
      if (status === "IN_PROGRESS") {
        await tripCollection.updateOne({ id: tripId, driverId: driver.id, status: "IN_PROGRESS" }, { $set: { status: "DELAYED", delay: savedReport, updatedAt: new Date() } });
        status = "DELAYED";
      }
      return NextResponse.json({ report: savedReport, status });
    }

    if (body.action === "occupancy") {
      if (!shuttle || !Number.isInteger(body.occupiedSeats) || body.occupiedSeats < 0 || body.occupiedSeats > shuttle.capacity) {
        return NextResponse.json({ error: "Passenger count is outside the shuttle capacity." }, { status: 400 });
      }
      await database.collection("shuttles").updateOne(
        { id: driver.assignedShuttleId },
        { $set: { occupiedSeats: body.occupiedSeats, updatedAt: new Date() } },
        { upsert: true },
      );
      return NextResponse.json({ occupiedSeats: body.occupiedSeats });
    }

    return NextResponse.json({ error: "Unknown workspace action." }, { status: 400 });
  } catch (error) {
    console.error("Driver workspace update failed.", error);
    return NextResponse.json({ error: "Could not save this update. Check the MongoDB connection." }, { status: 503 });
  }
}
