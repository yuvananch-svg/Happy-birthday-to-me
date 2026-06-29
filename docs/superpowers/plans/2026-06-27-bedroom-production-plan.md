# Memory Farm — Bedroom Production Plan (Milestone 1)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]` / `- [ ]`) syntax for tracking.
>
> **Scope:** Milestone 1 = **ฉากห้องนอน opening** — **M1-core implement แล้ว** (เล่นได้ใน `/game`); กำลังอยู่ช่วง **M1-polish** (ฉาก opening, แม่ NPC, cinematic)

**Status (2026-06-27 evening):** ✅ Bedroom free-walk engine ใน Next.js · ✅ cutscene dialogue · ✅ F1 + sidebar · ✅ mother/F1 assets จาก Higgsfield · ⏳ opening scene image lock · ⏳ video cutscene wire · ⏳ collision tune

**Goal:** ย้าย flow ที่พิสูจน์แล้วจากเดโmo ล่าสุดเข้า Next.js `/game` ให้เล่นได้จริงบน desktop + iPad ครบ opening cutscene → จดหมาย (guide) → F1 กรอบรูปเบลอ → sidebar quest → ประตู (placeholder) — **core flow ทำแล้ว**; ต่อไป polish visual + lock opening scene

**Architecture:** เก็บ register gate และ app shell ที่มีอยู่; แทนที่ visual-novel engine เก่า (`lib/story/game-reducer`, graph waypoints) ด้วย **free-walk bedroom engine** ใน `lib/game/` + React client ใน `app/game/` และ `components/game/`; story/interactable เป็น data-driven JSON/TS

**Tech Stack (M1):** Next.js App Router, TypeScript, React, CSS Modules, Vitest, DOM + CSS transform camera (ตามเดโmo), assets ใน `public/`

**Foundation demos (ทดสอบแล้ว):**

| Demo | บทบาทหลัก | สถานะ |
|---|---|---|
| `opening-demo.*` | Cutscene แม่, phase quest, sidebar, F1–F5 flow, canvas 960×540 | ผ่าน headless verification ถึง F5 |
| `bedroom-walk-demo.*` | ฉากใหญ่ 3840×2160, hero sprite + code legs, zoom, joystick | ทดสอบ scale/walk feel |
| `bedroom-demo.*` | ฉากใหญ่ + collision rects + interactables + modal | ทดสอบ camera + quest gating |
| `walk-demo.*` | Outdoor tile movement (อ้างอิง M2+) | ผ่าน input mode |
| `lib/bedroom-demo-engine.ts` | Pure helpers (collision, camera, facing, interact) + tests | มี Vitest |

---

## A. Executive Summary

**สิ่งที่สร้างก่อน:** Production slice ของ **ห้องนอน opening** — ผู้เล่นตื่นบนเตียง, ดู cutscene แม่, อ่านจดหมาย (ไม่ใช่ fragment), สำรวจห้อง, ปลดล็อก **Memory Fragment 1 (จำแม่ได้)** จากกรอบรูปเบลอ, ดู sidebar quest, ไปประตู (placeholder ยังไม่เปลี่ยนแมพ)

**ทำไมเริ่มที่ห้องนอน:**

1. เป็น emotional anchor ของเกม — ถ้า opening ไม่ดี ทั้งเกมพัง
2. เดโmo แยกส่วนพิสูจน์แล้ว: narrative (`opening-demo`) + scene scale (`bedroom-walk-demo`) + collision/interact (`bedroom-demo`) + engine tests (`bedroom-demo-engine`)
3. ขอบเขตแคบพอที่จะ lock tech + UX (input, dialogue, popup, sidebar) ก่อนขยาย outdoor map
4. Next.js production **pivot แล้ว** — `/game` ใช้ `BedroomGameClient` แทน visual novel เก่า (`lib/story/*` เก็บเป็น reference)

**North star M1:** แฟนเล่นจบห้องนอนแล้วรู้สึกอบอุ่น, เข้าใจ quest 12 fragments, จำแม่ได้, และอยากเดินออกประตูต่อ

---

## A.1 Progress Summary (อัปเดต 2026-06-27)

