import type { Interactable } from "@/lib/game/engine/types";

export type FarmInteractableId = "strawberry" | "noodle-shop";

export type FarmInteractable = Interactable & {
  hotspotLabel: string;
  hotspotWidth?: number;
  hotspotHeight?: number;
};

/**
 * Strawberry in the fruit garden on `farm-outdoor.png` (6336×2688).
 * Scaled from opening-demo outdoor coords (274, 256) on 960×540 — tune if hotspot drifts.
 */
export const FARM_INTERACTABLES: FarmInteractable[] = [
  {
    id: "strawberry",
    label: "สตรอเบอร์พิเศษในสวน",
    hotspotLabel: "สตรอเบอรี่",
    x: 1810,
    y: 1270,
    radius: 170,
    hotspotWidth: 112,
    hotspotHeight: 48
  },
  {
    id: "noodle-shop",
    label: "ร้านก๋วยเตี๋ยวริมบ่อน้ำ",
    hotspotLabel: "ร้านก๋วยเตี๋ยว",
    x: 2760,
    y: 1345,
    radius: 170,
    hotspotWidth: 88,
    hotspotHeight: 56
  }
];

export function getActiveFarmInteractableIds(
  phase: string,
  fragments: number[]
): Set<FarmInteractableId> {
  const ids = new Set<FarmInteractableId>();

  if (phase === "garden-strawberry" && !fragments.includes(2)) {
    ids.add("strawberry");
  }

  if (phase === "pond-noodle" && !fragments.includes(3)) {
    ids.add("noodle-shop");
  }

  return ids;
}
