"use client";

import type { RefObject } from "react";
import type { PlayerEntity, Point } from "@/lib/game/engine/types";
import { getLegPhase } from "@/lib/game/engine/movement";
import {
  FARM_HERO_COUNTER_ZOOM,
  FARM_WORLD,
  FARM_WORLD_ZOOM
} from "@/lib/game/scenes/farm/collision";
import { FARM_SCENE_IMAGE, FARM_POND_EAST_SCENE_IMAGE, NOODLE_VENDOR_FRONT, NOODLE_VENDOR_STALL } from "@/lib/game/scenes/farm/assets";
import type { FarmZone } from "@/lib/game/bedroom-reducer";
import type { FarmInteractable } from "@/lib/game/scenes/farm/interactables";
import { HeroSprite } from "./HeroSprite";
import sceneStyles from "./bedroom-game.module.css";

type FarmSceneProps = {
  player: PlayerEntity;
  camera: Point;
  farmZone: FarmZone;
  interactables: FarmInteractable[];
  activeIds: Set<string>;
  completedIds: Set<string>;
  showNoodleVendor?: boolean;
  onHotspotClick: (id: string) => void;
  frameRef: RefObject<HTMLDivElement | null>;
};

export function FarmScene({
  player,
  camera,
  farmZone,
  interactables,
  activeIds,
  completedIds,
  showNoodleVendor = false,
  onHotspotClick,
  frameRef
}: FarmSceneProps) {
  const legPhase = getLegPhase(player.stepTime, player.moving);
  const sceneImage = farmZone === "pond-east" ? FARM_POND_EAST_SCENE_IMAGE : FARM_SCENE_IMAGE;
  const sceneAlt = farmZone === "pond-east" ? "Memory Farm pond east" : "Memory Farm outdoor";

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
          src={sceneImage}
          alt={sceneAlt}
          width={FARM_WORLD.w}
          height={FARM_WORLD.h}
          style={{ width: FARM_WORLD.w, height: FARM_WORLD.h }}
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

        {showNoodleVendor ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className={sceneStyles.noodleVendor}
            src={NOODLE_VENDOR_FRONT}
            alt=""
            width={NOODLE_VENDOR_STALL.width}
            height={NOODLE_VENDOR_STALL.height}
            style={{
              left: NOODLE_VENDOR_STALL.x,
              top: NOODLE_VENDOR_STALL.y,
              transform: `translate(-50%, -100%) scale(${FARM_HERO_COUNTER_ZOOM})`
            }}
            draggable={false}
            aria-hidden
          />
        ) : null}

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