### ✅ M1-core — Done

| งาน | สถานะ | หมายเหตุ |
|---|---|---|
| `lib/game/engine/` + `bedroom-reducer` | ✅ | 28 Vitest tests pass |
| `BedroomGameClient` + `BedroomScene` + `HeroSprite` | ✅ | DOM/CSS camera, world zoom |
| Cutscene dialogue (แม่, มุก, จดหมาย) | ✅ | `cutscenes.ts` — ยังเป็น text PASS ไม่ใช่วิดีโอ |
| Input desktop/iPad | ✅ | WASD, joystick, E/INTERACT |
| QuestSidebar + GameModal | ✅ | current + teaser + replay |
| F1 unlock + popup | ✅ | รูปแม่ canonical จาก Higgsfield |
| F1 in-scene photo overlay | ✅ | `mother-f1-inner.png` + bbox ใน `assets.ts` |
| Mother dialogue portrait | ✅ | `/npc/mother-portrait.png` (Nano Banana Pro 4K) |
| Register gate | ✅ | ไม่พัง |
| `npm run build` | ✅ | |

### ⏳ M1-polish — In progress / Next

| งาน | สถานะ | หมายเหตุ |
|---|---|---|
| Opening scene image (แฟนนอนบนเตียง) | ⏳ | มี sample `hero-sleeping-bed-v2.png` (approved); เกมยังใช้ `bedroom.png` |
| กรอบรูป F1 บนฉากจริง | ⏳ | overlay ทำแล้ว; bbox tune กับ `bedroom.png` vs v2 อาจยังไม่ตรง |
| แม่ NPC ใน cutscene (sprite) | ⏳ | มี `mother-fullbody-nobg-v3.png`; ยังไม่ walk-in ใน scene |
| Video cutscene แม่+กะละมัง | ⏳ | มี `mother-basin-entry-v2.mp4` (Kling 3.0 1080p); ยังไม่ wire |
| Collision tune | ⏳ | colliders จาก demo อาจไม่ตรง `bedroom.png` |
| Scene compress (WebP) | ⏳ | `bedroom.png` ~16MB |
| Composite strategy | 📋 | แนะนำ: ฉากคงที่ + overlay hero/แม่/F1 แทน regenerate ทั้งเฟรม |

### 🎨 Higgsfield Assets (สร้างแล้ว — ดู `lib/game/scenes/bedroom/assets.ts`)

| Asset | Path | ใช้ในเกม |
|---|---|---|
| Mother dialogue portrait | `public/npc/mother-portrait.png` | ✅ DialoguePanel |
| Mother F1 (framed) | `public/memories/images/mother-f1.png` | ✅ GameModal popup |
| Mother F1 inner (no frame) | `public/memories/images/mother-f1-inner.png` | ✅ BedroomScene overlay |
| Mother full-body | `public/npc/mother-fullbody.png` | อ้างอิง / sprite ต่อ |
| Mother full-body nobg | `public/npc/mother-fullbody-nobg-v3.png` | รอ wire cutscene |
| Hero sleeping scene v2 | `public/npc/hero-sleeping-bed-v2.png` | **candidate** opening background |
| Hero sleeping scene v3 | `public/npc/hero-sleeping-bed-v3.png` | sample (F1 frame edit — ใบหน้ายังไม่ตรง) |
| Cutscene video 720p | `public/cutscenes/mother-basin-entry.mp4` | ยังไม่ wire |
| Cutscene video 1080p | `public/cutscenes/mother-basin-entry-v2.mp4` | ยังไม่ wire (mother end-image ref) |

**Canonical mother look (locked):** full-body `hf_20260627_165321_...` · F1 portrait `hf_20260627_165035_...`

---

## B. Demo → Production Mapping

