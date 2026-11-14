import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const CLIENT_SESSION_COOKIE = "campus-client-session";
const SESSION_DURATION_SECONDS = 8 * 60 * 60;

function getSessionSecret() {
  const configuredSecret = process.env.SESSION_SECRET;
  const secret = configuredSecret?.length >= 32
    ? configuredSecret
    : process.env.NODE_ENV !== "production"
      ? "campus-transport-local-demo-session-secret"
      : configuredSecret;
  if (!secret || secret.length < 32) {
    throw new Error("Set SESSION_SECRET to at least 32 characters before using production client sessions.");
  }
  return secret;
}

function sign(payload) {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
}

export function createClientSession(clientId) {
  const payload = Buffer.from(JSON.stringify({
    clientId,
    expiresAt: Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS,
  })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export async function getClientSessionId() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(CLIENT_SESSION_COOKIE)?.value;
    if (!token) return null;

    const [payload, suppliedSignature] = token.split(".");
    if (!payload || !suppliedSignature) return null;

    const expectedBuffer = Buffer.from(sign(payload));
    const suppliedBuffer = Buffer.from(suppliedSignature);
    if (expectedBuffer.length !== suppliedBuffer.length || !timingSafeEqual(expectedBuffer, suppliedBuffer)) return null;

    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (typeof session.clientId !== "string" || session.expiresAt <= Math.floor(Date.now() / 1000)) return null;
    return session.clientId;
  } catch {
    return null;
  }
}

export const clientSessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
  maxAge: SESSION_DURATION_SECONDS,
};
