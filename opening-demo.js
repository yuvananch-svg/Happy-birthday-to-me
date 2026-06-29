const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext("2d");

const fragmentCount = document.querySelector("#fragmentCount");
const controlMode = document.querySelector("#controlMode");
const interactionChip = document.querySelector("#interactionChip");
const speakerPortrait = document.querySelector("#speakerPortrait");
const speakerName = document.querySelector("#speakerName");
const speakerMeta = document.querySelector("#speakerMeta");
const dialogueText = document.querySelector("#dialogueText");
const passButton = document.querySelector("#passButton");
const currentQuest = document.querySelector("#currentQuest");
const completedList = document.querySelector("#completedList");
const nextQuestList = document.querySelector("#nextQuestList");
const modalBackdrop = document.querySelector("#modalBackdrop");
const modalTitle = document.querySelector("#modalTitle");
const modalBody = document.querySelector("#modalBody");
const modalClose = document.querySelector("#modalClose");
const joystick = document.querySelector("#joystick");
const joystickStick = document.querySelector("#joystickStick");
const touchInteract = document.querySelector("#touchInteract");

const BASE_WIDTH = 960;
const BASE_HEIGHT = 540;
const PLAYER_SPEED = 142;

const keys = new Set();
const joystickVector = { x: 0, y: 0 };
const view = { scale: 1, x: 0, y: 0, width: BASE_WIDTH, height: BASE_HEIGHT };

const player = {
  x: 318,
  y: 315,
  width: 28,
  height: 36,
  facing: "down",
  stepTime: 0
};

const mother = {
  x: 744,
  y: 315,
  visible: false,
  facing: "left"
};

const cats = {
  fon: {
    name: "ฟ่อน",
    x: 676,
    y: 258,
    mode: "sleep",
    visible: false,
    leadDone: false,
    color: "#e8c08d",
    accent: "#7b5638",
    followOffset: { x: -38, y: 36 },
    leadTarget: { x: 616, y: 176 }
  },
  foo: {
    name: "ฟู",
    x: 842,
    y: 238,
    mode: "hidden",
    visible: false,
    leadDone: false,
    color: "#a7a0a0",
    accent: "#353334",
    followOffset: { x: 38, y: 38 },
    leadTarget: { x: 790, y: 154 }
  }
};

const state = {
  scene: "bedroom",
  mode: "cutscene",
  phase: "intro",
  queue: [],
  queueIndex: 0,
  dialogue: null,
  heroAwake: false,
  motherVisible: false,
  basinDropped: false,
  letterRead: false,
  modalType: null,
  pendingAfterModal: null,
  pendingPhase: null,
  nearestInteractable: null,
  touchControlsEnabled: false,
  fragments: new Set(),
  inventory: new Set()
};

const fragmentNames = {
  1: "F1 จำแม่ได้",
  2: "F2 สวนผักผลไม้บนดอย",
  3: "F3 ก๋วยเตี๋ยวริมบ่อน้ำ",
  4: "F4 ฟ่อนกับรูปแรกๆ",
  5: "F5 ฟูกับของเล่น/อาหาร"
};

const bedroomColliders = [
  { id: "top-wall", x: 0, y: 0, w: BASE_WIDTH, h: 98 },
  { id: "left-wall", x: 0, y: 0, w: 36, h: BASE_HEIGHT },
  { id: "right-wall", x: BASE_WIDTH - 36, y: 0, w: 36, h: BASE_HEIGHT },
  { id: "bottom-wall-left", x: 0, y: BASE_HEIGHT - 38, w: 776, h: 38 },
  { id: "bottom-wall-right", x: 872, y: BASE_HEIGHT - 38, w: 88, h: 38 },
  { id: "bed", x: 84, y: 168, w: 196, h: 136 },
  { id: "bedside", x: 294, y: 160, w: 62, h: 64 },
  { id: "wardrobe", x: 64, y: 334, w: 118, h: 146 },
  { id: "desk", x: 610, y: 112, w: 178, h: 76 },
  { id: "cat-bed-a", x: 638, y: 388, w: 70, h: 50 },
  { id: "cat-bed-b", x: 720, y: 390, w: 72, h: 48 }
];

const outdoorColliders = [
  { id: "left-edge", x: 0, y: 0, w: 28, h: BASE_HEIGHT },
  { id: "right-edge", x: BASE_WIDTH - 28, y: 0, w: 28, h: BASE_HEIGHT },
  { id: "top-edge", x: 0, y: 0, w: BASE_WIDTH, h: 34 },
  { id: "bottom-edge", x: 0, y: BASE_HEIGHT - 28, w: BASE_WIDTH, h: 28 },
  { id: "house", x: 50, y: 150, w: 132, h: 114 },
  { id: "pond", x: 370, y: 338, w: 210, h: 120 },
  { id: "noodle-shop", x: 390, y: 258, w: 148, h: 74 },
  { id: "forest-rock", x: 850, y: 350, w: 46, h: 30 },
  { id: "tree-a", x: 712, y: 80, w: 42, h: 44 },
  { id: "tree-b", x: 842, y: 80, w: 42, h: 44 },
  { id: "tree-c", x: 824, y: 322, w: 42, h: 42 }
];

const interactables = [
  {
    id: "letter",
    label: "จดหมาย",
    x: 310,
    y: 148,
    w: 52,
    h: 42,
    scene: "bedroom",
    active: () => state.phase === "find-letter" && !state.letterRead,
    interact: () => openLetter()
  },
  {
    id: "photo",
    label: "กรอบรูป",
    x: 804,
    y: 138,
    w: 78,
    h: 64,
    scene: "bedroom",
    active: () => state.phase === "find-photo" && !state.fragments.has(1),
    interact: () => openMotherMemory()
  },
  {
    id: "door",
    label: "ประตู",
    x: 792,
    y: 486,
    w: 86,
    h: 54,
    scene: "bedroom",
    active: () => state.phase === "go-door",
    interact: () => enterOutdoorMap()
  },
  {
    id: "strawberry",
    label: "สตรอเบอรี่",
    x: 274,
    y: 256,
    w: 54,
    h: 44,
    scene: "outdoor",
    active: () => state.phase === "garden-strawberry" && !state.fragments.has(2),
    interact: () => openGardenMemory()
  },
  {
    id: "noodle",
    label: "ร้านก๋วยเตี๋ยว",
    x: 418,
    y: 270,
    w: 88,
    h: 56,
    scene: "outdoor",
    active: () => state.phase === "pond-noodle" && !state.fragments.has(3),
    interact: () => openNoodleMemory()
  },
  {
    id: "fon",
    label: "ฟ่อน",
    x: 652,
    y: 232,
    w: 54,
    h: 42,
    scene: "outdoor",
    active: () => state.phase === "find-fon" && cats.fon.visible && cats.fon.mode === "sleep",
    interact: () => meetFon()
  },
  {
    id: "fon-photo",
    label: "รูปฟ่อน",
    x: 594,
    y: 150,
    w: 64,
    h: 52,
    scene: "outdoor",
    active: () => state.phase === "follow-fon-photo" && cats.fon.leadDone && !state.fragments.has(4),
    interact: () => openFonMemory()
  },
  {
    id: "cat-food",
    label: "อาหารแมว",
    x: 738,
    y: 330,
    w: 48,
    h: 42,
    scene: "outdoor",
    active: () => state.phase === "collect-foo-items" && !state.inventory.has("cat-food"),
    interact: () => collectFooItem("cat-food")
  },
  {
    id: "cat-toy",
    label: "ของเล่น",
    x: 846,
    y: 196,
    w: 44,
    h: 42,
    scene: "outdoor",
    active: () => state.phase === "collect-foo-items" && !state.inventory.has("cat-toy"),
    interact: () => collectFooItem("cat-toy")
  },
  {
    id: "foo-photo",
    label: "รูปฟู",
    x: 768,
    y: 128,
    w: 64,
    h: 52,
    scene: "outdoor",
    active: () => state.phase === "follow-foo-photo" && cats.foo.leadDone && !state.fragments.has(5),
    interact: () => openFooMemory()
  }
];

