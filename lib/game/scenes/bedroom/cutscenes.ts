export type CutscenePortrait = "hero" | "mother" | "system";

export type CutsceneLine = {
  speaker: string;
  meta: string;
  portrait: CutscenePortrait;
  text: string;
  hook?: "hero-awake" | "mother-visible" | "basin-dropped" | "unlock-f1" | "cat-beds-done";
};

export const OPENING_LETTER_PARAGRAPHS = [
  "ถึงเธอ",
  "ถ้าเธอกำลังอ่านจดหมายฉบับนี้อยู่ แปลว่าเธอคงตื่นขึ้นมาแล้ว หลังจากหลับไปนานเพราะอุบัติเหตุประหลาดจากลำไยลูกหนึ่งที่ตกลงมาโดนหัวเธอ",
  "ฉันไม่รู้ว่าตอนนี้เธอยังจำฉันได้ไหม จำเราได้หรือเปล่า หรือจำคนที่เคยรักและคอยอยู่ข้างเธอได้มากแค่ไหน",
  "แต่ไม่เป็นไรนะ ถ้าความทรงจำของเธอกระจัดกระจายหายไประหว่างทาง ก็ขอให้ค่อยๆ เดินตามหามันกลับมาทีละชิ้น",
  "ในโลกใบนี้มีเศษความทรงจำทั้งหมด 12 ชิ้น บางชิ้นอยู่ในบ้าน บางชิ้นอยู่ตามทางที่เธอเคยเดินผ่าน บางชิ้นอยู่กับคนที่รักเธอ และบางชิ้นอยู่ในวันที่เราสองคนเคยผ่านอะไรมาด้วยกัน",
  "เมื่อเธอรวบรวมมันได้ครบ ขอให้มาหาฉันที่สถานที่แห่งความทรงจำของเรา ฉันหวังว่าเมื่อถึงตอนนั้น เธอจะจำได้ว่ามันคือที่ไหน",
  "เพราะฉันจะยังรอเธออยู่ที่นั่น ในเวลาที่พระอาทิตย์ค่อยๆ ลับขอบฟ้า",
  "รักและคิดถึงเสมอ"
] as const;

/** Intro cutscene v3 — synced with opening-intro.mp4 (D1–D11). */
export const INTRO_CUTSCENE: CutsceneLine[] = [
  {
    speaker: "Perthyw",
    meta: "Thanyawee Thanawaritkiat",
    portrait: "hero",
    text: "อืม... ที่นี่ที่ไหนกัน",
    hook: "hero-awake"
  },
  {
    speaker: "Perthyw",
    meta: "Thanyawee Thanawaritkiat",
    portrait: "hero",
    text: "เกิดอะไรขึ้นกับตัวฉัน..."
  },
  {
    speaker: "Perthyw",
    meta: "Thanyawee Thanawaritkiat",
    portrait: "hero",
    text: "ทำไมฉัน... มาอยู่ที่นี่ได้"
  },
  {
    speaker: "แม่",
    meta: "Mother",
    portrait: "mother",
    text: "เฮือก...!! ลูก...",
    hook: "mother-visible"
  },
  {
    speaker: "แม่",
    meta: "Mother",
    portrait: "mother",
    text: "นี่ลูกตะๆ ตื่นแล้วหรอ"
  },
  {
    speaker: "Perthyw",
    meta: "Thanyawee Thanawaritkiat",
    portrait: "hero",
    text: "หือ...? ลูกหรอคะ"
  },
  {
    speaker: "Perthyw",
    meta: "Thanyawee Thanawaritkiat",
    portrait: "hero",
    text: "คุณคือใครกัน... เราเคยเจอกันด้วยหรอคะ"
  },
  {
    speaker: "แม่",
    meta: "Mother",
    portrait: "mother",
    text: "นี่แสดงว่าลูกจำอะไรไม่ได้เลยใช่มั้ย"
  },
  {
    speaker: "Perthyw",
    meta: "Thanyawee Thanawaritkiat",
    portrait: "hero",
    text: "จำหรอคะ หมายความว่ายังไงกัน"
  },
  {
    speaker: "แม่",
    meta: "Mother",
    portrait: "mother",
    text: "ถ้างั้น... แม่คิดว่าให้ลูกลองเดินดูรอบห้องก่อนก็ได้"
  },
  {
    speaker: "แม่",
    meta: "Mother",
    portrait: "mother",
    text: "เผื่อว่ามันจะทำให้ลูกจำอะไรขึ้นมาได้บ้าง"
  }
];

