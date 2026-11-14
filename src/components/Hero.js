import Stat from "@/components/Stat";

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
}

// Shared by the home page (client) and the stop page (server), so it uses props only.
export default function Hero({ stop, destination, summary, peak, updatedAt }) {
  return (
    <header className="overflow-hidden rounded-2xl bg-asphalt text-white shadow-sm ring-1 ring-black/5">
      <div className="bg-signal px-5 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-asphalt sm:px-6">
        {updatedAt ? `Updated ${formatTime(updatedAt)}` : "Checking live status"}
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-2 text-sm text-white/70">
          <span className="live-dot inline-block h-2.5 w-2.5 rounded-full bg-cng" />
          {updatedAt ? "Live service" : "Getting live data"}
        </div>

        <h1 className="mt-4 font-display text-4xl font-bold leading-none sm:text-5xl">{stop.name}</h1>
        <p className="mt-2 text-base text-white/70 sm:text-lg">
          to {destination.name}, {destination.distanceKm} km
        </p>

        <div className="relative mt-6 h-7" aria-hidden="true">
          <div className="absolute inset-x-4 top-1/2 border-t border-dashed border-white/35" />
          <span className="absolute left-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-signal ring-4 ring-asphalt" />
          <span className="absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-white bg-asphalt" />
        </div>

        <dl className="mt-5 grid grid-cols-3 divide-x divide-white/15 border-t border-white/15 pt-4">
          <Stat
            label="Available"
            value={summary ? summary.availableCount : "–"}
            unit={summary ? `of ${summary.totalCount}` : undefined}
          />
          <Stat
            label="Pickup"
            value={summary?.avgEtaMin ?? "–"}
            unit={summary?.avgEtaMin ? "min" : undefined}
          />
          <Stat label="Lowest fare" value={summary?.lowestFare ? `₹${summary.lowestFare}` : "–"} />
        </dl>
      </div>

      {peak && (
        <p className="bg-signal px-5 py-3 text-sm font-semibold text-asphalt sm:px-6">
          Peak hours are busy; autos may add a surcharge.
        </p>
      )}
    </header>
  );
}
