const labelClass = "text-[10px] font-mono uppercase tracking-wider text-gray-400";

export default function VehicleCard({ vehicle, isCheapest, isFastest, isSelected, onSelect }) {
  const available = vehicle.status === "Available";

  return (
    <article
      className={`flex flex-col justify-between border p-6 transition ${
        available ? "border-gray-200 bg-white hover:border-black" : "border-gray-200 bg-gray-50"
      } ${isSelected ? "border-black" : ""}`}
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className={labelClass}>{vehicle.type}</p>
            <h3 className={`mt-1 text-xl font-bold tracking-tight ${available ? "" : "text-gray-400"}`}>{vehicle.driver}</h3>
          </div>
          <span
            className={`px-2 py-1 text-xs font-mono font-bold ${
              available ? "bg-emerald-100 text-emerald-800" : "bg-gray-200 text-gray-500"
            }`}
          >
            {available ? "AVAILABLE" : "NOT AVAILABLE"}
          </span>
        </div>

        {(isCheapest || isFastest) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {isCheapest && <span className="bg-black px-2 py-0.5 text-[10px] font-mono font-bold text-white">LOWEST FARE</span>}
            {isFastest && (
              <span className="border border-black px-2 py-0.5 text-[10px] font-mono font-bold">SHORTEST WAIT</span>
            )}
          </div>
        )}

        <dl className={`mt-5 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-gray-100 pt-5 text-sm ${available ? "" : "text-gray-400"}`}>
          <div>
            <dt className={labelClass}>Vehicle Number</dt>
            <dd className="mt-0.5 font-medium">{vehicle.vehicleNumber}</dd>
          </div>
          <div>
            <dt className={labelClass}>Estimated Fare</dt>
            <dd className="mt-0.5 font-medium">₹{vehicle.fare}</dd>
          </div>
          <div>
            <dt className={labelClass}>Pickup</dt>
            <dd className="mt-0.5 font-medium">{vehicle.pickup}</dd>
          </div>
          <div>
            <dt className={labelClass}>Destination</dt>
            <dd className="mt-0.5 font-medium">{vehicle.destination}</dd>
          </div>
          <div>
            <dt className={labelClass}>Waiting Time</dt>
            <dd className="mt-0.5 font-medium">{available ? `${vehicle.waitingTime} minutes` : "Not available"}</dd>
          </div>
          <div>
            <dt className={labelClass}>Available Seats</dt>
            <dd className="mt-0.5 font-medium">{vehicle.seats}</dd>
          </div>
        </dl>
      </div>

      <button
        type="button"
        disabled={!available}
        onClick={() => onSelect(vehicle)}
        className={`mt-6 w-full py-3 text-xs font-mono uppercase tracking-wider transition ${
          !available
            ? "cursor-not-allowed border border-gray-200 bg-gray-100 text-gray-400"
            : isSelected
            ? "border border-black bg-white text-black"
            : "bg-black text-white hover:bg-gray-800"
        }`}
      >
        {!available ? "Not Available" : isSelected ? "Selected ✓" : "Select Ride →"}
      </button>
    </article>
  );
}