| ความสามารถจาก Demo | Demo ต้นทาง | Production Target | Keep / Refactor / Replace |
|---|---|---|---|
| Opening cutscene (แม่, กะละมัง, มุก, จดหมาย) | `opening-demo.js` (`introCutscene`, `afterLetterCutscene`, phase machine) | `lib/game/scenes/bedroom/cutscenes.ts` + `lib/game/bedroom-state.ts` | **Refactor** — แยก data จาก imperative canvas code |
| Phase / quest gating (`find-letter` → `find-photo` → `go-door`) | `opening-demo.js` | `lib/game/quest/bedroom-quest.ts` | **Keep** logic, **Refactor** เป็น reducer/state machine |
| Sidebar: current + next 2 teaser + completed | `opening-demo.js`, `opening-demo.html` | `components/game/QuestSidebar.tsx` | **Keep** UX, **Replace** DOM ids ด้วย React props |
| Dialogue PASS + portrait | `opening-demo.js` | `components/game/DialoguePanel.tsx` (ขยายจาก `DialogueBox.tsx`) | **Refactor** — รองรับ portrait แม่/hero, onStart hooks |
| Large bedroom scene + camera follow | `bedroom-demo.js`, `bedroom-walk-demo.js` | `components/game/BedroomScene.tsx` | **Keep** DOM transform pattern M1 |
| World zoom + hero counter-scale | `bedroom-walk-demo.js` | `lib/bedroom-demo-engine.ts` (`clampCamera` มี zoom แล้ว) + scene CSS | **Keep** |
| Hero 4-facing + code leg animation | `bedroom-walk-demo.js`, `bedroom-walk-demo.css` | `components/game/HeroSprite.tsx` | **Keep** M1; production อาจ swap เป็น sprite sheet ทีหลัง |
| Collision rects | `bedroom-demo.js` colliders | `lib/game/scenes/bedroom/collision.json` (หรือ `.ts`) | **Refactor** — data-driven, tune ให้ตรงฉาก production |
| Interactables (letter, photo, door) | ทุก bedroom demo | `lib/game/scenes/bedroom/interactables.ts` | **Keep** pattern radius-based |
| Input: WASD/Arrow + E/PASS | ทุก demo | `lib/game/input/useGameInput.ts` | **Keep** + แยก cutscene vs explore mode |
| Touch joystick + INTERACT | ทุก demo | `components/game/TouchControls.tsx` | **Keep** |
| Input mode detection (`input-keyboard` / `input-touch`) | ทุก demo | `lib/game/input/detectInputMode.ts` | **Keep** |
| Letter / memory modal popup | ทุก demo | `components/game/GameModal.tsx` | **Refactor** — รองรับ letter, memory image, replay |
| Fragment counter + unlock F1 | `opening-demo.js` | `lib/game/fragments/fragment-state.ts` | **Keep** |
| Pure engine helpers + tests | `lib/bedroom-demo-engine.ts` | `lib/game/engine/` (rename/extend) | **Keep** + เพิ่ม tests |
| Canvas procedural bedroom draw | `opening-demo.js` | — | **Replace** ด้วย generated scene image |
| Outdoor mini-map F2–F5 | `opening-demo.js` | M2+ (`lib/game/scenes/outdoor/`) | **Defer** |
| Tile outdoor movement | `walk-demo.js` | M3+ | **Defer** |
| Graph waypoint map | `lib/story/map-graph.ts`, `PixelMap.tsx` | — | **Replace** สำหรับ bedroom M1 |
| Visual novel reducer | `lib/story/game-reducer.ts`, `story-data.ts` | archive หรือเก็บ reference | **Replace** ด้วย bedroom game reducer |
| Register gate | `app/register/`, `lib/auth/` | คงเดิม | **Keep** |
| Memory media viewer | `components/game/MemoryViewer.tsx` | ใช้ใน modal F1 | **Keep** + ปรับ popup overlay |

---

## C. Bedroom Scene Production Scope (Milestone 1)

### C.1 Scene / Map (ห้องนอนเท่านั้น)

- [x] ใช้ generated bedroom scene image ขนาดใหญ่ (3840×2160 display / native 5504×3072)
- [x] วางใน `public/scenes/bedroom/bedroom.png` (local asset)
- [x] Camera crop/follow ผู้เล่น + world zoom (~0.45) + hero counter-scale
- [x] ของตกแต่งตาม AGENTS.md (ใน scene image)
- [ ] Collision layer tune ให้ตรงฉาก production — **ยังต้องปรับ**
- [x] Hotspot visual: ขอบขาว/shimmer บน interactables
- [ ] **Switch opening background** → `hero-sleeping-bed-v2.png` (approved) หรือ composite
- [ ] Compress scene → WebP สำหรับ iPad

