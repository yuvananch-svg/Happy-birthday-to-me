import { describe, expect, it } from "vitest";
import { BEDROOM_PLAYER_DEFAULT } from "./collision";
import {
  BEDROOM_DOOR_EXIT_ZONE,
  BEDROOM_DOOR_INTERACT,
  isPlayerInBedroomDoorExitZone
} from "./door-zone";

describe("bedroom door exit zone", () => {
  it("covers the lower center bottom doorway on the 3840-wide map", () => {
    expect(BEDROOM_DOOR_INTERACT.x).toBe(1920);
    expect(BEDROOM_DOOR_EXIT_ZONE.x).toBe(1680);
    expect(BEDROOM_DOOR_EXIT_ZONE.x + BEDROOM_DOOR_EXIT_ZONE.w).toBe(2160);
    expect(BEDROOM_DOOR_EXIT_ZONE.y).toBe(2090);
    expect(BEDROOM_DOOR_EXIT_ZONE.y + BEDROOM_DOOR_EXIT_ZONE.h).toBe(2160);
  });

  it("detects the player walking down into the central bottom doorway", () => {
    const player = { ...BEDROOM_PLAYER_DEFAULT, x: 1920, y: 2115 };

    expect(isPlayerInBedroomDoorExitZone(player)).toBe(true);
  });

  it("does not detect the player standing just above the exit strip", () => {
    const player = { ...BEDROOM_PLAYER_DEFAULT, x: 1920, y: 2060 };

    expect(isPlayerInBedroomDoorExitZone(player)).toBe(false);
  });

  it("does not detect positions left or right of the central doorway", () => {
    const leftOfDoor = { ...BEDROOM_PLAYER_DEFAULT, x: 1400, y: 2115 };
    const rightOfDoor = { ...BEDROOM_PLAYER_DEFAULT, x: 2400, y: 2115 };

    expect(isPlayerInBedroomDoorExitZone(leftOfDoor)).toBe(false);
    expect(isPlayerInBedroomDoorExitZone(rightOfDoor)).toBe(false);
  });

  it("does not detect the legacy walk-demo door coordinates on the right side", () => {
    const player = { ...BEDROOM_PLAYER_DEFAULT, x: 3250, y: 1810 };

    expect(isPlayerInBedroomDoorExitZone(player)).toBe(false);
  });
});
