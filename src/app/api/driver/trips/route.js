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
    return NextResponse.json({ error: "Invalid trip request." }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "A valid trip action and trip ID are required." }, { status: 400 });
  }

  if (!['start', 'end'].includes(body.action) || typeof body.tripId !== "string" || !body.tripId.trim() || body.tripId.length > 100) {
    return NextResponse.json({ error: "A valid trip action and trip ID are required." }, { status: 400 });
  }

  try {
    const database = await getDatabase();
    const trips = database.collection("trips");
    const shuttles = database.collection("shuttles");
    const activeDriverTrips = database.collection("activeDriverTrips");

    if (body.action === "start") {
      await activeDriverTrips.createIndex({ driverId: 1 }, { unique: true });
      const activeTrip = await trips.findOne({ driverId: driver.id, status: { $in: ["IN_PROGRESS", "DELAYED"] } });
      if (activeTrip) {
        return NextResponse.json({ error: "You already have an active trip." }, { status: 409 });
      }

      const startedAt = new Date();
      await activeDriverTrips.insertOne({ driverId: driver.id, tripId: body.tripId, startedAt });
      try {
        await trips.insertOne({
          id: body.tripId,
          driverId: driver.id,
          shuttleId: driver.assignedShuttleId,
          routeId: driver.assignedRouteId,
          status: "IN_PROGRESS",
          startTime: startedAt,
          endTime: null,
          completedStops: 0,
        });
      } catch (error) {
        await activeDriverTrips.deleteOne({ driverId: driver.id, tripId: body.tripId });
        throw error;
      }
      await shuttles.updateOne(
        { id: driver.assignedShuttleId },
        { $set: { id: driver.assignedShuttleId, driverId: driver.id, status: "IN_SERVICE", updatedAt: startedAt } },
        { upsert: true },
      );
      return NextResponse.json({ tripId: body.tripId, status: "IN_PROGRESS" });
    }

    const endedAt = new Date();
    const result = await trips.updateOne(
      { id: body.tripId, driverId: driver.id, status: { $in: ["IN_PROGRESS", "DELAYED"] } },
      { $set: { status: "COMPLETED", endTime: endedAt } },
    );
    if (!result.matchedCount) {
      return NextResponse.json({ error: "No active trip was found for this driver." }, { status: 404 });
    }

    await shuttles.updateOne(
      { id: driver.assignedShuttleId },
      { $set: { id: driver.assignedShuttleId, driverId: driver.id, status: "AVAILABLE", updatedAt: endedAt } },
      { upsert: true },
    );
    await activeDriverTrips.deleteOne({ driverId: driver.id, tripId: body.tripId });
    return NextResponse.json({ tripId: body.tripId, status: "COMPLETED" });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json({ error: "You already have an active trip." }, { status: 409 });
    }
    console.error("Trip database operation failed.", error);
    return NextResponse.json({ error: "Could not save the trip. Check the MongoDB connection." }, { status: 503 });
  }
}
