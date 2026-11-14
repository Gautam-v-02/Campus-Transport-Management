"use client";

import { useState } from "react";
import Link from "next/link";
import { DESTINATIONS, STOPS, getBadges, sortVehicles } from "@/lib/lastMile";
import useLastMile from "@/hooks/useLastMile";
import Hero from "@/components/Hero";
import VehicleCard from "@/components/VehicleCard";
import Segmented from "@/components/Segmented";
import FareGuide from "@/components/FareGuide";

// Environment variable from .env (NEXT_PUBLIC_ names are readable in the browser)
const REFRESH_MS = Number(process.env.NEXT_PUBLIC_REFRESH_SECONDS ?? 10) * 1000;

const TYPE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "e-rickshaw", label: "E-rickshaw" },
  { value: "auto", label: "Auto" },
];

const SORT_OPTIONS = [
  { value: "best", label: "Default" },
  { value: "fastest", label: "Fastest" },
  { value: "cheapest", label: "Cheapest" },
];

export default function LastMileBoard() {
  // The state lives here, in the parent, and is passed down to the children that need it
  // (lifting state up, INT252 Unit II).
  const [stop, setStop] = useState(STOPS[0].id);
  const [destination, setDestination] = useState(DESTINATIONS[0].id);
  const [type, setType] = useState("all");
  const [sort, setSort] = useState("best");
  const [showGuide, setShowGuide] = useState(false);

  const { data, error, loading, reload } = useLastMile({ stop, destination, type, refreshMs: REFRESH_MS });

  const stopObj = STOPS.find((s) => s.id === stop);
  const destObj = DESTINATIONS.find((d) => d.id === destination);

  // Derived state: these are worked out from `data` and `sort` on every render,
  // so they never need to be stored in state of their own.
  const vehicles = data ? sortVehicles(data.vehicles, sort) : [];
  const badges = data ? getBadges(data.vehicles) : {};

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:py-8">
      <Hero
        stop={stopObj}
        destination={destObj}
        summary={data?.summary ?? null}
        peak={data?.peak ?? false}
        updatedAt={data?.updatedAt ?? null}
      />

      <section className="mt-6 rounded-2xl border border-line bg-white p-4 sm:p-5" aria-label="Choose your trip">
        <div className="flex flex-wrap items-center gap-2 text-base sm:text-lg">
          <span className="font-medium text-mute">From</span>
          <select id="stop" className="field min-w-[150px]" value={stop} onChange={(e) => setStop(e.target.value)}>
            {STOPS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <span className="font-medium text-mute">to</span>
          <select
            id="destination"
            className="field min-w-[160px]"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          >
            {DESTINATIONS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-4">
          <Segmented label="Vehicle" options={TYPE_OPTIONS} value={type} onChange={setType} />
          <Segmented label="Sort" options={SORT_OPTIONS} value={sort} onChange={setSort} />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
          <button
            type="button"
            aria-expanded={showGuide}
            onClick={() => setShowGuide(!showGuide)}
            className="text-sm font-semibold text-ink underline decoration-signal decoration-2 underline-offset-4 hover:text-asphalt"
          >
            {showGuide ? "Hide fare guide" : "Fare guide"}
          </button>
          <Link
            href={`/stops/${stop}?destination=${destination}`}
            className="text-sm font-semibold text-mute underline decoration-signal decoration-2 underline-offset-4 hover:text-ink"
          >
            Stop board
          </Link>
        </div>
        {showGuide && <FareGuide />}
      </section>

      {/* Results: loading, error, empty and list states */}
      <section className="mt-8" aria-live="polite">
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-display text-2xl font-bold">
            {data ? `${data.summary.availableCount} rides at ${data.stop.name}` : "Looking for rides"}
          </h2>
        </div>

        {error && (
          <div role="alert" className="rounded-xl border border-brick/30 bg-brick/10 p-4 text-sm">
            <p className="font-semibold text-brick">{error}</p>
            <p className="mt-1 text-ink">Check your connection and try again.</p>
            <button
              onClick={reload}
              className="mt-3 rounded-md bg-asphalt px-3 py-1.5 font-semibold text-white hover:bg-asphalt-2"
            >
              Try again
            </button>
          </div>
        )}

        {loading && !data && (
          <ul className="space-y-5" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <li key={i} className="h-32 animate-pulse rounded-xl bg-black/5" />
            ))}
          </ul>
        )}

        {data && vehicles.length === 0 && (
          <div className="rounded-xl border-2 border-dashed border-line bg-white p-10 text-center">
            <p className="font-display text-lg font-semibold">No rides of this type at {data.stop.name}</p>
            <p className="mt-1 text-sm text-mute">Show all vehicle types or pick another stop.</p>
            <button
              onClick={() => setType("all")}
              className="mt-4 rounded-md bg-asphalt px-4 py-2 text-sm font-semibold text-white hover:bg-asphalt-2"
            >
              Show all vehicles
            </button>
          </div>
        )}

        {vehicles.length > 0 && (
          <ul className={`space-y-5 ${loading ? "opacity-60" : ""}`}>
            {vehicles.map((v) => (
              <VehicleCard key={v.id} v={v} badges={badges[v.id]} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