const introCutscene = [
  {
    speaker: "Perthyw",
    meta: "Thanyawee Thanawaritkiat",
    portrait: "hero",
    text: "อืม... ที่นี่ที่ไหนกัน ทำไมเราจำอะไรไม่ได้เลย",
    onStart: () => {
      state.heroAwake = true;
    }
  },
  {
    speaker: "แม่",
    meta: "Mother",
    portrait: "mother",
    text: "ลูก... ตื่นแล้วเหรอ",
    onStart: () => {
      state.motherVisible = true;
      mother.x = 754;
      mother.y = 315;
    }
  },
  {
    speaker: "แม่",
    meta: "Mother",
    portrait: "mother",
    text: "แม่ตั้งใจจะมาเช็ดตัวให้ เห็นลูกตื่นแบบนี้แม่ตกใจหมดเลย",
    onStart: () => {
      state.basinDropped = true;
    }
  },
  {
    speaker: "Perthyw",
    meta: "Thanyawee Thanawaritkiat",
    portrait: "hero",
    text: "แม่... เหรอคะ ขอโทษนะ หนูจำอะไรไม่ได้จริงๆ"
  },
  {
    speaker: "แม่",
    meta: "Mother",
    portrait: "mother",
    text: "ไม่เป็นไรลูก ค่อยๆ หายใจนะ แม่อยู่ตรงนี้แล้ว"
  },
  {
    speaker: "แม่",
    meta: "Mother",
    portrait: "mother",
    text: "ดื่มน้ำก่อน จะได้ใจเย็นขึ้น"
  },
  {
    speaker: "Perthyw",
    meta: "Thanyawee Thanawaritkiat",
    portrait: "hero",
    text: "อึก... เอิ้ก!"
  },
  {
    speaker: "แม่",
    meta: "Mother",
    portrait: "mother",
    text: "โอ้ยลูกก อันนี้ก็ดังเกิน"
  },
  {
    speaker: "แม่",
    meta: "Mother",
    portrait: "mother",
    text: "ลูก...มีคนเขียนจดหมายมาให้ลูกด้วย เดี๋ยวลูกลองดูนะ วางอยู่ตรงโต๊ะข้างเตียง"
  }
];

const afterLetterCutscene = [
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

const rememberMotherCutscene = [
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
    onStart: () => addFragment(1)
  },
  {
    speaker: "แม่",
    meta: "Mother",
    portrait: "mother",
    text: "ถ้าพร้อมแล้ว ลองออกไปนอกบ้านนะ ความทรงจำถัดไปอาจอยู่ในสวนผักผลไม้"
  }
];

const outdoorIntroCutscene = [
  {
    speaker: "ระบบ",
    meta: "Memory Farm",
    portrait: "system",
    text: "เดโม่ต่อไปนี้คือ mini-map ย่อ: สวนผักผลไม้ บ่อน้ำ และป่าที่มีฟ่อนกับฟู"
  },
  {
    speaker: "Perthyw",
    meta: "Thanyawee Thanawaritkiat",
    portrait: "hero",
    text: "เริ่มจากสวนผักผลไม้ก่อนแล้วกัน... บางอย่างตรงนั้นดูคุ้นมาก"
  }
];

const afterGardenCutscene = [
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
    onStart: () => addFragment(2)
  },
  {
    speaker: "ระบบ",
    meta: "Next Memory",
    portrait: "system",
    text: "ถัดไป ลองเดินลงไปทางบ่อน้ำและร้านก๋วยเตี๋ยว"
  }
];

const afterNoodleCutscene = [
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
    onStart: () => addFragment(3)
  },
  {
    speaker: "ระบบ",
    meta: "Next Memory",
    portrait: "system",
    text: "เสียงเหมียวเบาๆ ดังมาจากป่าด้านขวา ลองไปตามหาฟ่อน"
  }
];

const meetFonCutscene = [
  {
    speaker: "ฟ่อน",
    meta: "Cat",
    portrait: "cat",
    text: "เหมียว... (สวัสดี)"
  },
  {
    speaker: "Perthyw",
    meta: "Thanyawee Thanawaritkiat",
    portrait: "hero",
    text: "ฟ่อนเหรอ... ทำไมเรารู้สึกว่าต้องรู้จักกันมาก่อน"
  },
  {
    speaker: "ฟ่อน",
    meta: "Cat",
    portrait: "cat",
    text: "เหมียว เหมียว... (ตามมาสิ เดี๋ยวพาไปดูบางอย่าง)",
    onStart: () => {
      cats.fon.mode = "leading";
    }
  }
];

const afterFonMemoryCutscene = [
  {
    speaker: "Perthyw",
    meta: "Thanyawee Thanawaritkiat",
    portrait: "hero",
    text: "รูปนี้... ตอนรับฟ่อนมาเลี้ยงใหม่ๆ ฟ่อนยังตัวเล็กมากเลย"
  },
  {
    speaker: "ฟ่อน",
    meta: "Cat",
    portrait: "cat",
    text: "เหมียว... (จำได้แล้วใช่ไหม)"
  },
  {
    speaker: "ระบบ",
    meta: "Memory Fragment",
    portrait: "system",
    text: "ปลดล็อก Fragment 4/12: รูปแรกๆ ของฟ่อน",
    onStart: () => {
      addFragment(4);
      cats.fon.mode = "follow";
    }
  },
  {
    speaker: "ระบบ",
    meta: "Next Memory",
    portrait: "system",
    text: "ฟ่อนจะเดินตามคุณแล้ว ต่อไปต้องหาอาหารแมวและของเล่น เพื่อเรียกฟูออกมา"
  }
];

