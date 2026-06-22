import type { JournalEntry } from "@/lib/story/game-reducer";
import styles from "./game-components.module.css";

type JournalLogProps = {
  entries: JournalEntry[];
};

export function JournalLog({ entries }: JournalLogProps) {
  return (
    <aside className={styles.journal} aria-label="story journal">
      <h2>Journey Log</h2>
      <ol>
        {entries.map((entry) => (
          <li key={entry.id}>{entry.text}</li>
        ))}
      </ol>
    </aside>
  );
}