export const AFTER_LETTER_CUTSCENE: CutsceneLine[] = [
  {
    speaker: "Perthyw",
    meta: "Thanyawee Thanawaritkiat",
    portrait: "hero",
    text: "12 เศษความทรงจำ... ถ้ารวบรวมครบ เราอาจจะจำได้ว่าเขารอเราอยู่ที่ไหน"
  },
  {
    speaker: "แม่",
    meta: "Mother",
    portrait: "mother",
    text: "ลองมองรอบๆ ห้องนี้ก่อนนะลูก บางทีความทรงจำแรกอาจอยู่ใกล้กว่าที่คิด"
  }
];

export const REMEMBER_MOTHER_CUTSCENE: CutsceneLine[] = [
  {
    speaker: "Perthyw",
    meta: "Thanyawee Thanawaritkiat",
    portrait: "hero",
    text: "ภาพนี้... แม่ทำกับข้าวให้หนูตั้งแต่เด็กเลยใช่ไหม"
  },
  {
    speaker: "แม่",
    meta: "Mother",
    portrait: "mother",
    text: "ใช่ลูก แม่ทำให้กินบ่อยมาก เพราะลูกชอบทำหน้าดีใจตอนเห็นของกิน"
  },
  {
    speaker: "Perthyw",
    meta: "Thanyawee Thanawaritkiat",
    portrait: "hero",
    text: "หนูเริ่มจำได้แล้ว... แม่คอยดูแลหนูมาตลอดจริงๆ"
  },
  {
    speaker: "ระบบ",
    meta: "Memory Fragment",
    portrait: "system",
    text: "ปลดล็อก Fragment 1/12: ความทรงจำของแม่",
    hook: "unlock-f1"
  },
  {
    speaker: "แม่",
    meta: "Mother",
    portrait: "mother",
    text: "ถ้าพร้อมแล้ว ลองออกไปนอกบ้านนะ ความทรงจำถัดไปอาจอยู่ในสวนผักผลไม้"
  }
];

export const F1_MEMORY_CAPTION = [
  "ภาพในกรอบค่อยๆ ชัดขึ้น",
  "ความทรงจำแรกกลับมาอย่างอ่อนโยน: แม่ที่คอยดูแลตั้งแต่เด็กจนโต",
  "เสียงหนึ่งเหมือนดังขึ้นมาในใจ... “โอ้ยลูกก อันนี้ก็ดังเกิน”"
] as const;

export const FARM_ENTRY_CUTSCENE: CutsceneLine[] = [
  {
    speaker: "Perthyw",
    meta: "Thanyawee Thanawaritkiat",
    portrait: "hero",
    text: "อากาศข้างนอก... คุ้นมาก บ้านบนดอยนี่แหละ"
  },
  {
    speaker: "ระบบ",
    meta: "Memory Farm",
    portrait: "system",
    text: "ออกจากห้องนอนแล้ว — ลองเดินสำรวจสวนผักผลไม้ บ่อน้ำ และป่าเพื่อหา Fragment ถัดไป"
  }
];

export const CAT_BEDS_CUTSCENE: CutsceneLine[] = [
  {
    speaker: "แม่",
    meta: "Mother",
    portrait: "mother",
    text: "ลูกคงได้เห็นแล้วใช่มั้ย ว่าลูกเองก็เลี้ยงแมวด้วย"
  },
  {
    speaker: "Perthyw",
    meta: "Thanyawee Thanawaritkiat",
    portrait: "hero",
    text: "นี่มันอะไรหรอคะ"
  },
  {
    speaker: "แม่",
    meta: "Mother",
    portrait: "mother",
    text: "อ่อ นี่ลูกเจอที่นอนฟูกับฟ่อนแล้วสินะ"
  },
  {
    speaker: "Perthyw",
    meta: "Thanyawee Thanawaritkiat",
    portrait: "hero",
    text: "ฟู ฟ่อน...?"
  },
  {
    speaker: "แม่",
    meta: "Mother",
    portrait: "mother",
    text: "ค่ะ ฟูกับฟ่อนคือแมวที่ลูกเลี้ยงเอาไว้ค่ะ"
  },
  {
    speaker: "Perthyw",
    meta: "Thanyawee Thanawaritkiat",
    portrait: "hero",
    text: "หนูเคยเลี้ยงแมวด้วยหรอคะ"
  },
  {
    speaker: "Perthyw",
    meta: "Thanyawee Thanawaritkiat",
    portrait: "hero",
    text: "ทำไมหนูถึงจำอะไรไม่ได้แบบนี้กันนะ"
  },
  {
    speaker: "แม่",
    meta: "Mother",
    portrait: "mother",
    text: "แม่ว่าลูกอย่าคิดเยอะเลย"
  },
  {
    speaker: "แม่",
    meta: "Mother",
    portrait: "mother",
    text: "ค่อยๆ ตามหาความทรงจำของตัวเองนะคะ"
  },
  {
    speaker: "Perthyw",
    meta: "Thanyawee Thanawaritkiat",
    portrait: "hero",
    text: "อื้อ หนูจะพยายามนะคะ",
    hook: "cat-beds-done"
  }
];
