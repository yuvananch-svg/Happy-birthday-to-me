const WORLD = { w: 3840, h: 2160 };
const keys = new Set();
const camera = { x: 0, y: 0 };
const joystickVector = { x: 0, y: 0 };
const completed = new Set();

const frame = document.querySelector("#playFrame");
const worldEl = document.querySelector("#world");
const playerEl = document.querySelector("#player");
const positionReadout = document.querySelector("#positionReadout");
const controlReadout = document.querySelector("#controlReadout");
const questReadout = document.querySelector("#questReadout");
const nearbyChip = document.querySelector("#nearbyChip");
const modalBackdrop = document.querySelector("#modalBackdrop");
const modalTitle = document.querySelector("#modalTitle");
const modalBody = document.querySelector("#modalBody");
const modalClose = document.querySelector("#modalClose");
const goalList = document.querySelector("#goalList");
const joystick = document.querySelector("#joystick");
const joystickStick = document.querySelector("#joystickStick");
const touchInteract = document.querySelector("#touchInteract");
const hotspotButtons = [...document.querySelectorAll("[data-hotspot]")];

const player = {
  x: 1180,
  y: 1760,
  w: 30,
  h: 34,
  speed: 330,
  facing: "down",
  moving: false
};

const colliders = [
  { id: "top-wall", x: 0, y: 0, w: WORLD.w, h: 250 },
  { id: "left-wall", x: 0, y: 0, w: 80, h: WORLD.h },
  { id: "right-wall", x: 3760, y: 0, w: 80, h: WORLD.h },
  { id: "bottom-wall", x: 0, y: 2110, w: WORLD.w, h: 50 },
  { id: "left-wardrobe", x: 0, y: 380, w: 520, h: 980 },
  { id: "back-wardrobe", x: 1500, y: 170, w: 830, h: 850 },
  { id: "bed", x: 1420, y: 690, w: 1860, h: 950 },
  { id: "bedside-table", x: 3340, y: 920, w: 470, h: 540 },
  { id: "cat-beds", x: 630, y: 780, w: 820, h: 360 }
];

const interactables = [
  {
    id: "letter",
    label: "จดหมายจากคนที่รออยู่",
    x: 3560,
    y: 1010,
    radius: 170,
    title: "จดหมายบนโต๊ะข้างเตียง",
    body: [
      "ถึงเธอ",
      "ถ้าเธอกำลังอ่านจดหมายฉบับนี้อยู่ แปลว่าเธอคงตื่นขึ้นมาแล้ว",
      "ในโลกใบนี้มีเศษความทรงจำทั้งหมด 12 ชิ้น ขอให้ค่อยๆ เดินตามหามันกลับมาทีละชิ้น",
      "เริ่มจากในห้องนี้ก่อนนะ มีบางอย่างที่อยากให้เธอลองมองดูอีกครั้ง"
    ],
    quest: "ตามหา Memory Fragment 1 จากกรอบรูปเบลอ"
  },
  {
    id: "photo",
    label: "กรอบรูปเบลอ",
    x: 3370,
    y: 470,
    radius: 180,
    title: "Memory Fragment 1/12: จำแม่ได้",
    body: [
      "ภาพในกรอบค่อยๆ ชัดขึ้น",
      "ความทรงจำแรกกลับมาอย่างอ่อนโยน: แม่ที่คอยดูแลตั้งแต่เด็กจนโต",
      "เสียงหนึ่งเหมือนดังขึ้นมาในใจ... “โอ้ยลูกก อันนี้ก็ดังเกิน”"
    ],
    quest: "ไปที่ประตูเพื่อออกสู่โลกหลัก"
  },
  {
    id: "door",
    label: "ประตูออกจากห้อง",
    x: 1180,
    y: 2030,
    radius: 190,
    title: "ประตูสู่ Memory Farm",
    body: [
      "นี่คือจุดจบของเดโม่ห้องนอน",
      "ถ้า flow นี้เวิร์ก ขั้นต่อไปคือเอาฉาก outdoor map ใหญ่มาใช้แบบเดียวกัน แล้ววาง collision กับ quest ต่อจากประตูนี้"
    ],
    quest: "เดโม่ห้องนอนครบ flow แล้ว"
  }
];

