import { describe, expect, it } from "vitest";
import {
  bedroomReducer,
  createInitialBedroomState,
  type BedroomGameState
} from "./bedroom-reducer";
import {
  AFTER_LETTER_CUTSCENE,
  CAT_BEDS_CUTSCENE,
  INTRO_CUTSCENE
} from "./scenes/bedroom/cutscenes";
import { BEDROOM_PLAYER_DEFAULT } from "./scenes/bedroom/collision";
import { FARM_PLAYER_SPAWN, getFarmSpawnCamera } from "./scenes/farm/collision";
import { isPlayerInBedroomDoorExitZone } from "./scenes/bedroom/door-zone";
import {
  getActiveInteractableIds,
  getCurrentQuestText,
  getNextQuestTeasers
} from "./quest/bedroom-quest";

describe("bedroom quest helpers", () => {
  it("gates interactables by phase", () => {
    expect([...getActiveInteractableIds("intro", false, [], false, false)]).toEqual([]);
    expect([...getActiveInteractableIds("find-letter", false, [], false, false)]).toEqual([
      "cat-beds",
      "letter"
    ]);
    expect([...getActiveInteractableIds("find-photo", true, [], false, false)]).toEqual([
      "cat-beds",
      "photo"
    ]);
    expect([...getActiveInteractableIds("go-door", true, [1], false, false)]).toEqual([
      "cat-beds",
      "door"
    ]);
    expect([...getActiveInteractableIds("go-door", true, [1], true, true)]).toEqual([]);
    expect([...getActiveInteractableIds("find-letter", false, [], false, true)]).toEqual(["letter"]);
  });

  it("describes current quest and teasers", () => {
    expect(getCurrentQuestText("find-letter", false, [])).toContain("สำรวจห้อง");
    expect(getNextQuestTeasers("go-door")).toEqual(["สวนผักผลไม้บนดอย", "บ่อน้ำกับร้านก๋วยเตี๋ยว"]);
  });
});

