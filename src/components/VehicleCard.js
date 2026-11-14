// A simple ride card that keeps the essentials front and center.
import Link from "next/link";
import Image from "next/image";

const STATUS = {
  available: { label: "Available", dot: "bg-cng", text: "text-cng" },
  busy: { label: "On a trip", dot: "bg-brick", text: "text-brick" },
  offline: { label: "Offline", dot: "bg-mute", text: "text-mute" },
};

function crowdText(v) {
  if (v.status === "offline") return "Not taking riders";
  if (v.status === "busy" || v.seatsFree === 0) return "Full";
  const ratio = v.seatsFree / v.seatsTotal;
  if (ratio <= 0.25) return "Almost full";
  if (ratio <= 0.5) return "Filling up";
  return "Plenty of room";
}

export default function VehicleCard({ v, badges = [] }) {
  const available = v.status === "available";
  const status = STATUS[v.status];
  const isAuto = v.type === "auto";

  return (
    <li className={`rounded-2xl border border-line bg-white p-4 shadow-sm transition-shadow hover:shadow-md ${available ? "" : "opacity-80"}`}>
      {badges.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {badges.map((b) => (
            <span key={b} className="rounded-full bg-signal px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-asphalt">
              {b}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {v.photo ? (
            <Image
              src={v.photo}
              alt={`${isAuto ? "Auto" : "E-rickshaw"} ${v.id}`}
              width={48}
              height={48}
              unoptimized
              className="h-12 w-12 shrink-0 rounded-xl object-cover"
            />
          ) : (
            <span
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${
                isAuto ? "bg-signal" : "bg-cng/10"
              }`}
              aria-hidden="true"
            >
              {isAuto ? "🛺" : "🔋"}
            </span>
          )}

          <div className="min-w-0">
            <p className="font-display text-lg font-semibold leading-tight">
              {isAuto ? "Auto" : "E-rickshaw"}
              <span className="ml-1 text-sm font-normal text-mute">{v.id}</span>
            </p>
            <p className="truncate text-sm text-mute">
              {v.driver}, {v.plate}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="font-display text-2xl font-bold tabular-nums">₹{v.fare}</p>
          <p className="text-[11px] text-mute">{v.fareLabel}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <span className={`inline-flex items-center gap-1.5 font-semibold ${status.text}`}>
            <span className={`h-2 w-2 rounded-full ${status.dot}`} />
            {status.label}
          </span>

          <span className="inline-flex items-center gap-2 text-mute">
            <span className="flex gap-1" role="img" aria-label={`${v.seatsFree} of ${v.seatsTotal} seats free`}>
              {Array.from({ length: v.seatsTotal }, (_, i) => (
                <span
                  key={i}
                  className={`h-2.5 w-2.5 rounded-full border-2 ${
                    i < v.seatsFree ? "border-cng bg-cng" : "border-line bg-transparent"
                  }`}
                />
              ))}
            </span>
            {crowdText(v)}
          </span>
        </div>

        <Link
          href={`/vehicles/${v.id}`}
          className="font-semibold text-ink underline decoration-signal decoration-2 underline-offset-4 hover:text-asphalt"
        >
          Details
        </Link>
      </div>

      <div className="mt-3 border-t border-line pt-3 text-sm text-mute">
        {v.status === "offline" ? (
          <span>No pickup</span>
        ) : (
          <>
            Pickup in <strong className="font-semibold text-ink tabular-nums">{v.etaMin} min</strong>
          </>
        )}
      </div>
    </li>
  );
}