### C.2 Character Movement & Input

- [x] Desktop: `WASD` / Arrow เดิน; `E` interact; `Space`/`Enter`/`PASS` ใน cutscene
- [x] iPad: on-screen joystick + ปุ่ม INTERACT; ซ่อน joystick บน desktop
- [x] แยก `mode`: `cutscene` vs `explore`
- [x] Hero: 4 มุม + code leg animation (`HeroSprite.tsx` + `public/prototypes/`)
- [x] Spawn บนเตียง (coords ใน collision.ts)

### C.3 Opening Cutscene Flow

ลำดับตาม AGENTS.md — **dialogue PASS ครบ**; **video cinematic ยังไม่ wire**

1. [x] ฮีโร่ตื่น — “ที่นี่ที่ไหน...”
2. [x] แม่เดินเข้ามากะละมัง → ตกใจ → กะละมังหล่น (dialogue)
3. [x] คุย — ลูกจำแม่ไม่ได้; แม่ใจเย็น
4. [x] แม่ยื่นน้ำ → แฟนเรอ → มุก “โอ้ยลูกก อันนี้ก็ดังเกิน”
5. [x] แม่ชี้จดหมายบนโต๊ะข้างเตียง
6. [x] ปลด movement → phase `find-letter`
7. [x] หลังอ่านจดหมาย → cutscene สั้น → phase `find-photo`
8. [x] หลัง F1 → cutscene จำแม่ได้ → phase `go-door`
9. [x] ประตู: placeholder message
10. [ ] **Optional:** เล่น `mother-basin-entry-v2.mp4` แทน/ก่อน dialogue block แรก

**สำคัญ:** จดหมาย = guide object เท่านั้น **ไม่** unlock fragment

### C.4 Interactables

| ID | Object | Phase | ผลลัพธ์ |
|---|---|---|---|
| `letter` | โต๊ะข้างเตียง | `find-letter` | เปิด letter popup (ข้อความจาก AGENTS.md draft) |
| `photo` | กรอบรูปเบลอ | `find-photo` | Blur → clear; unlock **F1 จำแม่ได้**; memory popup |
| `door` | ประตูห้อง | `go-door` | Placeholder “กำลังจะออกสู่โลกหลัก” |

### C.5 Dialogue System

- [x] Queue-based cutscene lines พร้อม speaker, portrait, meta, `onStart` hooks
- [x] PASS ข้าม typing / ไปบรรทัดถัดไป
- [x] Portrait แม่ / hero / system (`DialoguePanel.tsx`)
- [ ] ภาษาเหนือของแม่ (defer)

### C.6 Memory Popup / Sidebar Quest UI

- [x] Modal กลางจอ: letter (text), memory F1 (image)
- [x] Sidebar ขวา: Current quest, Next 1–2 teaser, Completed replay
- [x] Fragment counter `Memory X/12`
- [x] กด completed item → เปิด popup ซ้ำ

### C.7 Explicitly OUT OF SCOPE for M1

- Outdoor / farm continuous map
- F2–F12 และแมว (ฟ่อน/ฟู)
- Scene transition ผ่านประตูไปแมพใหญ่
- Day/night cycle
- NPC อื่นนอกแม่
- Save/load progress (optional localStorage ทีหลัง)
- Phaser migration
- Production deploy ขั้นสุดท้าย (ทำ skeleton ได้ แต่ไม่ block M1)
- เนื้อหาส่วนตัวที่ผู้ใช้ยังไม่ confirm (F10–F11, ภาษาเหนือ)
- ~~รูป F1 จริง~~ — **locked** แล้ว (Higgsfield portrait)

### C.8 Acceptance Criteria (M1 Done)

