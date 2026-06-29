import { intersects } from "@/lib/game/engine/math";
import { playerBounds } from "@/lib/game/engine/movement";
import type { PlayerEntity, Rect } from "@/lib/game/engine/types";

/** Walk-through exit at bottom-center bedroom door on `bedroom.png` (3840×2160). */
export const BEDROOM_DOOR_INTERACT = {
  x: 1920,
  y: 2110,
  radius: 200
} as const;

/**
 * Lower strip of the central bottom doorway — triggers when the hero walks
 * downward past the threshold shown in the production bedroom scene.
 */
export const BEDROOM_DOOR_EXIT_ZONE: Rect = {
  id: "door-exit",
  x: 1680,
  y: 2090,
  w: 480,
  h: 70
};

export function isPlayerInBedroomDoorExitZone(player: PlayerEntity): boolean {
  return intersects(playerBounds(player), BEDROOM_DOOR_EXIT_ZONE);
}
