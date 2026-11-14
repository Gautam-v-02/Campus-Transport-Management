import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { getDriverSession } from "@/lib/driverSession";

export const runtime = "nodejs";

export async function POST(request) {
  const driver = await getDriverSession();
  if (!driver) return NextResponse.json({ error: "Driver session expired. Sign in again." }, { status: 401 });

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid location request." }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "A valid location payload is required." }, { status: 400 });
  }

  const { latitude, longitude, accuracy, speed, timestamp, tripId } = body;
  const validCoordinates = typeof latitude === "number" && Number.isFinite(latitude)
    && latitude >= -90 && latitude <= 90
    && typeof longitude === "number" && Number.isFinite(longitude)
    && longitude >= -180 && longitude <= 180;
  const validAccuracy = typeof accuracy === "number" && Number.isFinite(accuracy)
    && accuracy >= 0 && accuracy <= 10000;
  const validSpeed = speed === null || (typeof speed === "number"
    && Number.isFinite(speed) && speed >= 0 && speed <= 100);
  const validTime = typeof timestamp === "number" && Number.isFinite(timestamp)
    && Math.abs(Date.now() - timestamp) <= 2 * 60 * 1000;

  if (!validCoordinates || !validAccuracy || !validSpeed || !validTime
    || typeof tripId !== "string" || tripId.length > 100) {
    return NextResponse.json({ error: "Location coordinates, accuracy, time, or trip ID are invalid." }, { status: 400 });
  }

  try {
    const database = await getDatabase();
    const trip = await database.collection("trips").findOne({
      id: tripId,
      driverId: driver.id,
      shuttleId: driver.assignedShuttleId,
      status: { $in: ["IN_PROGRESS", "DELAYED"] },
    });
    if (!trip) {
      return NextResponse.json({ error: "Location updates require this driver's active trip." }, { status: 409 });
    }

    const location = {
      shuttleId: driver.assignedShuttleId,
      tripId,
      driverId: driver.id,
      latitude,
      longitude,
      accuracy,
      speed,
      timestamp: new Date(timestamp),
    };

    await database.collection("shuttleLocations").insertOne(location);
    await database.collection("shuttles").updateOne(
      { id: driver.assignedShuttleId },
      {
        $set: {
          id: driver.assignedShuttleId,
          driverId: driver.id,
          status: "IN_SERVICE",
          currentLocation: location,
          updatedAt: location.timestamp,
        },
      },
      { upsert: true },
    );

    return NextResponse.json({ saved: true, timestamp: location.timestamp });
  } catch (error) {
    console.error("Location database operation failed.", error);
    return NextResponse.json({ error: "Could not save the location. Check the MongoDB connection." }, { status: 503 });
  }
}
