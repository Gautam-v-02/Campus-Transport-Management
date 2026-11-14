import { NextResponse } from "next/server";
import { deleteVehicle, getVehicle, updateVehicle } from "@/lib/vehicles";
import { vehicleUpdateSchema } from "@/lib/validation";

// GET /api/last-mile/vehicles/ER-01  -> read one
export async function GET(_request, { params }) {
  const { id } = await params;
  const vehicle = await getVehicle(id);
  if (!vehicle) return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
  return NextResponse.json(vehicle);
}

// PATCH /api/last-mile/vehicles/ER-01  body: { status, seatsFree, etaMin }  -> update
export async function PATCH(request, { params }) {
  const { id } = await params;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body must be valid JSON" }, { status: 400 });
  }

  const parsed = vehicleUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", fields: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const result = await updateVehicle(id, parsed.data);
  if (result.error) {
    const status = result.error === "Vehicle not found" ? 404 : 422;
    return NextResponse.json({ error: result.error }, { status });
  }
  return NextResponse.json(result.vehicle);
}

// DELETE /api/last-mile/vehicles/ER-01  -> delete
export async function DELETE(_request, { params }) {
  const { id } = await params;
  const result = await deleteVehicle(id);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 404 });
  return new NextResponse(null, { status: 204 });
}
