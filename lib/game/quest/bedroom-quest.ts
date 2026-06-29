import type { BedroomInteractableId } from "@/lib/game/scenes/bedroom/interactables";

export type BedroomPhase = "intro" | "find-letter" | "find-photo" | "go-door" | "farm-explore";

export function getActiveInteractableIds(
  phase: BedroomPhase,
  letterRead: boolean,
  fragments: number[],
  doorInteracted: boolean,
  catBedsTalked: boolean
): Set<BedroomInteractableId> {
  const ids = new Set<BedroomInteractableId>();

  if (phase === "intro") return ids;

  if (!catBedsTalked) {
    ids.add("cat-beds");
  }

  if (phase === "find-letter" && !letterRead) {
    ids.add("letter");
  }

  if (phase === "find-photo" && !fragments.includes(1)) {
    ids.add("photo");
  }

  if (phase === "go-door" && !doorInteracted) {
    ids.add("door");
  }

  return ids;
}

export function getCurrentQuestText(phase: BedroomPhase, letterRead: boolean, fragments: number[]) {
  if (phase === "intro") return "ตื่นขึ้นมาในห้องที่ไม่คุ้นเคย";
  if (phase === "find-letter" && !letterRead) return "สำรวจห้อง — ใช้ WASD / Arrow เดิน";
  if (phase === "find-photo" && !fragments.includes(1)) {
    return "สำรวจกรอบรูปเบลอในห้อง เพื่อจำแม่ให้ได้";
  }
  if (phase === "go-door") return "เดินไปที่ประตูด้านล่างเพื่อออกจากห้อง";
  if (phase === "farm-explore") return "สำรวจ Memory Farm — เดินหา Fragment ถัดไป";
  if (letterRead && fragments.includes(1)) return "สำรวจ Memory Farm";
  return "สำรวจ Memory Farm";
}

export function getNextQuestTeasers(phase: BedroomPhase): string[] {
  if (phase === "intro" || phase === "find-letter" || phase === "find-photo") {
    return ["???", "???"];
  }

  if (phase === "go-door" || phase === "farm-explore") {
    return ["สวนผักผลไม้บนดอย", "บ่อน้ำกับร้านก๋วยเตี๋ยว"];
  }

  return ["???", "???"];
}

export function getInteractionHint(options: {
  phase: BedroomPhase;
  mode: "cutscene" | "explore";
  modalOpen: boolean;
  nearestLabel: string | null;
  touchMode: boolean;
}) {
  if (options.modalOpen) return "ปิด popup เพื่อเล่นต่อ";

  if (options.mode === "cutscene") {
    return "Next > / Space เพื่ออ่านประโยคถัดไป";
  }

  if (options.nearestLabel) {
    const action = options.touchMode ? "กด INTERACT" : "กด E หรือ PASS";
    return `${action}: ${options.nearestLabel}`;
  }

  return options.touchMode
    ? "ใช้ joystick เดินหา object ที่มีแสง และกด INTERACT"
    : "เดินด้วย WASD / Arrow แล้วกด E เมื่ออยู่ใกล้ object ที่มีแสง";
}
