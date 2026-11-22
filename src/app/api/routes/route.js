import dbConnect from '@/lib/mongodb';
import Route from '@/models/Route';
import { NextResponse } from 'next/server';

function addMinutesToTime(timeStr, minutesToAdd) {
  const [hours, mins] = (timeStr || '08:00').split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(mins)) return null;

  const totalMinutes = hours * 60 + mins + Number(minutesToAdd || 0);
  const wrapped = ((totalMinutes % 1440) + 1440) % 1440;
  const h = String(Math.floor(wrapped / 60)).padStart(2, '0');
  const m = String(wrapped % 60).padStart(2, '0');
  return `${h}:${m}`;
}

function attachArrivalTimes(routeObj) {
  const sortedStops = [...(routeObj.stops || [])].sort((a, b) => a.order - b.order);
  const stopsWithEta = sortedStops.map((stop) => ({
    ...stop,
    expectedArrival: addMinutesToTime(routeObj.departureTime, stop.minutesFromStart),
  }));

  return {
    ...routeObj,
    stops: stopsWithEta,
  };
}

// GET: Fetch all routes or search trips by ?from=...&to=...
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from')?.trim().toLowerCase();
    const to = searchParams.get('to')?.trim().toLowerCase();

    const routes = await Route.find({}).lean();
    let results = routes.map(attachArrivalTimes);

    if (from && to) {
      results = results
        .map((route) => {
          const fromIndex = route.stops.findIndex((s) =>
            s.name.toLowerCase().includes(from)
          );
          const toIndex = route.stops.findIndex((s) =>
            s.name.toLowerCase().includes(to)
          );

          if (fromIndex === -1 || toIndex === -1 || fromIndex >= toIndex) {
            return null;
          }

          const pickupStop = route.stops[fromIndex];
          const dropoffStop = route.stops[toIndex];

          return {
            ...route,
            tripSummary: {
              from: pickupStop.name,
              to: dropoffStop.name,
              expectedPickupTime: pickupStop.expectedArrival,
              expectedDropoffTime: dropoffStop.expectedArrival,
              estimatedDurationMins: dropoffStop.minutesFromStart - pickupStop.minutesFromStart,
            },
          };
        })
        .filter(Boolean);
    }

    return NextResponse.json({ success: true, data: results }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// POST: Create a new route
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const newRoute = await Route.create(body);
    return NextResponse.json({ success: true, data: newRoute }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}