const itemCollectedCutscene = [
  {
    speaker: "ระบบ",
    meta: "Inventory",
    portrait: "system",
    text: "เก็บของสำหรับฟูแล้ว ยังต้องหาอีกชิ้นหนึ่ง"
  }
];

const fooAppearsCutscene = [
  {
    speaker: "ระบบ",
    meta: "Forest",
    portrait: "system",
    text: "เมื่อของครบ พุ่มหญ้าขยับแรงขึ้น แล้วฟูก็กระโดดออกมา"
  },
  {
    speaker: "ฟู",
    meta: "Cat",
    portrait: "cat",
    text: "เหมียว! (กว่าจะมาได้นะ)"
  },
  {
    speaker: "Perthyw",
    meta: "Thanyawee Thanawaritkiat",
    portrait: "hero",
    text: "ฟู... ถ้ามีฟู มีฟ่อน งั้นเราคงมีความทรงจำสำคัญกับทั้งสองตัวแน่ๆ"
  },
  {
    speaker: "ฟู",
    meta: "Cat",
    portrait: "cat",
    text: "เหมียว... (ตามมา เดี๋ยวพาไปดู)",
    onStart: () => {
      cats.foo.mode = "leading";
    }
  }
];

const afterFooMemoryCutscene = [
  {
    speaker: "Perthyw",
    meta: "Thanyawee Thanawaritkiat",
    portrait: "hero",
    text: "นี่คือรูปที่มีเรากับฟู... และตอนนี้ก็มีฟ่อนเดินอยู่ข้างๆ ด้วย"
  },
  {
    speaker: "ระบบ",
    meta: "Memory Fragment",
    portrait: "system",
    text: "ปลดล็อก Fragment 5/12: ฟูและฟ่อนกลับมาเดินข้างกัน",
    onStart: () => {
      addFragment(5);
      cats.foo.mode = "follow";
    }
  },
  {
    speaker: "ระบบ",
    meta: "Demo Checkpoint",
    portrait: "system",
    text: "เดโม่ถึงส่วนฟูจบแล้ว ในเกมเต็ม ต่อจากนี้จะเดินขึ้นเขาไปยังแคมป์ Fragment 6"
  }
];

function detectsTouchPrimaryInput() {
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const noHover = window.matchMedia("(hover: none)").matches;
  return coarsePointer || (navigator.maxTouchPoints > 1 && noHover);
}

function setInputMode() {
  state.touchControlsEnabled = detectsTouchPrimaryInput();
  document.body.classList.toggle("input-touch", state.touchControlsEnabled);
  document.body.classList.toggle("input-keyboard", !state.touchControlsEnabled);
  controlMode.textContent = state.touchControlsEnabled ? "Touch joystick" : "WASD / Arrow + E";
  if (!state.touchControlsEnabled) resetJoystick();
}

function resize() {
  const bounds = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(320, Math.floor(bounds.width * dpr));
  canvas.height = Math.max(240, Math.floor(bounds.height * dpr));
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  view.width = bounds.width;
  view.height = bounds.height;
  view.scale = Math.min(bounds.width / BASE_WIDTH, bounds.height / BASE_HEIGHT);
  view.x = (bounds.width - BASE_WIDTH * view.scale) / 2;
  view.y = (bounds.height - BASE_HEIGHT * view.scale) / 2;
}

function addFragment(fragmentId) {
  state.fragments.add(fragmentId);
}

function currentColliders() {
  return state.scene === "bedroom" ? bedroomColliders : outdoorColliders;
}

