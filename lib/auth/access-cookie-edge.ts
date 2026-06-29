import { ACCESS_COOKIE_PAYLOAD } from "@/lib/auth/constants";

function timingSafeEqualStrings(a: string, b: string): boolean {
  if (a.length !== b.length) return false;

  let mismatch = 0;
  for (let index = 0; index < a.length; index += 1) {
    mismatch |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }

  return mismatch === 0;
}

async function signAccessValue(secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(ACCESS_COOKIE_PAYLOAD)
  );

  const hex = Array.from(new Uint8Array(signature), (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");

  return `${ACCESS_COOKIE_PAYLOAD}.${hex}`;
}

export async function isAccessCookieValidEdge(
  value: string | undefined,
  secret: string | null | undefined
): Promise<boolean> {
  if (!value || !secret) return false;

  const expected = await signAccessValue(secret);
  return timingSafeEqualStrings(value, expected);
}
