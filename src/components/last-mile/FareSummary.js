export default function FareSummary({ cheapest, fastest }) {
  if (!cheapest || !fastest) return null;

  return (
    <div className="grid gap-px border border-gray-200 bg-gray-200 sm:grid-cols-2">
      <div className="bg-gray-50 p-4">
        <p className="text-[10px] font-mono uppercase tracking-wider text-gray-400">Lowest fare</p>
        <p className="mt-1 text-sm">
          <strong className="text-lg">₹{cheapest.fare}</strong>
          <span className="ml-2 text-gray-500">
            {cheapest.type}, {cheapest.vehicleNumber}
          </span>
        </p>
      </div>
      <div className="bg-gray-50 p-4">
        <p className="text-[10px] font-mono uppercase tracking-wider text-gray-400">Shortest waiting time</p>
        <p className="mt-1 text-sm">
          <strong className="text-lg">{fastest.waitingTime} min</strong>
          <span className="ml-2 text-gray-500">
            {fastest.type}, {fastest.vehicleNumber}
          </span>
        </p>
      </div>
    </div>
  );
}
