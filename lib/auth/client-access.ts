const STORAGE_KEY = "anniversary_access";

function normalize(value: string): string {
  return value.trim();
}

function matchesAllowed(input: string, allowed: string): boolean {
  return input.localeCompare(allowed, undefined, { sensitivity: "accent" }) === 0;
}

export function validateClientCredentials(name: string, code: string): boolean {
  const allowedName = normalize(process.env.NEXT_PUBLIC_ANNIVERSARY_ALLOWED_NAME ?? "");
  const allowedCode = normalize(process.env.NEXT_PUBLIC_ANNIVERSARY_ALLOWED_CODE ?? "");

  if (!allowedName || !allowedCode) return false;

  return (
    matchesAllowed(normalize(name), allowedName) &&
    matchesAllowed(normalize(code), allowedCode)
  );
}

export function hasClientAccess(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(STORAGE_KEY) === "granted";
}

export function setClientAccessGranted(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, "granted");
}

export function clearClientAccess(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
