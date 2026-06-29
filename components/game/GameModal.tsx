import type { ReactNode } from "react";
import Image from "next/image";
import {
  F1_MEMORY_CAPTION,
  OPENING_LETTER_PARAGRAPHS
} from "@/lib/game/scenes/bedroom/cutscenes";
import { MOTHER_F1_MEMORY_IMAGE } from "@/lib/game/scenes/bedroom/assets";
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

  if (modal.type === "memory") {
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
