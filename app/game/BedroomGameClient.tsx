"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from "react";
import { BedroomScene } from "@/components/game/BedroomScene";
import { FarmScene } from "@/components/game/FarmScene";
import { CinematicIntroLayer } from "@/components/game/CinematicIntroLayer";
import { DialoguePanel, type DialoguePanelHandle } from "@/components/game/DialoguePanel";
import { GameModal } from "@/components/game/GameModal";
import { QuestSidebar } from "@/components/game/QuestSidebar";
import { TouchControls } from "@/components/game/TouchControls";
import { applyMovementInput, cameraFollowPlayer, getNearestInteractable } from "@/lib/game/engine";
import { bedroomReducer, createInitialBedroomState } from "@/lib/game/bedroom-reducer";
import { useGameInput } from "@/lib/game/input/useGameInput";
import {
  getActiveInteractableIds,
  getCurrentQuestText,
  getNextQuestTeasers
} from "@/lib/game/quest/bedroom-quest";
import { isPlayerInBedroomDoorExitZone } from "@/lib/game/scenes/bedroom/door-zone";
import {
  BEDROOM_FREE_WALK_COLLIDERS,
  BEDROOM_WORLD,
  BEDROOM_WORLD_ZOOM
} from "@/lib/game/scenes/bedroom/collision";
import { BEDROOM_INTERACTABLES } from "@/lib/game/scenes/bedroom/interactables";
import {
  FARM_FREE_WALK_COLLIDERS,
  FARM_WORLD,
  FARM_WORLD_ZOOM
} from "@/lib/game/scenes/farm/collision";
import styles from "./game.module.css";

function getSceneWorldConfig(scene: "bedroom" | "farm") {
  if (scene === "farm") {
    return {
      world: FARM_WORLD,
      worldZoom: FARM_WORLD_ZOOM,
      colliders: FARM_FREE_WALK_COLLIDERS
    };
  }

  return {
    world: BEDROOM_WORLD,
    worldZoom: BEDROOM_WORLD_ZOOM,
    colliders: BEDROOM_FREE_WALK_COLLIDERS
  };
}

