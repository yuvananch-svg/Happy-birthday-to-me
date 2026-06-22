import { describe, expect, it } from "vitest";
import { createInitialGameState, gameReducer } from "./game-reducer";

describe("gameReducer", () => {
  it("starts at the first line with choices hidden", () => {
    const state = createInitialGameState();
    expect(state.currentNodeId).toBe("start");
    expect(state.currentLineIndex).toBe(0);
    expect(state.choicesVisible).toBe(false);
  });

  it("PASS completes typing before advancing", () => {
    const state = createInitialGameState();
    const next = gameReducer(state, { type: "PASS" });
    expect(next.currentLineIndex).toBe(0);
    expect(next.isTyping).toBe(false);
  });

  it("PASS advances lines when typing is complete", () => {
    const state = gameReducer(createInitialGameState(), { type: "PASS" });
    const next = gameReducer(state, { type: "PASS" });
    expect(next.currentLineIndex).toBe(1);
    expect(next.isTyping).toBe(true);
  });

  it("shows choices after the final line", () => {
    let state = createInitialGameState();
    for (let index = 0; index < 8; index += 1) {
      state = gameReducer(state, { type: "PASS" });
    }
    expect(state.choicesVisible).toBe(true);
  });

  it("selecting a choice changes node and computes a route", () => {
    let state = createInitialGameState();
    for (let index = 0; index < 8; index += 1) {
      state = gameReducer(state, { type: "PASS" });
    }

    const next = gameReducer(state, { type: "SELECT_CHOICE", choiceIndex: 0 });
    expect(next.currentNodeId).toBe("anniversary");
    expect(next.route).toEqual(["start", "anniversaryJunction", "anniversary"]);
    expect(next.journal[0].text).toBe("เลือกเส้นทางครบรอบ");
  });

  it("activates media on a line that has memory media", () => {
    let state = createInitialGameState();
    for (let index = 0; index < 8; index += 1) {
      state = gameReducer(state, { type: "PASS" });
    }
    state = gameReducer(state, { type: "SELECT_CHOICE", choiceIndex: 0 });
    state = gameReducer(state, { type: "PASS" });
    state = gameReducer(state, { type: "PASS" });
    state = gameReducer(state, { type: "PASS" });

    expect(state.currentLineIndex).toBe(1);
    expect(state.activeMedia[0]?.type).toBe("image");
  });

  it("records badge rewards once", () => {
    let state = createInitialGameState();
    for (let index = 0; index < 8; index += 1) {
      state = gameReducer(state, { type: "PASS" });
    }
    state = gameReducer(state, { type: "SELECT_CHOICE", choiceIndex: 0 });
    for (let index = 0; index < 8; index += 1) {
      state = gameReducer(state, { type: "PASS" });
    }
    state = gameReducer(state, { type: "SELECT_CHOICE", choiceIndex: 0 });

    expect(state.badges).toEqual([{ id: "laugh", label: "Laugh" }]);
  });
});