function overlaps(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function playerBounds(x = player.x, y = player.y) {
  return {
    x: x - player.width / 2,
    y: y - player.height / 2 + 12,
    w: player.width,
    h: player.height - 10
  };
}

function canMoveTo(x, y) {
  const bounds = playerBounds(x, y);
  if (bounds.x < 28 || bounds.y < 28 || bounds.x + bounds.w > BASE_WIDTH - 28 || bounds.y + bounds.h > BASE_HEIGHT - 24) {
    return false;
  }
  return !currentColliders().some((collider) => overlaps(bounds, collider));
}

function movePlayer(deltaSeconds) {
  if (state.mode !== "explore" || state.modalType) {
    player.stepTime = 0;
    return;
  }

  let dx = 0;
  let dy = 0;

  if (keys.has("w") || keys.has("arrowup")) dy -= 1;
  if (keys.has("s") || keys.has("arrowdown")) dy += 1;
  if (keys.has("a") || keys.has("arrowleft")) dx -= 1;
  if (keys.has("d") || keys.has("arrowright")) dx += 1;

  dx += joystickVector.x;
  dy += joystickVector.y;

  const length = Math.hypot(dx, dy);
  if (length > 0) {
    dx /= length;
    dy /= length;
    player.stepTime += deltaSeconds * 9;
    player.facing = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up";
  } else {
    player.stepTime = 0;
  }

  const nextX = player.x + dx * PLAYER_SPEED * deltaSeconds;
  const nextY = player.y + dy * PLAYER_SPEED * deltaSeconds;

  if (canMoveTo(nextX, player.y)) player.x = nextX;
  if (canMoveTo(player.x, nextY)) player.y = nextY;
}

function startCutscene(queue, nextPhase) {
  state.mode = "cutscene";
  state.queue = queue;
  state.queueIndex = 0;
  state.pendingPhase = nextPhase;
  showNextLine();
}

function showNextLine() {
  if (state.queueIndex >= state.queue.length) {
    endCutscene();
    return;
  }

  const line = state.queue[state.queueIndex];
  state.queueIndex += 1;
  if (line.onStart) line.onStart();
  state.dialogue = line;
  updateDialogue(line);
}

function endCutscene() {
  state.mode = "explore";
  if (state.pendingPhase) state.phase = state.pendingPhase;
  state.queue = [];
  state.queueIndex = 0;
  state.pendingPhase = null;

  if (state.phase === "follow-fon-photo" && !cats.fon.leadDone) cats.fon.mode = "leading";
  if (state.phase === "follow-foo-photo" && !cats.foo.leadDone) cats.foo.mode = "leading";

  updateQuest();
}

function advance() {
  if (state.modalType) return;
  if (state.mode === "cutscene") {
    showNextLine();
    return;
  }

  if (state.nearestInteractable) {
    state.nearestInteractable.interact();
  }
}

function updateDialogue(line) {
  speakerName.textContent = line.speaker;
  speakerMeta.textContent = line.meta;
  dialogueText.textContent = line.text;
  speakerPortrait.className = `portrait ${line.portrait === "mother" ? "mother" : line.portrait === "system" ? "system" : line.portrait === "cat" ? "cat" : ""}`;
}

function activeInteractables() {
  return interactables.filter((item) => item.scene === state.scene && item.active());
}

function getNearestInteractable() {
  const active = activeInteractables();
  let best = null;
  let bestDistance = Infinity;

  for (const item of active) {
    const centerX = item.x + item.w / 2;
    const centerY = item.y + item.h / 2;
    const distance = Math.hypot(player.x - centerX, player.y - centerY);
    if (distance < 96 && distance < bestDistance) {
      best = item;
      bestDistance = distance;
    }
  }

  return best;
}

function interactAtPoint(worldX, worldY) {
  const clicked = activeInteractables().find((item) =>
    worldX >= item.x - 14 &&
    worldX <= item.x + item.w + 14 &&
    worldY >= item.y - 14 &&
    worldY <= item.y + item.h + 14
  );

  if (clicked) {
    clicked.interact();
    return;
  }

  if (state.nearestInteractable) {
    state.nearestInteractable.interact();
  }
}

function openLetter() {
  state.modalType = "letter";
  state.letterRead = true;
  state.pendingAfterModal = () => startCutscene(afterLetterCutscene, "find-photo");
  modalTitle.textContent = "จดหมายจากคนที่รออยู่";
  modalBody.innerHTML = `
    <p>ถึงเธอ</p>
    <p>ถ้าเธอกำลังอ่านจดหมายฉบับนี้อยู่ แปลว่าเธอคงตื่นขึ้นมาแล้ว หลังจากหลับไปนานเพราะอุบัติเหตุประหลาดจากลำไยลูกหนึ่งที่ตกลงมาโดนหัวเธอ</p>
    <p>ฉันไม่รู้ว่าตอนนี้เธอยังจำฉันได้ไหม จำเราได้หรือเปล่า หรือจำคนที่เคยรักและคอยอยู่ข้างเธอได้มากแค่ไหน</p>
    <p>แต่ไม่เป็นไรนะ ถ้าความทรงจำของเธอกระจัดกระจายหายไประหว่างทาง ก็ขอให้ค่อยๆ เดินตามหามันกลับมาทีละชิ้น</p>
    <p>ในโลกใบนี้มีเศษความทรงจำทั้งหมด <strong>12 ชิ้น</strong> บางชิ้นอยู่ในบ้าน บางชิ้นอยู่ตามทางที่เธอเคยเดินผ่าน บางชิ้นอยู่กับคนที่รักเธอ และบางชิ้นอยู่ในวันที่เราสองคนเคยผ่านอะไรมาด้วยกัน</p>
    <p>เมื่อเธอรวบรวมมันได้ครบ ขอให้มาหาฉันที่สถานที่แห่งความทรงจำของเรา ฉันหวังว่าเมื่อถึงตอนนั้น เธอจะจำได้ว่ามันคือที่ไหน</p>
    <p>เพราะฉันจะยังรอเธออยู่ที่นั่น ในเวลาที่พระอาทิตย์ค่อยๆ ลับขอบฟ้า</p>
    <p><strong>รักและคิดถึงเสมอ</strong></p>
  `;
  modalBackdrop.classList.remove("hidden");
  updateQuest();
}

function openMemoryModal({ title, variant, body, after }) {
  state.modalType = "memory";
  state.pendingAfterModal = after;
  modalTitle.textContent = title;
  modalBody.innerHTML = `
    <div class="memory-photo ${variant}" aria-label="${title} placeholder"></div>
    ${body}
  `;
  modalBackdrop.classList.remove("hidden");
}

function openMotherMemory() {
  openMemoryModal({
    title: "Fragment 1: ความทรงจำของแม่",
    variant: "mother",
    body: `
      <p><strong>รูปจริงยังไม่ถูกใส่ในเดโม่นี้</strong> ตอน implement จริง กรอบนี้จะถูกแทนด้วยรูปแม่/ความทรงจำที่คุณส่งมา</p>
      <p>เศษความทรงจำค่อยๆ ชัดขึ้น: กลิ่นอาหารในบ้าน เสียงแม่เรียกกินข้าว และความรู้สึกว่าไม่ว่าจะโตแค่ไหน ก็ยังมีคนหนึ่งคอยดูแลอยู่เสมอ</p>
    `,
    after: () => startCutscene(rememberMotherCutscene, "go-door")
  });
}

function enterOutdoorMap() {
  state.scene = "outdoor";
  state.phase = "garden-strawberry";
  state.motherVisible = false;
  state.basinDropped = false;
  player.x = 118;
  player.y = 314;
  player.facing = "right";
  cats.fon.visible = true;
  cats.fon.mode = "sleep";
  cats.fon.x = 676;
  cats.fon.y = 258;
  cats.fon.leadDone = false;
  cats.foo.visible = false;
  cats.foo.mode = "hidden";
  cats.foo.x = 842;
  cats.foo.y = 238;
  cats.foo.leadDone = false;
  startCutscene(outdoorIntroCutscene, "garden-strawberry");
}

function openGardenMemory() {
  openMemoryModal({
    title: "Fragment 2: สวนผักผลไม้บนดอย",
    variant: "garden",
    body: `
      <p><strong>placeholder</strong> สำหรับรูปสวน/ผลไม้จริงที่จะใส่ภายหลัง</p>
      <p>สตรอเบอรี่ลูกเล็กๆ ทำให้ความทรงจำวัยเด็กเริ่มกลับมา: อากาศบนดอย กลิ่นดินหลังฝน และวันที่เคยเดินเล่นในสวนผักผลไม้ของบ้าน</p>
    `,
    after: () => startCutscene(afterGardenCutscene, "pond-noodle")
  });
}

function openNoodleMemory() {
  openMemoryModal({
    title: "Fragment 3: ก๋วยเตี๋ยวริมบ่อน้ำ",
    variant: "noodle",
    body: `
      <p><strong>placeholder</strong> สำหรับรูปบ่อน้ำ/ร้านก๋วยเตี๋ยวจริงที่จะใส่ภายหลัง</p>
      <p>ชามก๋วยเตี๋ยวริมบ่อน้ำพาความทรงจำช่วงเริ่มเดทกลับมา เป็นช่วงธรรมดาๆ แต่กลับชัดมาก เพราะมีคนหนึ่งนั่งอยู่ข้างกัน</p>
    `,
    after: () => startCutscene(afterNoodleCutscene, "find-fon")
  });
}

function meetFon() {
  cats.fon.mode = "awake";
  startCutscene(meetFonCutscene, "follow-fon-photo");
}

function openFonMemory() {
  openMemoryModal({
    title: "Fragment 4: รูปแรกๆ ของฟ่อน",
    variant: "fon",
    body: `
      <p><strong>placeholder</strong> สำหรับรูปแรกๆ ตอนรับฟ่อนมาเลี้ยงตั้งแต่ยังเด็ก</p>
      <p>ภาพนี้ไม่ได้เป็นแค่รูปแมวตัวเล็ก แต่เป็นหลักฐานว่าบางความรักเริ่มจากการดูแลสิ่งเล็กๆ ทุกวัน จนกลายเป็นครอบครัว</p>
    `,
    after: () => startCutscene(afterFonMemoryCutscene, "collect-foo-items")
  });
}

function collectFooItem(itemId) {
  state.inventory.add(itemId);
  if (state.inventory.has("cat-food") && state.inventory.has("cat-toy")) {
    cats.foo.visible = true;
    cats.foo.mode = "awake";
    cats.foo.x = 842;
    cats.foo.y = 238;
    startCutscene(fooAppearsCutscene, "follow-foo-photo");
    return;
  }

  startCutscene(itemCollectedCutscene, "collect-foo-items");
}

function openFooMemory() {
  openMemoryModal({
    title: "Fragment 5: ฟูและฟ่อน",
    variant: "foo",
    body: `
      <p><strong>placeholder</strong> สำหรับรูปแฟนกับฟู หรือรูปที่มีฟูและฟ่อนอยู่ด้วยกัน</p>
      <p>เมื่อฟูกลับมาอยู่ในเส้นทางเดียวกับฟ่อน โลกในเกมก็เริ่มรู้สึกเหมือนบ้านมากขึ้น ไม่ใช่เพราะสถานที่ แต่เพราะมีตัวเล็กๆ สองตัวเดินอยู่ข้างๆ</p>
    `,
    after: () => startCutscene(afterFooMemoryCutscene, "foo-complete")
  });
}

function closeModal() {
  modalBackdrop.classList.add("hidden");
  state.modalType = null;
  const afterModal = state.pendingAfterModal;
  state.pendingAfterModal = null;
  updateQuest();
  if (afterModal) afterModal();
}

function phaseQuestText() {
  const itemCount = state.inventory.size;
  if (state.phase === "intro") return "ตื่นขึ้นมาในห้องที่ไม่คุ้นเคย";
  if (state.phase === "find-letter") return "อ่านจดหมายบนโต๊ะข้างเตียง";
  if (state.phase === "find-photo") return "สำรวจกรอบรูปเบลอในห้อง เพื่อจำแม่ให้ได้";
  if (state.phase === "go-door") return "ออกจากห้องไปตามหา Fragment ถัดไป";
  if (state.phase === "garden-strawberry") return "สำรวจสวนผักผลไม้ แล้วกดสตรอเบอรี่พิเศษ";
  if (state.phase === "pond-noodle") return "เดินไปบ่อน้ำ แล้วสำรวจร้านก๋วยเตี๋ยว";
  if (state.phase === "find-fon") return "ตามหาและปลุกฟ่อนที่นอนอยู่ในป่า";
  if (state.phase === "follow-fon-photo") return cats.fon.leadDone ? "สำรวจรูปที่ฟ่อนพามาเจอ" : "เดินตามฟ่อนไปหาเศษความทรงจำ";
  if (state.phase === "collect-foo-items") return `หาอาหารแมวและของเล่นให้ฟู (${itemCount}/2)`;
  if (state.phase === "follow-foo-photo") return cats.foo.leadDone ? "สำรวจรูปที่ฟูพามาเจอ" : "เดินตามฟูไปหาเศษความทรงจำ";
  if (state.phase === "foo-complete") return "เดโม่ส่วนฟูจบแล้ว: ฟ่อนและฟูเดินตามผู้เล่น";
  return "สำรวจ Memory Farm";
}

function teaserItems() {
  if (state.phase === "intro" || state.phase === "find-letter" || state.phase === "find-photo") return ["???", "???"];
  if (state.phase === "go-door") return ["สวนผักผลไม้บนดอย", "บ่อน้ำกับร้านก๋วยเตี๋ยว"];
  if (state.phase === "garden-strawberry") return ["บ่อน้ำกับร้านก๋วยเตี๋ยว", "ตามหาฟ่อน"];
  if (state.phase === "pond-noodle") return ["ตามหาฟ่อน", "เรียกฟูออกจากพุ่ม"];
  if (state.phase === "find-fon" || state.phase === "follow-fon-photo") return ["เรียกฟูออกจากพุ่ม", "แคมป์บนดอย"];
  if (state.phase === "collect-foo-items" || state.phase === "follow-foo-photo") return ["แคมป์บนดอย", "ศาลา"];
  if (state.phase === "foo-complete") return ["แคมป์บนดอย", "ศาลา"];
  return ["???", "???"];
}

function updateQuest() {
  fragmentCount.textContent = `Memory ${state.fragments.size}/12`;
  currentQuest.textContent = phaseQuestText();

  const completed = [...state.fragments].sort((a, b) => a - b);
  completedList.innerHTML = completed.length
    ? completed.map((id) => `<li class="completed">${fragmentNames[id]}</li>`).join("")
    : `<li class="empty">ยังไม่มี memory ที่ปลดล็อก</li>`;

  nextQuestList.innerHTML = teaserItems().map((item) => `<li>${item}</li>`).join("");
}

function updateInteractionChip() {
  state.nearestInteractable = getNearestInteractable();

  if (state.modalType) {
    interactionChip.textContent = "ปิด popup เพื่อเล่นต่อ";
    return;
  }

  if (state.mode === "cutscene") {
    interactionChip.textContent = "PASS / Space เพื่ออ่านประโยคถัดไป";
    return;
  }

  if (state.nearestInteractable) {
    const action = state.touchControlsEnabled ? "กด INTERACT" : "กด E หรือ PASS";
    interactionChip.textContent = `${action}: ${state.nearestInteractable.label}`;
    return;
  }

  interactionChip.textContent = state.touchControlsEnabled
    ? "ใช้ joystick เดินหา object ที่มีแสง และกด INTERACT"
    : "เดินด้วย WASD / Arrow แล้วกด E เมื่ออยู่ใกล้ object ที่มีแสง";
}

function drawPixelRect(x, y, w, h, fill, stroke = null) {
  if (stroke) {
    ctx.fillStyle = stroke;
    ctx.fillRect(Math.round(x - 4), Math.round(y - 4), Math.round(w + 8), Math.round(h + 8));
  }
  ctx.fillStyle = fill;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

function drawScene(now) {
  ctx.clearRect(0, 0, view.width, view.height);
  ctx.save();
  ctx.translate(view.x, view.y);
  ctx.scale(view.scale, view.scale);

  if (state.scene === "bedroom") {
    drawRoom();
    drawFurniture();
    drawInteractables(now);
    if (state.motherVisible) drawMother();
    if (state.basinDropped) drawDroppedBasin();
    if (state.heroAwake || state.mode === "explore") {
      drawPlayer();
    } else {
      drawSleepingHero();
    }
    drawDoorGlow();
  } else {
    drawOutdoorMap(now);
    drawInteractables(now);
    drawCats();
    drawPlayer();
  }

  ctx.restore();
}

function drawRoom() {
  ctx.fillStyle = "#26383a";
  ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);

  drawPixelRect(36, 98, BASE_WIDTH - 72, BASE_HEIGHT - 136, "#c29463", "#765d42");

  for (let y = 110; y < BASE_HEIGHT - 42; y += 34) {
    ctx.fillStyle = "rgba(82, 56, 38, 0.22)";
    ctx.fillRect(36, y, BASE_WIDTH - 72, 4);
  }

  ctx.fillStyle = "#172326";
  ctx.fillRect(36, 34, BASE_WIDTH - 72, 64);
  ctx.fillStyle = "#34525a";
  ctx.fillRect(84, 48, 116, 36);
  ctx.fillStyle = "#f1d37d";
  ctx.fillRect(92, 54, 40, 24);
  ctx.fillStyle = "#dc8a59";
  ctx.fillRect(137, 54, 52, 24);
}

function drawFurniture() {
  drawBed();
  drawBedsideTable();
  drawWardrobe();
  drawDesk();
  drawRug();
  drawCatBeds();
  drawPhotoFrame(false);
  drawDoor();
}

function drawBed() {
  drawPixelRect(84, 168, 196, 136, "#875c4c", "#4d342f");
  drawPixelRect(105, 186, 154, 96, "#f3d08d");
  drawPixelRect(118, 206, 128, 74, "#6aa6b7");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(118, 186, 52, 28);
}

function drawSleepingHero() {
  ctx.fillStyle = "#3a2b27";
  ctx.fillRect(132, 188, 34, 18);
  ctx.fillStyle = "#ffd3ae";
  ctx.fillRect(136, 202, 28, 20);
  ctx.fillStyle = "#6aa6b7";
  ctx.fillRect(118, 222, 128, 58);
}

function drawBedsideTable() {
  drawPixelRect(294, 160, 62, 64, "#7b573d", "#4e3829");
  ctx.fillStyle = "#f0bd59";
  ctx.fillRect(308, 174, 32, 22);
}

function drawWardrobe() {
  drawPixelRect(64, 334, 118, 146, "#7c5139", "#432d25");
  ctx.fillStyle = "rgba(255,255,255,0.14)";
  ctx.fillRect(84, 354, 6, 106);
  ctx.fillRect(152, 354, 6, 106);
  ctx.fillStyle = "#e5c079";
  ctx.fillRect(118, 404, 8, 8);
}

function drawDesk() {
  drawPixelRect(610, 112, 178, 76, "#6c4d36", "#432e25");
  ctx.fillStyle = "#26383a";
  ctx.fillRect(636, 80, 94, 52);
  ctx.fillStyle = "#f7f0df";
  ctx.fillRect(644, 88, 78, 36);
  ctx.fillStyle = "#6aa6b7";
  ctx.fillRect(660, 142, 48, 12);
}

function drawRug() {
  drawPixelRect(330, 330, 220, 96, "#8a4f67", "#4e2d42");
  ctx.fillStyle = "rgba(255,255,255,0.16)";
  ctx.fillRect(352, 354, 176, 10);
  ctx.fillRect(352, 390, 176, 10);
}

function drawCatBeds() {
  drawPixelRect(638, 388, 70, 50, "#d5915f", "#5a3b2c");
  drawPixelRect(720, 390, 72, 48, "#7aaab0", "#365a62");
  ctx.fillStyle = "#2d2324";
  ctx.fillRect(660, 402, 26, 16);
  ctx.fillRect(744, 402, 24, 16);
}

function drawDoor() {
  drawPixelRect(792, 482, 86, 58, "#50342c", "#f7f0df");
  ctx.fillStyle = "#d7b765";
  ctx.fillRect(858, 506, 8, 8);
}

function drawPhotoFrame(highlight) {
  drawPixelRect(804, 138, 78, 64, "#211c1c", highlight ? "#f7f0df" : "#80654f");
  ctx.fillStyle = "#b9bf9e";
  ctx.fillRect(814, 148, 58, 44);
  ctx.fillStyle = "rgba(255,255,255,0.28)";
  ctx.fillRect(816, 150, 18, 40);
  ctx.fillStyle = "rgba(54,39,34,0.48)";
  ctx.fillRect(838, 150, 34, 40);
}

function drawOutdoorMap(now) {
  ctx.fillStyle = "#315f3f";
  ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);
  for (let y = 34; y < BASE_HEIGHT; y += 32) {
    for (let x = 28; x < BASE_WIDTH; x += 32) {
      ctx.fillStyle = (x + y) % 64 === 0 ? "#2c573a" : "#356a45";
      ctx.fillRect(x, y, 32, 32);
    }
  }

  drawPath(120, 314, 770, 46);
  drawPath(320, 214, 46, 170);
  drawPath(520, 214, 46, 156);
  drawPath(692, 176, 46, 180);

  drawOutdoorHouse();
  drawGarden();
  drawPondAndNoodleShop();
  drawForest(now);
  drawOutdoorMemoryProps();
  drawInventoryReadout();
}

