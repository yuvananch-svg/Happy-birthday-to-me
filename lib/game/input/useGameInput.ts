"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { detectsTouchPrimaryInput } from "./detectInputMode";

export type MovementVector = { dx: number; dy: number };

export function useGameInput(options: {
  enabled: boolean;
  onPass: () => void;
  onInteract: () => void;
  modalOpen: boolean;
  cutsceneMode: boolean;
}) {
  const [touchMode, setTouchMode] = useState(false);
  const keysRef = useRef(new Set<string>());
  const joystickRef = useRef<MovementVector>({ dx: 0, dy: 0 });

  useEffect(() => {
    const updateMode = () => {
      const touch = detectsTouchPrimaryInput();
      setTouchMode(touch);
      document.body.classList.toggle("input-touch", touch);
      document.body.classList.toggle("input-keyboard", !touch);
    };

    updateMode();
    window.addEventListener("resize", updateMode);

    return () => {
      window.removeEventListener("resize", updateMode);
      document.body.classList.remove("input-touch", "input-keyboard");
    };
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const key = event.key.toLowerCase();

      if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) {
        keysRef.current.add(key);
        event.preventDefault();
      }

      if (key === " " || key === "enter") {
        event.preventDefault();
        if (options.cutsceneMode) {
          options.onPass();
          return;
        }

        if (options.modalOpen) {
          options.onPass();
          return;
        }

        options.onInteract();
      }

      if (key === "e" && !options.cutsceneMode) {
        event.preventDefault();
        if (options.modalOpen) {
          options.onPass();
        } else {
          options.onInteract();
        }
      }
    }

    function onKeyUp(event: KeyboardEvent) {
      keysRef.current.delete(event.key.toLowerCase());
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [options.cutsceneMode, options.modalOpen, options.onInteract, options.onPass]);

  const getMovementVector = useCallback((): MovementVector => {
    if (!options.enabled) return { dx: 0, dy: 0 };

    let dx = 0;
    let dy = 0;
    const keys = keysRef.current;

    if (keys.has("w") || keys.has("arrowup")) dy -= 1;
    if (keys.has("s") || keys.has("arrowdown")) dy += 1;
    if (keys.has("a") || keys.has("arrowleft")) dx -= 1;
    if (keys.has("d") || keys.has("arrowright")) dx += 1;

    dx += joystickRef.current.dx;
    dy += joystickRef.current.dy;

    return { dx, dy };
  }, [options.enabled]);

  const setJoystickVector = useCallback((vector: MovementVector) => {
    joystickRef.current = vector;
  }, []);

  return {
    touchMode,
    getMovementVector,
    setJoystickVector
  };
}
