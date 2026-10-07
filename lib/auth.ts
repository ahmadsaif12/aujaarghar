import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "aujarghar_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

export type SessionUser = { id: number; name: string; email: string };

function secret() {
  const value = process.env.AUTH_SECRET;
  if (value && (process.env.NODE_ENV !== "production" || value.length >= 32)) return value;
  if (process.env.NODE_ENV === "production") throw new Error("AUTH_SECRET must be a 32-character-or-longer value in production.");
  return "aujarghar-development-secret-change-before-production";
}

function signature(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

// Passwords are salted, memory-hard hashes; the raw password is never stored.
export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 }).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const derived = scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
  const expected = Buffer.from(hash, "hex");
  return expected.length === derived.length && timingSafeEqual(expected, derived);
}

export function createSession(user: SessionUser) {
  const payload = Buffer.from(JSON.stringify({ ...user, exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE })).toString("base64url");
  return `${payload}.${signature(payload)}`;
}

export function readSession(token?: string) {
  if (!token) return null;
  const [payload, signed, ...rest] = token.split(".");
  if (!payload || !signed || rest.length) return null;
  const expected = Buffer.from(signature(payload), "base64url");
  const received = Buffer.from(signed, "base64url");
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;
  try {
    const value = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as SessionUser & { exp: number };
    if (!Number.isInteger(value.id) || typeof value.name !== "string" || typeof value.email !== "string" || value.exp <= Math.floor(Date.now() / 1000)) return null;
    return { id: value.id, name: value.name, email: value.email };
  } catch {
    return null;
  }
}

export const sessionCookie = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_MAX_AGE,
};
