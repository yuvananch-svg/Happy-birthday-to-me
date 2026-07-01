"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { clearClientAccess } from "@/lib/auth/client-access";
import { registerPath } from "@/lib/auth/paths";
import { isStaticExportMode } from "@/lib/auth/static-mode";
import { BedroomScene } from "@/components/game/BedroomScene";
import { FarmScene } from "@/components/game/FarmScene";
import { CinematicIntroLayer } from "@/components/game/CinematicIntroLayer";
import { DialoguePanel, type DialoguePanelHandle } from "@/components/game/DialoguePanel";
import { GameModal } from "@/components/game/GameModal";
import { QuestSidebar } from "@/components/game/QuestSidebar";
import { TouchControls } from "@/components/game/TouchControls";
import { applyMovementInput, cameraFollowPlayer, getNearestInteractable } from "@/lib/game/engine";
import { bedroomReducer, createInitialBedroomState, type FarmZone } from "@/lib/game/bedroom-reducer";
import { useGameInput } from "@/lib/game/input/useGameInput";
import {
  getActiveBedroomInteractableIds,
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
  FARM_POND_EAST_WORLD,
  FARM_WORLD,
  FARM_WORLD_ZOOM
} from "@/lib/game/scenes/farm/collision";
import {
  FARM_OUTDOOR_EAST_EXIT_X,
  isPlayerAtFarmLeftEdge,
  isPlayerAtFarmRightEdge,
  isPlayerPressingFarmEastEdge
} from "@/lib/game/scenes/farm/edge-zones";
import {
  FARM_INTERACTABLES,
  getActiveFarmInteractableIds
} from "@/lib/game/scenes/farm/interactables";
import styles from "./game.module.css";

