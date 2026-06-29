import type { Interactable, Point } from "./types";

export function getNearestInteractable(
  point: Point,
  interactables: Interactable[],
  activeIds: Set<string>
): Interactable | null {
  let nearest: Interactable | null = null;
  let nearestDistance = Infinity;

  for (const interactable of interactables) {
    if (!activeIds.has(interactable.id)) continue;

    const distance = Math.hypot(point.x - interactable.x, point.y - interactable.y);
    if (distance <= interactable.radius && distance < nearestDistance) {
      nearest = interactable;
      nearestDistance = distance;
    }
  }

  return nearest;
}
