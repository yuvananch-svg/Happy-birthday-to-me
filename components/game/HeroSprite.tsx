import type { Facing, LegPhase } from "@/lib/game/engine/types";
import styles from "./hero-sprite.module.css";

type HeroSpriteProps = {
  x: number;
  y: number;
  facing: Facing;
  legPhase: LegPhase;
  moving: boolean;
  counterZoom: number;
};

export function HeroSprite({ x, y, facing, legPhase, moving, counterZoom }: HeroSpriteProps) {
  return (
    <div
      className={`${styles.hero} ${moving ? styles.walking : ""}`}
      style={{
        left: x,
        top: y,
        transform: `translate(-50%, -88%) scale(${counterZoom})`
      }}
      data-facing={facing}
      data-leg={legPhase}
      aria-label="player character"
    >
      <div className={styles.heroShadow} />
      <div className={`${styles.heroLeg} ${styles.heroLegLeft}`} />
      <div className={`${styles.heroLeg} ${styles.heroLegRight}`} />
      <div className={styles.heroSprite} aria-hidden="true" />
    </div>
  );
}