function getSceneWorldConfig(scene: "bedroom" | "farm", farmZone: FarmZone = "outdoor") {
  if (scene === "farm") {
    const world = farmZone === "pond-east" ? FARM_POND_EAST_WORLD : FARM_WORLD;
    return {
      world,
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
  const router = useRouter();
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

    const bedroomActiveIds = getActiveBedroomInteractableIds(
      current.phase,
      current.letterRead,
      current.fragments,
      current.doorInteracted,
      current.catBedsTalked
    );
    const farmActiveIds = getActiveFarmInteractableIds(current.phase, current.fragments);

    if (current.currentScene === "farm") {
      if (current.farmZone !== "outdoor") return;
      const nearest = getNearestInteractable(current.player, FARM_INTERACTABLES, farmActiveIds);
      if (nearest?.id === "strawberry") dispatch({ type: "OPEN_STRAWBERRY" });
      else if (nearest?.id === "noodle-shop") dispatch({ type: "OPEN_NOODLE" });
      return;
    }

    const nearest = getNearestInteractable(current.player, BEDROOM_INTERACTABLES, bedroomActiveIds);
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

  const bedroomActiveIds = useMemo(
    () =>
      getActiveBedroomInteractableIds(
        state.phase,
        state.letterRead,
        state.fragments,
        state.doorInteracted,
        state.catBedsTalked
      ),
    [state.catBedsTalked, state.doorInteracted, state.fragments, state.letterRead, state.phase]
  );

  const farmActiveIds = useMemo(
    () => getActiveFarmInteractableIds(state.phase, state.fragments),
    [state.fragments, state.phase]
  );

  const farmCompletedIds = useMemo(() => {
    const ids = new Set<string>();
    if (state.fragments.includes(2)) ids.add("strawberry");
    if (state.fragments.includes(3)) ids.add("noodle-shop");
    return ids;
  }, [state.fragments]);

  const showNoodleVendor =
    isFarmScene &&
    state.farmZone === "outdoor" &&
    (state.phase === "pond-noodle" || state.phase === "farm-explore");

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
    let lastEdgeLogAt = 0;

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
        const { world, worldZoom, colliders } = getSceneWorldConfig(
          current.currentScene,
          current.farmZone
        );
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

        const atFarmRightEdge =
          current.currentScene === "farm" &&
          current.farmZone === "outdoor" &&
          (isPlayerAtFarmRightEdge(nextPlayer, world) ||
            isPlayerPressingFarmEastEdge(current.player, nextPlayer, movement, world));

        const atFarmLeftEdge =
          current.currentScene === "farm" &&
          current.farmZone === "pond-east" &&
          isPlayerAtFarmLeftEdge(nextPlayer, world);

        // #region agent log
        if (
          current.currentScene === "farm" &&
          current.farmZone === "outdoor" &&
          nextPlayer.x > FARM_OUTDOOR_EAST_EXIT_X - 400 &&
          timestamp - lastEdgeLogAt > 500
        ) {
          lastEdgeLogAt = timestamp;
          const boundsRight = nextPlayer.x + nextPlayer.w / 2;
          fetch("http://127.0.0.1:7414/ingest/959fc233-75c7-4f41-a3a8-f8934f9d1a24", {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "8c4c68" },
            body: JSON.stringify({
              sessionId: "8c4c68",
              runId: "pre-fix",
              hypothesisId: "A-B",
              location: "BedroomGameClient.tsx:tick",
              message: "farm outdoor near east edge",
              data: {
                playerX: nextPlayer.x,
                boundsRight,
                exitX: FARM_OUTDOOR_EAST_EXIT_X,
                worldW: world.w,
                atRightEdge: atFarmRightEdge,
                movementDx: movement.dx,
                mode: current.mode,
                modal: Boolean(current.modal),
                farmZone: current.farmZone
              },
              timestamp: Date.now()
            })
          }).catch(() => {});
        }
        // #endregion

        if (playerInDoorZone) {
          dispatch({ type: "ENTER_FARM" });
        } else if (atFarmRightEdge) {
          // #region agent log
          fetch("http://127.0.0.1:7414/ingest/959fc233-75c7-4f41-a3a8-f8934f9d1a24", {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "8c4c68" },
            body: JSON.stringify({
              sessionId: "8c4c68",
              runId: "pre-fix",
              hypothesisId: "D",
              location: "BedroomGameClient.tsx:warp-dispatch",
              message: "dispatching WARP_FARM_ZONE pond-east",
              data: { playerX: nextPlayer.x },
              timestamp: Date.now()
            })
          }).catch(() => {});
          // #endregion
          dispatch({ type: "WARP_FARM_ZONE", zone: "pond-east" });
        } else if (atFarmLeftEdge) {
          dispatch({ type: "WARP_FARM_ZONE", zone: "outdoor" });
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
      const { world, worldZoom } = getSceneWorldConfig(current.currentScene, current.farmZone);
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
  }, [showGameScene, isFarmScene, state.farmZone]);

  useEffect(() => {
    if (state.introPhase !== "done") return;
    frameRef.current?.focus({ preventScroll: true });
  }, [state.introPhase]);

  async function handleLogout() {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      if (isStaticExportMode()) {
        clearClientAccess();
        router.push(registerPath());
        return;
      }

      await fetch("/api/logout", { method: "POST" });
      router.push(registerPath());
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
              <FarmScene
                frameRef={frameRef}
                player={state.player}
                camera={state.camera}
                farmZone={state.farmZone}
                interactables={state.farmZone === "outdoor" ? FARM_INTERACTABLES : []}
                activeIds={farmActiveIds}
                completedIds={farmCompletedIds}
                showNoodleVendor={showNoodleVendor}
                onHotspotClick={(id) => {
                  if (state.mode !== "explore" || state.modal) return;
                  if (id === "strawberry") dispatch({ type: "OPEN_STRAWBERRY" });
                  else if (id === "noodle-shop") dispatch({ type: "OPEN_NOODLE" });
                }}
              />
            ) : (
              <BedroomScene
                frameRef={frameRef}
                player={state.player}
                camera={state.camera}
                interactables={BEDROOM_INTERACTABLES}
                activeIds={bedroomActiveIds}
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
            nextTeasers={getNextQuestTeasers(state.phase, state.fragments)}
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
