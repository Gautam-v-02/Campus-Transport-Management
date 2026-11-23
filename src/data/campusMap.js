const SAMPLE_ROUTE_ID = "SAMPLE_GATE_TO_CENTRE";

export const stopCoordinatesByName = {
  "Boys Hostel": [31.2562, 75.7028],
  "Library": [31.2554, 75.7051],
  "Sports Complex": [31.2535, 75.7065],
  "Main Gate": [31.260694, 75.707298],
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