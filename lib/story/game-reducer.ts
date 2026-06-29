import { findRoute } from "./route-finding";
import { initialNodeId, storyNodes } from "./story-data";
import type { MapPointKey, MemoryMedia, StoryNodeId, StoryReward } from "./story-types";

export type JournalEntry = {
  id: string;
  text: string;
};

export type Badge = {
  id: string;
  label: string;
};

export type GameState = {
  currentNodeId: StoryNodeId;
  currentLineIndex: number;
  isTyping: boolean;
  choicesVisible: boolean;
  currentPointKey: MapPointKey;
  route: MapPointKey[];
  journal: JournalEntry[];
  badges: Badge[];
  activeMedia: MemoryMedia[];
};

export type GameAction =
  | { type: "COMPLETE_TYPING" }
  | { type: "PASS" }
  | { type: "SELECT_CHOICE"; choiceIndex: number }
  | { type: "ARRIVE_AT_POINT"; point: MapPointKey };

function mediaForLine(nodeId: StoryNodeId, lineIndex: number): MemoryMedia[] {
  return storyNodes[nodeId].lines[lineIndex]?.media || [];
}

function addRewards(existing: Badge[], rewards: StoryReward[] | undefined): Badge[] {
  if (!rewards) return existing;

  const next = [...existing];
  for (const reward of rewards) {
    if (reward.type === "badge" && !next.some((badge) => badge.id === reward.id)) {
      next.push({ id: reward.id, label: reward.label });
    }
  }

  return next;
}

export function createInitialGameState(): GameState {
  const node = storyNodes[initialNodeId];
  return {
    currentNodeId: initialNodeId,
    currentLineIndex: 0,
    isTyping: true,
    choicesVisible: false,
    currentPointKey: "start",
    route: ["start"],
    journal: [{ id: "initial", text: "การมาถึงของปีศาจหมู" }],
    badges: [],
    activeMedia: mediaForLine(node.id, 0)
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  const node = storyNodes[state.currentNodeId];

  switch (action.type) {
    case "COMPLETE_TYPING":
      return { ...state, isTyping: false };

    case "PASS": {
      if (state.isTyping) {
        return { ...state, isTyping: false };
      }

      const nextLineIndex = state.currentLineIndex + 1;
      if (nextLineIndex < node.lines.length) {
        return {
          ...state,
          currentLineIndex: nextLineIndex,
          isTyping: true,
          activeMedia: mediaForLine(state.currentNodeId, nextLineIndex)
        };
      }

      return { ...state, choicesVisible: true };
    }

    case "SELECT_CHOICE": {
      if (!state.choicesVisible) return state;

      const choice = node.choices[action.choiceIndex];
      if (!choice) return state;

      const nextNode = storyNodes[choice.next];
      const route = findRoute(state.currentPointKey, nextNode.destination);
      const journal = choice.journal
        ? [{ id: `${Date.now()}-${choice.next}`, text: choice.journal }, ...state.journal].slice(0, 7)
        : state.journal;

      return {
        ...state,
        currentNodeId: nextNode.id,
        currentLineIndex: 0,
        isTyping: true,
        choicesVisible: false,
        route,
        journal,
        badges: addRewards(state.badges, nextNode.rewards),
        activeMedia: mediaForLine(nextNode.id, 0)
      };
    }

    case "ARRIVE_AT_POINT":
      return { ...state, currentPointKey: action.point };

    default:
      return state;
  }
}
