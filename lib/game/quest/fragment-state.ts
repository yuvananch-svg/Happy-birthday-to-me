export const FRAGMENT_NAMES: Record<number, string> = {
  1: "F1 จำแม่ได้",
  2: "F2 สวนผักผลไม้บนดอย",
  3: "F3 ก๋วยเตี๋ยวริมบ่อน้ำ",
  4: "F4 ฟ่อนกับรูปแรกๆ",
  5: "F5 ฟูกับของเล่น/อาหาร"
};

export const TOTAL_FRAGMENTS = 12;

export function hasFragment(fragments: number[], id: number) {
  return fragments.includes(id);
}

export function unlockFragment(fragments: number[], id: number) {
  if (fragments.includes(id)) return fragments;
  return [...fragments, id].sort((a, b) => a - b);
}

export function getFragmentName(id: number) {
  return FRAGMENT_NAMES[id] ?? `F${id}`;
}
