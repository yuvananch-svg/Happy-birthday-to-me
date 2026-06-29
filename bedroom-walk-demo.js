const WORLD = { w: 3840, h: 2160 };
// 0.7 base zoom × 0.8 × 0.9 × 0.9 additional zoom-out = 0.4536 (hero counter-scaled to stay same screen size)
const WORLD_ZOOM = 0.4536;
const HERO_COUNTER_ZOOM = 1 / WORLD_ZOOM;
const keys = new Set();
const camera = { x: 0, y: 0 };
const joystickVector = { x: 0, y: 0 };
const completed = new Set();

const frame = document.querySelector("#playFrame");
const worldEl = document.querySelector("#world");
const heroEl = document.querySelector("#hero");
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
  x: 1910,
  y: 1520,
  w: 30,
  h: 34,
  speed: 387,
  facing: "down",
  moving: false,
  stepTime: 0,
  legPhase: "idle"
};

const interactables = [
  {
    id: "letter",
    label: "จดหมาย",
    x: 1560,
    y: 900,
    radius: 160,
    title: "จดหมายบนโต๊ะข้างเตียง",
    body: [
      "ถึงเธอ",
      "นี่คือเดโม่ห้องนอนเวอร์ชันใหม่ที่ลองใช้ฉากสเกลเล็กลงและเดินได้มากขึ้น",
      "ตอนเดิน ขาของตัวละครจะสลับซ้ายขวาเพื่อทดสอบ animation แบบใช้โค้ด"
    ],
    quest: "ลองเดินไปดู Memory Fragment"
  },
  {
    id: "photo",
    label: "กรอบรูป Memory",
    x: 2440,
    y: 540,
    radius: 170,
    title: "Memory Fragment 1/12",
    body: [
      "กรอบรูปค่อยๆ ชัดขึ้น",
      "ถ้าใช้แนวนี้ต่อ เราจะวางจุด interact ให้ตรงกับ object ในฉากจริง แล้วทำ collision ตามกริดเดิน"
    ],
    quest: "ลองเดินไปที่ประตู"
  },
  {
    id: "door",
    label: "ประตู",
    x: 3250,
    y: 1810,
    radius: 190,
    title: "ออกจากห้อง",
    body: [
      "จบเดโม่ห้องนอนใหม่",
      "จุดที่ต้องดูต่อคือ scale ของตัวละครกับวัตถุ และความรู้สึกของขาที่ขยับเวลาเดิน"
    ],
    quest: "เดโม่ครบ flow แล้ว"
  }
];

let nearestInteractable = null;
let lastTimestamp = performance.now();
let touchControlsEnabled = false;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
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
  return bounds.x >= 0 && bounds.y >= 0 && bounds.x + bounds.w <= WORLD.w && bounds.y + bounds.h <= WORLD.h;
}

function getFacingFromVector(dx, dy, previousFacing) {
  if (dx === 0 && dy === 0) return previousFacing;
  if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? "right" : "left";
  return dy > 0 ? "down" : "up";
}

function getLegPhase(stepTime, isWalking) {
  if (!isWalking) return "idle";
  return Math.floor(stepTime * 6) % 2 === 0 ? "left" : "right";
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
    player.stepTime += deltaSeconds * 4.2;
  } else {
    player.stepTime = 0;
  }

  player.facing = getFacingFromVector(dx, dy, player.facing);
  player.legPhase = getLegPhase(player.stepTime, player.moving);

  const nextX = player.x + dx * player.speed * deltaSeconds;
  const nextY = player.y + dy * player.speed * deltaSeconds;

  if (canMoveTo(nextX, player.y)) player.x = nextX;
  if (canMoveTo(player.x, nextY)) player.y = nextY;
}

function updateCamera() {
  const viewWidth = frame.clientWidth;
  const viewHeight = frame.clientHeight;
  const visibleWorldW = viewWidth / WORLD_ZOOM;
  const visibleWorldH = viewHeight / WORLD_ZOOM;

  camera.x = clamp(player.x - visibleWorldW / 2, 0, Math.max(0, WORLD.w - visibleWorldW));
  camera.y = clamp(player.y - visibleWorldH / 2, 0, Math.max(0, WORLD.h - visibleWorldH));
  worldEl.style.transform = `scale(${WORLD_ZOOM}) translate3d(${-camera.x}px, ${-camera.y}px, 0)`;
}

function render() {
  heroEl.style.left = `${player.x}px`;
  heroEl.style.top = `${player.y}px`;
  heroEl.style.transform = `translate(-50%, -88%) scale(${HERO_COUNTER_ZOOM})`;
  heroEl.classList.toggle("walking", player.moving);
  heroEl.dataset.facing = player.facing;
  heroEl.dataset.leg = player.legPhase;
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

window.__bedroomWalkDemo = {
  player,
  updateMovement,
  updateCamera,
  render,
  getLegPhase,
  getFacingFromVector,
  WORLD_ZOOM,
  HERO_COUNTER_ZOOM
};

setInputMode();
updateQuestState();
requestAnimationFrame(tick);
