export function StatCard({ label, value, detail, icon }) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 font-semibold text-black">{icon}</span>
      </div>
      <p className="mt-4 text-2xl font-bold capitalize">{value}</p>
      <p className="mt-1 truncate text-sm text-gray-500">{detail}</p>
    </article>
  );
}
