// Shared mock data access for the student, driver, and last-mile modules.
// Browser changes are saved in localStorage; the seed files remain the fallback.
import { drivers } from "@/data/drivers";
import { shuttles } from "@/data/shuttles";
import { routes } from "@/data/routes";
import { trips } from "@/data/trips";
import { reports } from "@/data/reports";
export { getCrowdLevel } from "@/lib/transport";

const storageKeys = {
  drivers: "campus-transport-drivers",
  shuttles: "campus-transport-shuttles",
  routes: "campus-transport-routes",
  trips: "campus-transport-trips",
  reports: "campus-transport-reports",
  currentDriverId: "campus-transport-current-driver",
};

const seedData = { drivers, shuttles, routes, trips, reports };

function getCollection(collectionName) {
  if (typeof window === "undefined") {
    return seedData[collectionName];
  }

  const savedRecords = window.localStorage.getItem(storageKeys[collectionName]);
  if (!savedRecords) {
    return seedData[collectionName];
  }

  try {
    return JSON.parse(savedRecords);
  } catch {
    return seedData[collectionName];
  }
}

function saveCollection(collectionName, records) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(storageKeys[collectionName], JSON.stringify(records));
  }
  return records;
}

export function getDrivers() { return getCollection("drivers"); }
export function getShuttles() { return getCollection("shuttles"); }
export function getRoutes() { return getCollection("routes"); }
export function getTrips() { return getCollection("trips"); }
export function getReports() { return getCollection("reports"); }

export function getDriverByEmail(email) {
  return getDrivers().find((driver) => driver.email.toLowerCase() === email.toLowerCase());
}

export function getDriverAssignments(driverId) {
  const driver = getDrivers().find((item) => item.id === driverId);
  if (!driver) return null;

  return {
    driver,
    shuttle: getShuttles().find((item) => item.id === driver.assignedShuttleId),
    route: getRoutes().find((item) => item.id === driver.assignedRouteId),
  };
}

export function getCurrentDriverId() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(storageKeys.currentDriverId);
}

export function setCurrentDriverId(driverId) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(storageKeys.currentDriverId, driverId);
  }
}

export function clearCurrentDriverId() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(storageKeys.currentDriverId);
  }
}

export function getDriverActiveTrip(driverId) {
  return getTrips().find((trip) =>
    trip.driverId === driverId && ["IN_PROGRESS", "DELAYED"].includes(trip.status),
  ) || null;
}

export function startDriverTrip(driverId, tripId = `TRIP-${Date.now()}`) {
  if (getDriverActiveTrip(driverId)) return null;

  const assignment = getDriverAssignments(driverId);
  if (!assignment) return null;

  const newTrip = {
    id: tripId,
    driverId,
    shuttleId: assignment.shuttle.id,
    routeId: assignment.route.id,
    status: "IN_PROGRESS",
    startTime: new Date().toISOString(),
    endTime: null,
    completedStops: 0,
    delay: null,
  };

  saveCollection("trips", [newTrip, ...getTrips()]);
  saveCollection("shuttles", getShuttles().map((shuttle) =>
    shuttle.id === assignment.shuttle.id ? { ...shuttle, status: "IN_SERVICE" } : shuttle,
  ));
  return newTrip;
}

export function updateDriverTrip(tripId, updates) {
  const updatedTrips = getTrips().map((trip) =>
    trip.id === tripId ? { ...trip, ...updates } : trip,
  );
  saveCollection("trips", updatedTrips);
  return updatedTrips.find((trip) => trip.id === tripId) || null;
}

export function finishDriverTrip(tripId) {
  const trip = getTrips().find((item) => item.id === tripId);
  if (!trip) return null;

  const finishedTrip = updateDriverTrip(tripId, {
    status: "COMPLETED",
    endTime: new Date().toISOString(),
  });
  saveCollection("shuttles", getShuttles().map((shuttle) =>
    shuttle.id === trip.shuttleId ? { ...shuttle, status: "AVAILABLE" } : shuttle,
  ));
  return finishedTrip;
}

export function saveIncidentReport(report) {
  const updatedReports = [report, ...getReports()];
  saveCollection("reports", updatedReports);
  return updatedReports;
}

export function updateShuttleOccupancy(shuttleId, occupiedSeats) {
  const updatedShuttles = getShuttles().map((shuttle) =>
    shuttle.id === shuttleId ? { ...shuttle, occupiedSeats } : shuttle,
  );
  saveCollection("shuttles", updatedShuttles);
  return updatedShuttles.find((shuttle) => shuttle.id === shuttleId) || null;
}
