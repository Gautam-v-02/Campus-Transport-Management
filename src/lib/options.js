// Main query used by the API route and the server-rendered stop page. Server-only.
import { DESTINATIONS, STOPS, estimateFare, isPeak } from "@/lib/lastMile";
import { listVehicles } from "@/lib/vehicles";

const RANK = { available: 0, busy: 1, offline: 2 };

export async function getOptions({ stopId, destinationId, type = "all" }) {
  const stop = STOPS.find((s) => s.id === stopId);
  const destination = DESTINATIONS.find((d) => d.id === destinationId);
  if (!stop || !destination) return null;

  const peak = isPeak();
  const rows = await listVehicles({ stopId: stop.id, type });

  // Send only the fields the UI needs (no owner id, no timestamps).
  const vehicles = rows
    .map((v) => ({
      id: v.id,
      type: v.type,
      driver: v.driver,
      plate: v.plate,
      stopId: v.stopId,
      status: v.status,
      seatsTotal: v.seatsTotal,
      seatsFree: v.seatsFree,
      etaMin: v.etaMin,
      photo: v.photo,
      ...estimateFare(v, destination.distanceKm, peak),
    }))
    .sort((a, b) => RANK[a.status] - RANK[b.status] || a.etaMin - b.etaMin);

  const available = vehicles.filter((v) => v.status === "available");

  return {
    stop,
    destination,
    peak,
    updatedAt: new Date().toISOString(),
    summary: {
      availableCount: available.length,
      totalCount: vehicles.length,
      avgEtaMin: available.length
        ? Math.round(available.reduce((s, v) => s + v.etaMin, 0) / available.length)
        : null,
      lowestFare: available.length ? Math.min(...available.map((v) => v.fare)) : null,
    },
    vehicles,
  };
}
