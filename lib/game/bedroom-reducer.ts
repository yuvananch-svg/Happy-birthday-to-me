import type { PlayerEntity, Point } from "@/lib/game/engine/types";
import { BEDROOM_PLAYER_DEFAULT } from "@/lib/game/scenes/bedroom/collision";
import {
  AFTER_LETTER_CUTSCENE,
  CAT_BEDS_CUTSCENE,
  FARM_ENTRY_CUTSCENE,
  INTRO_CUTSCENE,
  REMEMBER_MOTHER_CUTSCENE,
  type CutsceneLine
} from "@/lib/game/scenes/bedroom/cutscenes";
import type { IntroPhase } from "@/lib/game/scenes/bedroom/opening-video-beats";
import { INTRO_BEATS } from "@/lib/game/scenes/bedroom/opening-video-beats";
import type { BedroomInteractableId } from "@/lib/game/scenes/bedroom/interactables";
import type { BedroomPhase } from "@/lib/game/quest/bedroom-quest";
import { unlockFragment } from "@/lib/game/quest/fragment-state";
import { FARM_PLAYER_SPAWN, getFarmSpawnCamera } from "@/lib/game/scenes/farm/collision";

export type GameScene = "bedroom" | "farm";

export type GameMode = "cutscene" | "explore";

export type ModalState =
  | null
  | { type: "letter" }
  | { type: "memory"; fragmentId: number; replay?: boolean };

export type PendingAfterModal =
  | null
  | { kind: "cutscene"; lines: CutsceneLine[]; nextPhase: BedroomPhase }
  | { kind: "phase"; nextPhase: BedroomPhase };

export type BedroomGameState = {
  mode: GameMode;
  phase: BedroomPhase;
  currentScene: GameScene;
  introPhase: IntroPhase;
  cutsceneQueue: CutsceneLine[];
  cutsceneIndex: number;
  pendingPhase: BedroomPhase | null;
  dialogue: CutsceneLine | null;
  player: PlayerEntity;
  camera: Point;
  fragments: number[];
  letterRead: boolean;
  doorInteracted: boolean;
  catBedsTalked: boolean;
  modal: ModalState;
  pendingAfterModal: PendingAfterModal;
  heroAwake: boolean;
  motherVisible: boolean;
  basinDropped: boolean;
};

export type BedroomAction =
  | { type: "TICK_MOVEMENT"; player: PlayerEntity; camera: Point }
  | { type: "START_CUTSCENE"; lines: CutsceneLine[]; nextPhase: BedroomPhase }
  | { type: "PASS_DIALOGUE" }
  | { type: "INTRO_REACHED_HERO_PAUSE" }
  | { type: "INTRO_REACHED_MOTHER_PAUSE" }
  | { type: "INTRO_ROOM_FADE_COMPLETE" }
  | { type: "OPEN_LETTER" }
  | { type: "OPEN_PHOTO" }
  | { type: "OPEN_DOOR" }
  | { type: "ENTER_FARM" }
  | { type: "OPEN_CAT_BEDS" }
  | { type: "CLOSE_MODAL" }
  | { type: "REPLAY_FRAGMENT"; fragmentId: number };

function applyCutsceneHook(state: BedroomGameState, hook?: CutsceneLine["hook"]): BedroomGameState {
  if (!hook) return state;

  if (hook === "hero-awake") return { ...state, heroAwake: true };
  if (hook === "mother-visible") return { ...state, motherVisible: true };
  if (hook === "basin-dropped") return { ...state, basinDropped: true };
  if (hook === "unlock-f1") return { ...state, fragments: unlockFragment(state.fragments, 1) };
  if (hook === "cat-beds-done") return { ...state, catBedsTalked: true };

  return state;
}

function showCutsceneLineAt(state: BedroomGameState, index: number): BedroomGameState {
  const line = state.cutsceneQueue[index];
  const nextState = applyCutsceneHook(state, line.hook);

  return {
    ...nextState,
    cutsceneIndex: index + 1,
    dialogue: line
  };
}

