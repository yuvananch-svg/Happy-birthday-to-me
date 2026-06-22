import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ACCESS_COOKIE_NAME = "anniversary_access";
const ACCESS_COOKIE_PAYLOAD = "anniversary-quest-access";

function getSecret(): string {
  const secret = process.env.ANNIVERSARY_COOKIE_SECRET;
  if (!secret) {
    throw new Error("ANNIVERSARY_COOKIE_SECRET is required");
  }
  return secret;
}

export function signAccessValue(secret: string): string {
  const signature = createHmac("sha256", secret)
    .update(ACCESS_COOKIE_PAYLOAD)
    .digest("hex");

  return `${ACCESS_COOKIE_PAYLOAD}.${signature}`;
}

export function verifyAccessValue(value: string | undefined, secret: string): boolean {
  if (!value) return false;

  const expected = signAccessValue(secret);
  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);

  if (valueBuffer.length !== expectedBuffer.length) return false;

  return timingSafeEqual(valueBuffer, expectedBuffer);
}

export function buildAccessCookieValue(): string {
  return signAccessValue(getSecret());
}

export async function hasAccessCookie(): Promise<boolean> {
  const cookieStore = await cookies();
  const value = cookieStore.get(ACCESS_COOKIE_NAME)?.value;
  return verifyAccessValue(value, getSecret());
}
