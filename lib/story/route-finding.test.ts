import { describe, expect, it } from "vitest";
import { findRoute } from "./route-finding";

describe("findRoute", () => {
  it("finds a path from start to anniversary", () => {
    expect(findRoute("start", "anniversary")).toEqual([
      "start",
      "anniversaryJunction",
      "anniversary"
    ]);
  });

  it("finds a path from birthday to finalGate through start", () => {
    expect(findRoute("birthday", "finalGate")).toEqual([
      "birthday",
      "birthdayJunction",
      "start",
      "finalJunction",
      "finalGate"
    ]);
  });

  it("returns the current point when already at destination", () => {
    expect(findRoute("finalGate", "finalGate")).toEqual(["finalGate"]);
  });
});
