import { NextResponse } from "next/server";
import { createVehicle, listVehicles } from "@/lib/vehicles";
import { vehicleCreateSchema } from "@/lib/validation";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const vehicles = await listVehicles({
    stopId: searchParams.get("stop") ?? undefined,
    type: searchParams.get("type") ?? undefined,
  });
  return NextResponse.json(vehicles);
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body must be valid JSON" }, { status: 400 });
  }

  const parsed = vehicleCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", fields: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const result = await createVehicle(parsed.data);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 409 });
  return NextResponse.json(result.vehicle, { status: 201 });
}
