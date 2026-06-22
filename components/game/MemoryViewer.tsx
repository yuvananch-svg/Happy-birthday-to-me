import type { MemoryMedia } from "@/lib/story/story-types";
import styles from "./game-components.module.css";

type MemoryViewerProps = {
  media: MemoryMedia[];
};

export function MemoryViewer({ media }: MemoryViewerProps) {
  if (media.length === 0) {
    return (
      <section className={styles.mediaViewer} aria-label="memory viewer">
        <div className={styles.mediaFrame}>ยังไม่มี memory ในฉากนี้</div>
      </section>
    );
  }

  return (
    <section className={styles.mediaViewer} aria-label="memory viewer">
      {media.map((item, index) => {
        if (item.type === "image") {
          return (
            <figure className={styles.mediaFrame} key={`${item.src}-${index}`}>
              <img src={item.src} alt={item.alt} />
              {item.caption ? <figcaption>{item.caption}</figcaption> : null}
            </figure>
          );
        }

        if (item.type === "gallery") {
          return (
            <div className={styles.mediaFrame} key={`gallery-${index}`}>
              {item.items.map((galleryItem) => (
                <figure key={galleryItem.src}>
                  <img src={galleryItem.src} alt={galleryItem.alt} />
                  {galleryItem.caption ? <figcaption>{galleryItem.caption}</figcaption> : null}
                </figure>
              ))}
            </div>
          );
        }

        return (
          <figure className={styles.mediaFrame} key={`${item.src}-${index}`}>
            <video controls playsInline preload="metadata" poster={item.poster}>
              <source src={item.src} type="video/mp4" />
            </video>
            {item.caption ? <figcaption>{item.caption}</figcaption> : null}
          </figure>
        );
      })}
    </section>
  );
}