function drawPath(x, y, w, h) {
  drawPixelRect(x, y, w, h, "#957a45", "#66563a");
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.fillRect(x + 8, y + 12, w - 16, 5);
}

function drawOutdoorHouse() {
  drawPixelRect(50, 150, 132, 114, "#c89555", "#594536");
  ctx.fillStyle = "#7b3f3f";
  ctx.fillRect(38, 132, 156, 42);
  ctx.fillStyle = "#513030";
  ctx.fillRect(70, 198, 38, 62);
  ctx.fillStyle = "#f3d28b";
  ctx.fillRect(126, 190, 34, 28);
}

function drawGarden() {
  drawPixelRect(236, 198, 134, 132, "#715a31", "#4a3a24");
  for (let y = 216; y < 314; y += 30) {
    ctx.fillStyle = "#3d7046";
    ctx.fillRect(252, y, 100, 10);
    for (let x = 266; x < 344; x += 28) {
      ctx.fillStyle = "#ef7894";
      ctx.fillRect(x, y - 6, 10, 10);
      ctx.fillStyle = "#f7f0df";
      ctx.fillRect(x + 2, y - 5, 3, 3);
    }
  }
}

function drawPondAndNoodleShop() {
  drawPixelRect(370, 338, 210, 120, "#2c7284", "#1c4c5c");
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.fillRect(406, 378, 78, 5);
  ctx.fillRect(454, 416, 92, 5);

  drawPixelRect(390, 258, 148, 74, "#b56f42", "#553728");
  ctx.fillStyle = "#e7c475";
  ctx.fillRect(382, 246, 164, 24);
  ctx.fillStyle = "#f7f0df";
  ctx.font = "12px monospace";
  ctx.textAlign = "center";
  ctx.fillText("NOODLE", 464, 263);
  ctx.fillStyle = "#f7f0df";
  ctx.fillRect(432, 286, 44, 24);
  ctx.fillStyle = "#d9534f";
  ctx.fillRect(444, 292, 20, 7);
}

