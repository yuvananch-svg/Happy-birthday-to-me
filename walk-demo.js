const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext("2d");
const readout = document.querySelector("#positionReadout");
const controlReadout = document.querySelector("#controlReadout");
const joystick = document.querySelector("#joystick");
const joystickStick = document.querySelector("#joystickStick");

const TILE = 32;
const WORLD_COLS = 80;
const WORLD_ROWS = 52;
const WORLD_WIDTH = WORLD_COLS * TILE;
const WORLD_HEIGHT = WORLD_ROWS * TILE;

const keys = new Set();
const joystickVector = { x: 0, y: 0 };
const camera = { x: 0, y: 0 };
const player = {
  x: 15 * TILE,
  y: 18 * TILE,
  width: 24,
  height: 28,
  speed: 160,
  facing: "down",
  stepTime: 0
};

let touchControlsEnabled = false;

function detectsTouchPrimaryInput() {
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const noHover = window.matchMedia("(hover: none)").matches;
  return coarsePointer || (navigator.maxTouchPoints > 1 && noHover);
}

function setInputMode() {
  touchControlsEnabled = detectsTouchPrimaryInput();
  document.body.classList.toggle("input-touch", touchControlsEnabled);
  document.body.classList.toggle("input-keyboard", !touchControlsEnabled);
  controlReadout.textContent = touchControlsEnabled ? "Touch joystick" : "WASD / Arrow keys";
  if (!touchControlsEnabled) resetJoystick();
}

const terrain = Array.from({ length: WORLD_ROWS }, (_, row) =>
  Array.from({ length: WORLD_COLS }, (_, col) => {
    if (row < 7) return "mountain";
    if (row > 39 && col > 44) return "lake";
    if (col > 58 && row < 27) return "forest";
    if (row > 30 && col < 28) return "field";
    if (row > 20 && row < 31 && col > 28 && col < 57) return "meadow";
    return "grass";
  })
);

const colliders = [];
const interactables = [];

function rect(x, y, w, h, kind = "solid") {
  const item = { x, y, w, h, kind };
  colliders.push(item);
  return item;
}

function marker(x, y, label, kind) {
  interactables.push({ x, y, label, kind });
}

// House and fences
rect(10 * TILE, 12 * TILE, 7 * TILE, 5 * TILE, "house");
rect(7 * TILE, 10 * TILE, 2 * TILE, 12 * TILE, "fence");
rect(18 * TILE, 10 * TILE, 2 * TILE, 12 * TILE, "fence");
rect(9 * TILE, 10 * TILE, 9 * TILE, TILE, "fence");
rect(9 * TILE, 21 * TILE, 9 * TILE, TILE, "fence");

// Lake collision
rect(45 * TILE, 40 * TILE, 26 * TILE, 9 * TILE, "water");
rect(51 * TILE, 36 * TILE, 14 * TILE, 5 * TILE, "water");

// Mountain wall
rect(0, 0, WORLD_WIDTH, 5 * TILE, "cliff");
rect(29 * TILE, 5 * TILE, 16 * TILE, 3 * TILE, "cliff");
rect(50 * TILE, 6 * TILE, 20 * TILE, 4 * TILE, "cliff");

// Decorative blockers: trees and rocks
const treePositions = [
  [61, 12], [64, 13], [67, 14], [70, 15], [62, 19], [68, 21], [72, 23],
  [7, 28], [11, 31], [14, 33], [21, 34], [31, 12], [34, 15], [38, 13],
  [40, 25], [43, 26], [48, 28], [52, 25]
];

for (const [col, row] of treePositions) {
  rect(col * TILE + 4, row * TILE + 6, 24, 24, "tree");
}

const rockPositions = [[24, 10], [26, 11], [46, 9], [55, 31], [58, 34], [33, 39]];
for (const [col, row] of rockPositions) {
  rect(col * TILE + 6, row * TILE + 10, 20, 18, "rock");
}

marker(13.5 * TILE, 18 * TILE, "บ้านบนดอย", "home");
marker(23 * TILE, 31 * TILE, "แปลงผัก", "field");
marker(39 * TILE, 23 * TILE, "ทุ่งดอกไม้", "flower");
marker(58 * TILE, 38 * TILE, "บ่อน้ำ", "water");
marker(65 * TILE, 18 * TILE, "ป่าสน", "forest");
marker(39 * TILE, 8 * TILE, "ทางขึ้นเขา", "mountain");

