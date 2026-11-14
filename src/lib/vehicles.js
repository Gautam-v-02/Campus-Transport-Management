// Vehicle data (CRUD) kept in memory. Server-only: never import in a Client Component.
// The data resets when the server restarts. To keep it for good, connect a database.

const SEED = [
  { id: "ER-01", type: "e-rickshaw", driver: "Ramesh K.", plate: "PB08 ER 1021", stopId: "main-gate", status: "available", seatsTotal: 4, seatsFree: 2, etaMin: 2 },
  { id: "ER-02", type: "e-rickshaw", driver: "Sukhdev S.", plate: "PB08 ER 2217", stopId: "main-gate", status: "available", seatsTotal: 4, seatsFree: 4, etaMin: 5 },
  { id: "AU-01", type: "auto", driver: "Balwinder P.", plate: "PB08 AU 4410", stopId: "main-gate", status: "available", seatsTotal: 3, seatsFree: 3, etaMin: 3 },
  { id: "AU-02", type: "auto", driver: "Manjit R.", plate: "PB08 AU 7782", stopId: "main-gate", status: "busy", seatsTotal: 3, seatsFree: 0, etaMin: 12 },
  { id: "ER-03", type: "e-rickshaw", driver: "Pritam L.", plate: "PB08 ER 3305", stopId: "library", status: "available", seatsTotal: 4, seatsFree: 1, etaMin: 4 },
  { id: "AU-03", type: "auto", driver: "Harpal D.", plate: "PB08 AU 9120", stopId: "library", status: "available", seatsTotal: 3, seatsFree: 3, etaMin: 6 },
  { id: "ER-04", type: "e-rickshaw", driver: "Jaswant G.", plate: "PB08 ER 5543", stopId: "hostel-a", status: "busy", seatsTotal: 4, seatsFree: 0, etaMin: 10 },
  { id: "ER-05", type: "e-rickshaw", driver: "Gurmeet A.", plate: "PB08 ER 6671", stopId: "hostel-a", status: "available", seatsTotal: 4, seatsFree: 3, etaMin: 3 },
  { id: "AU-04", type: "auto", driver: "Kuldeep M.", plate: "PB08 AU 1189", stopId: "admin", status: "offline", seatsTotal: 3, seatsFree: 0, etaMin: 0 },
  { id: "ER-06", type: "e-rickshaw", driver: "Tarsem B.", plate: "PB08 ER 8820", stopId: "admin", status: "available", seatsTotal: 4, seatsFree: 2, etaMin: 7 },
  { id: "AU-05", type: "auto", driver: "Lakhbir C.", plate: "PB08 AU 3356", stopId: "sports", status: "available", seatsTotal: 3, seatsFree: 2, etaMin: 8 },
  { id: "ER-07", type: "e-rickshaw", driver: "Amrik N.", plate: "PB08 ER 9904", stopId: "sports", status: "busy", seatsTotal: 4, seatsFree: 0, etaMin: 14 },
].map((v) => ({ ...v, photo: null }));

// Keep the store on globalThis so pages, API routes and Server Actions share one copy,
// and it survives hot reloads in `next dev`.
const store = (globalThis.__vehicleStore ??= { vehicles: SEED.map((v) => ({ ...v })) });

// The functions are async so they can be swapped for real database calls later
// without changing the code that uses them.

// ---- Read ----
export async function listVehicles({ stopId, type } = {}) {
  return store.vehicles
    .filter((v) => (!stopId || v.stopId === stopId) && (!type || type === "all" || v.type === type))
    .map((v) => ({ ...v }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

export async function getVehicle(id) {
  const vehicle = store.vehicles.find((v) => v.id === id);
  return vehicle ? { ...vehicle } : null;
}

// ---- Create ----
export async function createVehicle(data) {
  if (store.vehicles.some((v) => v.id === data.id || v.plate === data.plate)) {
    return { error: "A vehicle with this ID or number plate already exists" };
  }
  const vehicle = { ...data, status: "offline", seatsFree: 0, etaMin: 5, photo: null };
  store.vehicles.push(vehicle);
  return { vehicle: { ...vehicle } };
}

// ---- Update ----
// patch can hold: status, seatsFree, etaMin, photo
export async function updateVehicle(id, patch) {
  const vehicle = store.vehicles.find((v) => v.id === id);
  if (!vehicle) return { error: "Vehicle not found" };

  const next = { ...vehicle, ...patch };
  if (next.seatsFree > vehicle.seatsTotal) {
    return { error: `Seats free cannot be more than ${vehicle.seatsTotal}` };
  }
  // A busy or offline vehicle has no free seats.
  if (next.status !== "available") next.seatsFree = 0;

  Object.assign(vehicle, next);
  return { vehicle: { ...vehicle } };
}

// ---- Delete ----
export async function deleteVehicle(id) {
  const index = store.vehicles.findIndex((v) => v.id === id);
  if (index === -1) return { error: "Vehicle not found" };
  store.vehicles.splice(index, 1);
  return { ok: true };
}