- [x] `/register` → `/game` แล้วเข้า bedroom opening ได้
- [x] Desktop + iPad emulation: input mode ถูกต้อง
- [x] Cutscene ครบตาม premise (รวมมุกแม่) — dialogue mode
- [x] จดหมายอ่านได้, **ไม่** นับเป็น fragment
- [x] F1 unlock จากกรอบรูป; sidebar อัปเดต
- [ ] Collision กันเดินทะลุเฟอร์นิเจอร์หลัก — **ต้อง tune**
- [x] Completed F1 กดดูซ้ำจาก sidebar ได้
- [x] ประตู interact ได้ (placeholder)
- [x] Vitest: engine helpers + bedroom quest reducer (28 tests)
- [x] `npm run build` ผ่าน
- [ ] Opening visual: แฟนนอนบนเตียงในฉากที่เล่นจริง (v2 หรือ composite)
- [ ] กรอบรูป F1 ตรง bbox บนฉากที่เลือก

---

## D. 12 Task Areas — Production Roadmap (ตามลำดับ AGENTS.md)

### 1. Product & Story Bible

| ฟิลด์ | รายละเอียด |
|---|---|
| **Status** | Partial — AGENTS.md อัปเดต mother/F1 assets; ยังไม่มี `MEMORY_FRAGMENTS.md` |
| **Bedroom M1** | **Partial** — F1 media locked; F10–F11 ยังไม่ lock |
| **Subtasks** | สร้าง `MEMORY_FRAGMENTS.md`; Task 1.1 (F7, F10–F11); บันทึก canonical asset URLs |
| **Dependencies** | ผู้ใช้ confirm F10–F11, F7 ศาลา |
| **Acceptance criteria** | Fragment table ครบ 12; opening dialogue ใน TS |
| **บทบาท** | Story |

### 2. Next.js App Shell + Register Gate

| ฟิลด์ | รายละเอียด |
|---|---|
| **Status** | **Done** |
| **Bedroom M1** | **Done** — `GameClient` → `BedroomGameClient` |
| **Subtasks** | — |
| **บทบาท** | App |

### 3. Game Engine Foundation

| ฟิลด์ | รายละเอียด |
|---|---|
| **Status** | **Done** (M1 scope) — `lib/game/engine/`, reducer, 28 tests |
| **Bedroom M1** | **Done** |
| **Subtasks** | Debug collision overlay (optional); performance profiling iPad |
| **บทบาท** | Engine |

### 4. Single Continuous Farm Map

| ฟิลด์ | รายละเอียด |
|---|---|
| **Status** | Partial — bedroom playable; outdoor ยังไม่มี |
| **Bedroom M1** | **Partial** — ต้อง lock opening scene image + collision tune |
| **Subtasks** | ใช้ `hero-sleeping-bed-v2` เป็น background; retune `F1_PHOTO_FRAME` bbox; M2 outdoor |
| **บทบาท** | World / Assets |

### 5. Player Controls

| ฟิลด์ | รายละเอียด |
|---|---|
| **Status** | **Done** ใน Next.js |
| **Bedroom M1** | **Done** |
| **บทบาท** | Engine / UI |

### 6. NPC & Interaction System

| ฟิลด์ | รายละเอียด |
|---|---|
| **Status** | Partial — interactables ครบ; แม่เป็น dialogue + assets พร้อม |
| **Bedroom M1** | **Partial** |
| **Subtasks** | Mother sprite walk-in (`mother-fullbody-nobg-v3`); optional video cutscene player |
| **บทบาท** | Engine / Story / Cinematic |

### 7. Timeline Quest System

| ฟิลด์ | รายละเอียด |
|---|---|
| **Status** | **Done** (M1) — `QuestSidebar.tsx` |
| **Bedroom M1** | **Done** |
| **บทบาท** | UI / Story |

### 8. Memory Popup & Replay System

| ฟิลด์ | รายละเอียด |
|---|---|
| **Status** | **Done** (M1) — `GameModal.tsx`, F1 replay |
| **Bedroom M1** | **Done** |
| **บทบาท** | UI |

### 9. Cat Companion System

| ฟิลด์ | รายละเอียด |
|---|---|
| **Status** | Demo only (F4–F5 ใน opening-demo) |
| **Bedroom M1** | **No** — เตียงแมวเป็น decor เท่านั้น |
| **Subtasks** | Defer M4+ |
| **Dependencies** | Outdoor/forest zones |
| **Acceptance criteria** | — |
| **บทบาท** | Engine / Story |

