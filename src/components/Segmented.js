// A small group of buttons where exactly one is selected.
export default function Segmented({ label, options, value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-mute">{label}</span>
      <div className="inline-flex rounded-lg border border-line bg-chalk p-0.5" role="group" aria-label={label}>
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
            className={`rounded-md px-3 py-1.5 text-sm font-semibold transition-colors ${
              value === o.value ? "bg-asphalt text-white" : "text-ink hover:bg-white"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