function finishIntro(state: BedroomGameState): BedroomGameState {
  return {
    ...state,
    introPhase: "done",
    mode: "explore",
    phase: state.pendingPhase ?? "find-letter",
    cutsceneQueue: [],
    cutsceneIndex: 0,
    pendingPhase: null,
    dialogue: null,
    player: { ...BEDROOM_PLAYER_DEFAULT }
  };
}

function advanceIntroPass(state: BedroomGameState): BedroomGameState {
  const idx = state.cutsceneIndex;

  if (state.introPhase === "hero-dialogue" && idx === INTRO_BEATS.HERO_END_INDEX) {
    return { ...state, introPhase: "video-resume", dialogue: null };
  }

  if (state.introPhase === "mother-dialogue" && idx === INTRO_BEATS.MOTHER_END_INDEX) {
    return { ...state, introPhase: "room-dialogue", dialogue: null };
  }

  if (state.introPhase === "room-dialogue" && idx > INTRO_BEATS.LAST_INDEX) {
    return finishIntro(state);
  }

  if (idx <= INTRO_BEATS.LAST_INDEX) {
    return showCutsceneLineAt(state, idx);
  }

  return finishIntro(state);
}

function canEnterFarm(state: BedroomGameState) {
  return (
    state.currentScene === "bedroom" &&
    state.phase === "go-door" &&
    state.fragments.includes(1) &&
    !state.doorInteracted &&
    !state.modal &&
    state.mode === "explore"
  );
}

function enterFarm(state: BedroomGameState): BedroomGameState {
  if (!canEnterFarm(state)) return state;

  return bedroomReducer(
    {
      ...state,
      doorInteracted: true,
      currentScene: "farm",
      player: { ...FARM_PLAYER_SPAWN },
      camera: getFarmSpawnCamera()
    },
    {
      type: "START_CUTSCENE",
      lines: FARM_ENTRY_CUTSCENE,
      nextPhase: "farm-explore"
    }
  );
}

function showNextCutsceneLine(state: BedroomGameState): BedroomGameState {
  if (state.cutsceneIndex >= state.cutsceneQueue.length) {
    return {
      ...state,
      mode: "explore",
      phase: state.pendingPhase ?? state.phase,
      cutsceneQueue: [],
      cutsceneIndex: 0,
      pendingPhase: null,
      dialogue: null
    };
  }

  return showCutsceneLineAt(state, state.cutsceneIndex);
}

export function createInitialBedroomState(): BedroomGameState {
  return {
    mode: "cutscene",
    phase: "intro",
    currentScene: "bedroom",
    introPhase: "silent",
    cutsceneQueue: INTRO_CUTSCENE,
    cutsceneIndex: 0,
    pendingPhase: "find-letter",
    dialogue: null,
    player: { ...BEDROOM_PLAYER_DEFAULT },
    camera: { x: 0, y: 0 },
    fragments: [],
    letterRead: false,
    doorInteracted: false,
    catBedsTalked: false,
    modal: null,
    pendingAfterModal: null,
    heroAwake: false,
    motherVisible: false,
    basinDropped: false
  };
}