function resize() {
  const bounds = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(320, Math.floor(bounds.width * dpr));
  canvas.height = Math.max(240, Math.floor(bounds.height * dpr));
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function overlaps(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

function playerBounds(x = player.x, y = player.y) {
  return {
    x: x - player.width / 2,
    y: y - player.height / 2 + 8,
    w: player.width,
    h: player.height - 8
  };
}

function canMoveTo(x, y) {
  const bounds = playerBounds(x, y);
  if (bounds.x < 0 || bounds.y < 0 || bounds.x + bounds.w > WORLD_WIDTH || bounds.y + bounds.h > WORLD_HEIGHT) {
    return false;
  }
  return !colliders.some((collider) => overlaps(bounds, collider));
}

function movePlayer(deltaSeconds) {
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

    if (Math.abs(dx) > Math.abs(dy)) {
      player.facing = dx > 0 ? "right" : "left";
    } else {
      player.facing = dy > 0 ? "down" : "up";
    }
  } else {
    player.stepTime = 0;
  }

  const nextX = player.x + dx * player.speed * deltaSeconds;
  const nextY = player.y + dy * player.speed * deltaSeconds;

  if (canMoveTo(nextX, player.y)) player.x = nextX;
  if (canMoveTo(player.x, nextY)) player.y = nextY;
}

function updateCamera(viewWidth, viewHeight) {
  camera.x = clamp(player.x - viewWidth / 2, 0, WORLD_WIDTH - viewWidth);
  camera.y = clamp(player.y - viewHeight / 2, 0, WORLD_HEIGHT - viewHeight);
}

function drawTile(col, row, terrainKind) {
  const x = col * TILE;
  const y = row * TILE;
  const colors = {
    grass: ["#315f3f", "#2c573a"],
    meadow: ["#3d7046", "#35643e"],
    field: ["#766236", "#6b572f"],
    forest: ["#234c36", "#1f422f"],
    mountain: ["#596255", "#4d574c"],
    lake: ["#2c7284", "#256778"]
  };
  const [base, alt] = colors[terrainKind];
  ctx.fillStyle = (col + row) % 2 === 0 ? base : alt;
  ctx.fillRect(x, y, TILE, TILE);

  if (terrainKind === "field") {
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.fillRect(x + 2, y + 14, TILE - 4, 3);
  }

  if (terrainKind === "lake") {
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.fillRect(x + 5, y + 9 + ((col + row) % 3) * 4, 14, 3);
  }
}

function drawWorld() {
  const startCol = Math.max(0, Math.floor(camera.x / TILE) - 1);
  const endCol = Math.min(WORLD_COLS, Math.ceil((camera.x + canvas.clientWidth) / TILE) + 1);
  const startRow = Math.max(0, Math.floor(camera.y / TILE) - 1);
  const endRow = Math.min(WORLD_ROWS, Math.ceil((camera.y + canvas.clientHeight) / TILE) + 1);

  ctx.save();
  ctx.translate(-camera.x, -camera.y);

  for (let row = startRow; row < endRow; row += 1) {
    for (let col = startCol; col < endCol; col += 1) {
      drawTile(col, row, terrain[row][col]);
    }
  }

  drawPaths();
  drawHouse();
  drawColliders();
  drawMarkers();
  drawPlayer();

  ctx.restore();
}

function drawPaths() {
  ctx.fillStyle = "#8d7440";
  drawPixelRect(12 * TILE, 17 * TILE, 52 * TILE, 2 * TILE, "#8d7440", "#66563a");
  drawPixelRect(14 * TILE, 13 * TILE, 2 * TILE, 18 * TILE, "#8d7440", "#66563a");
  drawPixelRect(38 * TILE, 8 * TILE, 2 * TILE, 22 * TILE, "#8d7440", "#66563a");
  drawPixelRect(55 * TILE, 29 * TILE, 2 * TILE, 12 * TILE, "#8d7440", "#66563a");
}

function drawPixelRect(x, y, w, h, fill, stroke) {
  ctx.fillStyle = stroke;
  ctx.fillRect(x - 4, y - 4, w + 8, h + 8);
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

function drawHouse() {
  const x = 10 * TILE;
  const y = 11 * TILE;
  drawPixelRect(x, y + TILE, 7 * TILE, 5 * TILE, "#c89555", "#594536");
  ctx.fillStyle = "#7b3f3f";
  ctx.fillRect(x - 12, y + TILE, 7 * TILE + 24, TILE);
  ctx.fillStyle = "#513030";
  ctx.fillRect(x + 8, y + 2 * TILE, 42, 42);
  ctx.fillStyle = "#f3d28b";
  ctx.fillRect(x + 4 * TILE, y + 2 * TILE + 8, 32, 24);
}

function drawColliders() {
  for (const collider of colliders) {
    if (collider.kind === "tree") {
      const x = collider.x - 4;
      const y = collider.y - 14;
      ctx.fillStyle = "#6a442d";
      ctx.fillRect(x + 13, y + 26, 10, 24);
      ctx.fillStyle = "#1f613c";
      ctx.fillRect(x + 4, y + 4, 28, 26);
      ctx.fillStyle = "#2d7b4d";
      ctx.fillRect(x, y + 12, 36, 22);
    }

    if (collider.kind === "rock") {
      ctx.fillStyle = "#85837b";
      ctx.fillRect(collider.x, collider.y, collider.w, collider.h);
      ctx.fillStyle = "#b3afa2";
      ctx.fillRect(collider.x + 4, collider.y + 3, 8, 5);
    }

    if (collider.kind === "fence") {
      ctx.fillStyle = "#8d7650";
      ctx.fillRect(collider.x, collider.y, collider.w, collider.h);
      ctx.fillStyle = "rgba(255,255,255,0.14)";
      ctx.fillRect(collider.x + 5, collider.y + 5, Math.max(5, collider.w - 10), 5);
    }
  }
}

function drawMarkers() {
  for (const item of interactables) {
    const x = item.x;
    const y = item.y;
    ctx.fillStyle = "#08090b";
    ctx.fillRect(x - 48, y - 44, 96, 26);
    ctx.strokeStyle = "#f6f1e8";
    ctx.lineWidth = 3;
    ctx.strokeRect(x - 48, y - 44, 96, 26);
    ctx.fillStyle = "#f6f1e8";
    ctx.font = "12px monospace";
    ctx.textAlign = "center";
    ctx.fillText(item.label, x, y - 26);
  }
}

function drawPlayer() {
  const bob = Math.sin(player.stepTime) * 2;
  const x = Math.round(player.x - 16);
  const y = Math.round(player.y - 32 + bob);

  ctx.fillStyle = "rgba(0,0,0,0.28)";
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

function drawHud() {
  readout.textContent = `x: ${Math.round(player.x / TILE)} y: ${Math.round(player.y / TILE)}`;
}

let lastTime = performance.now();
function loop(now) {
  const deltaSeconds = Math.min(0.033, (now - lastTime) / 1000);
  lastTime = now;

  movePlayer(deltaSeconds);
  updateCamera(canvas.clientWidth, canvas.clientHeight);

  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  drawWorld();
  drawHud();

  requestAnimationFrame(loop);
}

function updateJoystick(clientX, clientY) {
  if (!touchControlsEnabled) return;

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

window.addEventListener("keydown", (event) => {
  keys.add(event.key.toLowerCase());
});

window.addEventListener("keyup", (event) => {
  keys.delete(event.key.toLowerCase());
});

joystick.addEventListener("pointerdown", (event) => {
  if (!touchControlsEnabled) return;
  joystick.setPointerCapture(event.pointerId);
  updateJoystick(event.clientX, event.clientY);
});

joystick.addEventListener("pointermove", (event) => {
  if (!touchControlsEnabled) return;
  if (!joystick.hasPointerCapture(event.pointerId)) return;
  updateJoystick(event.clientX, event.clientY);
});

joystick.addEventListener("pointerup", (event) => {
  if (!touchControlsEnabled) return;
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
requestAnimationFrame(loop);
