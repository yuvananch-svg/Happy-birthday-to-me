import type { Facing, LegPhase, PlayerEntity, Rect, Size } from "./types";
import { intersects } from "./math";

export function playerBounds(player: PlayerEntity, x = player.x, y = player.y): Rect {
  return {
    x: x - player.w / 2,
    y: y - player.h,
    w: player.w,
    h: player.h
  };
}

export function collidesWithAny(rect: Rect, colliders: Rect[]) {
  return colliders.some((collider) => intersects(rect, collider));
}

export function moveWithCollision(
  player: PlayerEntity,
  delta: { dx: number; dy: number },
  colliders: Rect[],
  world: Size
): PlayerEntity {
  const bounds = playerBounds(player);
  let nextX = player.x;
  let nextY = player.y;

  const tryXBounds = { ...bounds, x: bounds.x + delta.dx };
  const xInBounds = tryXBounds.x >= 0 && tryXBounds.x + tryXBounds.w <= world.w;

  if (xInBounds && !collidesWithAny(tryXBounds, colliders)) {
    nextX = player.x + delta.dx;
  }

  const yBounds = playerBounds(player, nextX, player.y);
  const tryYBounds = { ...yBounds, y: yBounds.y + delta.dy };
  const yInBounds = tryYBounds.y >= 0 && tryYBounds.y + tryYBounds.h <= world.h;

  if (yInBounds && !collidesWithAny(tryYBounds, colliders)) {
    nextY = player.y + delta.dy;
  }

  return { ...player, x: nextX, y: nextY };
}

export function getFacingFromVector(dx: number, dy: number, previousFacing: Facing): Facing {
  if (dx === 0 && dy === 0) return previousFacing;

  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? "right" : "left";
  }

  return dy > 0 ? "down" : "up";
}

export function getLegPhase(stepTime: number, isWalking: boolean): LegPhase {
  if (!isWalking) return "idle";

  return Math.floor(stepTime * 6) % 2 === 0 ? "left" : "right";
}

export function getSpriteViewForFacing(facing: Facing): { view: "front" | "back" | "side"; flipX: boolean } {
  if (facing === "down") return { view: "front", flipX: false };
  if (facing === "up") return { view: "back", flipX: false };
  if (facing === "left") return { view: "side", flipX: true };
  return { view: "side", flipX: false };
}

export function applyMovementInput(
  player: PlayerEntity,
  input: { dx: number; dy: number },
  deltaSeconds: number,
  colliders: Rect[],
  world: Size
): PlayerEntity {
  let { dx, dy } = input;
  const length = Math.hypot(dx, dy);
  const moving = length > 0;
  let stepTime = player.stepTime;

  if (moving) {
    dx /= length;
    dy /= length;
    stepTime += deltaSeconds * 4.2;
  } else {
    stepTime = 0;
  }

  const facing = getFacingFromVector(dx, dy, player.facing);
  const moved = moveWithCollision(
    { ...player, facing, stepTime, moving },
    { dx: dx * player.speed * deltaSeconds, dy: dy * player.speed * deltaSeconds },
    colliders,
    world
  );

  return { ...moved, facing, stepTime, moving };
}
