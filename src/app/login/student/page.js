'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CampusMap } from '@/components/CampusMap';

function routeMatchesJourney(route, pickup, destination) {
  const stops = route.stops.map((stop) => (typeof stop === 'string' ? stop : stop.name).toLowerCase());
  const pickupText = pickup.trim().toLowerCase();
  const destinationText = destination.trim().toLowerCase();
  const pickupIndex = pickupText
    ? stops.findIndex((stop) => stop.includes(pickupText) || pickupText.includes(stop))
    : 0;
  const destinationIndex = destinationText
    ? stops.findIndex((stop) => stop.includes(destinationText) || destinationText.includes(stop))
    : stops.length - 1;

  return pickupIndex >= 0 && destinationIndex > pickupIndex;
}

export default function StudentDashboard() {
  const router = useRouter();
  const [client, setClient] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState('');
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  // Journey search state
  const [pickup, setPickup] = useState('University Main Gate');
  const [destination, setDestination] = useState('Sports Complex');
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [availableRoutes, setAvailableRoutes] = useState([]);
  const [fleetReady, setFleetReady] = useState(false);
  const [fleetError, setFleetError] = useState('');
  const [userPosition, setUserPosition] = useState(null);
  const [locationMessage, setLocationMessage] = useState('');
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function checkClientSession() {
      try {
        const response = await fetch('/api/client/session');
        if (response.status === 401) {
          router.replace('/client/login');
          return;
        }
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Could not verify your account.');
        if (!cancelled) setClient(result.client);
      } catch (error) {
        if (!cancelled) setAuthError(error.message || 'Could not verify your account.');
      } finally {
        if (!cancelled) setAuthReady(true);
      }
    }

    checkClientSession();
    return () => { cancelled = true; };
  }, [router]);

  useEffect(() => {
    let cancelled = false;
    let requestPending = false;

    async function refreshFleet() {
      if (requestPending) return;
      requestPending = true;
      try {
        const response = await fetch('/api/client/transport', { cache: 'no-store' });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Could not load shuttle information.');
        if (cancelled) return;
        const routes = result.routes || [];
        setAvailableRoutes(routes);
        setSelectedRouteId((currentId) => routes.some((route) => route.id === currentId)
          ? currentId
          : routes[0]?.id || null);
        setFleetError('');
      } catch (error) {
        if (!cancelled) setFleetError(error.message || 'Could not load shuttle information.');
      } finally {
        requestPending = false;
        if (!cancelled) setFleetReady(true);
      }
    }

    refreshFleet();
    const refreshTimer = window.setInterval(refreshFleet, 5000);
    window.addEventListener('focus', refreshFleet);

    return () => {
      cancelled = true;
      window.clearInterval(refreshTimer);
      window.removeEventListener('focus', refreshFleet);
    };
  }, []);

  async function logout() {
    try {
      await fetch('/api/client/session', { method: 'DELETE' });
    } catch { /* Continue to account access even when offline. */ }
    router.replace('/login');
  }

  function showMyLocation() {
    if (!navigator.geolocation) {
      setLocationMessage('This browser does not support location.');
      return;
    }

    setLocating(true);
    setLocationMessage('Finding your location…');
    navigator.geolocation.getCurrentPosition(
      ({ coords, timestamp }) => {
        setUserPosition({
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: coords.accuracy,
          timestamp,
        });
        setLocationMessage(`Your location is shown on the map (±${Math.round(coords.accuracy)} m).`);
        setLocating(false);
      },
      (error) => {
        const messages = {
          1: 'Location permission was denied. Allow location access in your browser settings and try again.',
          2: 'Your location could not be determined. Check your device location settings and try again.',
          3: 'The location request timed out. Try again in a moment.',
        };
        setLocationMessage(messages[error.code] || 'Could not get your location. Try again.');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 },
    );
  }

  if (!authReady) {
    return <main className="p-8 text-sm text-gray-500">Verifying your client account…</main>;
  }

  if (!client) {
    return (
      <main className="mx-auto max-w-lg p-8">
        <h1 className="text-xl font-bold">Client account required</h1>
        <p role="alert" className="mt-2 text-sm text-gray-600">{authError || 'Please sign in to continue.'}</p>
        <a href="/client/login" className="mt-5 inline-flex rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white">Go to client sign in</a>
      </main>
    );
  }

  const matchingRoutes = searchTriggered
    ? availableRoutes.filter((route) => routeMatchesJourney(route, pickup, destination))
    : availableRoutes;
  const stopOptions = [...new Set(availableRoutes.flatMap((route) => route.stops.map((stop) =>
    typeof stop === 'string' ? stop : stop.name,
  )))];

  function handleSearch() {
    setSearchTriggered(true);
    const firstMatch = availableRoutes.find((route) => routeMatchesJourney(route, pickup, destination));
    setSelectedRouteId(firstMatch?.id || null);
  }

  const activeMapRoute = matchingRoutes.find((route) => route.id === selectedRouteId)
    || (!searchTriggered ? matchingRoutes[0] || null : null);

  return (
    <main className="min-h-screen bg-white text-black selection:bg-black selection:text-white flex flex-col">

      {/* Top Navbar */}
      <nav className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center bg-black text-white text-xs font-mono font-bold">
            CT
          </div>
          <span className="font-semibold tracking-tight text-sm">
            CampusTransit <span className="text-gray-400 font-mono text-xs">{"// Module 1: Student Transport"}</span>
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-gray-500">USER: {client.name.toUpperCase()}</span>
          <button type="button" onClick={logout} className="border border-gray-200 px-3 py-1.5 hover:border-black transition">
            Logout
          </button>
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
                  list="campus-stop-options"
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
                  list="campus-stop-options"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full text-sm font-medium text-black bg-transparent outline-none font-mono"
                />
              </div>
            </div>

            <datalist id="campus-stop-options">
              {stopOptions.map((stop) => <option key={stop} value={stop} />)}
            </datalist>

            <button
              type="button"
              onClick={handleSearch}
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
            {fleetError && <p role="alert" className="border border-red-200 bg-red-50 p-4 text-sm text-red-800">{fleetError}</p>}
            {fleetReady && matchingRoutes.length === 0 && (
              <p className="border border-gray-200 p-4 text-sm text-gray-500">
                {searchTriggered ? 'No route serves both of those stops.' : 'No shuttle routes are available.'}
              </p>
            )}

            {matchingRoutes.map((route) => {
              const isSelected = activeMapRoute?.id === route.id;
              const stopsReached = route.completedStops || 0;
              return (
                <div
                  key={route.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedRouteId(route.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedRouteId(route.id);
                    }
                  }}
                  className={`cursor-pointer p-4 space-y-3 transition ${
                    isSelected
                      ? 'border-2 border-black bg-gray-50'
                      : 'border border-gray-200 bg-white hover:border-black'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono bg-gray-100 px-2 py-0.5 font-bold">
                        {route.shuttleNumber} · {route.status.replaceAll('_', ' ')}
                      </span>
                      <h3 className="text-sm font-bold mt-1">{route.routeName}</h3>
                    </div>
                    <span className="text-xs font-mono font-bold bg-gray-100 px-2 py-0.5">
                      {isSelected ? 'ON MAP' : `${route.availableSeats} SEATS`}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 border border-gray-200 bg-gray-50 p-3 text-xs font-mono">
                    <p>Passengers: <strong>{route.occupiedSeats} / {route.capacity}</strong></p>
                    <p>Next stop: <strong>{route.nextStop || 'Not in service'}</strong></p>
                    {route.activeTripId && (
                      <p className="col-span-2">Progress: <strong>{stopsReached} / {route.stops.length} stops reached</strong></p>
                    )}
                    {route.currentLocation && <p className="col-span-2 text-emerald-700">Live shuttle location is available</p>}
                  </div>

                  <div className="text-xs text-gray-600 font-mono">
                    Stops:{' '}
                    {(route.stops || [])
                      .map((stop, index) => `${stopsReached > index ? '✓ ' : ''}${typeof stop === 'string' ? stop : stop.name}`)
                      .join(' → ')}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Panel: Campus Map Overview (7 Cols) */}
        <div className="lg:col-span-7 bg-gray-50 p-6 lg:p-8 flex flex-col justify-between relative min-h-[400px]">

          <div className="flex justify-between items-center z-10">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-gray-400">Campus Map</span>
              <h3 className="text-sm font-bold font-mono">Lovely Professional University</h3>
            </div>
            <div className="bg-white border border-gray-200 px-3 py-1.5 text-xs font-mono text-gray-500">
              OPENSTREETMAP
            </div>
          </div>

          <div className="z-10 mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={showMyLocation}
              disabled={locating}
              className="border border-gray-300 bg-white px-3 py-2 text-xs font-mono hover:border-black disabled:cursor-wait disabled:opacity-60"
            >
              {locating ? 'FINDING LOCATION…' : 'SHOW MY LOCATION'}
            </button>
            {locationMessage && <p role="status" className="text-xs text-gray-600">{locationMessage}</p>}
          </div>

          <CampusMap
            className="my-8"
            selectedRoute={activeMapRoute}
            position={activeMapRoute?.currentLocation || null}
            userPosition={userPosition}
            trackingStatus={activeMapRoute?.status || 'INACTIVE'}
          />

          <div className="flex justify-between items-center text-xs font-mono text-gray-400 z-10">
            <p>STOP NUMBERS · ✓ REACHED · 🚌 LIVE GPS · SCHEMATIC POSITIONS</p>
            <a href="https://www.openstreetmap.org/node/1406003115" target="_blank" rel="noreferrer" className="underline hover:text-black">
              VIEW MAP SOURCE
            </a>
          </div>

        </div>

      </div>

    </main>
  );
}