describe("bedroom reducer", () => {
  function finishCutscene(state: BedroomGameState) {
    let next = state;
    let guard = 0;
    while (next.mode === "cutscene" && guard < 30) {
      next = bedroomReducer(next, { type: "PASS_DIALOGUE" });
      guard += 1;
    }
    return next;
  }

  function reachMotherDialogueEnd() {
    let state = createInitialBedroomState();

    state = bedroomReducer(state, { type: "INTRO_REACHED_HERO_PAUSE" });
    state = bedroomReducer(state, { type: "PASS_DIALOGUE" });
    state = bedroomReducer(state, { type: "PASS_DIALOGUE" });
    state = bedroomReducer(state, { type: "PASS_DIALOGUE" });

    state = bedroomReducer(state, { type: "INTRO_REACHED_MOTHER_PAUSE" });
    state = bedroomReducer(state, { type: "PASS_DIALOGUE" });
    state = bedroomReducer(state, { type: "PASS_DIALOGUE" });

    return state;
  }

  function reachFindLetter() {
    let state = reachMotherDialogueEnd();

    state = bedroomReducer(state, { type: "INTRO_ROOM_FADE_COMPLETE" });
    state = finishCutscene(state);

    return state;
  }

  it("starts in silent intro with no dialogue", () => {
    const state = createInitialBedroomState();

    expect(state.mode).toBe("cutscene");
    expect(state.phase).toBe("intro");
    expect(state.introPhase).toBe("silent");
    expect(state.dialogue).toBeNull();
    expect(state.heroAwake).toBe(false);
  });

  it("shows hero dialogue after video pause at 5s", () => {
    const state = bedroomReducer(createInitialBedroomState(), { type: "INTRO_REACHED_HERO_PAUSE" });

    expect(state.introPhase).toBe("hero-dialogue");
    expect(state.dialogue?.text).toBe(INTRO_CUTSCENE[0].text);
    expect(state.heroAwake).toBe(true);
  });

  it("ignores PASS during video-resume until mother pause at 10s", () => {
    let state = createInitialBedroomState();

    state = bedroomReducer(state, { type: "INTRO_REACHED_HERO_PAUSE" });
    state = bedroomReducer(state, { type: "PASS_DIALOGUE" });
    state = bedroomReducer(state, { type: "PASS_DIALOGUE" });
    state = bedroomReducer(state, { type: "PASS_DIALOGUE" });

    expect(state.introPhase).toBe("video-resume");
    expect(state.dialogue).toBeNull();
    expect(state.cutsceneIndex).toBe(3);

    state = bedroomReducer(state, { type: "PASS_DIALOGUE" });

    expect(state.introPhase).toBe("video-resume");
    expect(state.dialogue).toBeNull();
    expect(state.cutsceneIndex).toBe(3);

    state = bedroomReducer(state, { type: "INTRO_REACHED_MOTHER_PAUSE" });

    expect(state.introPhase).toBe("mother-dialogue");
    expect(state.dialogue?.text).toBe(INTRO_CUTSCENE[3].text);
    expect(state.motherVisible).toBe(true);
  });

  it("ignores PASS during room-dialogue fade until video seek completes", () => {
    const state = reachMotherDialogueEnd();

    expect(state.introPhase).toBe("room-dialogue");
    expect(state.dialogue).toBeNull();

    const afterPass = bedroomReducer(state, { type: "PASS_DIALOGUE" });

    expect(afterPass.introPhase).toBe("room-dialogue");
    expect(afterPass.dialogue).toBeNull();
    expect(afterPass.cutsceneIndex).toBe(5);
  });

  it("plays all 11 intro lines in order through room-dialogue", () => {
    let state = createInitialBedroomState();
    const seen: string[] = [];

    state = bedroomReducer(state, { type: "INTRO_REACHED_HERO_PAUSE" });
    seen.push(state.dialogue!.text);

    for (let i = 0; i < 2; i += 1) {
      state = bedroomReducer(state, { type: "PASS_DIALOGUE" });
      seen.push(state.dialogue!.text);
    }

    state = bedroomReducer(state, { type: "PASS_DIALOGUE" });
    expect(state.introPhase).toBe("video-resume");
    expect(state.dialogue).toBeNull();

    state = bedroomReducer(state, { type: "INTRO_REACHED_MOTHER_PAUSE" });
    seen.push(state.dialogue!.text);

    state = bedroomReducer(state, { type: "PASS_DIALOGUE" });
    seen.push(state.dialogue!.text);

    state = bedroomReducer(state, { type: "PASS_DIALOGUE" });
    expect(state.introPhase).toBe("room-dialogue");
    expect(state.dialogue).toBeNull();
    expect(state.cutsceneIndex).toBe(5);

    state = bedroomReducer(state, { type: "INTRO_ROOM_FADE_COMPLETE" });
    seen.push(state.dialogue!.text);
    expect(state.introPhase).toBe("room-dialogue");
    expect(state.dialogue?.text).toBe(INTRO_CUTSCENE[5].text);

    for (let i = 5; i < INTRO_CUTSCENE.length - 1; i += 1) {
      state = bedroomReducer(state, { type: "PASS_DIALOGUE" });
      seen.push(state.dialogue!.text);
    }

    expect(seen).toEqual(INTRO_CUTSCENE.map((line) => line.text));

    state = bedroomReducer(state, { type: "PASS_DIALOGUE" });
    expect(state.mode).toBe("explore");
    expect(state.phase).toBe("find-letter");
    expect(state.introPhase).toBe("done");
    expect(state.dialogue).toBeNull();
  });

  it("transitions to room-dialogue after mother line D5", () => {
    const state = reachMotherDialogueEnd();

    expect(state.introPhase).toBe("room-dialogue");
    expect(state.dialogue).toBeNull();
    expect(state.cutsceneIndex).toBe(5);
    expect(state.mode).toBe("cutscene");
  });

  it("stays in cutscene mode through room-dialogue D6-D11 before explore", () => {
    let state = reachMotherDialogueEnd();

    state = bedroomReducer(state, { type: "INTRO_ROOM_FADE_COMPLETE" });
    expect(state.introPhase).toBe("room-dialogue");
    expect(state.mode).toBe("cutscene");
    expect(state.dialogue?.text).toBe(INTRO_CUTSCENE[5].text);

    for (let i = 5; i < INTRO_CUTSCENE.length - 1; i += 1) {
      state = bedroomReducer(state, { type: "PASS_DIALOGUE" });
      expect(state.introPhase).toBe("room-dialogue");
      expect(state.mode).toBe("cutscene");
    }

    state = bedroomReducer(state, { type: "PASS_DIALOGUE" });
    expect(state.introPhase).toBe("done");
    expect(state.mode).toBe("explore");
  });

  it("advances through intro cutscene to find-letter explore mode", () => {
    const state = reachFindLetter();

    expect(state.mode).toBe("explore");
    expect(state.phase).toBe("find-letter");
    expect(state.introPhase).toBe("done");
    expect(state.player).toEqual({ ...BEDROOM_PLAYER_DEFAULT });
    expect(state.motherVisible).toBe(true);
    expect(state.basinDropped).toBe(false);
  });

  it("opens letter without unlocking a fragment", () => {
    let state = reachFindLetter();

    state = bedroomReducer(state, { type: "OPEN_LETTER" });

    expect(state.modal).toEqual({ type: "letter" });
    expect(state.letterRead).toBe(true);
    expect(state.fragments).toEqual([]);
  });

  it("transitions letter → after-letter cutscene → find-photo", () => {
    let state = reachFindLetter();

    state = bedroomReducer(state, { type: "OPEN_LETTER" });
    state = bedroomReducer(state, { type: "CLOSE_MODAL" });

    expect(state.mode).toBe("cutscene");
    expect(state.dialogue?.text).toBe(AFTER_LETTER_CUTSCENE[0].text);

    state = finishCutscene(state);

    expect(state.mode).toBe("explore");
    expect(state.phase).toBe("find-photo");
  });

  it("opens cat beds dialogue and returns to explore when finished", () => {
    let state = reachFindLetter();

    state = bedroomReducer(state, { type: "OPEN_CAT_BEDS" });

    expect(state.mode).toBe("cutscene");
    expect(state.dialogue?.text).toBe(CAT_BEDS_CUTSCENE[0].text);
    expect(state.catBedsTalked).toBe(false);

    state = finishCutscene(state);

    expect(state.mode).toBe("explore");
    expect(state.phase).toBe("find-letter");
    expect(state.catBedsTalked).toBe(true);
    expect(state.dialogue).toBeNull();
  });

  it("unlocks F1 during remember-mother cutscene hook", () => {
    let state = reachFindLetter();

    state = bedroomReducer(state, { type: "OPEN_LETTER" });
    state = bedroomReducer(state, { type: "CLOSE_MODAL" });
    state = finishCutscene(state);

    state = bedroomReducer(state, { type: "OPEN_PHOTO" });
    state = bedroomReducer(state, { type: "CLOSE_MODAL" });

    expect(state.fragments).toEqual([]);

    while (state.mode === "cutscene" && !state.fragments.includes(1)) {
      state = bedroomReducer(state, { type: "PASS_DIALOGUE" });
    }

    expect(state.fragments).toEqual([1]);

    state = finishCutscene(state);
    expect(state.phase).toBe("go-door");
  });

  it("transitions to farm scene when entering door during go-door phase", () => {
    let state = reachFindLetter();

    state = bedroomReducer(state, { type: "OPEN_LETTER" });
    state = bedroomReducer(state, { type: "CLOSE_MODAL" });
    state = finishCutscene(state);

    state = bedroomReducer(state, { type: "OPEN_PHOTO" });
    state = bedroomReducer(state, { type: "CLOSE_MODAL" });
    state = finishCutscene(state);

    expect(state.phase).toBe("go-door");
    expect(state.currentScene).toBe("bedroom");

    state = bedroomReducer(state, { type: "ENTER_FARM" });

    expect(state.currentScene).toBe("farm");
    expect(state.doorInteracted).toBe(true);
    expect(state.player).toEqual({ ...FARM_PLAYER_SPAWN });
    expect(state.camera).toEqual(getFarmSpawnCamera());
    expect(state.mode).toBe("cutscene");
    expect(state.dialogue?.text).toContain("อากาศข้างนอก");

    state = finishCutscene(state);

    expect(state.mode).toBe("explore");
    expect(state.phase).toBe("farm-explore");
  });

  it("walk-through door zone aligns with bottom-center exit before farm transition", () => {
    let state = reachFindLetter();

    state = bedroomReducer(state, { type: "OPEN_LETTER" });
    state = bedroomReducer(state, { type: "CLOSE_MODAL" });
    state = finishCutscene(state);

    state = bedroomReducer(state, { type: "OPEN_PHOTO" });
    state = bedroomReducer(state, { type: "CLOSE_MODAL" });
    state = finishCutscene(state);

    const atBottomDoor = { ...BEDROOM_PLAYER_DEFAULT, x: 1920, y: 2115 };
    const aboveBottomDoor = { ...BEDROOM_PLAYER_DEFAULT, x: 1920, y: 2060 };
    const atLegacyDoor = { ...BEDROOM_PLAYER_DEFAULT, x: 3250, y: 1810 };

    expect(isPlayerInBedroomDoorExitZone(atBottomDoor)).toBe(true);
    expect(isPlayerInBedroomDoorExitZone(aboveBottomDoor)).toBe(false);
    expect(isPlayerInBedroomDoorExitZone(atLegacyDoor)).toBe(false);

    state = bedroomReducer(
      { ...state, player: atBottomDoor },
      { type: "ENTER_FARM" }
    );

    expect(state.currentScene).toBe("farm");
  });
});
