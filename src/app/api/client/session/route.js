import { promisify } from "node:util";
import { scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import {
  CLIENT_SESSION_COOKIE,
  clientSessionCookieOptions,
  createClientSession,
  getClientSessionId,
} from "@/lib/clientSession";

export const runtime = "nodejs";
const scrypt = promisify(scryptCallback);

async function verifyPassword(password, storedHash) {
  if (typeof storedHash !== "string") return false;
  const [salt, hashHex] = storedHash.split(":");
  if (!salt || !/^[a-f0-9]{128}$/i.test(hashHex || "")) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = await scrypt(password, salt, expected.length);
  return timingSafeEqual(expected, actual);
}

function publicClient(client) {
  return { id: client.id, name: client.name, email: client.email, phone: client.phone };
}

export async function GET() {
  const clientId = await getClientSessionId();
  if (!clientId) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  try {
    const database = await getDatabase();
    const client = await database.collection("clients").findOne({ id: clientId }, { projection: { _id: 0, passwordHash: 0 } });
    if (!client) return NextResponse.json({ error: "Account not found." }, { status: 401 });
    return NextResponse.json({ client });
  } catch (error) {
    console.error("Client session lookup failed.", error);
    return NextResponse.json({ error: "Could not verify your account. Check the database connection." }, { status: 503 });
  }
}

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid sign-in request." }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!email || email.length > 254 || !password || password.length > 128) {
    return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 });
  }

  try {
    const database = await getDatabase();
    const client = await database.collection("clients").findOne({ email });
    if (!client || !(await verifyPassword(password, client.passwordHash))) {
      return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 });
    }

    const response = NextResponse.json({ client: publicClient(client) });
    response.cookies.set(CLIENT_SESSION_COOKIE, createClientSession(client.id), clientSessionCookieOptions);
    return response;
  } catch (error) {
    console.error("Client sign-in failed.", error);
    return NextResponse.json({ error: "Could not sign in. Check the database connection." }, { status: 503 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(CLIENT_SESSION_COOKIE, "", { ...clientSessionCookieOptions, maxAge: 0 });
  return response;
}
