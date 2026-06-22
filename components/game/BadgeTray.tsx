import type { Badge } from "@/lib/story/game-reducer";
import styles from "./game-components.module.css";

type BadgeTrayProps = {
  badges: Badge[];
};

export function BadgeTray({ badges }: BadgeTrayProps) {
  if (badges.length === 0) return null;

  return (
    <div className={styles.badgeTray} aria-label="earned badges">
      {badges.map((badge) => (
        <span className={styles.badge} key={badge.id}>
          {badge.label}
        </span>
      ))}
    </div>
  );
}
