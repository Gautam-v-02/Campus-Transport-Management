import { NextResponse } from "next/server";
import { DESTINATIONS, STOPS } from "@/lib/lastMile";
import { getOptions } from "@/lib/options";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const stopId = searchParams.get("stop") ?? STOPS[0].id;
  const destinationId = searchParams.get("destination") ?? DESTINATIONS[0].id;
  const type = searchParams.get("type") ?? "all";

  const data = await getOptions({ stopId, destinationId, type });
  if (!data) {
    return NextResponse.json({ error: "Unknown stop or destination" }, { status: 400 });
  }

  return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
}
