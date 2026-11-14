const SAMPLE_ROUTE_ID = "SAMPLE_GATE_TO_CENTRE";

// Public map points used as replaceable examples, not confirmed shuttle stops.
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

// LPU describes a shuttle from the main gate to the campus centre, but does
// not publish its exact path. This dashed line is only a schematic connector.
export const campusRoutes = [
  {
    id: SAMPLE_ROUTE_ID,
    name: "Main gate to campus centre",
    coordinates: campusStops.map((stop) => [stop.latitude, stop.longitude]),
    color: "#111827",
    isSchematic: true,
  },
];