let nearestInteractable = null;
let lastTimestamp = performance.now();
let touchControlsEnabled = false;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function overlaps(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function playerBounds(x = player.x, y = player.y) {
  return {
    x: x - player.w / 2,
    y: y - player.h,
    w: player.w,
    h: player.h
  };
}

function canMoveTo(x, y) {
  const bounds = playerBounds(x, y);
  const inBounds = bounds.x >= 0 && bounds.y >= 0 && bounds.x + bounds.w <= WORLD.w && bounds.y + bounds.h <= WORLD.h;
  return inBounds && !colliders.some((collider) => overlaps(bounds, collider));
}

function detectsTouchPrimaryInput() {
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const noHover = window.matchMedia("(hover: none)").matches;
  return coarsePointer || (navigator.maxTouchPoints > 1 && noHover);
}

function setInputMode() {
  touchControlsEnabled = detectsTouchPrimaryInput();
  document.body.classList.toggle("input-touch", touchControlsEnabled);
  document.body.classList.toggle("input-keyboard", !touchControlsEnabled);
  controlReadout.textContent = touchControlsEnabled ? "Touch joystick" : "WASD / Arrow + E";
  if (!touchControlsEnabled) resetJoystick();
}

function getActiveIds() {
  if (!completed.has("letter")) return new Set(["letter"]);
  if (!completed.has("photo")) return new Set(["photo"]);
  return new Set(["door"]);
}

function updateQuestState() {
  const activeIds = getActiveIds();

  hotspotButtons.forEach((button) => {
    const id = button.dataset.hotspot;
    button.classList.toggle("done", completed.has(id));
    button.hidden = completed.has(id) || !activeIds.has(id);
  });

  const goals = [...goalList.querySelectorAll("li")];
  goals.forEach((goal, index) => {
    const isDone = index === 0 ? completed.has("letter") : index === 1 ? completed.has("photo") : completed.has("door");
    const isActive =
      (index === 0 && !completed.has("letter")) ||
      (index === 1 && completed.has("letter") && !completed.has("photo")) ||
      (index === 2 && completed.has("photo") && !completed.has("door"));

    goal.classList.toggle("done", isDone);
    goal.classList.toggle("active", isActive);
  });
}

function updateNearestInteractable() {
  const activeIds = getActiveIds();
  let nearest = null;
  let nearestDistance = Infinity;

  for (const interactable of interactables) {
    if (!activeIds.has(interactable.id)) continue;

    const distance = Math.hypot(player.x - interactable.x, player.y - interactable.y);
    if (distance <= interactable.radius && distance < nearestDistance) {
      nearest = interactable;
      nearestDistance = distance;
    }
  }

  nearestInteractable = nearest;
  nearbyChip.textContent = nearest ? `กด E เพื่อสำรวจ: ${nearest.label}` : "เดินไปใกล้จุดที่มีแสง";
}

function openModal(interactable) {
  completed.add(interactable.id);
  modalTitle.textContent = interactable.title;
  modalBody.innerHTML = interactable.body.map((line) => `<p>${line}</p>`).join("");
  modalBackdrop.classList.remove("hidden");
  questReadout.textContent = `Quest: ${interactable.quest}`;
  updateQuestState();
}

function closeModal() {
  modalBackdrop.classList.add("hidden");
  updateNearestInteractable();
}

function interact() {
  updateNearestInteractable();
  if (nearestInteractable) {
    openModal(nearestInteractable);
  }
}

function updateMovement(deltaSeconds) {
  let dx = 0;
  let dy = 0;

  if (keys.has("w") || keys.has("arrowup")) dy -= 1;
  if (keys.has("s") || keys.has("arrowdown")) dy += 1;
  if (keys.has("a") || keys.has("arrowleft")) dx -= 1;
  if (keys.has("d") || keys.has("arrowright")) dx += 1;

  dx += joystickVector.x;
  dy += joystickVector.y;

  const length = Math.hypot(dx, dy);
  player.moving = length > 0;

  if (length > 0) {
    dx /= length;
    dy /= length;
    if (Math.abs(dx) > Math.abs(dy)) {
      player.facing = dx > 0 ? "right" : "left";
    } else {
      player.facing = dy > 0 ? "down" : "up";
    }
  }

  const nextX = player.x + dx * player.speed * deltaSeconds;
  const nextY = player.y + dy * player.speed * deltaSeconds;

  if (canMoveTo(nextX, player.y)) player.x = nextX;
  if (canMoveTo(player.x, nextY)) player.y = nextY;
}

function updateCamera() {
  const viewWidth = frame.clientWidth;
  const viewHeight = frame.clientHeight;
  camera.x = clamp(player.x - viewWidth / 2, 0, Math.max(0, WORLD.w - viewWidth));
  camera.y = clamp(player.y - viewHeight / 2, 0, Math.max(0, WORLD.h - viewHeight));
  worldEl.style.transform = `translate3d(${-camera.x}px, ${-camera.y}px, 0)`;
}

function render() {
  playerEl.style.left = `${player.x}px`;
  playerEl.style.top = `${player.y}px`;
  playerEl.classList.toggle("walking", player.moving);
  playerEl.dataset.facing = player.facing;
  positionReadout.textContent = `x: ${Math.round(player.x)} y: ${Math.round(player.y)}`;
}

function tick(timestamp) {
  const deltaSeconds = Math.min(0.033, (timestamp - lastTimestamp) / 1000);
  lastTimestamp = timestamp;

  if (modalBackdrop.classList.contains("hidden")) {
    updateMovement(deltaSeconds);
  }

  updateCamera();
  updateNearestInteractable();
  render();
  requestAnimationFrame(tick);
}

function resetJoystick() {
  joystickVector.x = 0;
  joystickVector.y = 0;
  joystickStick.style.transform = "translate(-50%, -50%)";
}

function setJoystickFromPointer(event) {
  const rect = joystick.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const max = rect.width * 0.34;
  const dx = clamp(event.clientX - centerX, -max, max);
  const dy = clamp(event.clientY - centerY, -max, max);

  joystickVector.x = dx / max;
  joystickVector.y = dy / max;
  joystickStick.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
}

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) {
    keys.add(key);
    event.preventDefault();
  }

  if (key === "e" || key === "enter" || key === " ") {
    event.preventDefault();
    if (modalBackdrop.classList.contains("hidden")) {
      interact();
    } else {
      closeModal();
    }
  }
});

window.addEventListener("keyup", (event) => {
  keys.delete(event.key.toLowerCase());
});

window.addEventListener("resize", () => {
  setInputMode();
  updateCamera();
});

modalClose.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", (event) => {
  if (event.target === modalBackdrop) closeModal();
});

hotspotButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const interactable = interactables.find((item) => item.id === button.dataset.hotspot);
    if (interactable && getActiveIds().has(interactable.id)) openModal(interactable);
  });
});

touchInteract.addEventListener("click", interact);
joystick.addEventListener("pointerdown", (event) => {
  joystick.setPointerCapture(event.pointerId);
  setJoystickFromPointer(event);
});
joystick.addEventListener("pointermove", (event) => {
  if (event.buttons > 0) setJoystickFromPointer(event);
});
joystick.addEventListener("pointerup", resetJoystick);
joystick.addEventListener("pointercancel", resetJoystick);

setInputMode();
updateQuestState();
requestAnimationFrame(tick);
