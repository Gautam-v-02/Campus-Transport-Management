import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { drivers } from "@/data/drivers";

export const DRIVER_SESSION_COOKIE = "campus-driver-session";
const SESSION_DURATION_SECONDS = 8 * 60 * 60;

function getSessionSecret() {
  const configuredSecret = process.env.SESSION_SECRET;
  const secret = configuredSecret?.length >= 32
    ? configuredSecret
    : process.env.NODE_ENV !== "production"
      ? "campus-transport-local-demo-session-secret"
      : configuredSecret;
  if (!secret || secret.length < 32) {
    throw new Error("Set SESSION_SECRET to at least 32 characters before using production driver sessions.");
  }
  return secret;
}

function sign(payload) {
  return createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("base64url");
}

export function createDriverSession(driverId) {
  const payload = Buffer.from(JSON.stringify({
    driverId,
    expiresAt: Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS,
  })).toString("base64url");

  return `${payload}.${sign(payload)}`;
}

export async function getDriverSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(DRIVER_SESSION_COOKIE)?.value;
    if (!token) return null;

    const [payload, suppliedSignature] = token.split(".");
    if (!payload || !suppliedSignature) return null;

    const expectedSignature = sign(payload);
    const expectedBuffer = Buffer.from(expectedSignature);
    const suppliedBuffer = Buffer.from(suppliedSignature);
    if (expectedBuffer.length !== suppliedBuffer.length) return null;
    if (!timingSafeEqual(expectedBuffer, suppliedBuffer)) return null;

    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (session.expiresAt <= Math.floor(Date.now() / 1000)) return null;

    return drivers.find((driver) => driver.id === session.driverId) || null;
  } catch {
    return null;
  }
}

export const driverSessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
  maxAge: SESSION_DURATION_SECONDS,
};