export function BedroomGameClient() {
  const [state, dispatch] = useReducer(bedroomReducer, undefined, createInitialBedroomState);
  const frameRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef(state);
  const dialoguePanelRef = useRef<DialoguePanelHandle>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  stateRef.current = state;

  const introActive = state.introPhase !== "done";
  const showGameScene = state.introPhase === "done";
  const isFarmScene = state.currentScene === "farm";

  const advanceDialogue = useCallback(() => {
    if (dialoguePanelRef.current?.handlePass()) return;
    dispatch({ type: "PASS_DIALOGUE" });
  }, []);

  const handleIntroHeroPause = useCallback(() => {
    dispatch({ type: "INTRO_REACHED_HERO_PAUSE" });
  }, []);

  const handleIntroMotherPause = useCallback(() => {
    dispatch({ type: "INTRO_REACHED_MOTHER_PAUSE" });
  }, []);

  const handleIntroFadeComplete = useCallback(() => {
    dispatch({ type: "INTRO_ROOM_FADE_COMPLETE" });
  }, []);

  const handlePass = useCallback(() => {
    const current = stateRef.current;
    if (current.modal) {
      dispatch({ type: "CLOSE_MODAL" });
      return;
    }
    if (current.mode === "cutscene") {
      advanceDialogue();
    }
  }, [advanceDialogue]);

  const handleInteract = useCallback(() => {
    const current = stateRef.current;
    if (current.modal) {
      dispatch({ type: "CLOSE_MODAL" });
      return;
    }

    if (current.mode === "cutscene") {
      advanceDialogue();
      return;
    }

    const activeIds = getActiveInteractableIds(
      current.phase,
      current.letterRead,
      current.fragments,
      current.doorInteracted,
      current.catBedsTalked
    );
    const nearest = getNearestInteractable(current.player, BEDROOM_INTERACTABLES, activeIds);
    if (nearest?.id === "letter") dispatch({ type: "OPEN_LETTER" });
    else if (nearest?.id === "photo") dispatch({ type: "OPEN_PHOTO" });
    else if (nearest?.id === "door") dispatch({ type: "ENTER_FARM" });
    else if (nearest?.id === "cat-beds") dispatch({ type: "OPEN_CAT_BEDS" });
  }, [advanceDialogue]);

  const { touchMode, getMovementVector, setJoystickVector } = useGameInput({
    enabled: state.mode === "explore" && !state.modal,
    onPass: handlePass,
    onInteract: handleInteract,
    modalOpen: Boolean(state.modal),
    cutsceneMode: state.mode === "cutscene"
  });

  const activeIds = useMemo(
    () =>
      getActiveInteractableIds(
        state.phase,
        state.letterRead,
        state.fragments,
        state.doorInteracted,
        state.catBedsTalked
      ),
    [state.catBedsTalked, state.doorInteracted, state.fragments, state.letterRead, state.phase]
  );

  const completedIds = useMemo(() => {
    const ids = new Set<string>();
    if (state.letterRead) ids.add("letter");
    if (state.fragments.includes(1)) ids.add("photo");
    if (state.doorInteracted) ids.add("door");
    if (state.catBedsTalked) ids.add("cat-beds");
    return ids;
  }, [state.catBedsTalked, state.doorInteracted, state.fragments, state.letterRead]);

  useEffect(() => {
    let frameId = 0;
    let lastTimestamp = performance.now();

    function tick(timestamp: number) {
      const current = stateRef.current;
      const deltaSeconds = Math.min(0.033, (timestamp - lastTimestamp) / 1000);
      lastTimestamp = timestamp;

      if (current.mode === "explore" && !current.modal) {
        const movement = getMovementVector();
        const frame = frameRef.current;
        const viewport =
          frame && frame.clientWidth > 0
            ? { w: frame.clientWidth, h: frame.clientHeight }
            : { w: 960, h: 540 };
        const { world, worldZoom, colliders } = getSceneWorldConfig(current.currentScene);
        const nextPlayer = applyMovementInput(
          current.player,
          movement,
          deltaSeconds,
          colliders,
          world
        );
        const nextCamera = cameraFollowPlayer(nextPlayer, viewport, world, worldZoom);

        const playerInDoorZone =
          current.currentScene === "bedroom" &&
          current.phase === "go-door" &&
          current.fragments.includes(1) &&
          !current.doorInteracted &&
          isPlayerInBedroomDoorExitZone(nextPlayer);

        if (playerInDoorZone) {
          dispatch({ type: "ENTER_FARM" });
        } else if (
            nextPlayer.x !== current.player.x ||
            nextPlayer.y !== current.player.y ||
            nextPlayer.facing !== current.player.facing ||
            nextPlayer.moving !== current.player.moving
          ) {
            dispatch({ type: "TICK_MOVEMENT", player: nextPlayer, camera: nextCamera });
          } else if (nextCamera.x !== current.camera.x || nextCamera.y !== current.camera.y) {
            dispatch({ type: "TICK_MOVEMENT", player: current.player, camera: nextCamera });
          }
      }

      frameId = requestAnimationFrame(tick);
    }

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [getMovementVector]);

  useLayoutEffect(() => {
    let observer: ResizeObserver | undefined;
    let rafId = 0;

    function syncCamera() {
      const node = frameRef.current;
      if (!node) return;

      const current = stateRef.current;
      const { world, worldZoom } = getSceneWorldConfig(current.currentScene);
      const nextCamera = cameraFollowPlayer(
        current.player,
        { w: node.clientWidth, h: node.clientHeight },
        world,
        worldZoom
      );

      if (nextCamera.x !== current.camera.x || nextCamera.y !== current.camera.y) {
        dispatch({ type: "TICK_MOVEMENT", player: current.player, camera: nextCamera });
      }
    }

    function attach() {
      const frame = frameRef.current;
      if (!frame || frame.clientHeight === 0) {
        rafId = requestAnimationFrame(attach);
        return;
      }

      syncCamera();
      observer = new ResizeObserver(syncCamera);
      observer.observe(frame);
    }

    if (showGameScene) {
      attach();
    }

    return () => {
      cancelAnimationFrame(rafId);
      observer?.disconnect();
    };
  }, [showGameScene, isFarmScene]);

  useEffect(() => {
    if (state.introPhase !== "done") return;
    frameRef.current?.focus({ preventScroll: true });
  }, [state.introPhase]);

  async function handleLogout() {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await fetch("/api/logout", { method: "POST" });
      window.location.assign("/register");
    } catch {
      setIsLoggingOut(false);
    }
  }

  return (
    <main className={styles.gameShell}>
      {!introActive ? (
        <section className={styles.topBar}>
          <div className={styles.topBarTitle}>
            <h1>Memory Farm</h1>
            <p className={styles.subtitle}>Happy anniversary and birthday</p>
          </div>
          <div className={styles.dateBadges}>
            <span>Memory {state.fragments.length}/12</span>
            <button
              type="button"
              className={styles.logoutButton}
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "กำลังออก..." : "ล็อกเอาท์"}
            </button>
          </div>
        </section>
      ) : null}

      <section className={styles.bedroomLayout}>
        <div className={styles.sceneColumn}>
          {showGameScene ? (
            isFarmScene ? (
              <FarmScene frameRef={frameRef} player={state.player} camera={state.camera} />
            ) : (
              <BedroomScene
                frameRef={frameRef}
                player={state.player}
                camera={state.camera}
                interactables={BEDROOM_INTERACTABLES}
                activeIds={activeIds}
                completedIds={completedIds}
                basinDropped={state.basinDropped}
                onHotspotClick={(id) => {
                  if (state.mode !== "explore" || state.modal) return;
                  if (id === "letter") dispatch({ type: "OPEN_LETTER" });
                  else if (id === "photo") dispatch({ type: "OPEN_PHOTO" });
                  else if (id === "door") dispatch({ type: "ENTER_FARM" });
                  else if (id === "cat-beds") dispatch({ type: "OPEN_CAT_BEDS" });
                }}
              />
            )
          ) : null}
          {!introActive ? (
            <TouchControls
              visible={touchMode}
              onInteract={handleInteract}
              onJoystickChange={setJoystickVector}
            />
          ) : null}
        </div>

        {!introActive ? (
          <QuestSidebar
            currentQuest={getCurrentQuestText(state.phase, state.letterRead, state.fragments)}
            nextTeasers={getNextQuestTeasers(state.phase)}
            fragments={state.fragments}
            onReplayFragment={(fragmentId) => dispatch({ type: "REPLAY_FRAGMENT", fragmentId })}
          />
        ) : null}
      </section>

      <CinematicIntroLayer
        introPhase={state.introPhase}
        onHeroPause={handleIntroHeroPause}
        onMotherPause={handleIntroMotherPause}
        onFadeComplete={handleIntroFadeComplete}
      />

      <DialoguePanel
        ref={dialoguePanelRef}
        line={state.dialogue}
        visible={state.mode === "cutscene" && state.dialogue !== null}
        onPass={() => dispatch({ type: "PASS_DIALOGUE" })}
      />

      <GameModal modal={state.modal} onClose={() => dispatch({ type: "CLOSE_MODAL" })} />
    </main>
  );
}
