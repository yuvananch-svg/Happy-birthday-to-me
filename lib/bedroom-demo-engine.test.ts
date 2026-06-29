import { describe, expect, it } from "vitest";
import {
  clampCamera,
  collidesWithAny,
  getFacingFromVector,
  getLegPhase,
  getNearestInteractable,
  getSpriteViewForFacing,
  moveWithCollision
} from "./bedroom-demo-engine";

const bedCollider = { id: "bed", x: 100, y: 100, w: 80, h: 60 };
const letter = { id: "letter", label: "จดหมาย", x: 220, y: 120, radius: 58 };

describe("bedroom demo engine helpers", () => {
  it("keeps the camera crop inside the large bedroom image", () => {
    expect(clampCamera({ x: -50, y: 40 }, { w: 960, h: 540 }, { w: 3840, h: 2160 })).toEqual({
      x: 0,
      y: 40
    });

    expect(clampCamera({ x: 3400, y: 1900 }, { w: 960, h: 540 }, { w: 3840, h: 2160 })).toEqual({
      x: 2880,
      y: 1620
    });
  });

  it("shows more world area when the viewport is zoomed out", () => {
    const clamped = clampCamera({ x: 3400, y: 1900 }, { w: 960, h: 540 }, { w: 3840, h: 2160 }, 0.4536);

    expect(clamped.x).toBeCloseTo(1723.5978835978835, 10);
    expect(clamped.y).toBeCloseTo(969.5238095238096, 10);
  });

  it("blocks movement when the player would enter a furniture collider", () => {
    const player = {
      x: 94,
      y: 164,
      w: 28,
      h: 34,
      facing: "down" as const,
      stepTime: 0,
      moving: false,
      speed: 387
    };
    const next = moveWithCollision(player, { dx: 42, dy: 0 }, [bedCollider], { w: 3840, h: 2160 });

    expect(next.x).toBe(94);
    expect(next.y).toBe(164);
  });

  it("allows movement when the destination is clear", () => {
    const player = {
      x: 54,
      y: 74,
      w: 28,
      h: 34,
      facing: "down" as const,
      stepTime: 0,
      moving: false,
      speed: 387
    };
    const next = moveWithCollision(player, { dx: 16, dy: 9 }, [bedCollider], { w: 3840, h: 2160 });

    expect(next.x).toBe(70);
    expect(next.y).toBe(83);
  });

  it("finds the closest active interactable within range", () => {
    const nearest = getNearestInteractable(
      { x: 200, y: 130 },
      [
        letter,
        { id: "photo", label: "กรอบรูป", x: 600, y: 300, radius: 58 }
      ],
      new Set(["letter", "photo"])
    );

    expect(nearest?.id).toBe("letter");
  });

  it("ignores inactive interactables", () => {
    const nearest = getNearestInteractable({ x: 200, y: 130 }, [letter], new Set());

    expect(nearest).toBeNull();
  });

  it("detects rectangle collisions", () => {
    expect(collidesWithAny({ x: 120, y: 130, w: 20, h: 20 }, [bedCollider])).toBe(true);
    expect(collidesWithAny({ x: 20, y: 20, w: 20, h: 20 }, [bedCollider])).toBe(false);
  });

  it("keeps the previous facing when the player is idle", () => {
    expect(getFacingFromVector(0, 0, "left")).toBe("left");
  });

  it("chooses facing from the strongest movement axis", () => {
    expect(getFacingFromVector(2, 0.4, "down")).toBe("right");
    expect(getFacingFromVector(-2, 0.4, "down")).toBe("left");
    expect(getFacingFromVector(0.3, -2, "down")).toBe("up");
    expect(getFacingFromVector(0.3, 2, "up")).toBe("down");
  });

  it("alternates leg phases while walking and rests when idle", () => {
    expect(getLegPhase(0, false)).toBe("idle");
    expect(getLegPhase(0.1, true)).toBe("left");
    expect(getLegPhase(0.25, true)).toBe("right");
  });

  it("maps facing to sprite sheet views and horizontal flipping", () => {
    expect(getSpriteViewForFacing("down")).toEqual({ view: "front", flipX: false });
    expect(getSpriteViewForFacing("up")).toEqual({ view: "back", flipX: false });
    expect(getSpriteViewForFacing("right")).toEqual({ view: "side", flipX: false });
    expect(getSpriteViewForFacing("left")).toEqual({ view: "side", flipX: true });
  });
});
