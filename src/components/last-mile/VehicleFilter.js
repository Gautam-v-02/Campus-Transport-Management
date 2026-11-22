const filters = ["All Vehicles", "E-Rickshaw", "Auto"];

export default function VehicleFilter({ selected, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter}
          type="button"
          onClick={() => onChange(filter)}
          className={`border px-4 py-2 text-xs font-medium transition ${
            selected === filter
              ? "border-black bg-black text-white"
              : "border-gray-200 bg-white text-gray-600 hover:border-black hover:text-black"
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
