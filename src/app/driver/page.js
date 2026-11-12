"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  clearCurrentDriverId,
  finishDriverTrip,
  getCrowdLevel,
  getCurrentDriverId,
  getDriverActiveTrip,
  getDriverAssignments,
  getReports,
  getRoutes,
  getShuttles,
  getTrips,
  saveIncidentReport,
  startDriverTrip,
  updateDriverTrip,
  updateShuttleOccupancy,
} from "@/lib/mockStore";
import { StatCard } from "./components/StatCard";
import { TripPanel } from "./components/TripPanel";
import { ShuttlePanel } from "./components/ShuttlePanel";
import { RoutePanel } from "./components/RoutePanel";
import { ReportsPanel } from "./components/ReportsPanel";
import { HistoryPanel } from "./components/HistoryPanel";

const DEMO_DRIVER_ID = "DRV001";

export default function DriverDashboard() {
  const router = useRouter();
  const [driverId, setDriverId] = useState(DEMO_DRIVER_ID);
  const [sessionReady, setSessionReady] = useState(false);
  const assignments = getDriverAssignments(driverId);
  const [tripStatus, setTripStatus] = useState("NOT_STARTED");
  const [completedStops, setCompletedStops] = useState(0);
  const [occupiedSeats, setOccupiedSeats] = useState(25);
  const [tripStartTime, setTripStartTime] = useState("");
  const [incidentReports, setIncidentReports] = useState(() =>
    getReports().filter((report) => report.driverId === DEMO_DRIVER_ID),
  );
  const [delayReason, setDelayReason] = useState("TRAFFIC_CONGESTION");
  const [delayMinutes, setDelayMinutes] = useState(10);
  const [delayDescription, setDelayDescription] = useState("");
  const [reportMessage, setReportMessage] = useState("");
  const [historySearch, setHistorySearch] = useState("");
  const [historyDate, setHistoryDate] = useState("");
  const [historyStatus, setHistoryStatus] = useState("ALL");
  const [activeTripId, setActiveTripId] = useState(null);

  // Read browser-only login and saved trip data after the first render.
  useEffect(() => {
    const savedDriverId = getCurrentDriverId();
    if (!savedDriverId) {
      router.replace("/driver/login");
      return;
    }

    const savedAssignment = getDriverAssignments(savedDriverId);
    if (!savedAssignment) {
      clearCurrentDriverId();
      router.replace("/driver/login");
      return;
    }

    const savedActiveTrip = getDriverActiveTrip(savedDriverId);
    // localStorage cannot be read until the component runs in the browser.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDriverId(savedDriverId);
    setOccupiedSeats(savedAssignment.shuttle.occupiedSeats);
    setIncidentReports(getReports().filter((report) => report.driverId === savedDriverId));
    if (savedActiveTrip) {
      setActiveTripId(savedActiveTrip.id);
      setTripStatus(savedActiveTrip.status);
      setCompletedStops(savedActiveTrip.completedStops);
      setTripStartTime(new Date(savedActiveTrip.startTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }));
    }
    setSessionReady(true);
  }, [router]);

  if (!sessionReady) {
    return <main className="p-8 text-gray-600">Opening driver workspace…</main>;
  }

  if (!assignments) {
    return <main className="p-8">No driver assignment was found.</main>;
  }

  const { driver, shuttle, route } = assignments;
  const availableSeats = shuttle.capacity - occupiedSeats;
  const driverTrips = getTrips().filter((trip) => trip.driverId === driver.id);
  const completedTrips = driverTrips.filter((trip) => trip.status === "COMPLETED").length;
  const shuttleRecords = getShuttles();
  const routeRecords = getRoutes();
  const activeTrips = driverTrips.filter((trip) =>
    ["IN_PROGRESS", "DELAYED"].includes(trip.status),
  ).length;
  const tripHistory = getTrips().filter((trip) => {
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

  function startTrip() {
    const newTrip = startDriverTrip(driver.id);
    if (!newTrip) return;
    setActiveTripId(newTrip.id);
    setTripStartTime(new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }));
    setCompletedStops(0);
    setTripStatus("IN_PROGRESS");
  }

  function markStopReached() {
    if (completedStops < route.stops.length) {
      const nextCompletedStops = completedStops + 1;
      setCompletedStops(nextCompletedStops);
      if (activeTripId) {
        updateDriverTrip(activeTripId, { completedStops: nextCompletedStops });
      }
    }
  }

  function completeTrip() {
    if (activeTripId) finishDriverTrip(activeTripId);
    setTripStatus("COMPLETED");
  }

  function reportDelay(event) {
    event.preventDefault();

    const newReport = {
      id: `REPORT-${getReports().length + 1}`,
      driverId: driver.id,
      tripId: activeTripId,
      category: delayReason,
      description: delayDescription.trim() || "No additional details provided.",
      estimatedDelayMinutes: Number(delayMinutes),
      reportedAt: new Date().toISOString(),
    };

    setIncidentReports(
      saveIncidentReport(newReport).filter((report) => report.driverId === driver.id),
    );
    if (tripStatus === "IN_PROGRESS") {
      setTripStatus("DELAYED");
      if (activeTripId) {
        updateDriverTrip(activeTripId, { status: "DELAYED", delay: newReport });
      }
    }
    setReportMessage("Incident report saved for this session.");
    setDelayDescription("");
  }

  function resumeTrip() {
    setTripStatus("IN_PROGRESS");
    if (activeTripId) updateDriverTrip(activeTripId, { status: "IN_PROGRESS" });
  }

  function changeOccupancy(amount) {
    const nextValue = occupiedSeats + amount;
    if (nextValue >= 0 && nextValue <= shuttle.capacity) {
      setOccupiedSeats(nextValue);
      updateShuttleOccupancy(shuttle.id, nextValue);
    }
  }

  function logOut() {
    clearCurrentDriverId();
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
            <StatCard label="Completed trips" value={completedTrips} detail="Demo trip records" icon="✓" />
            <StatCard label="Active trips" value={activeTrips} detail={tripStartTime ? `Started at ${tripStartTime}` : "No active trip"} icon="◷" />
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
