export function detectsTouchPrimaryInput() {
  if (typeof window === "undefined") return false;

  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const noHover = window.matchMedia("(hover: none)").matches;
  return coarsePointer || (navigator.maxTouchPoints > 1 && noHover);
}
