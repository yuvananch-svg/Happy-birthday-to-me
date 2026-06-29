import { TOTAL_FRAGMENTS, getFragmentName } from "@/lib/game/quest/fragment-state";
import styles from "./quest-sidebar.module.css";

type QuestSidebarProps = {
  currentQuest: string;
  nextTeasers: string[];
  fragments: number[];
  onReplayFragment: (fragmentId: number) => void;
};

export function QuestSidebar({
  currentQuest,
  nextTeasers,
  fragments,
  onReplayFragment
}: QuestSidebarProps) {
  return (
    <aside className={styles.sidebar} aria-label="Quest timeline">
      <p className={styles.fragmentCount}>
        Memory {fragments.length}/{TOTAL_FRAGMENTS}
      </p>

      <section className={styles.section}>
        <h2>Current Quest</h2>
        <p className={styles.currentQuest}>{currentQuest}</p>
      </section>

      <section className={styles.section}>
        <h2>Next</h2>
        <ul className={styles.teaserList}>
          {nextTeasers.map((item, index) => (
            <li key={`teaser-${index}`}>{item}</li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2>Completed</h2>
        <ul className={styles.completedList}>
          {fragments.length === 0 ? (
            <li className={styles.empty}>ยังไม่มี memory ที่ปลดล็อก</li>
          ) : (
            fragments.map((id) => (
              <li key={id}>
                <button type="button" className={styles.replayButton} onClick={() => onReplayFragment(id)}>
                  {getFragmentName(id)}
                </button>
              </li>
            ))
          )}
        </ul>
      </section>
    </aside>
  );
}
