import { mapPoints } from "@/lib/story/map-graph";
import type { MapPointKey } from "@/lib/story/story-types";
import styles from "./game-components.module.css";

type PixelMapProps = {
  currentPointKey: MapPointKey;
};

export function PixelMap({ currentPointKey }: PixelMapProps) {
  const point = mapPoints[currentPointKey];

  return (
    <div className={styles.screenFrame}>
      <div className={styles.screen}>
        <div className={styles.sky} />
        <div className={styles.map} aria-hidden="true">
          <div className={`${styles.road} ${styles.roadMain}`} />
          <div className={`${styles.road} ${styles.roadAnniversary}`} />
          <div className={`${styles.road} ${styles.roadBirthday}`} />
          <div className={`${styles.road} ${styles.roadChildhood}`} />
          <div className={`${styles.road} ${styles.roadFinal}`} />
          <div className={`${styles.location} ${styles.locationStart}`}>START</div>
          <div className={`${styles.location} ${styles.locationAnniversary}`}>9 JUL</div>
          <div className={`${styles.location} ${styles.locationBirthday}`}>12 JUL</div>
          <div className={`${styles.location} ${styles.locationChildhood}`}>HOME</div>
          <div className={`${styles.location} ${styles.locationFinal}`}>GATE</div>
          <div
            className={styles.hero}
            style={{ "--x": point.x, "--y": point.y } as React.CSSProperties}
          >
            <span className={styles.heroHair} />
            <span className={styles.heroFace} />
            <span className={styles.heroBody} />
            <span className={styles.heroShadow} />
          </div>
        </div>
      </div>
    </div>
  );
}
