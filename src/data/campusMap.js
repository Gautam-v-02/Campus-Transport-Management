const SAMPLE_ROUTE_ID = "SAMPLE_GATE_TO_CENTRE";

export const stopCoordinatesByName = {
  // Existing sample points. Newly added points below are schematic until the
  // transport team supplies verified stop coordinates.
  "Boys Hostel": [31.2562, 75.7028],
  "Hostel": [31.2562, 75.7028],
  "Library": [31.2554, 75.7051],
  "Sports Complex": [31.2535, 75.7065],
  "Main Gate": [31.260694, 75.707298],
  "University Main Gate": [31.260694, 75.707298],
  "Academic Block": [31.2578, 75.7058],
  "Main Campus Exit": [31.2529, 75.7044],
  "South Gate": [31.2527, 75.7071],
  "Engineering Block": [31.2559, 75.7068],
  "Cafeteria": [31.2572, 75.7049],
  "Medical Centre": [31.2584, 75.7038],
  "Girls Hostel": [31.2569, 75.7029],
  "South Campus Exit": [31.2524, 75.7034],
  "City Bus Stand": [31.326015, 75.57618],
  "Central Market": [31.3238, 75.5792],
  "Railway Station": [31.331, 75.591],
  "Front gate LPU — sample stop": [31.260694, 75.707298],
  "LPU campus OSM point — sample stop": [31.25492, 75.70462],
};

export const campusStops = [
  {
    id: "SAMPLE_GATE",
    name: "Front gate LPU — sample stop",
    latitude: 31.260694,
    longitude: 75.707298,
    routeId: SAMPLE_ROUTE_ID,
    sequence: 1,
    source: "FlixBus public map pin for Front gate LPU",
  },
  {
    id: "SAMPLE_LPU_POINT",
    name: "LPU campus OSM point — sample stop",
    latitude: 31.25492,
    longitude: 75.70462,
    routeId: SAMPLE_ROUTE_ID,
    sequence: 2,
    source: "OpenStreetMap university reference point",
  },
];

export const campusRoutes = [
  {
    id: SAMPLE_ROUTE_ID,
    name: "Main gate to campus centre",
    coordinates: campusStops.map((stop) => [stop.latitude, stop.longitude]),
    color: "#111827",
    isSchematic: true,
  },
];
