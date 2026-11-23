"use client";

import { useEffect, useRef, useState } from "react";
import { campusRoutes, campusStops, stopCoordinatesByName } from "@/data/campusMap";

const LPU_CAMPUS_REFERENCE = [31.25492, 75.70462];

export function CampusMap({
  className = "",
  position = null,
  trackingStatus = "INACTIVE",
  selectedRoute = null,
}) {
  const mapElement = useRef(null);
  const mapInstance = useRef(null);
  const leafletLibrary = useRef(null);
  const shuttleMarker = useRef(null);
  const routeLayerGroup = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState("");

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
      routeLayerGroup.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstance.current;
    const L = leafletLibrary.current;
    const layerGroup = routeLayerGroup.current;
    if (!mapReady || !map || !L || !layerGroup) return;

    layerGroup.clearLayers();

    if (selectedRoute && Array.isArray(selectedRoute.stops) && selectedRoute.stops.length > 0) {
      const sortedStops = [...selectedRoute.stops].sort((a, b) => a.order - b.order);
      const validPoints = [];

      sortedStops.forEach((stop, index) => {
        const coords = stopCoordinatesByName[stop.name];
        if (!coords) return;

        validPoints.push(coords);

        L.circleMarker(coords, {
          radius: 8,
          color: "#ffffff",
          weight: 2,
          fillColor: index === 0 ? "#16a34a" : index === sortedStops.length - 1 ? "#dc2626" : "#111827",
          fillOpacity: 1,
        })
          .addTo(layerGroup)
          .bindPopup(
            `<strong>${stop.order}. ${stop.name}</strong><br />Route: ${selectedRoute.routeName} (${selectedRoute.busNumber})<br />+${stop.minutesFromStart} min from start`,
          );
      });

      if (validPoints.length > 1) {
        L.polyline(validPoints, {
          color: "#2563eb",
          weight: 5,
          opacity: 0.9,
        })
          .addTo(layerGroup)
          .bindPopup(`<strong>${selectedRoute.routeName}</strong> (${selectedRoute.busNumber})`);
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
  }, [mapReady, selectedRoute]);

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
        {selectedRoute ? `${selectedRoute.routeName} (${selectedRoute.busNumber})` : "Sample stops · schematic route"}
      </p>
    </div>
  );
}