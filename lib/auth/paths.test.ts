import { describe, expect, it, vi } from "vitest";
import { gamePath, registerPath } from "./paths";

describe("auth paths", () => {
  it("returns register and game paths without a base path", () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "");
    expect(registerPath()).toBe("/register");
    expect(gamePath()).toBe("/game");
  });

  it("prefixes register and game paths with the configured base path", () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/Happy-birthday-to-me");
    expect(registerPath()).toBe("/Happy-birthday-to-me/register");
    expect(gamePath()).toBe("/Happy-birthday-to-me/game");
  });
});
