import type { Interactable } from "@/lib/game/engine/types";
import { F1_PHOTO_FRAME } from "@/lib/game/scenes/bedroom/assets";

export type BedroomInteractableId = "letter" | "photo" | "door" | "cat-beds";

export type BedroomInteractable = Interactable & {
  hotspotLabel: string;
  hotspotWidth?: number;
  hotspotHeight?: number;
};

/** Positions from `bedroom-demo.js` — aligned with production scene image. */
export const BEDROOM_INTERACTABLES: BedroomInteractable[] = [
  {
    id: "letter",
    label: "จดหมายจากคนที่รออยู่",
    hotspotLabel: "จดหมาย",
    x: 2560,
    y: 630,
    radius: 170,
    hotspotWidth: 190,
    hotspotHeight: 110
  },
  {
    id: "photo",
    label: "กรอบรูปเบลอ",
    hotspotLabel: "Memory",
    x: F1_PHOTO_FRAME.interactX,
    y: F1_PHOTO_FRAME.interactY,
    radius: F1_PHOTO_FRAME.interactRadius
  },
  {
    id: "door",
    label: "ประตูออกจากห้อง",
    hotspotLabel: "ประตู",
    x: 1920,
    y: 2110,
    radius: 200,
    hotspotWidth: 320,
    hotspotHeight: 72
  },
  {
    id: "cat-beds",
    label: "เตียงนอนแมวของฟูกับฟ่อน",
    hotspotLabel: "เตียงแมว",
    x: 2600,
    y: 1692,
    radius: 280
  }
];

export function getBedroomInteractable(id: BedroomInteractableId) {
  const item = BEDROOM_INTERACTABLES.find((entry) => entry.id === id);
  if (!item) throw new Error(`Unknown interactable: ${id}`);
  return item;
}
