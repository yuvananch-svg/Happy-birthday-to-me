import { cookies } from "next/headers";
import { isAccessCookieValid } from "@/lib/auth/access-cookie";
import { ACCESS_COOKIE_NAME } from "@/lib/auth/constants";

export async function hasAccessCookie(): Promise<boolean> {
  const cookieStore = await cookies();
  const value = cookieStore.get(ACCESS_COOKIE_NAME)?.value;
  return isAccessCookieValid(value, process.env.ANNIVERSARY_COOKIE_SECRET);
}
