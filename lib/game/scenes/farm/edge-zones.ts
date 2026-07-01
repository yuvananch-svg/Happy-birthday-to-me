import { playerBounds } from "@/lib/game/engine/movement";
import type { PlayerEntity, Size } from "@/lib/game/engine/types";
import { FARM_WORLD } from "@/lib/game/scenes/farm/collision";

/** Pixels from map edge before edge-warp triggers (matches opening-demo ~28px scaled feel). */
export const FARM_EDGE_WARP_MARGIN = 56;

/**
 * Outdoor hub east exit on `farm-outdoor.png` — scaled from opening-demo forest path mouth (~x841 on 960px).
 * Warp triggers here (not at world.w) so the transition matches where the dirt path ends in the artwork.
 */
export const FARM_OUTDOOR_EAST_EXIT_X = Math.round(841 * (FARM_WORLD.w / 960));

export function isPlayerAtFarmRightEdge(player: PlayerEntity, world: Size): boolean {
  const bounds = playerBounds(player);
  const atArtExit = bounds.x + bounds.w >= FARM_OUTDOOR_EAST_EXIT_X;
  const atWorldEdge = bounds.x + bounds.w >= world.w - FARM_EDGE_WARP_MARGIN;
  return atArtExit || atWorldEdge;
}

/** Moving right but blocked — player pressed against the east boundary near the exit zone. */
export function isPlayerPressingFarmEastEdge(
  player: PlayerEntity,
  nextPlayer: PlayerEntity,
  movement: { dx: number; dy: number },
  world: Size
): boolean {
  if (movement.dx <= 0) return false;

  const bounds = playerBounds(nextPlayer);
  const blocked = nextPlayer.x === player.x;
  const atWorldEdge = bounds.x + bounds.w >= world.w - 1;
  const nearArtExit = bounds.x + bounds.w >= FARM_OUTDOOR_EAST_EXIT_X - 280;

  return blocked && (atWorldEdge || nearArtExit);
}

export function isPlayerAtFarmLeftEdge(player: PlayerEntity, world: Size): boolean {
  const bounds = playerBounds(player);
  return bounds.x <= FARM_EDGE_WARP_MARGIN;
}

export function getFarmOutdoorEnterFromEast(player: PlayerEntity): PlayerEntity {
  return {
    ...player,
    x: FARM_OUTDOOR_EAST_EXIT_X - player.w / 2 - 12,
    facing: "left",
    moving: false,
    stepTime: 0
  };
}

export function getFarmPondEastEnterFromWest(player: PlayerEntity): PlayerEntity {
  return {
    ...player,
    x: FARM_EDGE_WARP_MARGIN + player.w,
    facing: "right",
    moving: false,
    stepTime: 0
  };
}
