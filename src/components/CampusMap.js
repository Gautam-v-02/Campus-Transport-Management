"use client";

import { useEffect, useRef, useState } from "react";
import { campusRoutes, campusStops, stopCoordinatesByName } from "@/data/campusMap";

const LPU_CAMPUS_REFERENCE = [31.25492, 75.70462];

function createRoutePopup(stop, route) {
  const routeName = route.routeName || route.name || "Shuttle route";
  const shuttleName = route.busNumber || route.shuttleNumber;
  const content = document.createElement("div");
  const stopName = document.createElement("strong");
  stopName.textContent = `${stop.order ?? stop.sequence ?? ""}. ${stop.name}`;
  content.append(stopName, document.createElement("br"));

  const routeDetails = document.createElement("span");
  routeDetails.textContent = `Route: ${routeName}${shuttleName ? ` (${shuttleName})` : ""}`;
  content.append(routeDetails, document.createElement("br"));

  const stopStatus = document.createElement("span");
  stopStatus.textContent = stop.reached ? "Reached" : "Upcoming";
  content.append(stopStatus);

  if (Number.isFinite(stop.minutesFromStart)) {
    content.append(document.createElement("br"));
    const arrival = document.createElement("span");
    arrival.textContent = `+${stop.minutesFromStart} min from start`;
    content.append(arrival);
  }
  return content;
}

function createRouteLinePopup(route) {
  const content = document.createElement("div");
  const routeName = document.createElement("strong");
  routeName.textContent = `${route.routeName || route.name || "Shuttle route"}${route.busNumber || route.shuttleNumber ? ` (${route.busNumber || route.shuttleNumber})` : ""}`;
  content.append(routeName);
  return content;
}

function createStopTooltip(name) {
  const label = document.createElement("span");
  label.textContent = name;
  return label;
}

function getRouteSignature(route) {
  if (!route) return "sample-route";
  const stopDetails = (route.stops || []).map((stop) => typeof stop === "string"
    ? stop
    : `${stop.name}:${stop.order ?? stop.sequence ?? ""}:${stop.latitude ?? ""}:${stop.longitude ?? ""}`);
  return `${route.id}:${route.routeName || route.name}:${route.completedStops || 0}:${stopDetails.join("|")}`;
}

