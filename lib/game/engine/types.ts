export type Size = {
  w: number;
  h: number;
};

export type Point = {
  x: number;
  y: number;
};

export type Rect = Point &
  Size & {
    id?: string;
  };

export type Interactable = Point & {
  id: string;
  label: string;
  radius: number;
};

export type Facing = "up" | "down" | "left" | "right";

export type LegPhase = "idle" | "left" | "right";

export type SpriteView = "front" | "back" | "side";

export type PlayerEntity = Point & {
  w: number;
  h: number;
  facing: Facing;
  stepTime: number;
  moving: boolean;
  speed: number;
};
