export function RoutePanel({ route, completedStops, tripStatus }) {
  return (
    <section id="route" className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div><p className="text-sm text-gray-500">Route management</p><h3 className="mt-1 text-xl font-bold">Stops on {route.routeName}</h3></div>
        <p className="text-sm text-gray-500">Mark stops as your shuttle reaches them</p>
      </div>
      <ol className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {route.stops.map((stop, index) => {
          let stopStyle = "border-gray-200 bg-white text-gray-500";
          let stopLabel = "Upcoming";
          if (index < completedStops) {
            stopStyle = "border-emerald-200 bg-emerald-50 text-emerald-800";
            stopLabel = "Reached";
          } else if (index === completedStops && ["IN_PROGRESS", "DELAYED"].includes(tripStatus)) {
            stopStyle = "border-gray-300 bg-gray-100 text-black";
            stopLabel = "Current stop";
          }

          return (
            <li key={stop.id} className={`flex items-center gap-3 rounded-xl border p-4 ${stopStyle}`}>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold">{index < completedStops ? "✓" : stop.sequence}</span>
              <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{stop.name}</span><span className="mt-1 block text-xs">{stopLabel}</span></span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
