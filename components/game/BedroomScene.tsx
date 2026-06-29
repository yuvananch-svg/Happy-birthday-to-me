"use client";

import type { RefObject } from "react";
import type { PlayerEntity, Point } from "@/lib/game/engine/types";
import { getLegPhase } from "@/lib/game/engine/movement";
import {
  BEDROOM_HERO_COUNTER_ZOOM,
  BEDROOM_SCENE_IMAGE,
  BEDROOM_WORLD,
  BEDROOM_WORLD_ZOOM
} from "@/lib/game/scenes/bedroom/collision";
import type { BedroomInteractable } from "@/lib/game/scenes/bedroom/interactables";
import { HeroSprite } from "./HeroSprite";
import sceneStyles from "./bedroom-game.module.css";

type BedroomSceneProps = {
  player: PlayerEntity;
  camera: Point;
  interactables: BedroomInteractable[];
  activeIds: Set<string>;
  completedIds: Set<string>;
  basinDropped: boolean;
  onHotspotClick: (id: string) => void;
  frameRef: RefObject<HTMLDivElement | null>;
};

export function BedroomScene({
  player,
  camera,
  interactables,
  activeIds,
  completedIds,
  basinDropped,
  onHotspotClick,
  frameRef
}: BedroomSceneProps) {
  const legPhase = getLegPhase(player.stepTime, player.moving);

  return (
    <div className={sceneStyles.playFrame} ref={frameRef} tabIndex={-1}>
      <div
        className={sceneStyles.world}
        style={{
          transform: `scale(${BEDROOM_WORLD_ZOOM}) translate3d(${-camera.x}px, ${-camera.y}px, 0)`
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={sceneStyles.bedroomMap}
          src={BEDROOM_SCENE_IMAGE}
          alt="ห้องนอน Memory Farm"
          width={BEDROOM_WORLD.w}
          height={BEDROOM_WORLD.h}
          draggable={false}
        />

        {interactables.map((item) => {
          const isActive = activeIds.has(item.id);
          const isDone = completedIds.has(item.id);

          return (
            <button
              key={item.id}
              type="button"
              className={`${sceneStyles.hotspot} ${isDone ? sceneStyles.hotspotDone : ""} ${!isActive ? sceneStyles.hotspotHidden : ""}`}
              style={{
                left: item.x,
                top: item.y,
                ...(item.hotspotWidth != null ? { width: item.hotspotWidth } : {}),
                ...(item.hotspotHeight != null ? { height: item.hotspotHeight } : {})
              }}
              onClick={() => onHotspotClick(item.id)}
              aria-hidden={!isActive}
              tabIndex={isActive ? 0 : -1}
            >
              {item.hotspotLabel}
            </button>
          );
        })}

        {basinDropped ? (
          <div className={sceneStyles.basinProp} style={{ left: 2040, top: 1420 }} aria-hidden="true" />
        ) : null}

        <HeroSprite
          x={player.x}
          y={player.y}
          facing={player.facing}
          legPhase={legPhase}
          moving={player.moving}
          counterZoom={BEDROOM_HERO_COUNTER_ZOOM}
        />
      </div>
    </div>
  );
}
