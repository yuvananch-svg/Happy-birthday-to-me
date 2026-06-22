import styles from "./game-components.module.css";

type DialogueBoxProps = {
  speaker: string;
  chapter: string;
  text: string;
  lineNumber: number;
  lineTotal: number;
  isTyping: boolean;
  onPass: () => void;
};

export function DialogueBox({
  speaker,
  chapter,
  text,
  lineNumber,
  lineTotal,
  isTyping,
  onPass
}: DialogueBoxProps) {
  return (
    <section className={styles.dialoguePanel} aria-live="polite">
      <div className={styles.speakerRow}>
        <span className={styles.portrait} aria-hidden="true" />
        <div>
          <p className={styles.speaker}>{speaker}</p>
          <p className={styles.chapter}>{chapter}</p>
        </div>
      </div>
      <p className={styles.dialogue}>{text}</p>
      <div className={styles.passRow}>
        <button className={styles.passButton} type="button" onClick={onPass}>
          {isTyping ? "SKIP" : "PASS"}
        </button>
        <span>
          ประโยค {lineNumber}/{lineTotal} - กด PASS หรือ Space
        </span>
      </div>
    </section>
  );
}
