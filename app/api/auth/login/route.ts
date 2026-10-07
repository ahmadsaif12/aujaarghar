import { NextResponse } from "next/server";
import { createSession, SESSION_COOKIE, sessionCookie, verifyPassword } from "@/lib/auth";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Send a valid JSON body." }, { status: 400 }); }
  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? "";
  if (!email || !password) return NextResponse.json({ error: "Email and password are required." }, { status: 400 });

  const user = await db.user.findUnique({ where: { email }, select: { id: true, name: true, email: true, passwordHash: true } });
  if (!user || !verifyPassword(password, user.passwordHash))
    return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });

  const publicUser = { id: user.id, name: user.name, email: user.email };
  const response = NextResponse.json({ user: publicUser });
  response.cookies.set({ ...sessionCookie, name: SESSION_COOKIE, value: createSession(publicUser) });
  return response;
}
