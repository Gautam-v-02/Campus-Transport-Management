const fieldClass = "border border-gray-200 bg-white p-3.5 transition focus-within:border-black";
const labelClass = "mb-1 block text-[10px] font-mono uppercase tracking-wider text-gray-400";
const selectClass = "w-full cursor-pointer bg-transparent text-sm font-medium text-black outline-none";

export default function RouteSelector({ pickupStops, destinations, pickup, destination, onPickupChange, onDestinationChange }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className={fieldClass}>
        <label htmlFor="pickup" className={labelClass}>
          Pickup Stop
        </label>
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2 flex-shrink-0 bg-black"></span>
          <select id="pickup" value={pickup} onChange={(e) => onPickupChange(e.target.value)} className={selectClass}>
            {pickupStops.map((stop) => (
              <option key={stop} value={stop}>
                {stop}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={fieldClass}>
        <label htmlFor="destination" className={labelClass}>
          Destination
        </label>
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2 flex-shrink-0 border border-black"></span>
          <select
            id="destination"
            value={destination}
            onChange={(e) => onDestinationChange(e.target.value)}
            className={selectClass}
          >
            {destinations.map((place) => (
              <option key={place} value={place}>
                {place}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
