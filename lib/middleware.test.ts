import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "../middleware";
import { signAccessValue } from "./auth/access-cookie";
import { ACCESS_COOKIE_NAME } from "./auth/constants";

const SECRET = "test-cookie-secret";

function requestFor(pathname: string, cookie?: string) {
  return new NextRequest(`http://localhost:3000${pathname}`, {
    headers: cookie ? { cookie } : undefined
  });
}

function accessCookie() {
  return `${ACCESS_COOKIE_NAME}=${signAccessValue(SECRET)}`;
}

describe("middleware register gate", () => {
  it("keeps the root link register-first even with an existing access cookie", async () => {
    process.env.ANNIVERSARY_COOKIE_SECRET = SECRET;

    const response = await middleware(requestFor("/", accessCookie()));

    expect(response.headers.get("location")).toBe("http://localhost:3000/register");
  });

  it("does not skip the register page when an access cookie already exists", async () => {
    process.env.ANNIVERSARY_COOKIE_SECRET = SECRET;

    const response = await middleware(requestFor("/register", accessCookie()));

    expect(response.headers.get("location")).toBeNull();
  });

  it("redirects unauthenticated game visits to register", async () => {
    process.env.ANNIVERSARY_COOKIE_SECRET = SECRET;

    const response = await middleware(requestFor("/game"));

    expect(response.headers.get("location")).toBe("http://localhost:3000/register");
  });
});