function drawForest(now) {
  ctx.fillStyle = "rgba(20, 56, 38, 0.78)";
  ctx.fillRect(628, 42, 286, 398);
  const treePositions = [
    [644, 84], [712, 80], [776, 92], [842, 80], [872, 146],
    [630, 324], [706, 374], [824, 322], [882, 378]
  ];
  for (const [x, y] of treePositions) drawTree(x, y);

  drawPixelRect(828, 228, 74, 44, "#2d6b3f", "#18492d");
  const rustle = Math.sin(now / 160) * 3;
  ctx.fillStyle = "#4f9a55";
  ctx.fillRect(844 + rustle, 218, 28, 20);
  ctx.fillRect(862 - rustle, 230, 30, 20);

  drawPixelRect(850, 350, 46, 30, "#85837b", "#56534f");
}

function drawTree(x, y) {
  ctx.fillStyle = "#6a442d";
  ctx.fillRect(x + 18, y + 36, 12, 34);
  ctx.fillStyle = "#1f613c";
  ctx.fillRect(x + 8, y + 4, 34, 34);
  ctx.fillStyle = "#2d7b4d";
  ctx.fillRect(x, y + 20, 50, 32);
}

function drawOutdoorMemoryProps() {
  drawPixelRect(594, 150, 64, 52, "#211c1c", cats.fon.leadDone && !state.fragments.has(4) ? "#f7f0df" : "#80654f");
  ctx.fillStyle = "#d8c09a";
  ctx.fillRect(603, 160, 46, 32);
  ctx.fillStyle = "#e8c08d";
  ctx.fillRect(620, 168, 16, 14);

  drawPixelRect(768, 128, 64, 52, "#211c1c", cats.foo.leadDone && !state.fragments.has(5) ? "#f7f0df" : "#80654f");
  ctx.fillStyle = "#c4d1d4";
  ctx.fillRect(777, 138, 46, 32);
  ctx.fillStyle = "#a7a0a0";
  ctx.fillRect(794, 146, 16, 14);

  if (!state.inventory.has("cat-food")) {
    drawPixelRect(738, 330, 48, 42, "#d5915f", "#5a3b2c");
    ctx.fillStyle = "#f7f0df";
    ctx.fillRect(748, 340, 28, 16);
  }
  if (!state.inventory.has("cat-toy")) {
    ctx.fillStyle = "#ef7894";
    ctx.beginPath();
    ctx.arc(868, 218, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f7f0df";
    ctx.fillRect(858, 216, 20, 4);
  }
}

function drawInventoryReadout() {
  if (state.phase !== "collect-foo-items" && state.phase !== "follow-foo-photo" && state.phase !== "foo-complete") return;
  drawPixelRect(34, 438, 250, 54, "rgba(7, 8, 9, 0.86)", "#f7f0df");
  ctx.fillStyle = "#f7f0df";
  ctx.font = "14px monospace";
  ctx.textAlign = "left";
  ctx.fillText(`ของฟู: ${state.inventory.size}/2`, 54, 464);
  ctx.fillStyle = state.inventory.has("cat-food") ? "#ffd16c" : "#777";
  ctx.fillText("อาหารแมว", 54, 484);
  ctx.fillStyle = state.inventory.has("cat-toy") ? "#ffd16c" : "#777";
  ctx.fillText("ของเล่น", 146, 484);
}

function drawInteractables(now) {
  for (const item of activeInteractables()) {
    const pulse = 0.5 + Math.sin(now / 210) * 0.5;
    ctx.strokeStyle = `rgba(247, 240, 223, ${0.55 + pulse * 0.4})`;
    ctx.lineWidth = 4;
    ctx.strokeRect(item.x - 7, item.y - 7, item.w + 14, item.h + 14);
    ctx.fillStyle = `rgba(255, 209, 108, ${0.12 + pulse * 0.1})`;
    ctx.fillRect(item.x - 10, item.y - 10, item.w + 20, item.h + 20);

    if (item.id === "photo") drawPhotoFrame(true);

    const labelWidth = Math.max(84, Math.min(148, item.label.length * 14));
    ctx.fillStyle = "#08090b";
    ctx.fillRect(item.x + item.w / 2 - labelWidth / 2, item.y - 34, labelWidth, 22);
    ctx.strokeStyle = "#f7f0df";
    ctx.lineWidth = 2;
    ctx.strokeRect(item.x + item.w / 2 - labelWidth / 2, item.y - 34, labelWidth, 22);
    ctx.fillStyle = "#f7f0df";
    ctx.font = "12px monospace";
    ctx.textAlign = "center";
    ctx.fillText(item.label, item.x + item.w / 2, item.y - 19);
  }
}

function drawDoorGlow() {
  if (state.phase !== "go-door") return;
  ctx.strokeStyle = "rgba(255, 209, 108, 0.9)";
  ctx.lineWidth = 5;
  ctx.strokeRect(786, 476, 98, 68);
}

function drawPlayer() {
  const bob = Math.sin(player.stepTime) * 2;
  const x = Math.round(player.x - 16);
  const y = Math.round(player.y - 32 + bob);

  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(x + 2, y + 54, 30, 8);
  ctx.fillStyle = "#3a2b27";
  ctx.fillRect(x + 5, y + 4, 24, 18);
  ctx.fillStyle = "#ffd3ae";
  ctx.fillRect(x + 7, y + 18, 20, 18);
  ctx.fillStyle = "#1e9fb7";
  ctx.fillRect(x + 6, y + 36, 22, 22);
  ctx.fillStyle = "#26728d";
  ctx.fillRect(x + 6, y + 52, 22, 8);
  ctx.fillStyle = "#08090b";
  if (player.facing === "left") {
    ctx.fillRect(x + 8, y + 26, 4, 4);
  } else if (player.facing === "right") {
    ctx.fillRect(x + 22, y + 26, 4, 4);
  } else if (player.facing === "up") {
    ctx.fillRect(x + 10, y + 20, 14, 3);
  } else {
    ctx.fillRect(x + 11, y + 27, 4, 4);
    ctx.fillRect(x + 21, y + 27, 4, 4);
  }
}

function drawMother() {
  const x = Math.round(mother.x - 16);
  const y = Math.round(mother.y - 34);
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(x + 2, y + 58, 32, 8);
  ctx.fillStyle = "#2c262b";
  ctx.fillRect(x + 5, y + 5, 25, 18);
  ctx.fillStyle = "#f3c493";
  ctx.fillRect(x + 7, y + 21, 21, 18);
  ctx.fillStyle = "#8fb46d";
  ctx.fillRect(x + 5, y + 39, 25, 24);
  ctx.fillStyle = "#08090b";
  ctx.fillRect(x + 10, y + 30, 4, 4);
  ctx.fillRect(x + 21, y + 30, 4, 4);
}

function drawDroppedBasin() {
  drawPixelRect(704, 338, 54, 20, "#b9c2c8", "#64717a");
  ctx.fillStyle = "rgba(104, 176, 205, 0.38)";
  ctx.fillRect(676, 358, 94, 10);
  ctx.fillRect(690, 370, 62, 7);
}

function drawCats() {
  drawCat(cats.fon);
  drawCat(cats.foo);
}

function drawCat(cat) {
  if (!cat.visible || cat.mode === "hidden") return;

  const x = Math.round(cat.x - 14);
  const y = Math.round(cat.y - 14);
  ctx.fillStyle = "rgba(0,0,0,0.23)";
  ctx.fillRect(x - 4, y + 25, 36, 8);

  ctx.fillStyle = cat.color;
  if (cat.mode === "sleep") {
    ctx.fillRect(x, y + 8, 32, 16);
    ctx.fillRect(x + 18, y, 16, 16);
    ctx.fillStyle = cat.accent;
    ctx.fillRect(x + 20, y - 4, 5, 6);
    ctx.fillRect(x + 29, y - 4, 5, 6);
    ctx.fillStyle = "#f7f0df";
    ctx.font = "12px monospace";
    ctx.fillText("Z", x + 40, y - 2);
  } else {
    ctx.fillRect(x + 2, y + 12, 28, 18);
    ctx.fillRect(x + 19, y + 3, 17, 16);
    ctx.fillStyle = cat.accent;
    ctx.fillRect(x + 21, y - 2, 5, 7);
    ctx.fillRect(x + 31, y - 2, 5, 7);
    ctx.fillRect(x - 4, y + 14, 10, 5);
    ctx.fillStyle = "#08090b";
    ctx.fillRect(x + 24, y + 10, 3, 3);
    ctx.fillRect(x + 32, y + 10, 3, 3);
  }

  ctx.fillStyle = "#08090b";
  ctx.fillRect(x - 16, y - 24, 62, 18);
  ctx.strokeStyle = "#f7f0df";
  ctx.lineWidth = 2;
  ctx.strokeRect(x - 16, y - 24, 62, 18);
  ctx.fillStyle = "#f7f0df";
  ctx.font = "11px monospace";
  ctx.textAlign = "center";
  ctx.fillText(cat.name, x + 15, y - 10);
}

function updateCats(deltaSeconds) {
  updateCat(cats.fon, deltaSeconds);
  updateCat(cats.foo, deltaSeconds);
}

function updateCat(cat, deltaSeconds) {
  if (!cat.visible || cat.mode === "hidden" || cat.mode === "sleep" || cat.mode === "awake") return;

  let target = null;
  if (cat.mode === "leading") target = cat.leadTarget;
  if (cat.mode === "follow") target = { x: player.x + cat.followOffset.x, y: player.y + cat.followOffset.y };
  if (!target) return;

  const dx = target.x - cat.x;
  const dy = target.y - cat.y;
  const distance = Math.hypot(dx, dy);
  if (distance < 4) {
    if (cat.mode === "leading") {
      cat.leadDone = true;
      cat.mode = "wait";
    }
    return;
  }

  const speed = cat.mode === "leading" ? 96 : 126;
  cat.x += (dx / distance) * speed * deltaSeconds;
  cat.y += (dy / distance) * speed * deltaSeconds;
}

function updateJoystick(clientX, clientY) {
  if (!state.touchControlsEnabled) return;

  const rect = joystick.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const max = rect.width * 0.32;
  const rawX = clientX - centerX;
  const rawY = clientY - centerY;
  const length = Math.hypot(rawX, rawY);
  const clamped = Math.min(max, length);
  const angle = Math.atan2(rawY, rawX);
  const stickX = Math.cos(angle) * clamped;
  const stickY = Math.sin(angle) * clamped;

  joystickStick.style.transform = `translate(calc(-50% + ${stickX}px), calc(-50% + ${stickY}px))`;
  joystickVector.x = length > 8 ? stickX / max : 0;
  joystickVector.y = length > 8 ? stickY / max : 0;
}

function resetJoystick() {
  joystickStick.style.transform = "translate(-50%, -50%)";
  joystickVector.x = 0;
  joystickVector.y = 0;
}

function canvasToWorld(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (clientX - rect.left - view.x) / view.scale,
    y: (clientY - rect.top - view.y) / view.scale
  };
}

