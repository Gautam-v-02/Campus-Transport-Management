"use client";

import { useState } from "react";
import { pickupStops, destinations, lastMileVehicles } from "@/data/lastMileVehicles";
import RouteSelector from "@/components/last-mile/RouteSelector";
import VehicleFilter from "@/components/last-mile/VehicleFilter";
import FareSummary from "@/components/last-mile/FareSummary";
import VehicleCard from "@/components/last-mile/VehicleCard";

export default function LastMilePage() {
  const [pickup, setPickup] = useState(pickupStops[0]);
  const [destination, setDestination] = useState(destinations[0]);
  const [filter, setFilter] = useState("All Vehicles");
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const routeVehicles = lastMileVehicles.filter(
    (v) => v.pickup === pickup && v.destination === destination
  );
  const visibleVehicles =
    filter === "All Vehicles" ? routeVehicles : routeVehicles.filter((v) => v.type === filter);

  const availableVehicles = visibleVehicles.filter((v) => v.status === "Available");
  const cheapest = availableVehicles.length > 0 ? availableVehicles.reduce((a, b) => (b.fare < a.fare ? b : a)) : null;
  const fastest =
    availableVehicles.length > 0 ? availableVehicles.reduce((a, b) => (b.waitingTime < a.waitingTime ? b : a)) : null;

  function changePickup(value) {
    setPickup(value);
    setSelectedVehicle(null);
  }

  function changeDestination(value) {
    setDestination(value);
    setSelectedVehicle(null);
  }

  function changeFilter(value) {
    setFilter(value);
    setSelectedVehicle(null);
  }

  return (
    <main className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center bg-black text-xs font-mono font-bold tracking-tighter text-white">
            CT
          </div>
          <span className="text-sm font-semibold tracking-tight">Campus Transport – Last Mile</span>
        </div>
        <span className="text-xs font-mono text-gray-400">STANDALONE_DEMO</span>
      </nav>

      <section className="mx-auto max-w-5xl px-6 pt-12 pb-20">
        <div className="inline-block mb-6 border border-gray-200 px-3 py-1 text-[11px] font-mono uppercase tracking-widest text-gray-500">
          Module 3 · Last-Mile Service
        </div>
        <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight md:text-5xl">
          Reach your final stop, <span className="text-gray-400">without the wait.</span>
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-600">
          Getting off the shuttle? Choose your pickup stop and destination to see the e-rickshaws and autos available for
          your route, and compare their fares and waiting times.
        </p>

        <div className="mt-10 border border-gray-200 bg-gray-50 p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
            <span className="text-xs font-mono font-medium uppercase tracking-wider text-gray-400">Find a ride</span>
            <span className="text-[11px] font-mono text-gray-400">INTERACTIVE</span>
          </div>
          <RouteSelector
            pickupStops={pickupStops}
            destinations={destinations}
            pickup={pickup}
            destination={destination}
            onPickupChange={changePickup}
            onDestinationChange={changeDestination}
          />
          <div className="mt-6">
            <p className="mb-2 text-[10px] font-mono uppercase tracking-wider text-gray-400">Vehicle Type</p>
            <VehicleFilter selected={filter} onChange={changeFilter} />
          </div>
        </div>

        <section className="mt-12">
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-2xl font-bold tracking-tight">
              {pickup} <span className="text-gray-400">→</span> {destination}
            </h2>
            <span className="text-xs font-mono text-gray-400">
              {visibleVehicles.length} {visibleVehicles.length === 1 ? "VEHICLE" : "VEHICLES"}
            </span>
          </div>

          <FareSummary cheapest={cheapest} fastest={fastest} />

          {selectedVehicle && (
            <div className="mt-4 border border-black bg-gray-50 p-4 text-sm">
              <p className="mb-1 text-[10px] font-mono uppercase tracking-wider text-gray-400">Ride selected</p>
              <p>
                {selectedVehicle.type} {selectedVehicle.vehicleNumber} with {selectedVehicle.driver} will pick you up
                from {selectedVehicle.pickup} in {selectedVehicle.waitingTime} minutes. Estimated fare: ₹
                {selectedVehicle.fare}.
              </p>
              <p className="mt-1 text-xs text-gray-500">This is only a demo selection, not a real booking.</p>
            </div>
          )}

          {visibleVehicles.length === 0 ? (
            <p className="mt-4 border border-dashed border-gray-300 p-10 text-center text-sm text-gray-500">
              No vehicles found for this route. Try a different stop, destination or vehicle type.
            </p>
          ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {visibleVehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  isCheapest={cheapest !== null && vehicle.id === cheapest.id}
                  isFastest={fastest !== null && vehicle.id === fastest.id}
                  isSelected={selectedVehicle !== null && selectedVehicle.id === vehicle.id}
                  onSelect={setSelectedVehicle}
                />
              ))}
            </div>
          )}
        </section>
      </section>

      <footer className="border-t border-gray-200 px-6 py-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between text-xs font-mono text-gray-400">
          <p>© 2026 CampusTransit Systems</p>
          <p>LAST_MILE_OK</p>
        </div>
      </footer>
    </main>
  );
}
