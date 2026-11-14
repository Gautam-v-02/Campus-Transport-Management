import { DESTINATIONS } from "@/lib/lastMile";

// Shown or hidden with conditional rendering when the student taps "How are fares worked out?"
export default function FareGuide() {
  return (
    <div className="mt-3 rounded-lg border border-line bg-chalk p-4 text-sm">
      <p className="font-semibold">How fares are worked out</p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-ink/80">
        <li>E-rickshaw (shared): ₹10 + ₹6 per km, charged per seat.</li>
        <li>Auto (whole vehicle): ₹30 + ₹14 per km, charged per ride.</li>
        <li>Autos cost 20% more during peak hours (8–10 AM and 4–7 PM).</li>
        <li>Fares are rounded to the nearest ₹5.</li>
      </ul>
      <p className="mt-3 font-semibold">Distances</p>
      <ul className="mt-1 grid grid-cols-1 gap-x-6 text-ink/80 sm:grid-cols-2">
        {DESTINATIONS.map((d) => (
          <li key={d.id}>
            {d.name}: {d.distanceKm} km
          </li>
        ))}
      </ul>
    </div>
  );
}
