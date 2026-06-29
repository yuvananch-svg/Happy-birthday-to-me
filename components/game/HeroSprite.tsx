import type { Facing, LegPhase } from "@/lib/game/engine/types";
import { withBasePath } from "@/lib/navigation";
import styles from "./hero-sprite.module.css";

const HERO_FRONT_BODY = withBasePath("/prototypes/hero-front-body.png");
const HERO_BACK_BODY = withBasePath("/prototypes/hero-back-body.png");
const HERO_SIDE_BODY = withBasePath("/prototypes/hero-side-body.png");

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
        transform: `translate(-50%, -88%) scale(${counterZoom})`,
        ["--hero-front-body" as string]: `url("${HERO_FRONT_BODY}")`,
        ["--hero-back-body" as string]: `url("${HERO_BACK_BODY}")`,
        ["--hero-side-body" as string]: `url("${HERO_SIDE_BODY}")`
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