### 10. Day/Night Cycle

| ฟิลด์ | รายละเอียด |
|---|---|
| **Status** | Not started |
| **Bedroom M1** | **No** |
| **Subtasks** | Defer post-M3; 15-min tint cycle |
| **Dependencies** | Full map |
| **Acceptance criteria** | — |
| **บทบาท** | Engine / Assets |

### 11. Final Sequence

| ฟิลด์ | รายละเอียด |
|---|---|
| **Status** | Not started |
| **Bedroom M1** | **No** |
| **Subtasks** | Defer; Golden Bridge + video |
| **Dependencies** | F1–F12 complete, F10–F11 locked |
| **Acceptance criteria** | — |
| **บทบาท** | Story / Cinematic |

### 12. Asset Pipeline + Deploy

| ฟิลด์ | รายละเอียด |
|---|---|
| **Status** | Partial — Higgsfield pipeline ใช้ได้; mother/F1/hero samples มี; deploy ยังไม่ |
| **Bedroom M1** | **Partial** |
| **Subtasks** | WebP compress; wire video cutscene; Netlify deploy preview; iPad load test |
| **บทบาท** | Assets / DevOps |

---

## E. Technical Decisions to Lock for Bedroom

### E.1 DOM vs Canvas vs Phaser (M1)

**แนะนำ: React + DOM/CSS transform สำหรับ M1**

| ตัวเลือก | เหตุผล |
|---|---|
| **DOM (เลือก M1)** | `bedroom-walk-demo` / `bedroom-demo` พิสูจน์แล้ว; integrate กับ Next.js/React ตรงไปตรงมา; ห้องเดียว 4K ยัง manage ได้ด้วย compress + transform GPU |
| Canvas | `opening-demo` ใช้ canvas แต่วาด procedural — ไม่ match production scene image approach |
| Phaser | Overkill สำหรับ M1; learning curve + bundle size; เหมาะเมื่อ single continuous map + NPC มาก (M3+) |

**Migration trigger:** iPad frame drop หรือ DOM node มากเกิน → ย้าย render layer เป็น canvas ใน `BedroomScene` โดยคง `lib/game/engine` เดิม

### E.2 Collision Approach

- **Rect JSON** ใน `lib/game/scenes/bedroom/collision.ts` — เริ่มจาก `bedroom-demo.js` colliders
- ใช้ `moveWithCollision` จาก engine (แกน X แล้วแกน Y)
- **Tune ใน dev tool ง่ายๆ** (debug overlay toggle) ก่อน lock
- `bedroom-walk-demo` ยัง free-walk (bounds only) — **อย่า** copy pattern นั้นสำหรับ production
- Hotspots/interactables: **data-driven** `{ id, x, y, radius, phases[] }` ไม่ hardcode จาก pixel ในภาพอย่างเดียว

### E.3 Asset List — Bedroom M1

| Asset | Path | สถานะ | หมายเหตุ |
|---|---|---|---|
| Bedroom scene (runtime) | `public/scenes/bedroom/bedroom.png` | ✅ มี | ~16MB — ต้อง compress |
| Opening scene candidate | `public/npc/hero-sleeping-bed-v2.png` | ✅ approved sample | ยังไม่เป็น runtime background |
| Hero front/back/side | `public/prototypes/hero-*.png` | ✅ | 4 มุม + body layers |
| Mother dialogue portrait | `public/npc/mother-portrait.png` | ✅ | Nano Banana Pro 4K |
| Mother full-body | `public/npc/mother-fullbody.png` | ✅ | canonical ref |
| Mother full-body nobg | `public/npc/mother-fullbody-nobg-v3.png` | ✅ | cutscene / sprite |
| F1 memory (popup) | `public/memories/images/mother-f1.png` | ✅ **locked** | Higgsfield 165035 |
| F1 in-scene inner | `public/memories/images/mother-f1-inner.png` | ✅ | overlay ในกรอบ |
| Cutscene video | `public/cutscenes/mother-basin-entry-v2.mp4` | ✅ sample | Kling 3.0 1080p; ยังไม่ wire |
| Letter content | `cutscenes.ts` | ✅ | draft AGENTS.md |
| Registry | `lib/game/scenes/bedroom/assets.ts` | ✅ | URLs + bbox |
| Audio | — | Out of scope M1 | |

