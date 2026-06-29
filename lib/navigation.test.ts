import { describe, expect, it, vi } from "vitest";
import { withBasePath } from "./navigation";

describe("withBasePath", () => {
  it("returns the path unchanged when base path is empty", () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "");
    expect(withBasePath("/game")).toBe("/game");
  });

  it("prefixes paths with the configured base path", () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/Happy-birthday-to-me");
    expect(withBasePath("/cutscenes/opening-intro.mp4")).toBe(
      "/Happy-birthday-to-me/cutscenes/opening-intro.mp4"
    );
  });
});
