import { NextResponse } from "next/server";
import { drivers } from "@/data/drivers";
import {
  createDriverSession,
  DRIVER_SESSION_COOKIE,
  driverSessionCookieOptions,
  getDriverSession,
} from "@/lib/driverSession";

export async function GET() {
  const driver = await getDriverSession();
  if (!driver) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  return NextResponse.json({ driver: { id: driver.id, name: driver.name, email: driver.email } });
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid login request." }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const driver = drivers.find((item) =>
    item.email.toLowerCase() === email && item.password === password,
  );

  if (!driver) {
    return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 });
  }

  let token;
  try {
    token = createDriverSession(driver.id);
  } catch {
    return NextResponse.json({ error: "Set SESSION_SECRET in your environment before signing in." }, { status: 503 });
  }

  const response = NextResponse.json({ driverId: driver.id });
  response.cookies.set(DRIVER_SESSION_COOKIE, token, driverSessionCookieOptions);
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(DRIVER_SESSION_COOKIE, "", { ...driverSessionCookieOptions, maxAge: 0 });
  return response;
}
