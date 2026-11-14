import { promisify } from "node:util";
import { randomBytes, randomUUID, scrypt as scryptCallback } from "node:crypto";
import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { CLIENT_SESSION_COOKIE, clientSessionCookieOptions, createClientSession } from "@/lib/clientSession";

export const runtime = "nodejs";
const scrypt = promisify(scryptCallback);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = await scrypt(password, salt, 64);
  return `${salt}:${hash.toString("hex")}`;
}

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Please submit a valid sign-up form." }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Please submit a valid sign-up form." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (name.length < 2 || name.length > 80 || !EMAIL_PATTERN.test(email) || email.length > 254
    || phone.length > 24 || password.length < 8 || password.length > 128) {
    return NextResponse.json({ error: "Enter a valid name and email, and choose a password with 8–128 characters." }, { status: 422 });
  }

  try {
    const database = await getDatabase();
    const clients = database.collection("clients");
    await clients.createIndex({ email: 1 }, { unique: true });
    const client = {
      id: randomUUID(),
      name,
      email,
      phone,
      passwordHash: await hashPassword(password),
      createdAt: new Date(),
    };
    const sessionToken = createClientSession(client.id);
    await clients.insertOne(client);

    const response = NextResponse.json({ client: { id: client.id, name, email, phone } }, { status: 201 });
    response.cookies.set(CLIENT_SESSION_COOKIE, sessionToken, clientSessionCookieOptions);
    return response;
  } catch (error) {
    if (error.code === 11000) return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    console.error("Client account creation failed.", error);
    return NextResponse.json({ error: "Could not create your account. Check the database connection." }, { status: 503 });
  }
}