let lastTime = performance.now();
function loop(now) {
  const deltaSeconds = Math.min(0.033, (now - lastTime) / 1000);
  lastTime = now;

  movePlayer(deltaSeconds);
  updateCats(deltaSeconds);
  updateInteractionChip();
  updateQuest();
  drawScene(now);

  requestAnimationFrame(loop);
}

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  if ([" ", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) {
    event.preventDefault();
  }

  if (key === " " || key === "enter") {
    advance();
    return;
  }

  if (key === "e") {
    if (state.mode === "explore" && state.nearestInteractable) state.nearestInteractable.interact();
    return;
  }

  keys.add(key);
});

window.addEventListener("keyup", (event) => {
  keys.delete(event.key.toLowerCase());
});

passButton.addEventListener("click", advance);
touchInteract.addEventListener("click", advance);
modalClose.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", (event) => {
  if (event.target === modalBackdrop) closeModal();
});

canvas.addEventListener("pointerdown", (event) => {
  if (state.mode === "cutscene") {
    advance();
    return;
  }

  if (state.mode === "explore" && !state.modalType) {
    const point = canvasToWorld(event.clientX, event.clientY);
    interactAtPoint(point.x, point.y);
  }
});

joystick.addEventListener("pointerdown", (event) => {
  if (!state.touchControlsEnabled) return;
  joystick.setPointerCapture(event.pointerId);
  updateJoystick(event.clientX, event.clientY);
});

joystick.addEventListener("pointermove", (event) => {
  if (!state.touchControlsEnabled) return;
  if (!joystick.hasPointerCapture(event.pointerId)) return;
  updateJoystick(event.clientX, event.clientY);
});

joystick.addEventListener("pointerup", (event) => {
  if (!state.touchControlsEnabled) return;
  joystick.releasePointerCapture(event.pointerId);
  resetJoystick();
});

joystick.addEventListener("pointercancel", resetJoystick);

window.addEventListener("resize", () => {
  resize();
  setInputMode();
});

const pointerQuery = window.matchMedia("(pointer: coarse)");
const hoverQuery = window.matchMedia("(hover: none)");
pointerQuery.addEventListener("change", setInputMode);
hoverQuery.addEventListener("change", setInputMode);

setInputMode();
resize();
startCutscene(introCutscene, "find-letter");
requestAnimationFrame(loop);
