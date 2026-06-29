import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { isAccessCookieValid } from "@/lib/auth/access-cookie";
import { ACCESS_COOKIE_NAME } from "@/lib/auth/constants";

export async function GET() {
  const cookieStore = await cookies();
  const value = cookieStore.get(ACCESS_COOKIE_NAME)?.value;
  const ok = isAccessCookieValid(value, process.env.ANNIVERSARY_COOKIE_SECRET);

  return NextResponse.json({ ok });
}
