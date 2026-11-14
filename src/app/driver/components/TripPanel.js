export function TripPanel({ route, status, completedStops, onMarkStop, onComplete }) {
  const totalStops = route.stops.length;
  const progress = Math.round((completedStops / totalStops) * 100);
  const currentStop = route.stops[completedStops];
  const nextStop = route.stops[completedStops + 1];

  return (
    <article id="trip" className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm xl:col-span-2">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><p className="text-sm text-gray-500">Assigned route</p><h3 className="mt-1 text-xl font-bold">{route.routeName}</h3></div>
        <span className={`rounded-full px-3 py-1.5 text-sm font-semibold ${status === "DELAYED" ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-black"}`}>{status.replaceAll("_", " ")}</span>
      </div>

      <div className="mt-6 grid gap-4 rounded-xl bg-gray-50 p-4 sm:grid-cols-2">
        <div><p className="text-xs uppercase tracking-wide text-gray-500">Current stop</p><p className="mt-1 font-semibold">{status === "NOT_STARTED" ? "Not started" : currentStop ? currentStop.name : "Route complete"}</p></div>
        <div><p className="text-xs uppercase tracking-wide text-gray-500">Next stop</p><p className="mt-1 font-semibold">{status === "NOT_STARTED" ? route.stops[0].name : nextStop ? nextStop.name : "—"}</p></div>
      </div>

      <div className="mt-6 flex items-center justify-between text-sm">
        <span className="font-medium">Route progress</span>
        <span className="text-gray-500">{completedStops} of {totalStops} stops · {progress}%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-black transition-all" style={{ width: `${progress}%` }} /></div>

      {status === "IN_PROGRESS" && completedStops < totalStops && <button onClick={onMarkStop} className="mt-5 rounded-lg border border-black px-4 py-2.5 text-sm font-semibold text-black hover:bg-gray-100">Mark stop as reached</button>}
      {status === "DELAYED" && <p className="mt-5 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">This trip is delayed. Resume it when it is safe to continue.</p>}
      {["IN_PROGRESS", "DELAYED"].includes(status) && <button onClick={onComplete} className="mt-5 rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800">End trip</button>}
      {status === "NOT_STARTED" && <p className="mt-5 text-sm text-gray-500">Start the trip to record progress through the stops.</p>}
    </article>
  );
}
