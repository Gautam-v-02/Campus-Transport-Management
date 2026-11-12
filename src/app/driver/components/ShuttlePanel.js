export function ShuttlePanel({ shuttle, occupiedSeats, availableSeats, onChangeOccupancy }) {
  const occupancyPercentage = Math.round((occupiedSeats / shuttle.capacity) * 100);
  const vehicleIsInService = shuttle.status === "IN_SERVICE";

  return (
    <article id="shuttle" className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div><p className="text-sm text-gray-500">My shuttle</p><h3 className="mt-1 text-xl font-bold">{shuttle.shuttleNumber}</h3></div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${vehicleIsInService ? "bg-gray-100 text-black" : "bg-emerald-100 text-emerald-800"}`}>{vehicleIsInService ? "ON TRIP" : "AVAILABLE"}</span>
      </div>
      <p className="mt-1 text-sm text-gray-500">{shuttle.registrationNumber}</p>
      <div className="my-6 border-t border-gray-100" />
      <div className="flex justify-between text-sm"><span className="text-gray-500">Passenger occupancy</span><span className="font-semibold">{occupiedSeats}/{shuttle.capacity}</span></div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-black" style={{ width: `${occupancyPercentage}%` }} /></div>
      <div className="mt-2 flex justify-between text-xs text-gray-500"><span>{availableSeats} seats available</span><span>{occupancyPercentage}%</span></div>
      <div className="mt-5 flex items-center justify-between rounded-lg bg-gray-50 p-3">
        <span className="text-sm font-medium">Update passengers</span>
        <div className="flex items-center gap-2">
          <button aria-label="Remove one passenger" onClick={() => onChangeOccupancy(-1)} className="h-8 w-8 rounded-md border border-gray-200 bg-white font-bold hover:bg-gray-100">−</button>
          <span className="w-6 text-center text-sm font-semibold">{occupiedSeats}</span>
          <button aria-label="Add one passenger" onClick={() => onChangeOccupancy(1)} className="h-8 w-8 rounded-md border border-gray-200 bg-white font-bold hover:bg-gray-100">+</button>
        </div>
      </div>
    </article>
  );
}
