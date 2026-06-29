import styles from "./game-components.module.css";

type DialogueBoxProps = {
  speaker: string;
  chapter: string;
  text: string;
};

export function DialogueBox({ speaker, chapter, text }: DialogueBoxProps) {
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
    </section>
  );
}
