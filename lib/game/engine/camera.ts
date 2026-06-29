import type { Point, Size } from "./types";
import { clamp } from "./math";

export function clampCamera(camera: Point, viewport: Size, world: Size, zoom = 1): Point {
  const visibleW = viewport.w / zoom;
  const visibleH = viewport.h / zoom;

  return {
    x: clamp(camera.x, 0, Math.max(0, world.w - visibleW)),
    y: clamp(camera.y, 0, Math.max(0, world.h - visibleH))
  };
}

export function cameraFollowPlayer(
  player: Point,
  viewport: Size,
  world: Size,
  zoom: number
): Point {
  const visibleWorldW = viewport.w / zoom;
  const visibleWorldH = viewport.h / zoom;

  return clampCamera(
    {
      x: player.x - visibleWorldW / 2,
      y: player.y - visibleWorldH / 2
    },
    viewport,
    world,
    zoom
  );
}
