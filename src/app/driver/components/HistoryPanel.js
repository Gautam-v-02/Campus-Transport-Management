export function HistoryPanel({
  trips,
  shuttles,
  routes,
  search,
  date,
  status,
  onSearchChange,
  onDateChange,
  onStatusChange,
}) {
  return (
    <section id="history" className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-sm text-gray-500">All driver journeys</p><h3 className="mt-1 text-xl font-bold">Trip history</h3></div>
        <div className="flex flex-wrap gap-3">
          <label className="text-sm font-medium">Search trips
            <input value={search} onChange={(event) => onSearchChange(event.target.value)} className="mt-1 block rounded-lg border border-gray-300 px-3 py-2 font-normal" placeholder="Trip, shuttle, or route" />
          </label>
          <label className="text-sm font-medium">Date
            <input type="date" value={date} onChange={(event) => onDateChange(event.target.value)} className="mt-1 block rounded-lg border border-gray-300 px-3 py-2 font-normal" />
          </label>
          <label className="text-sm font-medium">Status
            <select value={status} onChange={(event) => onStatusChange(event.target.value)} className="mt-1 block rounded-lg border border-gray-300 bg-white px-3 py-2 font-normal">
              <option value="ALL">All statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="IN_PROGRESS">In progress</option>
              <option value="DELAYED">Delayed</option>
            </select>
          </label>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
            <tr><th className="py-3 pr-4">Trip ID</th><th className="py-3 pr-4">Shuttle</th><th className="py-3 pr-4">Route</th><th className="py-3 pr-4">Date</th><th className="py-3 pr-4">Start</th><th className="py-3 pr-4">End</th><th className="py-3 pr-4">Duration</th><th className="py-3">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {trips.map((trip) => {
              const shuttle = shuttles.find((item) => item.id === trip.shuttleId);
              const route = routes.find((item) => item.id === trip.routeId);
              const duration = trip.endTime
                ? Math.round((new Date(trip.endTime) - new Date(trip.startTime)) / 60000)
                : null;
              let statusStyle = "bg-gray-100 text-black";
              if (trip.status === "COMPLETED") statusStyle = "bg-emerald-50 text-emerald-700";
              if (trip.status === "DELAYED") statusStyle = "bg-amber-50 text-amber-800";

              return (
                <tr key={trip.id}>
                  <td className="py-3 pr-4 font-medium">{trip.id}</td>
                  <td className="py-3 pr-4">{shuttle?.shuttleNumber || "—"}</td>
                  <td className="py-3 pr-4">{route?.routeName || "—"}</td>
                  <td className="py-3 pr-4">{new Date(trip.startTime).toLocaleDateString()}</td>
                  <td className="py-3 pr-4">{new Date(trip.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                  <td className="py-3 pr-4">{trip.endTime ? new Date(trip.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}</td>
                  <td className="py-3 pr-4">{duration === null ? "—" : `${duration} min`}</td>
                  <td className="py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle}`}>{trip.status.replaceAll("_", " ")}</span></td>
                </tr>
              );
            })}
            {trips.length === 0 && <tr><td colSpan="8" className="py-5 text-center text-gray-500">No trips match these filters.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}
