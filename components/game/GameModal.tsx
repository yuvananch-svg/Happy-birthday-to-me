import type { ReactNode } from "react";
import Image from "next/image";
import {
  F1_MEMORY_CAPTION,
  OPENING_LETTER_PARAGRAPHS
} from "@/lib/game/scenes/bedroom/cutscenes";
import { MOTHER_F1_MEMORY_IMAGE } from "@/lib/game/scenes/bedroom/assets";
import { F2_MEMORY_CAPTION, F3_MEMORY_CAPTION } from "@/lib/game/scenes/farm/cutscenes";
import { getFragmentName } from "@/lib/game/quest/fragment-state";
import type { ModalState } from "@/lib/game/bedroom-reducer";
import styles from "./game-modal.module.css";

type GameModalProps = {
  modal: ModalState;
  onClose: () => void;
};

export function GameModal({ modal, onClose }: GameModalProps) {
  if (!modal) return null;

  if (modal.type === "letter") {
    return (
      <ModalShell title="จดหมายจากคนที่รออยู่" onClose={onClose}>
        {OPENING_LETTER_PARAGRAPHS.map((paragraph) => (
          <p key={paragraph}>{paragraph === "รักและคิดถึงเสมอ" ? <strong>{paragraph}</strong> : paragraph}</p>
        ))}
      </ModalShell>
    );
  }

  if (modal.type === "memory" && modal.fragmentId === 1) {
    return (
      <ModalShell title="Fragment 1: ความทรงจำของแม่" onClose={onClose}>
        <div className={styles.memoryPhoto}>
          <Image
            src={MOTHER_F1_MEMORY_IMAGE}
            alt="ความทรงจำของแม่"
            width={640}
            height={640}
            className={styles.memoryImage}
          />
        </div>
        {F1_MEMORY_CAPTION.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </ModalShell>
    );
  }

  if (modal.type === "memory" && modal.fragmentId === 2) {
    return (
      <ModalShell title="Fragment 2: สวนผักผลไม้บนดอย" onClose={onClose}>
        <div className={styles.memoryPlaceholder}>
          <p>
            <strong>รูปสวนผลไม้จริงจะใส่ที่นี่ภายหลัง</strong>
          </p>
        </div>
        {F2_MEMORY_CAPTION.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </ModalShell>
    );
  }

  if (modal.type === "memory" && modal.fragmentId === 3) {
    return (
      <ModalShell title="Fragment 3: ก๋วยเตี๋ยวริมบ่อน้ำ" onClose={onClose}>
        <div className={styles.memoryPlaceholder}>
          <p>
            <strong>รูปเดทกินก๋วยเตี๋ยวริมบ่อน้ำจริงจะใส่ที่นี่ภายหลัง</strong>
          </p>
        </div>
        {F3_MEMORY_CAPTION.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </ModalShell>
    );
  }

  if (modal.type === "memory") {
    return (
      <ModalShell title={getFragmentName(modal.fragmentId)} onClose={onClose}>
        <p>ความทรงจำนี้ยังไม่พร้อมในเวอร์ชันนี้</p>
      </ModalShell>
    );
  }

  return null;
}

function ModalShell({
  title,
  onClose,
  children
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true" aria-labelledby="game-modal-title">
      <article className={styles.card}>
        <button type="button" className={styles.close} onClick={onClose} aria-label="close">
          ×
        </button>
        <h2 id="game-modal-title">{title}</h2>
        <div className={styles.body}>{children}</div>
      </article>
    </div>
  );
}
