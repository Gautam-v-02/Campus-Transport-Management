"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getCrowdLevel } from "@/lib/transport";
import { StatCard } from "./components/StatCard";
import { TripPanel } from "./components/TripPanel";
import { ShuttlePanel } from "./components/ShuttlePanel";
import { RoutePanel } from "./components/RoutePanel";
import { ReportsPanel } from "./components/ReportsPanel";
import { HistoryPanel } from "./components/HistoryPanel";
import { CampusMap } from "@/components/CampusMap";

function distanceBetweenMeters(first, second) {
  const latitudeMeters = (first.latitude - second.latitude) * 111_320;
  const averageLatitude = ((first.latitude + second.latitude) / 2) * (Math.PI / 180);
  const longitudeMeters =
    (first.longitude - second.longitude) * 111_320 * Math.cos(averageLatitude);

  return Math.hypot(latitudeMeters, longitudeMeters);
}

export default function DriverDashboard() {
  const router = useRouter();
  const [workspace, setWorkspace] = useState(null);
  const [workspaceError, setWorkspaceError] = useState("");
  const [sessionReady, setSessionReady] = useState(false);
  const [tripStatus, setTripStatus] = useState("NOT_STARTED");
  const [completedStops, setCompletedStops] = useState(0);
  const [occupiedSeats, setOccupiedSeats] = useState(0);
  const [tripStartTime, setTripStartTime] = useState("");
  const [incidentReports, setIncidentReports] = useState([]);
  const [delayReason, setDelayReason] = useState("TRAFFIC_CONGESTION");
  const [delayMinutes, setDelayMinutes] = useState(10);
  const [delayDescription, setDelayDescription] = useState("");
  const [reportMessage, setReportMessage] = useState("");
  const [historySearch, setHistorySearch] = useState("");
  const [historyDate, setHistoryDate] = useState("");
  const [historyStatus, setHistoryStatus] = useState("ALL");
  const [activeTripId, setActiveTripId] = useState(null);
  const [gpsStatus, setGpsStatus] = useState("IDLE");
  const [gpsMessage, setGpsMessage] = useState("");
  const [gpsPosition, setGpsPosition] = useState(null);
  const [isOnline, setIsOnline] = useState(null);
  const lastAcceptedPosition = useRef(null);
  const tripActionPending = useRef(false);

  useEffect(() => {
    let isCancelled = false;

    async function loadDriverWorkspace() {
      try {
        const sessionResponse = await fetch("/api/driver/session");
        if (!sessionResponse.ok) {
          router.replace("/driver/login");
          return;
        }
        const response = await fetch("/api/driver/workspace");
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not load driver workspace.");
        if (isCancelled) return;
        setWorkspace(data);
        setOccupiedSeats(data.shuttle.occupiedSeats || 0);
        setIncidentReports(data.reports);
        if (data.latestLocation) {
          const savedPosition = {
            latitude: data.latestLocation.latitude,
            longitude: data.latestLocation.longitude,
            accuracy: data.latestLocation.accuracy,
            speed: data.latestLocation.speed,
            timestamp: new Date(data.latestLocation.timestamp).getTime(),
          };
          lastAcceptedPosition.current = savedPosition;
          setGpsPosition(savedPosition);
        }
        const savedActiveTrip = data.trips.find((trip) => ["IN_PROGRESS", "DELAYED"].includes(trip.status));
        if (savedActiveTrip) {
          setActiveTripId(savedActiveTrip.id);
          setTripStatus(savedActiveTrip.status);
          setCompletedStops(savedActiveTrip.completedStops || 0);
          setTripStartTime(new Date(savedActiveTrip.startTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }));
        }
      } catch (error) {
        if (!isCancelled) setWorkspaceError(error.message || "Could not load driver workspace.");
      } finally {
        if (!isCancelled) setSessionReady(true);
      }
    }

    loadDriverWorkspace();
    return () => {
      isCancelled = true;
    };
  }, [router]);

  useEffect(() => {
    function updateNetworkStatus() {
      setIsOnline(navigator.onLine);
    }

    updateNetworkStatus();
    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);

    return () => {
      window.removeEventListener("online", updateNetworkStatus);
      window.removeEventListener("offline", updateNetworkStatus);
    };
  }, []);

  useEffect(() => {
    if (!sessionReady || !activeTripId || !["IN_PROGRESS", "DELAYED"].includes(tripStatus)) return;

    if (!navigator.geolocation) {
      // This branch reports a missing browser capability from the effect.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGpsStatus("UNAVAILABLE");
      setGpsMessage("This browser does not provide GPS location.");
      return;
    }

    setGpsStatus("REQUESTING");
    setGpsMessage("");
    lastAcceptedPosition.current = null;

    let watchId;
    try {
      watchId = navigator.geolocation.watchPosition(
      (position) => {
        const nextPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          speed: position.coords.speed,
          timestamp: position.timestamp || Date.now(),
        };
        const previousPosition = lastAcceptedPosition.current;

        if (previousPosition) {
          const movedMeters = distanceBetweenMeters(previousPosition, nextPosition);
          const elapsedMs = nextPosition.timestamp - previousPosition.timestamp;
          // Ignore tiny, immediate GPS variations to avoid unnecessary updates.
          if (movedMeters < 5 && elapsedMs < 5000) return;
        }

        lastAcceptedPosition.current = nextPosition;
        setGpsPosition(nextPosition);
        setGpsStatus("ACTIVE");
        fetch("/api/driver/location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...nextPosition, tripId: activeTripId }),
        })
          .then(async (response) => {
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Could not save GPS location.");
            setGpsMessage("");
          })
          .catch(() => {
            setGpsMessage("Could not save this GPS reading. Check your connection and MongoDB setup; the next reading will retry.");
          });
      },
      (error) => {
        const errorMessages = {
          1: "Location permission was denied. Allow location access in your browser settings.",
          2: "The device could not determine its location. Check GPS settings and try again.",
          3: "The location request timed out. Keep the page open and wait for another reading.",
        };
        setGpsStatus(error.code === 1 ? "PERMISSION_DENIED" : "ERROR");
        setGpsMessage(errorMessages[error.code] || "The GPS location could not be read.");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 15000,
      },
      );
    } catch {
      setGpsStatus("ERROR");
      setGpsMessage("The browser could not start GPS tracking. Check location permissions and use HTTPS or localhost.");
      return;
    }

    return () => navigator.geolocation.clearWatch(watchId);
  }, [activeTripId, sessionReady, tripStatus]);

  if (!sessionReady) {
    return <main className="p-8 text-gray-600">Opening driver workspace…</main>;
  }

  if (!workspace) {
    return (
      <main className="mx-auto max-w-xl p-8">
        <h1 className="text-xl font-bold">Could not open driver workspace</h1>
        <p role="alert" className="mt-2 text-gray-600">{workspaceError || "No driver assignment was found."}</p>
        <button onClick={() => window.location.reload()} className="mt-5 rounded-lg bg-black px-4 py-2 text-white">Try again</button>
        <button onClick={logOut} className="ml-3 mt-5 rounded-lg border px-4 py-2">Sign out</button>
      </main>
    );
  }

  const { driver, shuttle, route } = workspace;
  const availableSeats = shuttle.capacity - occupiedSeats;
  const driverTrips = workspace.trips;
  const completedTrips = driverTrips.filter((trip) => trip.status === "COMPLETED").length;
  const shuttleRecords = [shuttle];
  const routeRecords = [route];
  const activeTrips = driverTrips.filter((trip) =>
    ["IN_PROGRESS", "DELAYED"].includes(trip.status),
  ).length;
  const tripHistory = driverTrips.filter((trip) => {
    if (trip.driverId !== driver.id) {
      return false;
    }
    if (historyStatus !== "ALL" && trip.status !== historyStatus) return false;
    const tripDate = new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(trip.startTime));
    if (historyDate && tripDate !== historyDate) return false;

    const searchText = historySearch.toLowerCase().trim();
    const tripId = trip.id.toLowerCase();
    const tripShuttle = shuttleRecords.find((item) => item.id === trip.shuttleId);
    const tripRoute = routeRecords.find((item) => item.id === trip.routeId);
    const shuttleNumber = tripShuttle?.shuttleNumber.toLowerCase() || "";
    const routeName = tripRoute?.routeName.toLowerCase() || "";
    return shuttleNumber.includes(searchText)
      || routeName.includes(searchText)
      || tripId.includes(searchText);
  });

  const crowdLevel = getCrowdLevel(occupiedSeats, shuttle.capacity);
  const tripIsActive = ["IN_PROGRESS", "DELAYED"].includes(tripStatus);
  const visibleGpsStatus = tripIsActive
    ? gpsStatus
    : tripStatus === "COMPLETED" ? "STOPPED" : "NOT STARTED";
  const networkStatus = isOnline === null ? "CHECKING" : isOnline ? "ONLINE" : "OFFLINE";

  async function startTrip() {
    if (tripActionPending.current) return;
    tripActionPending.current = true;

    const tripId = `TRIP-${crypto.randomUUID()}`;
    try {
      const response = await fetch("/api/driver/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start", tripId }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not start trip.");

      const newTrip = { id: tripId, driverId: driver.id, shuttleId: shuttle.id, routeId: route.id,
        status: "IN_PROGRESS", startTime: new Date(), endTime: null, completedStops: 0 };
      setWorkspace((current) => ({ ...current, trips: [newTrip, ...current.trips], shuttle: { ...current.shuttle, status: "IN_SERVICE" } }));

      setGpsPosition(null);
      setGpsStatus("REQUESTING");
      setGpsMessage("");
      setActiveTripId(newTrip.id);
      setTripStartTime(new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }));
      setCompletedStops(0);
      setTripStatus("IN_PROGRESS");
    } catch (error) {
      setGpsMessage(error.message || "Could not start trip. Check your database connection.");
    } finally {
      tripActionPending.current = false;
    }
  }

  async function markStopReached() {
    if (completedStops >= route.stops.length || !activeTripId || tripActionPending.current) return;
    tripActionPending.current = true;
    try {
      const response = await fetch("/api/driver/workspace", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "stop", tripId: activeTripId }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not update stop progress.");
      setCompletedStops(result.completedStops);
      setWorkspace((current) => ({ ...current, trips: current.trips.map((trip) =>
        trip.id === activeTripId ? { ...trip, completedStops: result.completedStops } : trip) }));
      setGpsMessage("");
    } catch (error) { setGpsMessage(error.message || "Could not update stop progress."); }
    finally { tripActionPending.current = false; }
  }

  async function completeTrip() {
    if (!activeTripId || tripActionPending.current) return;
    tripActionPending.current = true;

    try {
      const response = await fetch("/api/driver/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "end", tripId: activeTripId }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not end trip.");

      setWorkspace((current) => ({ ...current, trips: current.trips.map((trip) => trip.id === activeTripId
        ? { ...trip, status: "COMPLETED", endTime: new Date() } : trip), shuttle: { ...current.shuttle, status: "AVAILABLE" } }));
      setTripStatus("COMPLETED");
      setGpsMessage("");
    } catch (error) {
      setGpsMessage(error.message || "Could not end trip. Check your database connection.");
    } finally {
      tripActionPending.current = false;
    }
  }

  async function reportDelay(event) {
    event.preventDefault();
    if (!activeTripId || tripActionPending.current) return;
    tripActionPending.current = true;
    const newReport = {
      category: delayReason,
      description: delayDescription.trim() || "No additional details provided.",
      estimatedDelayMinutes: Number(delayMinutes),
      tripId: activeTripId,
    };
    try {
      const response = await fetch("/api/driver/workspace", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "report", tripId: activeTripId, report: newReport }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not save incident report.");
      setIncidentReports((current) => [result.report, ...current]);
      setWorkspace((current) => ({ ...current, reports: [result.report, ...current.reports], trips: current.trips.map((trip) =>
        trip.id === activeTripId ? { ...trip, status: result.status, delay: result.report } : trip) }));
      setTripStatus(result.status);
      setReportMessage("Incident report saved.");
      setDelayDescription("");
      setGpsMessage("");
    } catch (error) {
      setReportMessage(error.message || "Could not save incident report.");
    } finally {
      tripActionPending.current = false;
    }
  }

  async function resumeTrip() {
    if (!activeTripId || tripActionPending.current) return;
    tripActionPending.current = true;
    try {
      const response = await fetch("/api/driver/workspace", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "resume", tripId: activeTripId }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not resume trip.");
      setTripStatus(result.status);
      setWorkspace((current) => ({ ...current, trips: current.trips.map((trip) => trip.id === activeTripId ? { ...trip, status: result.status } : trip) }));
      setGpsMessage("");
    } catch (error) { setGpsMessage(error.message || "Could not resume trip."); }
    finally { tripActionPending.current = false; }
  }

  async function changeOccupancy(amount) {
    const nextValue = occupiedSeats + amount;
    if (nextValue >= 0 && nextValue <= shuttle.capacity && !tripActionPending.current) {
      tripActionPending.current = true;
      try {
        const response = await fetch("/api/driver/workspace", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "occupancy", occupiedSeats: nextValue }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Could not update passenger count.");
        setOccupiedSeats(result.occupiedSeats);
        setWorkspace((current) => ({ ...current, shuttle: { ...current.shuttle, occupiedSeats: result.occupiedSeats } }));
        setGpsMessage("");
      } catch (error) { setGpsMessage(error.message || "Could not update passenger count."); }
      finally { tripActionPending.current = false; }
    }
  }

  async function logOut() {
    try {
      await fetch("/api/driver/session", { method: "DELETE" });
    } catch { /* Redirect even when the session endpoint is unreachable. */ }
    router.replace("/driver/login");
  }


  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-gray-950 px-5 py-7 text-white lg:flex">
        <a href="#dashboard" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-xl">🚌</span>
          <span>
            <span className="block font-bold">CampusTransit</span>
            <span className="text-xs text-gray-400">Driver operations</span>
          </span>
        </a>
        <p className="mb-3 mt-10 text-xs font-semibold uppercase tracking-wider text-gray-500">Workspace</p>
        <nav className="space-y-1 text-sm">
          <a href="#dashboard" className="block rounded-lg bg-black px-3 py-2.5 font-medium">Dashboard</a>
          <a href="#shuttle" className="block rounded-lg px-3 py-2.5 text-gray-300 hover:bg-gray-800">My shuttle</a>
          <a href="#trip" className="block rounded-lg px-3 py-2.5 text-gray-300 hover:bg-gray-800">Active trip</a>
          <a href="#route" className="block rounded-lg px-3 py-2.5 text-gray-300 hover:bg-gray-800">Route management</a>
          <a href="#reports" className="block rounded-lg px-3 py-2.5 text-gray-300 hover:bg-gray-800">Delay reports</a>
          <a href="#history" className="block rounded-lg px-3 py-2.5 text-gray-300 hover:bg-gray-800">Trip history</a>
        </nav>
        <div className="mt-auto rounded-xl border border-gray-800 bg-gray-900 p-4">
          <p className="text-sm font-semibold">{driver.name}</p>
          <p className="mt-1 text-xs text-gray-400">{driver.email}</p>
          <p className="mt-3 text-xs text-gray-300">Demo driver account</p>
          <button onClick={logOut} className="mt-4 text-sm font-medium text-gray-300 hover:text-white">Log out</button>
        </div>
      </aside>

      <main id="dashboard" className="lg:ml-64">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 bg-white px-6 py-4 md:px-10">
          <div>
            <p className="text-sm text-gray-500">Driver workspace</p>
            <h1 className="mt-1 text-xl font-bold">Driver dashboard</h1>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-gray-200 px-3 py-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-black">{driver.name.charAt(0)}</span>
            <span className="text-sm font-medium">{driver.name}</span>
          </div>
        </header>

        <nav aria-label="Driver dashboard sections" className="flex gap-2 overflow-x-auto border-b border-gray-200 bg-white px-4 py-3 lg:hidden">
          <a href="#dashboard" className="whitespace-nowrap rounded-lg bg-black px-3 py-2 text-sm font-medium text-white">Dashboard</a>
          <a href="#shuttle" className="whitespace-nowrap rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100">My shuttle</a>
          <a href="#trip" className="whitespace-nowrap rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100">Active trip</a>
          <a href="#route" className="whitespace-nowrap rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100">Route</a>
          <a href="#reports" className="whitespace-nowrap rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100">Reports</a>
          <a href="#history" className="whitespace-nowrap rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100">History</a>
          <button onClick={logOut} className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-black hover:bg-gray-100">Log out</button>
        </nav>

        <div className="mx-auto max-w-7xl space-y-6 p-5 md:p-10">
          <section className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-black">SHUTTLE OPERATIONS</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight">Good morning, {driver.name.split(" ")[0]}</h2>
              <p className="mt-2 text-gray-500">Here is the current status of your assigned shuttle.</p>
            </div>
            {(tripStatus === "NOT_STARTED" || tripStatus === "COMPLETED") && (
              <button onClick={startTrip} className="rounded-lg bg-black px-5 py-3 font-semibold text-white shadow-sm hover:bg-gray-800">
                Start assigned trip
              </button>
            )}
            {tripStatus === "IN_PROGRESS" && (
              <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800">Trip in progress</span>
            )}
            {tripStatus === "DELAYED" && (
              <button onClick={resumeTrip} className="rounded-lg bg-amber-500 px-5 py-3 font-semibold text-white shadow-sm hover:bg-amber-600">Resume trip</button>
            )}
            {tripStatus === "COMPLETED" && (
              <span className="rounded-full bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700">Trip completed</span>
            )}
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard label="Assigned shuttle" value={shuttle.shuttleNumber} detail={shuttle.registrationNumber} icon="🚌" />
            <StatCard label="Total trips" value={driverTrips.length} detail="All trip records" icon="↗" />
            <StatCard label="Completed trips" value={completedTrips} detail="Completed journeys" icon="✓" />
            <StatCard label="Active trips" value={activeTrips} detail={activeTrips && tripStartTime ? `Started at ${tripStartTime}` : "No active trip"} icon="◷" />
            <StatCard label="Crowd level" value={crowdLevel} detail={`${occupiedSeats} of ${shuttle.capacity} seats occupied`} icon="👥" />
          </section>

          <section className="grid gap-6 xl:grid-cols-3">
            <TripPanel
              route={route}
              status={tripStatus}
              completedStops={completedStops}
              onMarkStop={markStopReached}
              onComplete={completeTrip}
            />
            <ShuttlePanel
              shuttle={shuttle}
              occupiedSeats={occupiedSeats}
              availableSeats={availableSeats}
              onChangeOccupancy={changeOccupancy}
            />
          </section>

          <section className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Campus map</p>
              <h2 className="mt-1 text-xl font-bold">Lovely Professional University</h2>
              <p className="mt-1 text-sm text-gray-500">
                Stop markers are sample locations. The dashed line is a schematic of the documented main-gate-to-campus-centre service, not a verified road path.
              </p>
            </div>
            <article className="border border-gray-200 bg-white p-4">
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono">
                <p>GPS: <span className="font-bold">{visibleGpsStatus.replaceAll("_", " ")}</span></p>
                <p>NETWORK: <span className={`font-bold ${isOnline === false ? "text-red-700" : "text-gray-900"}`}>{networkStatus}</span></p>
              </div>
              {gpsPosition ? (
                <p className="mt-2 text-xs text-gray-600">
                  {gpsPosition.latitude.toFixed(6)}, {gpsPosition.longitude.toFixed(6)}
                  <span className="ml-2">±{Math.round(gpsPosition.accuracy)} m</span>
                  <span className="ml-2">Updated {new Date(gpsPosition.timestamp).toLocaleTimeString()}</span>
                </p>
              ) : (
                <p className="mt-2 text-xs text-gray-500">
                  {tripIsActive ? "Waiting for the first GPS reading…" : "Start a trip to request the device location."}
                </p>
              )}
              {gpsMessage && <p role="alert" className="mt-2 text-sm text-red-700">{gpsMessage}</p>}
              {isOnline === false && (
                <p role="status" className="mt-2 text-sm text-amber-800">
                  Internet is disconnected. The current reading stays in this page; the next GPS reading will retry after reconnecting.
                </p>
              )}
            </article>
            <CampusMap position={gpsPosition} trackingStatus={visibleGpsStatus} />
          </section>

          <RoutePanel
            route={route}
            completedStops={completedStops}
            tripStatus={tripStatus}
          />

          <ReportsPanel
            reports={incidentReports}
            category={delayReason}
            delayMinutes={delayMinutes}
            description={delayDescription}
            message={reportMessage}
            onCategoryChange={setDelayReason}
            onDelayMinutesChange={setDelayMinutes}
            onDescriptionChange={setDelayDescription}
            onSubmit={reportDelay}
          />

          <HistoryPanel
            trips={tripHistory}
            shuttles={shuttleRecords}
            routes={routeRecords}
            search={historySearch}
            date={historyDate}
            status={historyStatus}
            onSearchChange={setHistorySearch}
            onDateChange={setHistoryDate}
            onStatusChange={setHistoryStatus}
          />
        </div>
      </main>
    </div>
  );
}