export function CampusMap({
  className = "",
  position = null,
  userPosition = null,
  trackingStatus = "INACTIVE",
  selectedRoute = null,
}) {
  const mapElement = useRef(null);
  const mapInstance = useRef(null);
  const leafletLibrary = useRef(null);
  const shuttleMarker = useRef(null);
  const userMarker = useRef(null);
  const routeLayerGroup = useRef(null);
  const renderedRouteSignature = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState("");
  const routeSignature = getRouteSignature(selectedRoute);
  const unmappedStops = selectedRoute?.stops?.filter((stop) => {
    const name = typeof stop === "string" ? stop : stop.name;
    const hasCoordinates = typeof stop === "object"
      && Number.isFinite(stop.latitude)
      && Number.isFinite(stop.longitude);
    return !hasCoordinates && !stopCoordinatesByName[name];
  }).length || 0;

  useEffect(() => {
    let map;
    let isDisposed = false;

    import("leaflet")
      .then(({ default: L }) => {
        if (isDisposed || !mapElement.current) return;

        map = L.map(mapElement.current, {
          center: LPU_CAMPUS_REFERENCE,
          zoom: 16,
          scrollWheelZoom: true,
        });
        mapInstance.current = map;
        leafletLibrary.current = L;
        routeLayerGroup.current = L.layerGroup().addTo(map);

        const tiles = L.tileLayer(
          "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            maxZoom: 19,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          },
        ).addTo(map);

        tiles.on("tileerror", () => {
          setMapError("Map tiles could not load. Check your internet connection.");
        });

        setMapReady(true);
      })
      .catch(() => {
        if (!isDisposed) setMapError("The campus map could not be loaded.");
      });

    return () => {
      isDisposed = true;
      map?.remove();
      mapInstance.current = null;
      leafletLibrary.current = null;
      shuttleMarker.current = null;
      userMarker.current = null;
      routeLayerGroup.current = null;
      renderedRouteSignature.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstance.current;
    const L = leafletLibrary.current;
    const layerGroup = routeLayerGroup.current;
    if (!mapReady || !map || !L || !layerGroup) return;
    if (renderedRouteSignature.current === routeSignature) return;

    layerGroup.clearLayers();
    renderedRouteSignature.current = routeSignature;

    if (selectedRoute && Array.isArray(selectedRoute.stops) && selectedRoute.stops.length > 0) {
      const sortedStops = [...selectedRoute.stops].sort(
        (a, b) => (a.order ?? a.sequence ?? 0) - (b.order ?? b.sequence ?? 0),
      );
      const validPoints = [];
      const completedStops = selectedRoute.completedStops || 0;

      sortedStops.forEach((stop, index) => {
        const stopName = typeof stop === "string" ? stop : stop.name;
        const coords = typeof stop === "object" && Number.isFinite(stop.latitude) && Number.isFinite(stop.longitude)
          ? [stop.latitude, stop.longitude]
          : stopCoordinatesByName[stopName];
        if (!coords) return;

        validPoints.push(coords);
        const reached = index < completedStops;
        const stopNumber = stop.order ?? stop.sequence ?? index + 1;
        const stopIcon = L.divIcon({
          className: "campus-stop-icon",
          html: `<span class="${reached ? "is-reached" : ""}">${reached ? "✓" : stopNumber}</span>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        L.marker(coords, {
          icon: stopIcon,
          title: `${stopNumber}. ${stopName}${reached ? " — reached" : " — upcoming"}`,
        })
          .addTo(layerGroup)
          .bindPopup(createRoutePopup({
            ...stop,
            order: stopNumber,
            name: stopName,
            reached,
          }, selectedRoute))
          .bindTooltip(createStopTooltip(stopName), {
            permanent: true,
            direction: "top",
            offset: [0, -11],
            className: "campus-stop-tooltip",
          });
      });

      if (validPoints.length > 1) {
        L.polyline(validPoints, {
          color: "#2563eb",
          weight: 5,
          opacity: 0.9,
        })
          .addTo(layerGroup)
          .bindPopup(createRouteLinePopup(selectedRoute));
      }

      if (validPoints.length > 0) {
        map.fitBounds(L.latLngBounds(validPoints), { padding: [36, 36], maxZoom: 16 });
      }
      return;
    }

    campusRoutes.forEach((route) => {
      L.polyline(route.coordinates, {
        color: route.color,
        weight: 4,
        opacity: 0.85,
        dashArray: "8 8",
      })
        .addTo(layerGroup)
        .bindPopup(
          `<strong>${route.name}</strong><br />Schematic sample only — the exact shuttle path is not published.`,
        );
    });

    campusStops.forEach((stop, index) => {
      L.circleMarker([stop.latitude, stop.longitude], {
        radius: 8,
        color: "#ffffff",
        weight: 2,
        fillColor: index === 0 ? "#111827" : "#64748b",
        fillOpacity: 1,
      })
        .addTo(layerGroup)
        .bindPopup(
          `<strong>${stop.name}</strong><br />Sample location for development; verify with LPU Transport before live use.`,
        );
    });

    map.fitBounds(
      L.latLngBounds(campusRoutes.flatMap((route) => route.coordinates)),
      { padding: [32, 32], maxZoom: 16 },
    );
  }, [mapReady, routeSignature, selectedRoute]);

  useEffect(() => {
    const map = mapInstance.current;
    const L = leafletLibrary.current;
    if (!mapReady || !map || !L) return;

    if (!position) {
      shuttleMarker.current?.remove();
      shuttleMarker.current = null;
      return;
    }

    const coordinates = [position.latitude, position.longitude];
    const popup = `<strong>Live shuttle GPS</strong><br />Status: ${trackingStatus}<br />Accuracy: ±${Math.round(position.accuracy)} m<br />Updated: ${new Date(position.timestamp).toLocaleTimeString()}`;

    if (!shuttleMarker.current) {
      const busIcon = L.divIcon({
        className: "campus-shuttle-icon",
        html: '<span aria-hidden="true">🚌</span>',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      shuttleMarker.current = L.marker(coordinates, {
        icon: busIcon,
        title: "Live shuttle GPS location",
      }).addTo(map);
    } else {
      shuttleMarker.current.setLatLng(coordinates);
    }

    shuttleMarker.current.setPopupContent(popup);
    if (!map.getBounds().contains(coordinates)) {
      map.panInside(coordinates, { padding: [48, 48] });
    }
  }, [mapReady, position, trackingStatus]);

  useEffect(() => {
    const map = mapInstance.current;
    const L = leafletLibrary.current;
    if (!mapReady || !map || !L) return;

    if (!userPosition) {
      userMarker.current?.remove();
      userMarker.current = null;
      return;
    }

    const coordinates = [userPosition.latitude, userPosition.longitude];
    if (!coordinates.every(Number.isFinite)) return;

    if (!userMarker.current) {
      const locationIcon = L.divIcon({
        className: "campus-user-location-icon",
        html: '<span aria-hidden="true"></span>',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
      userMarker.current = L.marker(coordinates, {
        icon: locationIcon,
        title: "Your current location",
        zIndexOffset: 1000,
      })
        .addTo(map)
        .bindPopup("");
      map.setView(coordinates, Math.max(map.getZoom(), 16));
    } else {
      userMarker.current.setLatLng(coordinates);
      if (!map.getBounds().contains(coordinates)) {
        map.panInside(coordinates, { padding: [48, 48] });
      }
    }

    userMarker.current.setPopupContent(
      `<strong>Your current location</strong><br />Accuracy: ±${Math.round(userPosition.accuracy)} m<br />Updated: ${new Date(userPosition.timestamp).toLocaleTimeString()}`,
    );
  }, [mapReady, userPosition]);

  return (
    <div className={`relative h-[420px] w-full overflow-hidden border border-gray-200 bg-gray-100 ${className}`}>
      <div
        ref={mapElement}
        className="h-full w-full"
        role="application"
        aria-label="Interactive OpenStreetMap centered on Lovely Professional University"
      />
      {mapError && (
        <p role="status" className="absolute right-3 top-3 z-[1000] bg-white px-3 py-2 text-xs text-gray-700 shadow">
          {mapError}
        </p>
      )}
      <p className="absolute left-3 top-3 z-[500] bg-white/95 px-3 py-2 text-[10px] font-mono uppercase tracking-wide text-gray-700 shadow">
        {selectedRoute ? `${selectedRoute.routeName || selectedRoute.name}${selectedRoute.shuttleNumber ? ` · ${selectedRoute.shuttleNumber}` : selectedRoute.busNumber ? ` · ${selectedRoute.busNumber}` : ""}` : "Sample stops · schematic route"}
      </p>
      {userPosition && (
        <p className="absolute left-3 top-11 z-[500] flex items-center gap-2 bg-white/95 px-3 py-2 text-[10px] font-mono uppercase tracking-wide text-gray-700 shadow">
          <span className="h-2.5 w-2.5 rounded-full border-2 border-white bg-blue-600 shadow" />
          Your location
        </p>
      )}
      {unmappedStops > 0 && (
        <p className="absolute bottom-3 left-3 z-[500] bg-white/95 px-3 py-2 text-[10px] text-gray-700 shadow">
          {unmappedStops} route {unmappedStops === 1 ? "stop has" : "stops have"} no map coordinates yet.
        </p>
      )}
    </div>
  );
}
