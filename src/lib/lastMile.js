// Module 3 – Last-Mile Service: reference data and pure helper functions.
// No database or server-only imports here, so it is safe to use in Client Components.

export const STOPS = [
  { id: "main-gate", name: "Main Gate" },
  { id: "library", name: "Library" },
  { id: "hostel-a", name: "Hostel Block A" },
  { id: "admin", name: "Admin Block" },
  { id: "sports", name: "Sports Complex" },
];

export const DESTINATIONS = [
  { id: "railway-station", name: "Railway Station", distanceKm: 4.5 },
  { id: "bus-stand", name: "Bus Stand", distanceKm: 3.2 },
  { id: "city-market", name: "City Market", distanceKm: 2.4 },
  { id: "metro", name: "Metro Station", distanceKm: 5.8 },
  { id: "hospital", name: "Civil Hospital", distanceKm: 3.9 },
];

export const VEHICLE_TYPES = ["e-rickshaw", "auto"];
export const STATUSES = ["available", "busy", "offline"];

/** Peak hours in IST: 8–10 AM and 4–7 PM. */
export function isPeak(date = new Date()) {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      hour: "numeric",
      hour12: false,
      timeZone: "Asia/Kolkata",
    }).format(date)
  );
  return (hour >= 8 && hour < 10) || (hour >= 16 && hour < 19);
}

const roundTo5 = (n) => Math.max(5, Math.round(n / 5) * 5);

/**
 * E-rickshaw: shared, fare is per seat (Rs 10 + Rs 6/km)
 * Auto: whole vehicle (Rs 30 + Rs 14/km, +20% at peak)
 */
export function estimateFare(vehicle, distanceKm, peak) {
  if (vehicle.type === "e-rickshaw") {
    return { fare: roundTo5(10 + 6 * distanceKm), fareLabel: "per seat (shared)" };
  }
  const base = 30 + 14 * distanceKm;
  return { fare: roundTo5(peak ? base * 1.2 : base), fareLabel: "per ride" };
}

const RANK = { available: 0, busy: 1, offline: 2 };

/**
 * Returns a NEW sorted list. The original array is never changed (immutability):
 * [...vehicles] makes a copy first, because .sort() changes the array it is called on.
 * Available rides always come first.
 */
export const sortVehicles = (vehicles, sort) => {
  const copy = [...vehicles];
  if (sort === "fastest") {
    return copy.sort((a, b) => RANK[a.status] - RANK[b.status] || a.etaMin - b.etaMin);
  }
  if (sort === "cheapest") {
    return copy.sort((a, b) => RANK[a.status] - RANK[b.status] || a.fare - b.fare || a.etaMin - b.etaMin);
  }
  return copy;
};

/**
 * Marks the fastest and cheapest available ride so students can decide quickly.
 * Returns { [vehicleId]: ["Fastest", "Cheapest"] }. Needs 2+ available rides.
 */
export function getBadges(vehicles) {
  const available = vehicles.filter((v) => v.status === "available");
  if (available.length < 2) return {};

  const fastest = available.reduce((a, b) => (b.etaMin < a.etaMin ? b : a));
  const cheapest = available.reduce((a, b) => (b.fare < a.fare ? b : a));

  const badges = {};
  badges[fastest.id] = ["Fastest"];
  badges[cheapest.id] = [...(badges[cheapest.id] ?? []), "Cheapest"];
  return badges;
}
