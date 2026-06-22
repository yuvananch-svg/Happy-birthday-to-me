"use client";

import { useEffect, useMemo, useReducer, useState } from "react";
import { BadgeTray } from "@/components/game/BadgeTray";
import { ChoicePanel } from "@/components/game/ChoicePanel";
import { DialogueBox } from "@/components/game/DialogueBox";
import { JournalLog } from "@/components/game/JournalLog";
import { MemoryViewer } from "@/components/game/MemoryViewer";
import { PixelMap } from "@/components/game/PixelMap";
import { createInitialGameState, gameReducer } from "@/lib/story/game-reducer";
import { storyNodes } from "@/lib/story/story-data";
import styles from "./game.module.css";

export function GameClient() {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialGameState);
  const [typedText, setTypedText] = useState("");
  const node = storyNodes[state.currentNodeId];
  const currentLine = node.lines[state.currentLineIndex];

  useEffect(() => {
    if (!state.isTyping) {
      setTypedText(currentLine.text);
      return;
    }

    setTypedText("");
    let index = 0;
    const timer = window.setInterval(() => {
      setTypedText((value) => value + currentLine.text[index]);
      index += 1;

      if (index >= currentLine.text.length) {
        window.clearInterval(timer);
        dispatch({ type: "COMPLETE_TYPING" });
      }
    }, 18);

    return () => window.clearInterval(timer);
  }, [currentLine.text, state.currentLineIndex, state.currentNodeId, state.isTyping]);

  useEffect(() => {
    let index = 0;
    const route = state.route;
    if (route.length === 0) return;

    dispatch({ type: "ARRIVE_AT_POINT", point: route[0] });

    const timer = window.setInterval(() => {
      index += 1;
      if (index >= route.length) {
        window.clearInterval(timer);
        return;
      }

      dispatch({ type: "ARRIVE_AT_POINT", point: route[index] });
    }, 390);

    return () => window.clearInterval(timer);
  }, [state.route]);

  const lineNumber = state.currentLineIndex + 1;
  const lineTotal = node.lines.length;

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        dispatch({ type: "PASS" });
        return;
      }

      if (!state.choicesVisible) return;

      const numeric = Number(event.key);
      if (numeric >= 1 && numeric <= node.choices.length) {
        dispatch({ type: "SELECT_CHOICE", choiceIndex: numeric - 1 });
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [node.choices.length, state.choicesVisible]);

  const dialogueText = useMemo(() => typedText || currentLine.text, [currentLine.text, typedText]);

  return (
    <main className={styles.gameShell}>
      <section className={styles.topBar}>
        <div>
          <p className={styles.kicker}>Anniversary Quest</p>
          <h1>2 Years 5 Months + Birthday</h1>
        </div>
        <div className={styles.dateBadges}>
          <span>9 Jul</span>
          <span>12 Jul</span>
        </div>
      </section>

      <section className={styles.gameLayout}>
        <div className={styles.leftColumn}>
          <PixelMap currentPointKey={state.currentPointKey} />
          <MemoryViewer media={state.activeMedia} />
        </div>
        <div className={styles.rightColumn}>
          <BadgeTray badges={state.badges} />
          <JournalLog entries={state.journal} />
        </div>
      </section>

      <DialogueBox
        speaker={node.speaker}
        chapter={node.chapter}
        text={dialogueText}
        lineNumber={lineNumber}
        lineTotal={lineTotal}
        isTyping={state.isTyping}
        onPass={() => dispatch({ type: "PASS" })}
      />
      <ChoicePanel
        choices={node.choices}
        visible={state.choicesVisible}
        onChoose={(choiceIndex) => dispatch({ type: "SELECT_CHOICE", choiceIndex })}
      />
    </main>
  );
}
