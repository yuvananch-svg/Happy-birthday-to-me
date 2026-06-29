"use client";

import { useCallback, useRef } from "react";
import styles from "./touch-controls.module.css";

type TouchControlsProps = {
  visible: boolean;
  onInteract: () => void;
  onJoystickChange: (vector: { dx: number; dy: number }) => void;
};

export function TouchControls({ visible, onInteract, onJoystickChange }: TouchControlsProps) {
  const joystickRef = useRef<HTMLDivElement>(null);

  const resetJoystick = useCallback(() => {
    onJoystickChange({ dx: 0, dy: 0 });
    const stick = joystickRef.current?.querySelector(`.${styles.stick}`) as HTMLElement | null;
    if (stick) stick.style.transform = "translate(-50%, -50%)";
  }, [onJoystickChange]);

  const setJoystickFromPointer = useCallback(
    (event: React.PointerEvent) => {
      const joystick = joystickRef.current;
      if (!joystick) return;

      const rect = joystick.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const max = rect.width * 0.34;
      const dx = Math.max(-max, Math.min(max, event.clientX - centerX));
      const dy = Math.max(-max, Math.min(max, event.clientY - centerY));

      onJoystickChange({ dx: dx / max, dy: dy / max });

      const stick = joystick.querySelector(`.${styles.stick}`) as HTMLElement | null;
      if (stick) {
        stick.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
      }
    },
    [onJoystickChange]
  );

  if (!visible) return null;

  return (
    <>
      <div
        ref={joystickRef}
        className={styles.joystick}
        aria-hidden="true"
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setJoystickFromPointer(event);
        }}
        onPointerMove={(event) => {
          if (event.buttons > 0) setJoystickFromPointer(event);
        }}
        onPointerUp={resetJoystick}
        onPointerCancel={resetJoystick}
      >
        <div className={styles.stick} />
      </div>
      <button type="button" className={styles.interact} onClick={onInteract}>
        INTERACT
      </button>
    </>
  );
}
