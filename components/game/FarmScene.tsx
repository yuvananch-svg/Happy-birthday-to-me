"use client";

import type { RefObject } from "react";
import type { PlayerEntity, Point } from "@/lib/game/engine/types";
import { getLegPhase } from "@/lib/game/engine/movement";
import {
  FARM_HERO_COUNTER_ZOOM,
  FARM_WORLD,
  FARM_WORLD_ZOOM
} from "@/lib/game/scenes/farm/collision";
import { FARM_SCENE_IMAGE } from "@/lib/game/scenes/farm/assets";
import { HeroSprite } from "./HeroSprite";
import sceneStyles from "./bedroom-game.module.css";

type FarmSceneProps = {
  player: PlayerEntity;
  camera: Point;
  frameRef: RefObject<HTMLDivElement | null>;
};

export function FarmScene({ player, camera, frameRef }: FarmSceneProps) {
  const legPhase = getLegPhase(player.stepTime, player.moving);

  return (
    <div className={sceneStyles.playFrame} ref={frameRef} tabIndex={-1}>
      <div
        className={sceneStyles.world}
        style={{
          width: FARM_WORLD.w,
          height: FARM_WORLD.h,
          transform: `scale(${FARM_WORLD_ZOOM}) translate3d(${-camera.x}px, ${-camera.y}px, 0)`
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={sceneStyles.bedroomMap}
          src={FARM_SCENE_IMAGE}
          alt="Memory Farm outdoor"
          width={FARM_WORLD.w}
          height={FARM_WORLD.h}
          style={{ width: FARM_WORLD.w, height: FARM_WORLD.h }}
          draggable={false}
        />

        <HeroSprite
          x={player.x}
          y={player.y}
          facing={player.facing}
          legPhase={legPhase}
          moving={player.moving}
          counterZoom={FARM_HERO_COUNTER_ZOOM}
        />
      </div>
    </div>
  );
}
