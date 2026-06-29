import { NextResponse } from "next/server";
import { ACCESS_COOKIE_NAME, buildAccessCookieValue } from "@/lib/auth/access-cookie";

type RegisterBody = {
  name?: string;
  code?: string;
};

function normalize(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function matchesAllowed(input: string, allowed: string): boolean {
  return input.localeCompare(allowed, undefined, { sensitivity: "accent" }) === 0;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as RegisterBody;
  const name = normalize(body.name);
  const code = normalize(body.code);
  const allowedName = normalize(process.env.ANNIVERSARY_ALLOWED_NAME);
  const allowedCode = normalize(process.env.ANNIVERSARY_ALLOWED_CODE);

  if (!allowedName || !allowedCode) {
    return NextResponse.json(
      { ok: false, message: "ประตูความทรงจำยังไม่ได้ตั้งค่ากุญแจ" },
      { status: 500 }
    );
  }

  if (!matchesAllowed(name, allowedName) || !matchesAllowed(code, allowedCode)) {
    return NextResponse.json(
      { ok: false, message: "ยังไม่ใช่กุญแจของเรื่องนี้ ลองอีกครั้งนะ" },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ACCESS_COOKIE_NAME, buildAccessCookieValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });

  return response;
}
