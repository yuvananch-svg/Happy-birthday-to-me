import { describe, expect, it } from "vitest";
import { applyMovementInput } from "@/lib/game/engine";
import { collidesWithAny, playerBounds } from "@/lib/game/engine/movement";
import {
  BEDROOM_COLLIDERS,
  BEDROOM_FREE_WALK_COLLIDERS,
  BEDROOM_PLAYER_DEFAULT,
  BEDROOM_WORLD
} from "./collision";

describe("bedroom player spawn", () => {
  it("starts on walkable floor and can move", () => {
    const player = { ...BEDROOM_PLAYER_DEFAULT };

    expect(collidesWithAny(playerBounds(player), BEDROOM_FREE_WALK_COLLIDERS)).toBe(false);

    const moved = applyMovementInput(
      player,
      { dx: 0, dy: -1 },
      0.1,
      BEDROOM_FREE_WALK_COLLIDERS,
      BEDROOM_WORLD
    );

    expect(moved.y).toBeLessThan(player.y);
  });
});

describe("bedroom free-walk", () => {
  it("moves through former bed area in all directions", () => {
    const bedCenter = { ...BEDROOM_PLAYER_DEFAULT, x: 2350, y: 1165 };

    expect(collidesWithAny(playerBounds(bedCenter), BEDROOM_COLLIDERS)).toBe(true);

    const directions = [
      { dx: 0, dy: -1 },
      { dx: 0, dy: 1 },
      { dx: -1, dy: 0 },
      { dx: 1, dy: 0 }
    ] as const;

    for (const dir of directions) {
      const moved = applyMovementInput(
        bedCenter,
        dir,
        0.1,
        BEDROOM_FREE_WALK_COLLIDERS,
        BEDROOM_WORLD
      );

      expect(moved.x !== bedCenter.x || moved.y !== bedCenter.y).toBe(true);
    }
  });
});
