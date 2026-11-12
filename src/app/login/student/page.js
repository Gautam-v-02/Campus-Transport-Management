'use client';

import { useEffect, useState } from 'react';
import {
  getCrowdLevel,
  getDrivers,
  getRoutes,
  getShuttles,
  getTrips,
} from '@/lib/mockStore';

function getStudentShuttleRoutes() {
  const drivers = getDrivers();
  const routes = getRoutes();
  const shuttles = getShuttles();
  const trips = getTrips();

  return drivers.flatMap((driver) => {
    const shuttle = shuttles.find((item) => item.id === driver.assignedShuttleId);
    const route = routes.find((item) => item.id === driver.assignedRouteId);
    if (!shuttle || !route) return [];

    const activeTrip = trips.find((trip) =>
      trip.driverId === driver.id && ['IN_PROGRESS', 'DELAYED'].includes(trip.status),
    );

    return [{
      id: route.id,
      name: route.routeName,
      stops: route.stops.map((stop) => stop.name),
      capacity: shuttle.capacity,
      occupiedSeats: shuttle.occupiedSeats,
      crowdLevel: getCrowdLevel(shuttle.occupiedSeats, shuttle.capacity),
      status: activeTrip?.status || shuttle.status,
      shuttleId: shuttle.shuttleNumber,
    }];
  });
}

function routeMatchesJourney(route, pickup, destination) {
  const stops = route.stops.map((stop) => stop.toLowerCase());
  const pickupText = pickup.trim().toLowerCase();
  const destinationText = destination.trim().toLowerCase();
  const pickupIndex = pickupText
    ? stops.findIndex((stop) => stop.includes(pickupText) || pickupText.includes(stop))
    : 0;
  const destinationIndex = destinationText
    ? stops.findIndex((stop) => stop.includes(destinationText) || destinationText.includes(stop))
    : stops.length - 1;

  return pickupIndex >= 0 && destinationIndex >= 0 && destinationIndex !== pickupIndex;
}