export function bedroomReducer(state: BedroomGameState, action: BedroomAction): BedroomGameState {
  switch (action.type) {
    case "TICK_MOVEMENT":
      if (state.modal) return state;
      if (state.mode !== "explore") {
        return { ...state, camera: action.camera };
      }
      return { ...state, player: action.player, camera: action.camera };

    case "START_CUTSCENE":
      return showNextCutsceneLine({
        ...state,
        mode: "cutscene",
        cutsceneQueue: action.lines,
        cutsceneIndex: 0,
        pendingPhase: action.nextPhase,
        dialogue: null,
        modal: null
      });

    case "INTRO_REACHED_HERO_PAUSE":
      if (state.introPhase !== "silent") return state;
      return showCutsceneLineAt({ ...state, introPhase: "hero-dialogue" }, 0);

    case "INTRO_REACHED_MOTHER_PAUSE":
      if (state.introPhase !== "video-resume") return state;
      return showCutsceneLineAt({ ...state, introPhase: "mother-dialogue" }, 3);

    case "INTRO_ROOM_FADE_COMPLETE":
      if (state.introPhase !== "room-dialogue" || state.dialogue !== null) return state;
      return showCutsceneLineAt(state, INTRO_BEATS.ROOM_START_INDEX);

    case "PASS_DIALOGUE":
      if (state.mode !== "cutscene") return state;
      if (state.introPhase !== "done" && state.phase === "intro") {
        return advanceIntroPass(state);
      }
      return showNextCutsceneLine(state);

    case "OPEN_LETTER":
      if (state.phase !== "find-letter" || state.letterRead || state.modal) return state;
      return {
        ...state,
        letterRead: true,
        modal: { type: "letter" },
        pendingAfterModal: {
          kind: "cutscene",
          lines: AFTER_LETTER_CUTSCENE,
          nextPhase: "find-photo"
        }
      };

    case "OPEN_PHOTO":
      if (state.phase !== "find-photo" || state.fragments.includes(1) || state.modal) return state;
      return {
        ...state,
        modal: { type: "memory", fragmentId: 1 },
        pendingAfterModal: {
          kind: "cutscene",
          lines: REMEMBER_MOTHER_CUTSCENE,
          nextPhase: "go-door"
        }
      };

    case "OPEN_DOOR":
      return enterFarm(state);

    case "ENTER_FARM":
      return enterFarm(state);

    case "OPEN_CAT_BEDS":
      if (state.catBedsTalked || state.modal || state.mode !== "explore" || state.phase === "intro") {
        return state;
      }
      return bedroomReducer(state, {
        type: "START_CUTSCENE",
        lines: CAT_BEDS_CUTSCENE,
        nextPhase: state.phase
      });

    case "CLOSE_MODAL": {
      if (!state.modal) return state;

      const next = { ...state, modal: null as ModalState };
      const pending = state.pendingAfterModal;
      const wasReplay = state.modal.type === "memory" && state.modal.replay;

      if (wasReplay || !pending) {
        return { ...next, pendingAfterModal: null };
      }

      if (pending.kind === "cutscene") {
        if (state.modal.type === "memory" && state.modal.fragmentId === 1) {
          return bedroomReducer(next, {
            type: "START_CUTSCENE",
            lines: pending.lines,
            nextPhase: pending.nextPhase
          });
        }

        return bedroomReducer(next, {
          type: "START_CUTSCENE",
          lines: pending.lines,
          nextPhase: pending.nextPhase
        });
      }

      return { ...next, phase: pending.nextPhase, pendingAfterModal: null };
    }

    case "REPLAY_FRAGMENT":
      if (!state.fragments.includes(action.fragmentId)) return state;
      return {
        ...state,
        modal: { type: "memory", fragmentId: action.fragmentId, replay: true },
        pendingAfterModal: null
      };

    default:
      return state;
  }
}

export function interactWithNearest(
  state: BedroomGameState,
  interactableId: BedroomInteractableId | null
): BedroomGameState {
  if (!interactableId || state.modal || state.mode !== "explore") return state;

  if (interactableId === "letter") {
    return bedroomReducer(state, { type: "OPEN_LETTER" });
  }

  if (interactableId === "photo") {
    return bedroomReducer(state, { type: "OPEN_PHOTO" });
  }

  if (interactableId === "door") {
    return bedroomReducer(state, { type: "OPEN_DOOR" });
  }

  if (interactableId === "cat-beds") {
    return bedroomReducer(state, { type: "OPEN_CAT_BEDS" });
  }

  return state;
}
