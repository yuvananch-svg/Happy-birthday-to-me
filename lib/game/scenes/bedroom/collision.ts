import type { Rect } from "@/lib/game/engine/types";
import { withBasePath } from "@/lib/navigation";

/** Large bedroom world — matches `public/scenes/bedroom/bedroom.png` (3840×2160). */
export const BEDROOM_WORLD = { w: 3840, h: 2160 } as const;

/** World zoom from bedroom-walk-demo — hero counter-scaled to keep screen size. */
export const BEDROOM_WORLD_ZOOM = 0.4536;
export const BEDROOM_HERO_COUNTER_ZOOM = 1 / BEDROOM_WORLD_ZOOM;

export const BEDROOM_PLAYER_DEFAULT = {
  x: 1910,
  y: 1750,
  w: 30,
  h: 34,
  speed: 387,
  facing: "down" as const,
  stepTime: 0,
  moving: false
};

export const BEDROOM_SCENE_IMAGE = withBasePath("/scenes/bedroom/bedroom.png");

/**
 * Production collision rects (furniture + walls) — kept for future tuning.
 * Not used during prototype free-walk.
 */
export const BEDROOM_COLLIDERS: Rect[] = [
  { id: "top-wall", x: 0, y: 0, w: BEDROOM_WORLD.w, h: 250 },
  { id: "left-wall", x: 0, y: 0, w: 80, h: BEDROOM_WORLD.h },
  { id: "right-wall", x: 3760, y: 0, w: 80, h: BEDROOM_WORLD.h },
  { id: "bottom-wall", x: 0, y: 2110, w: BEDROOM_WORLD.w, h: 50 },
  { id: "left-wardrobe", x: 0, y: 380, w: 520, h: 980 },
  { id: "back-wardrobe", x: 1500, y: 170, w: 830, h: 850 },
  { id: "bed", x: 1420, y: 690, w: 1860, h: 950 },
  { id: "bedside-table", x: 3340, y: 920, w: 470, h: 540 },
  { id: "cat-beds", x: 630, y: 780, w: 820, h: 360 }
];

/** Prototype free-walk — no furniture blockers; world edge clamping is in `moveWithCollision`. */
export const BEDROOM_FREE_WALK_COLLIDERS: Rect[] = [];
