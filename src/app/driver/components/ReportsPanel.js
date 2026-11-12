export function ReportsPanel({
  reports,
  category,
  delayMinutes,
  description,
  message,
  onCategoryChange,
  onDelayMinutesChange,
  onDescriptionChange,
  onSubmit,
}) {
  return (
    <section id="reports" className="grid gap-6 xl:grid-cols-2">
      <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-500">Delay and incident reporting</p>
        <h3 className="mt-1 text-xl font-bold">Report an issue</h3>
        <p className="mt-2 text-sm text-gray-500">Submitting a report marks an active trip as delayed. You can resume it from the top of this page.</p>
        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <label className="block text-sm font-medium">Issue category
            <select value={category} onChange={(event) => onCategoryChange(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 font-normal">
              <option value="TRAFFIC_CONGESTION">Traffic congestion</option>
              <option value="VEHICLE_BREAKDOWN">Vehicle breakdown</option>
              <option value="ROAD_BLOCKAGE">Road blockage</option>
              <option value="WEATHER_CONDITIONS">Weather conditions</option>
              <option value="OTHER">Other</option>
            </select>
          </label>
          <label className="block text-sm font-medium">Estimated delay (minutes)
            <input type="number" min="1" max="240" required value={delayMinutes} onChange={(event) => onDelayMinutesChange(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 font-normal" />
          </label>
          <label className="block text-sm font-medium">Description (optional)
            <textarea rows="3" value={description} onChange={(event) => onDescriptionChange(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 font-normal" placeholder="Add useful details for the transport team" />
          </label>
          <button type="submit" className="rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800">Save incident report</button>
          {message && <p role="status" className="text-sm text-emerald-700">{message}</p>}
        </form>
      </article>

      <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-500">Saved for this session</p>
        <h3 className="mt-1 text-xl font-bold">Previous incident reports</h3>
        <ul className="mt-5 divide-y divide-gray-100">
          {reports.map((report) => (
            <li key={report.id} className="py-4 first:pt-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold">{report.category.replaceAll("_", " ")}</p>
                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800">~{report.estimatedDelayMinutes} min</span>
              </div>
              <p className="mt-1 text-sm text-gray-600">{report.description}</p>
              <p className="mt-2 text-xs text-gray-400">{new Date(report.reportedAt).toLocaleString()}</p>
            </li>
          ))}
          {reports.length === 0 && <li className="py-4 text-sm text-gray-500">No reports have been filed.</li>}
        </ul>
      </article>
    </section>
  );
}
