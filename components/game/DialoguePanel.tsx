"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from "react";
import type { CutsceneLine, CutscenePortrait } from "@/lib/game/scenes/bedroom/cutscenes";
import styles from "./dialogue-panel.module.css";

const CHAR_DELAY_MS = 40;

export type DialoguePanelHandle = {
  /** Returns true if the pass was consumed to complete typing. */
  handlePass: () => boolean;
};

type DialoguePanelProps = {
  line: CutsceneLine | null;
  visible: boolean;
  onPass: () => void;
};

function portraitClass(portrait: CutscenePortrait) {
  if (portrait === "mother") return styles.portraitMother;
  if (portrait === "system") return styles.portraitSystem;
  return styles.portraitHero;
}

export const DialoguePanel = forwardRef<DialoguePanelHandle, DialoguePanelProps>(
  function DialoguePanel({ line, visible, onPass }, ref) {
    const [displayedText, setDisplayedText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const fullTextRef = useRef("");
    const isTypingRef = useRef(false);

    const clearTimer = useCallback(() => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }, []);

    const completeTyping = useCallback(() => {
      clearTimer();
      setDisplayedText(fullTextRef.current);
      setIsTyping(false);
      isTypingRef.current = false;
    }, [clearTimer]);

    useEffect(() => {
      isTypingRef.current = isTyping;
    }, [isTyping]);

    useEffect(() => {
      if (!visible || !line) {
        clearTimer();
        setDisplayedText("");
        setIsTyping(false);
        isTypingRef.current = false;
        return;
      }

      fullTextRef.current = line.text;
      setDisplayedText("");
      setIsTyping(true);
      isTypingRef.current = true;

      let index = 0;
      timerRef.current = setInterval(() => {
        index += 1;
        if (index >= line.text.length) {
          clearTimer();
          setDisplayedText(line.text);
          setIsTyping(false);
          isTypingRef.current = false;
        } else {
          setDisplayedText(line.text.slice(0, index));
        }
      }, CHAR_DELAY_MS);

      return clearTimer;
    }, [clearTimer, line, visible]);

    useImperativeHandle(
      ref,
      () => ({
        handlePass: () => {
          if (isTypingRef.current) {
            completeTyping();
            return true;
          }
          return false;
        }
      }),
      [completeTyping]
    );

    const handlePassClick = () => {
      if (isTypingRef.current) {
        completeTyping();
        return;
      }
      onPass();
    };

    if (!visible || !line) return null;

    return (
      <section className={styles.panel} aria-live="polite">
        <div className={styles.speakerRow}>
          <span className={`${styles.portrait} ${portraitClass(line.portrait)}`} aria-hidden="true" />
          <div>
            <p className={styles.speaker}>{line.speaker}</p>
            <p className={styles.meta}>{line.meta}</p>
          </div>
        </div>
        <p className={styles.text}>{displayedText}</p>
        <button type="button" className={styles.passButton} onClick={handlePassClick}>
          {isTyping ? "SKIP" : "Next >"}
        </button>
      </section>
    );
  }
);
