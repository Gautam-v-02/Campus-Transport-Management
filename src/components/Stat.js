// One number with a plain label. Label is rendered under the value but kept
// first in the DOM so screen readers hear "Available now, 3 of 4".
export default function Stat({ label, value, unit }) {
  return (
    <div className="flex flex-col-reverse px-3 first:pl-0 sm:px-5">
      <dt className="text-sm text-white/65">{label}</dt>
      <dd className="font-display text-3xl font-bold tabular-nums sm:text-4xl">
        {value}
        {unit && <span className="ml-1 text-base font-medium text-white/60">{unit}</span>}
      </dd>
    </div>
  );
}