### E.5 Scene Composition Strategy (ใหม่ — บทเรียนจาก Higgsfield)

**ปัญหา:** image-to-image regenerate ทั้งฉากทำให้เตียง/เฟอร์นิเจอร์ drift แม้ v2/v3 ดีขึ้น

**แนะนำ production:**

1. **Background คงที่** — `hero-sleeping-bed-v2.png` (หรือ `bedroom.png` + hero overlay)
2. **Overlay layers ใน `BedroomScene`:** F1 portrait (ทำแล้ว), hero sprite เมื่อ explore, mother sprite ตอน cutscene
3. **Video cutscene** — เล่น fullscreen overlay ก่อน dialogue (optional polish)
4. **อย่า** regenerate ทั้งเฟรมเพื่อแก้รายละเอียดเล็กๆ — ใช้ composite

### E.4 Integration with Next.js `/game` + Register Gate

```
/register (server check cookie)
    ↓ POST /api/register
/game (server check cookie → GameClient)
    ↓
BedroomGameClient (client)
    ├── useGameLoop + bedroomReducer
    ├── BedroomScene (world image + hero + mother cutscene sprite)
    ├── DialoguePanel (cutscene)
    ├── QuestSidebar
    ├── GameModal (letter / memory)
    └── TouchControls
```

- เก็บ `app/game/page.tsx` gate pattern
- **แทนที่** `GameClient` content — visual novel components (`ChoicePanel`, graph `PixelMap`) ถอดหรือเก็บใน `reference/` จนกว่าจะลบ
- `lib/story/*` เก็บเป็น reference หรือ migrate media types ไป `lib/game/types.ts`
- Logout คง `/api/logout`

---

## F. Phased Rollout After Bedroom

| Milestone | Scope | สถานะ |
|---|---|---|
| **M1-core — Bedroom Playable** | Engine + dialogue cutscene + F1 + sidebar + door placeholder | ✅ **Done** |
| **M1-polish — Opening Visual** | Lock `hero-sleeping-bed-v2` background; F1 bbox tune; mother sprite/video; collision; WebP | ⏳ **Current** |
| **M2 — Outdoor Hub Slice** | Transition ประตู → outdoor mini-map F2–F3 | Not started |
| **M3 — Cat Arc Start** | F4 ฟ่อน, F5 ฟู | Demo only |
| **M4 — Continuous Map v1** | Stitch zones, collision ทั้งแมพ | Not started |
| **M5 — Mid-game Fragments** | F6–F9 | Not started |
| **M6 — Full 12 + Final** | F10–F12, Golden Bridge, video | Not started |
| **M7 — Polish & Deploy** | Day/night, iPad perf, Netlify | Partial |

---

## G. Open Questions / Blockers

| # | หัวข้อ | Block M1? | หมายเหตุ |
|---|---|---|---|
| 3 | **รูปกรอบ F1 (แม่)** | ~~Soft block~~ | ✅ **Locked** — `mother-f1.png` + overlay |
| 13 | **Mother NPC look** | ~~Partial~~ | ✅ **Locked** — full-body + portrait Higgsfield |
| 12 | **ภาษาเหนือของแม่** | No | Draft กลางใน M1 |
| 1 | F10–F11 | No M1 | ต้อง lock ก่อน M5 |
| 2 | F7 ศาลา | No M1 | |
| 4–11 | F2–F9, final video | No M1 | sidebar teaser พอ |

**Blockers ทางเทคนิค (อัปเดต):**

1. ~~Pivot Next.js~~ — ✅ ทำแล้ว
2. **Opening background lock** — เลือก v2 vs composite บน `bedroom.png`
3. **F1 bbox** — retune เมื่อเปลี่ยน background
4. **Collision tune** — colliders vs ฉากที่ lock
5. **Scene size** — compress WebP ก่อน deploy/iPad
6. **Video cutscene** — ตัดสินใจ wire หรือเก็บเป็น dialogue-only
7. **Kling character ref** — ไม่มี `--image` ref; ใช้ composite/end-frame ถ้าต้องการ likeness แม่ในวิดีโอ