export default function StudentDashboard() {
  // Journey search state
  const [pickup, setPickup] = useState('Boys Hostel');
  const [destination, setDestination] = useState('Main Gate');
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [availableRoutes, setAvailableRoutes] = useState([]);
  const [fleetReady, setFleetReady] = useState(false);

  useEffect(() => {
    function refreshFleet() {
      setAvailableRoutes(getStudentShuttleRoutes());
      setFleetReady(true);
    }

    refreshFleet();
    window.addEventListener('storage', refreshFleet);
    window.addEventListener('focus', refreshFleet);

    return () => {
      window.removeEventListener('storage', refreshFleet);
      window.removeEventListener('focus', refreshFleet);
    };
  }, []);

  const matchingRoutes = searchTriggered
    ? availableRoutes.filter((route) => routeMatchesJourney(route, pickup, destination))
    : availableRoutes;

  return (
    <main className="min-h-screen bg-white text-black selection:bg-black selection:text-white flex flex-col">

      {/* Top Navbar */}
      <nav className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center bg-black text-white text-xs font-mono font-bold">
            CT
          </div>
          <span className="font-semibold tracking-tight text-sm">
            CampusTransit <span className="text-gray-400 font-mono text-xs">// Module 1: Student Transport</span>
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-gray-500">USER: STUDENT</span>
          <a
            href="/login"
            className="border border-gray-200 px-3 py-1.5 hover:border-black transition"
          >
            Logout
          </a>
        </div>
      </nav>

      {/* Main Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 flex-1">

        {/* Left Panel: Journey Planner & Results (5 Cols) */}
        <div className="lg:col-span-5 border-r border-gray-200 p-6 lg:p-8 space-y-6 overflow-y-auto">
          
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-gray-400">Module 01</span>
            <h1 className="text-2xl font-bold tracking-tight mt-1">Journey Planner</h1>
            <p className="text-xs text-gray-500 font-mono mt-1">Search campus stops and check shuttle status and seating.</p>
          </div>

          {/* Search Inputs Card */}
          <div className="border border-gray-200 bg-gray-50 p-5 space-y-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1">
                Pickup Location
              </label>
              <div className="flex items-center gap-2.5 bg-white border border-gray-200 p-3">
                <span className="h-2 w-2 bg-black flex-shrink-0"></span>
                <input
                  type="text"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="w-full text-sm font-medium text-black bg-transparent outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1">
                Destination Location
              </label>
              <div className="flex items-center gap-2.5 bg-white border border-gray-200 p-3">
                <span className="h-2 w-2 border border-black flex-shrink-0"></span>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full text-sm font-medium text-black bg-transparent outline-none font-mono"
                />
              </div>
            </div>

            <button
              onClick={() => setSearchTriggered(true)}
              className="w-full bg-black text-white text-center py-3 text-xs font-mono uppercase tracking-wider hover:bg-gray-800 transition"
            >
              Search Routes & Shuttles →
            </button>
          </div>

          {/* Available Routes Results */}
          <div className="space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-gray-400">
              {searchTriggered ? 'Matching Routes Found' : 'Campus Shuttle Fleet'}
            </h2>

            {!fleetReady && <p className="border border-gray-200 p-4 text-sm text-gray-500">Loading shuttle data…</p>}
            {fleetReady && matchingRoutes.length === 0 && (
              <p className="border border-gray-200 p-4 text-sm text-gray-500">
                {searchTriggered ? 'No route serves both of those stops.' : 'No shuttle routes are available.'}
              </p>
            )}

            {matchingRoutes.map((route) => (
              <div key={route.id} className="border border-gray-200 bg-white p-4 space-y-3 hover:border-black transition">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono bg-gray-100 px-2 py-0.5 font-bold">{route.shuttleId} · {route.id}</span>
                    <h3 className="text-sm font-bold mt-1">{route.name}</h3>
                  </div>
                  <span className="text-xs font-mono font-bold bg-gray-100 px-2 py-0.5">
                    {route.status.replaceAll('_', ' ')}
                  </span>
                </div>

                <div className="text-xs text-gray-500 font-mono">
                  Stops: {route.stops.join(' → ')}
                </div>

                <div className="border-t border-gray-100 pt-3 flex justify-between items-center text-xs font-mono">
                  <div>
                    <span className="text-gray-400">Capacity: </span>
                    <span className="font-bold text-black">{route.occupiedSeats} / {route.capacity} seats</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Crowd: </span>
                    <span className="font-semibold text-black">{route.crowdLevel}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right Panel: Campus Map Overview (7 Cols) */}
        <div className="lg:col-span-7 bg-gray-50 p-6 lg:p-8 flex flex-col justify-between relative min-h-[400px]">
          
          <div className="flex justify-between items-center z-10">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-gray-400">Geospatial Feed</span>
              <h3 className="text-sm font-bold font-mono">Campus Map & Shuttle Live Tracking</h3>
            </div>
            <div className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 text-xs font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>LIVE_FEED_ACTIVE</span>
            </div>
          </div>

          {/* Map Placeholder / Leaflet Integration Area */}
          <div className="my-auto border border-gray-200 bg-white p-12 text-center relative overflow-hidden my-8">
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
            
            <div className="relative z-10 max-w-sm mx-auto space-y-3">
              <div className="text-4xl">🗺️</div>
              <h4 className="text-sm font-bold font-mono">Interactive Leaflet Map Canvas</h4>
              <p className="text-xs text-gray-500">
                Campus stops (Main Gate, Hostels, Academic Block) and active shuttle markers will render here.
              </p>
              <div className="pt-2">
                <span className="inline-block bg-black text-white text-[10px] font-mono px-3 py-1 uppercase tracking-widest">
                  Module 1 Canvas Ready
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-xs font-mono text-gray-400 z-10">
            <p>LAT: 31.2550° N, LNG: 75.7040° E</p>
            <p>SYSTEM_STATUS: OPERATIONAL</p>
          </div>

        </div>

      </div>

    </main>
  );
}
