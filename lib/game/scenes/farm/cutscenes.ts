import type { CutsceneLine } from "@/lib/game/scenes/bedroom/cutscenes";

export const AFTER_GARDEN_CUTSCENE: CutsceneLine[] = [
  {
    speaker: "Perthyw",
    meta: "Thanyawee Thanawaritkiat",
    portrait: "hero",
    text: "สตรอเบอรี่... เหมือนตอนเด็กๆ ที่เคยเดินเล่นแถวสวนบนดอยเลย"
  },
  {
    speaker: "ระบบ",
    meta: "Memory Fragment",
    portrait: "system",
    text: "ปลดล็อก Fragment 2/12: สวนผักผลไม้บนดอย",
    hook: "unlock-f2"
  },
  {
    speaker: "ระบบ",
    meta: "Next Memory",
    portrait: "system",
    text: "ถัดไป ลองเดินลงไปทางบ่อน้ำและร้านก๋วยเตี๋ยว"
  }
];

export const F2_MEMORY_CAPTION = [
  "สตรอเบอรี่ลูกเล็กๆ ทำให้ความทรงจำวัยเด็กเริ่มกลับมา",
  "อากาศบนดอย กลิ่นดินหลังฝน และวันที่เคยเดินเล่นในสวนผักผลไม้ของบ้าน"
] as const;

export const AFTER_POND_NOODLE_CUTSCENE: CutsceneLine[] = [
  {
    speaker: "Perthyw",
    meta: "Thanyawee Thanawaritkiat",
    portrait: "hero",
    text: "บ่อน้ำ ร้านก๋วยเตี๋ยว... เหมือนเคยนั่งกินด้วยกันตอนเริ่มเดทใหม่ๆ"
  },
  {
    speaker: "ระบบ",
    meta: "Memory Fragment",
    portrait: "system",
    text: "ปลดล็อก Fragment 3/12: ก๋วยเตี๋ยวริมบ่อน้ำ",
    hook: "unlock-f3"
  },
  {
    speaker: "ระบบ",
    meta: "Next Memory",
    portrait: "system",
    text: "เสียงเหมียวเบาๆ ดังมาจากป่าด้านขวา ลองไปตามหาฟ่อน"
  }
];

export const F3_MEMORY_CAPTION = [
  "ชามก๋วยเตี๋ยวริมบ่อน้ำพาความทรงจำช่วงเริ่มเดทกลับมา",
  "เป็นช่วงธรรมดาๆ แต่กลับชัดมาก เพราะมีคนหนึ่งนั่งอยู่ข้างกัน"
] as const;
