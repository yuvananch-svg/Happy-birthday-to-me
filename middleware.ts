import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ACCESS_COOKIE_NAME } from "@/lib/auth/constants";
import { isAccessCookieValidEdge } from "@/lib/auth/access-cookie-edge";

async function isAuthed(request: NextRequest): Promise<boolean> {
  const value = request.cookies.get(ACCESS_COOKIE_NAME)?.value;
  return isAccessCookieValidEdge(value, process.env.ANNIVERSARY_COOKIE_SECRET);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authed = await isAuthed(request);

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/register", request.url));
  }

  if (pathname === "/game" && !authed) {
    return NextResponse.redirect(new URL("/register", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/register", "/game"]
};