---

## H. Immediate Next Actionable Tasks

ลำดับ execution — **หลัง M1-core แล้ว:**

1. - [ ] **Lock opening background** — ใช้ `hero-sleeping-bed-v2-web.png` เป็น `BEDROOM_SCENE_IMAGE` หรือ composite hero-on-bed layer
2. - [ ] **Retune `F1_PHOTO_FRAME` bbox** — ให้ตรงกรอบบนโต๊ะ doily บนฉากที่ lock (debug overlay ช่วยได้)
3. - [ ] **Retune collision** — walk ทั่วห้อง; แก้ rects ใน `collision.ts`
4. - [ ] **Mother cutscene visual** — sprite walk-in จาก `mother-fullbody-nobg-v3` หรือ wire `mother-basin-entry-v2.mp4` ก่อน dialogue
5. - [ ] **Compress assets** — WebP สำหรับ bedroom + hero-sleeping scene
6. - [ ] **Task 1.1 Story Bible** — lock F7, F10–F11; สร้าง `MEMORY_FRAGMENTS.md`
7. - [ ] **Manual QA** — desktop + iPad; บันทึก bbox/collision gaps
8. - [ ] **M2 prep** — วางแผน outdoor transition จากประตู (port `opening-demo` outdoor)

### ~~Completed (M1-core)~~

- [x] Lock bedroom scene asset → `public/scenes/bedroom/bedroom.png`
- [x] `collision.ts` + `interactables.ts` + engine + reducer tests
- [x] Port cutscenes → `cutscenes.ts`
- [x] `BedroomGameClient` + `BedroomScene` + `HeroSprite`
- [x] `QuestSidebar` + `GameModal` + input hooks
- [x] F1 memory + mother portrait assets (Higgsfield)
- [x] Photo frame overlay + dialogue mother portrait

---

## Appendix: Production File Structure (implemented)

```text
lib/game/
  engine/          ✅ movement, camera, interact, math, types
  input/           ✅ detectInputMode, useGameInput
  scenes/bedroom/
    assets.ts      ✅ canonical URLs + F1 bbox
    collision.ts   ✅ (needs tune)
    interactables.ts ✅
    cutscenes.ts   ✅
  quest/           ✅ bedroom-quest, fragment-state
  bedroom-reducer.ts ✅
  bedroom-reducer.test.ts ✅

components/game/
  BedroomScene.tsx     ✅
  HeroSprite.tsx       ✅
  DialoguePanel.tsx    ✅
  QuestSidebar.tsx     ✅
  GameModal.tsx        ✅
  TouchControls.tsx    ✅

app/game/
  BedroomGameClient.tsx ✅
  GameClient.tsx        ✅ wrapper

public/
  scenes/bedroom/       ✅ bedroom.png
  npc/                  ✅ mother + hero-sleeping samples
  memories/images/      ✅ mother-f1.png, mother-f1-inner.png
  cutscenes/            ✅ mother-basin-entry*.mp4
```

---

## Appendix: Demo vs Production Gap Summary (อัปเดต)

| หัวข้อ | เดิม | ตอนนี้ |
|---|---|---|
| Next.js production | visual novel | ✅ Bedroom free-walk |
| Cutscene แม่ | มีแค่ opening-demo | ✅ dialogue ใน production; ⏳ video/sprite |
| F1 กรอบรูป | placeholder | ✅ canonical portrait + overlay |
| Mother portrait | CSS block | ✅ Higgsfield assets |
| Opening แฟนนอนเตียง | ไม่มีใน production | ⏳ sample v2 approved; ยังไม่ wire |
| Collision | demo only | ⏳ มีแต่ต้อง tune |
| Scene regenerate | — | ใช้ composite แทน full-scene regen |

---

*Last updated: 2026-06-27 (evening) — post M1-core implementation + Higgsfield assets*
