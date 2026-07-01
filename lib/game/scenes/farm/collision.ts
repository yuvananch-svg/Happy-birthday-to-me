import { cameraFollowPlayer } from "@/lib/game/engine/camera";
import type { PlayerEntity, Point, Rect } from "@/lib/game/engine/types";

/** Wide outdoor farm map — matches `public/scenes/farm/farm-outdoor.png` (6336×2688). */
export const FARM_WORLD = { w: 6336, h: 2688 } as const;

/** Pond-east / forest zone — matches `public/scenes/farm/farm-pond-east.png` (6336×2688). */
export const FARM_POND_EAST_WORLD = FARM_WORLD;

/** Slightly wider zoom than bedroom to fit the panoramic map. */
export const FARM_WORLD_ZOOM = 0.36;
export const FARM_HERO_COUNTER_ZOOM = 1 / FARM_WORLD_ZOOM;

/** Default viewport used before the play frame measures its client size. */
export const FARM_DEFAULT_VIEWPORT = { w: 960, h: 540 } as const;

/**
 * Spawn on the dirt path centered on the farmhouse door — just outside the threshold
 * (map analysis: door center ≈ x750, path stones ≈ y1000).
 */
export const FARM_PLAYER_SPAWN = {
  x: 750,
  y: 1000,
  w: 30,
  h: 34,
  speed: 387,
  facing: "down" as const,
  stepTime: 0,
  moving: false
};

export function getFarmSpawnCamera(
  viewport = FARM_DEFAULT_VIEWPORT,
  player: PlayerEntity = FARM_PLAYER_SPAWN,
  world = FARM_WORLD
): Point {
  return cameraFollowPlayer(player, viewport, world, FARM_WORLD_ZOOM);
}

/** Prototype free-walk — world edge clamping only. */
export const FARM_FREE_WALK_COLLIDERS: Rect[] = [];
