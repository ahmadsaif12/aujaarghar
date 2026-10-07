import { NextResponse } from "next/server";
import { createSession, hashPassword, SESSION_COOKIE, sessionCookie } from "@/lib/auth";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { name?: string; email?: string; phone?: string; password?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Send a valid JSON body." }, { status: 400 }); }
  const name = body.name?.trim();
  const email = body.email?.trim().toLowerCase();
  const phone = body.phone?.trim() || null;
  const password = body.password ?? "";
  if (!name || name.length > 80 || !email || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8)
    return NextResponse.json({ error: "Enter your name, a valid email, and a password of at least 8 characters." }, { status: 400 });
  if (phone && phone.length > 30) return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });

  const existing = await db.user.findUnique({ where: { email }, select: { id: true } });
  if (existing) return NextResponse.json({ error: "An account with this email already exists. Please log in." }, { status: 409 });

  const user = await db.user.create({ data: { name, email, phone, passwordHash: hashPassword(password) }, select: { id: true, name: true, email: true } });
  const response = NextResponse.json({ user }, { status: 201 });
  response.cookies.set({ ...sessionCookie, name: SESSION_COOKIE, value: createSession(user) });
  return response;
}
