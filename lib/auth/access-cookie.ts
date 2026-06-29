import { createHmac, timingSafeEqual } from "crypto";
import { ACCESS_COOKIE_NAME, ACCESS_COOKIE_PAYLOAD } from "@/lib/auth/constants";

export { ACCESS_COOKIE_NAME } from "@/lib/auth/constants";

function getSecret(): string {
  const secret = process.env.ANNIVERSARY_COOKIE_SECRET;
  if (!secret) {
    throw new Error("ANNIVERSARY_COOKIE_SECRET is required");
  }
  return secret;
}

export function isAccessCookieValid(
  value: string | undefined,
  secret: string | null | undefined
): boolean {
  if (!secret) return false;
  return verifyAccessValue(value, secret);
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
