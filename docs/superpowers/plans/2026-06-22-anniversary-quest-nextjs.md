# Anniversary Quest Next.js Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the approved Next.js App Router version of Anniversary Quest with a server-side soft register gate, pixel RPG story game, graph-constrained map movement, journal, badges, and image/video memory reveals.

**Architecture:** Scaffold a TypeScript Next.js app in the existing project, preserving the current static prototype as reference documentation. Keep server-side access logic in `lib/auth`, pure story state in `lib/story`, and interactive UI in focused client components under `components/game` plus `app/game/GameClient.tsx`.

**Tech Stack:** Next.js App Router, TypeScript, React, CSS Modules, Vitest for unit tests, local media assets under `public/memories`, environment variables for register credentials.

## Global Constraints

- The GitHub repository should be private because it will contain personal images and videos.
- Do not commit `.env.local`.
- Do commit `.env.example`.
- No real account system.
- No database.
- No email, OAuth, or auth provider.
- No protected media streaming in the first version.
- Videos use `<video controls playsInline preload="metadata">` and do not autoplay by default.
- If a video is larger than about 50-80 MB, use Git LFS or external hosting instead of normal git.
- Choices are not visible until the current node's lines are complete.
- Character movement is constrained to graph waypoints.
- Story nodes declare a destination, not full hardcoded routes.

---

## File Structure

Create or migrate toward this structure:

```text
app/
  layout.tsx
  page.tsx
  globals.css
  register/
    page.tsx
    RegisterForm.tsx
    register.module.css
  api/
    register/
      route.ts
  game/
    page.tsx
    GameClient.tsx
    game.module.css

components/
  game/
    BadgeTray.tsx
    ChoicePanel.tsx
    DialogueBox.tsx
    JournalLog.tsx
    MemoryViewer.tsx
    PixelMap.tsx

lib/
  auth/
    access-cookie.ts
  story/
    game-reducer.ts
    game-reducer.test.ts
    map-graph.ts
    route-finding.ts
    route-finding.test.ts
    story-data.ts
    story-types.ts

public/
  memories/
    images/
      .gitkeep
    videos/
      .gitkeep

reference/
  static-prototype/
    index.html
    script.js
    styles.css
```

## Task 1: Scaffold Next.js and Preserve Static Prototype

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `.gitignore`
- Create: `.env.example`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/globals.css`
- Create: `reference/static-prototype/index.html`
- Create: `reference/static-prototype/script.js`
- Create: `reference/static-prototype/styles.css`
- Modify: `index.html`, `script.js`, `styles.css` may be removed after copying to `reference/static-prototype/`

**Interfaces:**
- Produces: Next.js project scripts: `dev`, `build`, `lint`, `test`
- Produces: environment variable contract documented in `.env.example`

- [ ] **Step 1: Copy static prototype into reference folder**

Run:

```bash
mkdir -p reference/static-prototype
cp index.html reference/static-prototype/index.html
cp script.js reference/static-prototype/script.js
cp styles.css reference/static-prototype/styles.css
```

Expected: `reference/static-prototype/` contains the current working static demo.

- [ ] **Step 2: Create package and config files**

Create `package.json`:

```json
{
  "name": "anniversary-quest",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run"
  },
  "dependencies": {
    "next": "latest",
    "react": "latest",
    "react-dom": "latest"
  },
  "devDependencies": {
    "@types/node": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "typescript": "latest",
    "vitest": "latest"
  }
}
```

Create `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "reference/static-prototype"]
}
```

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts"]
  },
  resolve: {
    alias: {
      "@": new URL(".", import.meta.url).pathname
    }
  }
});
```

Create `.gitignore`:

```gitignore
node_modules
.next
out
.env
.env.local
.env*.local
*.log
```

Create `.env.example`:

```env
ANNIVERSARY_ALLOWED_NAME=Perthyw
ANNIVERSARY_ALLOWED_CODE=12/07/2003
ANNIVERSARY_COOKIE_SECRET=replace-with-a-long-random-string
```

- [ ] **Step 3: Create base app files**

Create `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anniversary Quest",
  description: "A private pixel story game for anniversary and birthday memories."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
```

Create `app/page.tsx`:

```tsx
import { redirect } from "next/navigation";
import { hasAccessCookie } from "@/lib/auth/access-cookie";

export default async function HomePage() {
  if (await hasAccessCookie()) {
    redirect("/game");
  }

  redirect("/register");
}
```

Create `app/globals.css`:

```css
:root {
  --ink: #15151a;
  --paper: #f4f0e8;
  --panel: #fff9ef;
  --line: #2e2b2f;
  --accent: #d94f70;
  --accent-dark: #8f2f48;
  --green: #83b96f;
  --green-dark: #4d7b4c;
  --path: #d8b96f;
  --sky: #9fd4d8;
  --shadow: rgba(21, 21, 26, 0.22);
}

* {
  box-sizing: border-box;
}

html {
  min-height: 100%;
  background:
    linear-gradient(45deg, rgba(21, 21, 26, 0.04) 25%, transparent 25%) 0 0 / 16px 16px,
    linear-gradient(-45deg, rgba(21, 21, 26, 0.035) 25%, transparent 25%) 0 0 / 16px 16px,
    var(--paper);
}

body {
  min-height: 100dvh;
  margin: 0;
  color: var(--ink);
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
}

button,
input {
  font: inherit;
}

@media (prefers-color-scheme: dark) {
  :root {
    --ink: #f6f1e8;
    --paper: #18191f;
    --panel: #24242c;
    --line: #f6f1e8;
    --accent: #f06c8a;
    --accent-dark: #ff9ab0;
    --sky: #517b89;
    --shadow: rgba(0, 0, 0, 0.42);
  }
}
```

- [ ] **Step 4: Run install and verify scaffold**

Run:

```bash
npm install
npm run test
```

Expected: dependencies install and Vitest reports no test files or zero tests without TypeScript config errors.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json next.config.ts tsconfig.json vitest.config.ts .gitignore .env.example app reference
git commit -m "chore: scaffold next app for anniversary quest"
```

## Task 2: Implement Access Cookie Helpers

**Files:**
- Create: `lib/auth/access-cookie.ts`

**Interfaces:**
- Produces: `ACCESS_COOKIE_NAME: "anniversary_access"`
- Produces: `signAccessValue(secret: string): string`
- Produces: `verifyAccessValue(value: string | undefined, secret: string): boolean`
- Produces: `hasAccessCookie(): Promise<boolean>`
- Produces: `buildAccessCookieValue(): string`

- [ ] **Step 1: Create helper implementation**

Create `lib/auth/access-cookie.ts`:

```ts
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ACCESS_COOKIE_NAME = "anniversary_access";
const ACCESS_COOKIE_PAYLOAD = "anniversary-quest-access";

function getSecret(): string {
  const secret = process.env.ANNIVERSARY_COOKIE_SECRET;
  if (!secret) {
    throw new Error("ANNIVERSARY_COOKIE_SECRET is required");
  }
  return secret;
}

export function signAccessValue(secret: string): string {
  const signature = createHmac("sha256", secret)
    .update(ACCESS_COOKIE_PAYLOAD)
    .digest("hex");

  return `${ACCESS_COOKIE_PAYLOAD}.${signature}`;
}

export function verifyAccessValue(value: string | undefined, secret: string): boolean {
  if (!value) return false;

  const expected = signAccessValue(secret);
  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);

  if (valueBuffer.length !== expectedBuffer.length) return false;

  return timingSafeEqual(valueBuffer, expectedBuffer);
}

export function buildAccessCookieValue(): string {
  return signAccessValue(getSecret());
}

export async function hasAccessCookie(): Promise<boolean> {
  const cookieStore = await cookies();
  const value = cookieStore.get(ACCESS_COOKIE_NAME)?.value;
  return verifyAccessValue(value, getSecret());
}
```

- [ ] **Step 2: Run TypeScript build check**

Run:

```bash
npm run build
```

Expected: build fails only if later tasks have not yet created required imports from `app/page.tsx`. If `app/page.tsx` already imports this file, it should compile.

- [ ] **Step 3: Commit**

```bash
git add lib/auth/access-cookie.ts app/page.tsx
git commit -m "feat: add signed access cookie helpers"
```

## Task 3: Build Register Gate

**Files:**
- Create: `app/register/page.tsx`
- Create: `app/register/RegisterForm.tsx`
- Create: `app/register/register.module.css`
- Create: `app/api/register/route.ts`

**Interfaces:**
- Consumes: `buildAccessCookieValue`, `ACCESS_COOKIE_NAME`, `hasAccessCookie`
- Produces: `POST /api/register` accepting `{ name: string; code: string }`
- Produces: redirect from `/register` to `/game` when cookie is valid

- [ ] **Step 1: Create API route**

Create `app/api/register/route.ts`:

```ts
import { NextResponse } from "next/server";
import { ACCESS_COOKIE_NAME, buildAccessCookieValue } from "@/lib/auth/access-cookie";

type RegisterBody = {
  name?: string;
  code?: string;
};

function normalize(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as RegisterBody;
  const name = normalize(body.name);
  const code = normalize(body.code);
  const allowedName = normalize(process.env.ANNIVERSARY_ALLOWED_NAME);
  const allowedCode = normalize(process.env.ANNIVERSARY_ALLOWED_CODE);

  if (!allowedName || !allowedCode) {
    return NextResponse.json(
      { ok: false, message: "ประตูความทรงจำยังไม่ได้ตั้งค่ากุญแจ" },
      { status: 500 }
    );
  }

  if (name !== allowedName || code !== allowedCode) {
    return NextResponse.json(
      { ok: false, message: "ยังไม่ใช่กุญแจของเรื่องนี้ ลองอีกครั้งนะ" },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ACCESS_COOKIE_NAME, buildAccessCookieValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });

  return response;
}
```

- [ ] **Step 2: Create register page**

Create `app/register/page.tsx`:

```tsx
import { redirect } from "next/navigation";
import { hasAccessCookie } from "@/lib/auth/access-cookie";
import { RegisterForm } from "./RegisterForm";
import styles from "./register.module.css";

export default async function RegisterPage() {
  if (await hasAccessCookie()) {
    redirect("/game");
  }

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="register-title">
        <p className={styles.kicker}>Memory Gate</p>
        <h1 id="register-title">ประตูเมืองความทรงจำ</h1>
        <p className={styles.copy}>
          ใส่ชื่อกับรหัสวันเกิด เพื่อเปิดทางเข้าเควสต์เล็กๆ ที่ทำไว้ให้คนเดียว
        </p>
        <RegisterForm />
      </section>
    </main>
  );
}
```

Create `app/register/RegisterForm.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./register.module.css";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, code })
    });

    const payload = (await response.json().catch(() => ({}))) as {
      ok?: boolean;
      message?: string;
    };

    setIsSubmitting(false);

    if (!response.ok || !payload.ok) {
      setMessage(payload.message || "ประตูยังไม่เปิด ลองใหม่อีกครั้งนะ");
      return;
    }

    router.push("/game");
    router.refresh();
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <label>
        <span>ชื่อผู้เล่น</span>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="name"
          placeholder="Perthyw"
        />
      </label>

      <label>
        <span>รหัสวันเกิด</span>
        <input
          value={code}
          onChange={(event) => setCode(event.target.value)}
          inputMode="numeric"
          placeholder="12/07/2003"
        />
      </label>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "กำลังเปิดประตู..." : "เปิดประตูความทรงจำ"}
      </button>

      {message ? <p className={styles.error}>{message}</p> : null}
    </form>
  );
}
```

- [ ] **Step 3: Create register CSS**

Create `app/register/register.module.css`:

```css
.page {
  width: min(720px, calc(100% - 28px));
  min-height: 100dvh;
  margin: 0 auto;
  display: grid;
  place-items: center;
  padding: 24px 0;
}

.card {
  width: 100%;
  border: 4px solid var(--line);
  background: var(--panel);
  box-shadow: 8px 8px 0 var(--line);
  padding: clamp(20px, 5vw, 42px);
}

.kicker {
  margin: 0 0 8px;
  color: var(--accent-dark);
  font-size: 12px;
}

.card h1 {
  margin: 0;
  font-size: clamp(28px, 8vw, 54px);
  line-height: 1.05;
}

.copy {
  max-width: 56ch;
  margin: 14px 0 24px;
  line-height: 1.7;
}

.form {
  display: grid;
  gap: 14px;
}

.form label {
  display: grid;
  gap: 8px;
}

.form input {
  width: 100%;
  border: 3px solid var(--line);
  background: #fffdf8;
  color: #15151a;
  padding: 12px;
  box-shadow: 4px 4px 0 var(--line);
}

.form button {
  border: 3px solid var(--line);
  background: var(--accent);
  color: #fffdf8;
  padding: 12px;
  box-shadow: 4px 4px 0 var(--line);
  cursor: pointer;
}

.form button:disabled {
  cursor: wait;
  opacity: 0.72;
}

.error {
  margin: 0;
  color: var(--accent-dark);
  line-height: 1.6;
}
```

- [ ] **Step 4: Verify register flow compile**

Run:

```bash
npm run build
```

Expected: Next.js production build succeeds.

- [ ] **Step 5: Commit**

```bash
git add app/register app/api/register lib/auth .env.example
git commit -m "feat: add memory gate register flow"
```

## Task 4: Add Story Types, Data, and Route Finding

**Files:**
- Create: `lib/story/story-types.ts`
- Create: `lib/story/map-graph.ts`
- Create: `lib/story/route-finding.ts`
- Create: `lib/story/route-finding.test.ts`
- Create: `lib/story/story-data.ts`

**Interfaces:**
- Produces: `findRoute(from: MapPointKey, to: MapPointKey): MapPointKey[]`
- Produces: `storyNodes: Record<StoryNodeId, StoryNode>`
- Produces: `mapPoints: Record<MapPointKey, { x: string; y: string }>`

- [ ] **Step 1: Define story types**

Create `lib/story/story-types.ts`:

```ts
export type MapPointKey =
  | "start"
  | "anniversaryJunction"
  | "anniversary"
  | "birthdayJunction"
  | "birthday"
  | "childhoodJunction"
  | "childhood"
  | "finalJunction"
  | "finalGate";

export type StoryNodeId =
  | "start"
  | "anniversary"
  | "birthday"
  | "childhood"
  | "funnyMemory"
  | "hardSeason"
  | "gift"
  | "letter"
  | "kidYears"
  | "growingUp"
  | "finalGate"
  | "sweetEnding"
  | "playfulEnding";

export type MemoryMedia =
  | {
      type: "image";
      src: string;
      alt: string;
      caption?: string;
    }
  | {
      type: "gallery";
      items: {
        src: string;
        alt: string;
        caption?: string;
      }[];
    }
  | {
      type: "video";
      src: string;
      caption?: string;
      poster?: string;
    };

export type StoryLine = {
  text: string;
  media?: MemoryMedia[];
};

export type StoryChoice = {
  label: string;
  next: StoryNodeId;
  journal?: string;
};

export type StoryReward = {
  type: "badge";
  id: string;
  label: string;
};

export type StoryNode = {
  id: StoryNodeId;
  speaker: string;
  chapter: string;
  destination: MapPointKey;
  lines: StoryLine[];
  choices: StoryChoice[];
  rewards?: StoryReward[];
};
```

- [ ] **Step 2: Define map graph and route finder**

Create `lib/story/map-graph.ts`:

```ts
import type { MapPointKey } from "./story-types";

export const mapPoints: Record<MapPointKey, { x: string; y: string }> = {
  start: { x: "50%", y: "58%" },
  anniversaryJunction: { x: "28%", y: "58%" },
  anniversary: { x: "28%", y: "27%" },
  birthdayJunction: { x: "75%", y: "58%" },
  birthday: { x: "75%", y: "25%" },
  childhoodJunction: { x: "18%", y: "58%" },
  childhood: { x: "18%", y: "45%" },
  finalJunction: { x: "50%", y: "58%" },
  finalGate: { x: "50%", y: "35%" }
};

export const mapGraph: Record<MapPointKey, MapPointKey[]> = {
  start: ["anniversaryJunction", "birthdayJunction", "childhoodJunction", "finalJunction"],
  anniversaryJunction: ["start", "anniversary"],
  anniversary: ["anniversaryJunction"],
  birthdayJunction: ["start", "birthday"],
  birthday: ["birthdayJunction"],
  childhoodJunction: ["start", "childhood"],
  childhood: ["childhoodJunction"],
  finalJunction: ["start", "finalGate"],
  finalGate: ["finalJunction"]
};
```

Create `lib/story/route-finding.ts`:

```ts
import { mapGraph } from "./map-graph";
import type { MapPointKey } from "./story-types";

export function findRoute(from: MapPointKey, to: MapPointKey): MapPointKey[] {
  if (from === to) return [from];

  const queue: MapPointKey[][] = [[from]];
  const visited = new Set<MapPointKey>([from]);

  while (queue.length > 0) {
    const route = queue.shift();
    if (!route) break;

    const last = route[route.length - 1];
    const neighbors = mapGraph[last] || [];

    for (const neighbor of neighbors) {
      if (visited.has(neighbor)) continue;

      const nextRoute = [...route, neighbor];
      if (neighbor === to) return nextRoute;

      visited.add(neighbor);
      queue.push(nextRoute);
    }
  }

  return [from];
}
```

- [ ] **Step 3: Add route tests**

Create `lib/story/route-finding.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { findRoute } from "./route-finding";

describe("findRoute", () => {
  it("finds a path from start to anniversary", () => {
    expect(findRoute("start", "anniversary")).toEqual([
      "start",
      "anniversaryJunction",
      "anniversary"
    ]);
  });

  it("finds a path from birthday to finalGate through start", () => {
    expect(findRoute("birthday", "finalGate")).toEqual([
      "birthday",
      "birthdayJunction",
      "start",
      "finalJunction",
      "finalGate"
    ]);
  });

  it("returns the current point when already at destination", () => {
    expect(findRoute("finalGate", "finalGate")).toEqual(["finalGate"]);
  });
});
```

- [ ] **Step 4: Add initial story data**

Create `lib/story/story-data.ts` with the migrated story content:

```ts
import type { StoryNode, StoryNodeId } from "./story-types";

export const initialNodeId: StoryNodeId = "start";

export const storyNodes: Record<StoryNodeId, StoryNode> = {
  start: {
    id: "start",
    speaker: "Pixel Guide",
    chapter: "เมืองความทรงจำ",
    destination: "start",
    lines: [
      { text: "ยินดีต้อนรับสู่เมืองความทรงจำ" },
      { text: "วันนี้ไม่ใช่เควสต์ธรรมดา เพราะมีสองวันสำคัญซ้อนกันอยู่ใกล้ๆ" },
      { text: "วันที่ 9 กรกฎาคมคือครบรอบ 2 ปี 5 เดือน และวันที่ 12 กรกฎาคมคือวันเกิดของเธอ" },
      { text: "ก่อนออกเดินทาง เลือกเส้นทางแรกที่อยากเปิดอ่าน" }
    ],
    choices: [
      { label: "ไปวันที่ 9 ก.ค.", next: "anniversary", journal: "เลือกเส้นทางครบรอบ" },
      { label: "ไปวันที่ 12 ก.ค.", next: "birthday", journal: "เลือกเส้นทางวันเกิด" },
      { label: "เปิดสมุดวัยเด็ก", next: "childhood", journal: "เปิดบทวัยเด็ก" }
    ]
  },
  anniversary: {
    id: "anniversary",
    speaker: "Pixel Guide",
    chapter: "เส้นทาง 9 กรกฎาคม",
    destination: "anniversary",
    lines: [
      { text: "ถนนเส้นนี้พาเรากลับไปวันที่ความสัมพันธ์เริ่มมีน้ำหนักมากขึ้นเรื่อยๆ" },
      {
        text: "นี่คือช่องสำหรับรูปแรกที่ควรเปิดช้าๆ ไม่ใช่รีบผ่าน",
        media: [
          {
            type: "image",
            src: "/memories/images/first-date.jpg",
            alt: "รูปความทรงจำเดทแรก",
            caption: "เดทแรก"
          }
        ]
      },
      { text: "ตรงนี้ควรใส่ความทรงจำจริง: [เติมความทรงจำวันสำคัญของคู่เรา]" },
      { text: "จากความทรงจำนี้ เกมจะแตกไปได้สองอารมณ์" }
    ],
    choices: [
      { label: "เล่าโมเมนต์ตลก", next: "funnyMemory", journal: "เก็บโมเมนต์ตลก" },
      { label: "เล่าช่วงที่ผ่านยาก", next: "hardSeason", journal: "เก็บบทที่โตไปด้วยกัน" },
      { label: "กลับจุดเริ่มต้น", next: "start", journal: "กลับเมืองความทรงจำ" }
    ]
  },
  birthday: {
    id: "birthday",
    speaker: "Birthday NPC",
    chapter: "เส้นทาง 12 กรกฎาคม",
    destination: "birthday",
    lines: [
      { text: "ป้ายข้างทางเขียนว่า 12 กรกฎาคม" },
      { text: "บทวันเกิดไม่ควรมีแค่คำว่า ขอให้มีความสุข นั่นฟังถูกแต่ยังไม่พิเศษพอ" },
      { text: "ให้เล่าว่าเธอเป็นคนแบบไหนในสายตาคุณ: [เติมนิสัยหรือคุณค่าที่คุณรักในตัวเธอ]" },
      { text: "ปลายทางมีทั้งกล่องของขวัญและจดหมาย เลือกว่าจะเปิดอะไรก่อน" }
    ],
    choices: [
      { label: "ของขวัญในเกม", next: "gift", journal: "พบกล่องของขวัญ" },
      { label: "จดหมายสั้น", next: "letter", journal: "พบจดหมายวันเกิด" },
      { label: "กลับจุดเริ่มต้น", next: "start", journal: "กลับเมืองความทรงจำ" }
    ]
  },
  childhood: {
    id: "childhood",
    speaker: "Family Memory",
    chapter: "บ้านหลังแรก",
    destination: "childhood",
    lines: [
      { text: "ทางซ้ายคือบ้านหลังแรกในสมุดความทรงจำ" },
      { text: "บทนี้ต้องใช้ข้อมูลจริงเท่านั้น เพราะเรื่องครอบครัวแต่งแทนกันไม่ได้" },
      { text: "ให้เก็บเรื่องเล็กๆ ที่บ้านยังจำได้ เช่น ของกินที่ชอบ คนที่ดูแล หรือเรื่องที่ครอบครัวภูมิใจ" },
      { text: "เมื่อพร้อมแล้ว เลือกว่าจะเปิดวัยเด็กหรือวันที่เธอโตขึ้น" }
    ],
    choices: [
      { label: "วัยเด็ก", next: "kidYears", journal: "เปิดกล่องวัยเด็ก" },
      { label: "วันที่โตขึ้น", next: "growingUp", journal: "เปิดบทเติบโต" },
      { label: "กลับจุดเริ่มต้น", next: "start", journal: "กลับเมืองความทรงจำ" }
    ]
  },
  funnyMemory: {
    id: "funnyMemory",
    speaker: "Pixel Guide",
    chapter: "ฉากหัวเราะ",
    destination: "anniversaryJunction",
    lines: [
      { text: "บางความทรงจำไม่ได้ยิ่งใหญ่ แต่กลับจำแม่นกว่าเรื่องใหญ่ๆ" },
      { text: "อาจเป็นคำพูดติดปาก ร้านที่ไปแล้วเจอเรื่องแปลก หรือวันที่หลงทางแบบน่าหัวเราะ" },
      { text: "ใส่เหตุการณ์เฉพาะของคู่คุณตรงนี้: [เติมมุกหรือโมเมนต์ตลก]" },
      { text: "เกมมอบ badge ให้หนึ่งอัน เพราะการหัวเราะด้วยกันคือของดีมาก" }
    ],
    rewards: [{ type: "badge", id: "laugh", label: "Laugh" }],
    choices: [
      { label: "เก็บเป็น badge", next: "finalGate", journal: "ได้ badge: Laugh" },
      { label: "ไปวันเกิด", next: "birthday", journal: "เดินต่อไปวันเกิด" },
      { label: "กลับ", next: "anniversary", journal: "กลับเส้นทางครบรอบ" }
    ]
  },
  hardSeason: {
    id: "hardSeason",
    speaker: "Pixel Guide",
    chapter: "ฉากที่ไม่ง่าย",
    destination: "start",
    lines: [
      { text: "เส้นทางบางช่วงไม่ควรเล่าด้วยเสียงเศร้าเกินจริง" },
      { text: "เล่าให้ตรงก็พอว่าเคยผ่านอะไร และอะไรทำให้ยังเลือกเดินต่อด้วยกัน" },
      { text: "ตรงนี้ใส่ช่วงเวลาที่โตไปด้วยกัน: [เติมเรื่องจริงที่ผ่านยากแต่สำคัญ]" },
      { text: "บทนี้ควรจบด้วยความรู้สึกว่า เราไม่ได้สมบูรณ์แบบ แต่เราเรียนรู้กันจริง" }
    ],
    rewards: [{ type: "badge", id: "brave", label: "Brave" }],
    choices: [
      { label: "เก็บเป็น badge", next: "finalGate", journal: "ได้ badge: Brave" },
      { label: "ไปวัยเด็ก", next: "childhood", journal: "เดินต่อไปบ้านความทรงจำ" },
      { label: "กลับ", next: "anniversary", journal: "กลับเส้นทางครบรอบ" }
    ]
  },
  gift: {
    id: "gift",
    speaker: "Birthday NPC",
    chapter: "กล่องของขวัญ",
    destination: "birthdayJunction",
    lines: [
      { text: "กล่องนี้ไม่จำเป็นต้องเป็นของแพง" },
      { text: "แต่มันควรเชื่อมกับสิ่งที่เธอชอบจริง เช่น เดทหนึ่งวัน รูปหนึ่งเซ็ต หรือเพลงหนึ่งเพลง" },
      { text: "ตัวอย่างช่องข้อมูล: [เติมของขวัญหรือแผนเซอร์ไพรส์วันที่ 12 กรกฎาคม]" },
      { text: "เมื่อเปิดกล่องแล้ว จะพาไปจดหมายหรือฉากสุดท้ายก็ได้" }
    ],
    choices: [
      { label: "เปิดจดหมาย", next: "letter", journal: "เปิดจดหมายวันเกิด" },
      { label: "ไปฉากสุดท้าย", next: "finalGate", journal: "นำของขวัญไปฉากสุดท้าย" },
      { label: "กลับ", next: "birthday", journal: "กลับเส้นทางวันเกิด" }
    ]
  },
  letter: {
    id: "letter",
    speaker: "You",
    chapter: "จดหมาย",
    destination: "finalJunction",
    lines: [
      { text: "จดหมายถูกพับไว้ในซองเล็กๆ" },
      { text: "สุขสันต์วันเกิดนะ [ชื่อแฟน]" },
      { text: "ขอบคุณที่โตมาเป็นคนที่ฉันได้รัก และขอบคุณที่ให้ฉันได้อยู่ในหลายหน้าของชีวิตเธอ" },
      { text: "ถ้าจะทำให้แรงกว่านี้ ให้เปลี่ยนประโยคสุดท้ายเป็นภาษาของคุณเอง อย่าใช้ประโยคที่ดูดีแต่ไม่ใช่คุณ" }
    ],
    rewards: [{ type: "badge", id: "love-letter", label: "Love Letter" }],
    choices: [
      { label: "เก็บเป็น badge", next: "finalGate", journal: "ได้ badge: Love Letter" },
      { label: "ไปครอบครัว", next: "childhood", journal: "เดินต่อไปบทครอบครัว" },
      { label: "กลับ", next: "birthday", journal: "กลับเส้นทางวันเกิด" }
    ]
  },
  kidYears: {
    id: "kidYears",
    speaker: "Family Memory",
    chapter: "วัยเด็ก",
    destination: "childhoodJunction",
    lines: [
      { text: "กล่องวัยเด็กเปิดออกมาเป็นภาพเล็กๆ หลายใบ" },
      { text: "อาจเป็นของเล่นที่ชอบ อาหารที่บ้านทำให้ หรือเรื่องที่ครอบครัวยังเล่าอยู่เสมอ" },
      { text: "ช่องนี้ควรใส่รูปหรือเสียงจากครอบครัว ถ้าขอมาได้จะดีมาก" },
      { text: "นี่คือบทที่ทำให้เว็บไม่ใช่แค่ของขวัญแฟน แต่เป็นบันทึกชีวิตของเธอด้วย" }
    ],
    rewards: [{ type: "badge", id: "little-star", label: "Little Star" }],
    choices: [
      { label: "วัยเรียน", next: "growingUp", journal: "เปิดบทวัยเรียน" },
      { label: "เก็บเป็น badge", next: "finalGate", journal: "ได้ badge: Little Star" },
      { label: "กลับ", next: "childhood", journal: "กลับบ้านหลังแรก" }
    ]
  },
  growingUp: {
    id: "growingUp",
    speaker: "Family Memory",
    chapter: "วันที่โตขึ้น",
    destination: "start",
    lines: [
      { text: "บางคนโตขึ้นอย่างเงียบๆ จนคนใกล้ตัวลืมหยุดมองว่าเธอพยายามมาแค่ไหน" },
      { text: "บทนี้ควรเล่าความฝัน ความพยายาม หรือจุดเปลี่ยนที่ทำให้เธอเป็นเธอในวันนี้" },
      { text: "เติมข้อมูลจริงตรงนี้: [เติมเรื่องการเติบโต จุดเปลี่ยน หรือสิ่งที่เธอภูมิใจ]" },
      { text: "จากตรงนี้ เรื่องของครอบครัวจะค่อยๆ เชื่อมกลับไปหาเรื่องของคุณสองคน" }
    ],
    choices: [
      { label: "ไปจดหมาย", next: "letter", journal: "เชื่อมสู่อวยพรวันเกิด" },
      { label: "ไปฉากสุดท้าย", next: "finalGate", journal: "เดินสู่ฉากรวม" },
      { label: "กลับ", next: "childhood", journal: "กลับบ้านหลังแรก" }
    ]
  },
  finalGate: {
    id: "finalGate",
    speaker: "Pixel Guide",
    chapter: "สะพานสองวันสำคัญ",
    destination: "finalGate",
    lines: [
      { text: "ทุกเส้นทางกลับมาที่สะพานเดียวกัน" },
      { text: "ด้านหนึ่งคือวันที่ 9 กรกฎาคม วันที่ความรักนับเวลาเพิ่มขึ้นอีกหนึ่งบท" },
      { text: "อีกด้านคือวันที่ 12 กรกฎาคม วันที่โลกได้รู้จักเธอก่อนที่คุณจะได้รู้จัก" },
      { text: "ตอนจบควรให้เธอเลือกอารมณ์เอง: หวาน หรือขำๆ" }
    ],
    choices: [
      { label: "ฉากจบหวาน", next: "sweetEnding", journal: "เลือกฉากจบหวาน" },
      { label: "ฉากจบขำๆ", next: "playfulEnding", journal: "เลือกฉากจบขำๆ" },
      { label: "เล่นใหม่", next: "start", journal: "เริ่มเควสต์ใหม่" }
    ]
  },
  sweetEnding: {
    id: "sweetEnding",
    speaker: "You",
    chapter: "Ending",
    destination: "finalGate",
    lines: [
      { text: "ขอบคุณที่อยู่ด้วยกันมา 2 ปี 5 เดือน" },
      { text: "และสุขสันต์วันเกิดล่วงหน้า ขอให้ปีนี้เป็นปีที่ใจดีกับเธอมากๆ" },
      { text: "ฉันรักเธอ" },
      { text: "จบเควสต์ แต่ไม่จบเรื่องของเรา" }
    ],
    choices: [
      { label: "เล่นอีกครั้ง", next: "start", journal: "เริ่มเควสต์ใหม่" },
      { label: "ไปจดหมาย", next: "letter", journal: "กลับไปอ่านจดหมาย" },
      { label: "ไปวันเกิด", next: "birthday", journal: "กลับเส้นทางวันเกิด" }
    ]
  },
  playfulEnding: {
    id: "playfulEnding",
    speaker: "Pixel Guide",
    chapter: "Ending",
    destination: "finalGate",
    lines: [
      { text: "เควสต์สำเร็จ" },
      { text: "ผู้เล่นได้รับรางวัล: สิทธิ์กอด 1 ครั้ง อาหารอร่อย 1 มื้อ และคนรักที่ตั้งใจทำเว็บนี้ให้จริงๆ" },
      { text: "ระบบขอแจ้งว่า reward นี้ไม่สามารถแลกคืนเป็นเงินสดได้" },
      { text: "แต่แลกเป็นเดทครั้งต่อไปได้ ถ้าผู้เล่นยิ้มตอนอ่านถึงตรงนี้" }
    ],
    choices: [
      { label: "เล่นอีกครั้ง", next: "start", journal: "เริ่มเควสต์ใหม่" },
      { label: "ไปของขวัญ", next: "gift", journal: "กลับไปกล่องของขวัญ" },
      { label: "ไปครบรอบ", next: "anniversary", journal: "กลับเส้นทางครบรอบ" }
    ]
  }
};
```

- [ ] **Step 5: Run tests**

Run:

```bash
npm run test
```

Expected: all route-finding tests pass.

- [ ] **Step 6: Commit**

```bash
git add lib/story/story-types.ts lib/story/map-graph.ts lib/story/route-finding.ts lib/story/route-finding.test.ts lib/story/story-data.ts
git commit -m "feat: add story graph and route finding"
```

## Task 5: Implement Game Reducer

**Files:**
- Create: `lib/story/game-reducer.ts`
- Create: `lib/story/game-reducer.test.ts`

**Interfaces:**
- Consumes: `storyNodes`, `initialNodeId`, `findRoute`
- Produces: `createInitialGameState()`
- Produces: `gameReducer(state, action)`
- Produces: action types `COMPLETE_TYPING`, `PASS`, `SELECT_CHOICE`, `ARRIVE_AT_POINT`

- [ ] **Step 1: Create reducer**

Create `lib/story/game-reducer.ts`:

```ts
import { findRoute } from "./route-finding";
import { initialNodeId, storyNodes } from "./story-data";
import type { MapPointKey, MemoryMedia, StoryNodeId, StoryReward } from "./story-types";

export type JournalEntry = {
  id: string;
  text: string;
};

export type Badge = {
  id: string;
  label: string;
};

export type GameState = {
  currentNodeId: StoryNodeId;
  currentLineIndex: number;
  isTyping: boolean;
  choicesVisible: boolean;
  currentPointKey: MapPointKey;
  route: MapPointKey[];
  journal: JournalEntry[];
  badges: Badge[];
  activeMedia: MemoryMedia[];
};

export type GameAction =
  | { type: "COMPLETE_TYPING" }
  | { type: "PASS" }
  | { type: "SELECT_CHOICE"; choiceIndex: number }
  | { type: "ARRIVE_AT_POINT"; point: MapPointKey };

function mediaForLine(nodeId: StoryNodeId, lineIndex: number): MemoryMedia[] {
  return storyNodes[nodeId].lines[lineIndex]?.media || [];
}

function addRewards(existing: Badge[], rewards: StoryReward[] | undefined): Badge[] {
  if (!rewards) return existing;

  const next = [...existing];
  for (const reward of rewards) {
    if (reward.type === "badge" && !next.some((badge) => badge.id === reward.id)) {
      next.push({ id: reward.id, label: reward.label });
    }
  }

  return next;
}

export function createInitialGameState(): GameState {
  const node = storyNodes[initialNodeId];
  return {
    currentNodeId: initialNodeId,
    currentLineIndex: 0,
    isTyping: true,
    choicesVisible: false,
    currentPointKey: "start",
    route: ["start"],
    journal: [{ id: "initial", text: "เริ่มที่เมืองความทรงจำ" }],
    badges: [],
    activeMedia: mediaForLine(node.id, 0)
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  const node = storyNodes[state.currentNodeId];

  switch (action.type) {
    case "COMPLETE_TYPING":
      return { ...state, isTyping: false };

    case "PASS": {
      if (state.isTyping) {
        return { ...state, isTyping: false };
      }

      const nextLineIndex = state.currentLineIndex + 1;
      if (nextLineIndex < node.lines.length) {
        return {
          ...state,
          currentLineIndex: nextLineIndex,
          isTyping: true,
          activeMedia: mediaForLine(state.currentNodeId, nextLineIndex)
        };
      }

      return { ...state, choicesVisible: true };
    }

    case "SELECT_CHOICE": {
      if (!state.choicesVisible) return state;

      const choice = node.choices[action.choiceIndex];
      if (!choice) return state;

      const nextNode = storyNodes[choice.next];
      const route = findRoute(state.currentPointKey, nextNode.destination);
      const journal = choice.journal
        ? [{ id: `${Date.now()}-${choice.next}`, text: choice.journal }, ...state.journal].slice(0, 7)
        : state.journal;

      return {
        ...state,
        currentNodeId: nextNode.id,
        currentLineIndex: 0,
        isTyping: true,
        choicesVisible: false,
        route,
        journal,
        badges: addRewards(state.badges, nextNode.rewards),
        activeMedia: mediaForLine(nextNode.id, 0)
      };
    }

    case "ARRIVE_AT_POINT":
      return { ...state, currentPointKey: action.point };

    default:
      return state;
  }
}
```

- [ ] **Step 2: Add reducer tests**

Create `lib/story/game-reducer.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { createInitialGameState, gameReducer } from "./game-reducer";

describe("gameReducer", () => {
  it("starts at the first line with choices hidden", () => {
    const state = createInitialGameState();
    expect(state.currentNodeId).toBe("start");
    expect(state.currentLineIndex).toBe(0);
    expect(state.choicesVisible).toBe(false);
  });

  it("PASS completes typing before advancing", () => {
    const state = createInitialGameState();
    const next = gameReducer(state, { type: "PASS" });
    expect(next.currentLineIndex).toBe(0);
    expect(next.isTyping).toBe(false);
  });

  it("PASS advances lines when typing is complete", () => {
    const state = gameReducer(createInitialGameState(), { type: "PASS" });
    const next = gameReducer(state, { type: "PASS" });
    expect(next.currentLineIndex).toBe(1);
    expect(next.isTyping).toBe(true);
  });

  it("shows choices after the final line", () => {
    let state = createInitialGameState();
    for (let index = 0; index < 8; index += 1) {
      state = gameReducer(state, { type: "PASS" });
    }
    expect(state.choicesVisible).toBe(true);
  });

  it("selecting a choice changes node and computes a route", () => {
    let state = createInitialGameState();
    for (let index = 0; index < 8; index += 1) {
      state = gameReducer(state, { type: "PASS" });
    }

    const next = gameReducer(state, { type: "SELECT_CHOICE", choiceIndex: 0 });
    expect(next.currentNodeId).toBe("anniversary");
    expect(next.route).toEqual(["start", "anniversaryJunction", "anniversary"]);
    expect(next.journal[0].text).toBe("เลือกเส้นทางครบรอบ");
  });

  it("activates media on a line that has memory media", () => {
    let state = createInitialGameState();
    for (let index = 0; index < 8; index += 1) {
      state = gameReducer(state, { type: "PASS" });
    }
    state = gameReducer(state, { type: "SELECT_CHOICE", choiceIndex: 0 });
    state = gameReducer(state, { type: "PASS" });
    state = gameReducer(state, { type: "PASS" });
    state = gameReducer(state, { type: "PASS" });

    expect(state.currentLineIndex).toBe(1);
    expect(state.activeMedia[0]?.type).toBe("image");
  });

  it("records badge rewards once", () => {
    let state = createInitialGameState();
    for (let index = 0; index < 8; index += 1) {
      state = gameReducer(state, { type: "PASS" });
    }
    state = gameReducer(state, { type: "SELECT_CHOICE", choiceIndex: 0 });
    for (let index = 0; index < 8; index += 1) {
      state = gameReducer(state, { type: "PASS" });
    }
    state = gameReducer(state, { type: "SELECT_CHOICE", choiceIndex: 0 });

    expect(state.badges).toEqual([{ id: "laugh", label: "Laugh" }]);
  });
});
```

- [ ] **Step 3: Run tests**

Run:

```bash
npm run test
```

Expected: route-finding and reducer tests pass.

- [ ] **Step 4: Commit**

```bash
git add lib/story/game-reducer.ts lib/story/game-reducer.test.ts
git commit -m "feat: add story game reducer"
```

## Task 6: Build Game UI Components

**Files:**
- Create: `components/game/BadgeTray.tsx`
- Create: `components/game/ChoicePanel.tsx`
- Create: `components/game/DialogueBox.tsx`
- Create: `components/game/JournalLog.tsx`
- Create: `components/game/MemoryViewer.tsx`
- Create: `components/game/PixelMap.tsx`
- Create: `components/game/game-components.module.css`
- Create: `app/game/GameClient.tsx`
- Create: `app/game/game.module.css`

**Interfaces:**
- Consumes: `GameState`, `GameAction`, `storyNodes`, `mapPoints`
- Produces: renderable protected game client

- [ ] **Step 1: Create component CSS**

Create `components/game/game-components.module.css`:

```css
.screenFrame,
.dialoguePanel,
.journal,
.mediaViewer,
.badgeTray {
  border: 4px solid var(--line);
  box-shadow: 8px 8px 0 var(--line);
  background: var(--panel);
}

.screenFrame {
  min-height: 430px;
  padding: 12px;
}

.screen {
  position: relative;
  height: 100%;
  min-height: 402px;
  overflow: hidden;
  border: 3px solid var(--line);
  background: var(--sky);
}

.sky {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(var(--sky) 0 32%, transparent 32%),
    repeating-linear-gradient(0deg, #76b75d 0 24px, #6dad58 24px 48px);
}

.map {
  position: absolute;
  inset: 0;
}

.road {
  position: absolute;
  background:
    linear-gradient(90deg, rgba(255, 255, 255, 0.22) 0 8px, transparent 8px 20px) 0 50% / 20px 6px repeat-x,
    var(--path);
  border: 3px solid #ad8e4a;
  box-shadow: inset 0 0 0 3px rgba(255, 255, 255, 0.18);
}

.roadMain {
  left: 18%;
  right: 18%;
  top: 56%;
  height: 54px;
}

.roadAnniversary,
.roadBirthday,
.roadChildhood,
.roadFinal {
  width: 52px;
  background:
    linear-gradient(0deg, rgba(255, 255, 255, 0.22) 0 8px, transparent 8px 20px) 50% 0 / 6px 20px repeat-y,
    var(--path);
}

.roadAnniversary {
  height: 33%;
  left: 28%;
  top: 26%;
}

.roadBirthday {
  height: 37%;
  right: 25%;
  top: 23%;
}

.roadChildhood {
  left: 18%;
  top: 44%;
  bottom: 16%;
}

.roadFinal {
  left: 48%;
  top: 35%;
  bottom: 28%;
}

.location {
  position: absolute;
  z-index: 2;
  min-width: 58px;
  padding: 6px 8px;
  border: 3px solid var(--line);
  background: #fffdf8;
  color: #15151a;
  font-size: 11px;
  line-height: 1;
  text-align: center;
  box-shadow: 4px 4px 0 var(--line);
}

.locationStart {
  left: calc(50% - 29px);
  top: calc(58% - 19px);
}

.locationAnniversary {
  left: calc(28% - 29px);
  top: calc(27% - 19px);
}

.locationBirthday {
  left: calc(75% - 29px);
  top: calc(25% - 19px);
}

.locationChildhood {
  left: calc(18% - 29px);
  top: calc(45% - 19px);
}

.locationFinal {
  left: calc(50% - 29px);
  top: calc(35% - 19px);
}

.hero {
  --x: 50%;
  --y: 58%;
  position: absolute;
  z-index: 4;
  left: var(--x);
  top: var(--y);
  width: 54px;
  height: 72px;
  transform: translate(-50%, -50%);
  transition: left 360ms steps(4), top 360ms steps(4);
}

.hero span {
  position: absolute;
  display: block;
}

.heroHair {
  width: 38px;
  height: 30px;
  left: 8px;
  top: 2px;
  background: #433028;
  box-shadow: inset 0 -8px 0 #2e211d;
}

.heroFace {
  width: 30px;
  height: 28px;
  left: 12px;
  top: 20px;
  background: #ffd2a9;
  box-shadow:
    8px 8px 0 -5px var(--line),
    22px 8px 0 -5px var(--line);
}

.heroBody {
  width: 34px;
  height: 28px;
  left: 10px;
  top: 46px;
  background: var(--accent);
  box-shadow:
    -8px 12px 0 -3px #284b8f,
    8px 12px 0 -3px #284b8f;
}

.heroShadow {
  width: 44px;
  height: 12px;
  left: 5px;
  bottom: -7px;
  background: var(--shadow);
}

.journal {
  padding: 16px;
  min-height: 180px;
}

.journal h2 {
  margin: 0;
  font-size: 18px;
}

.journal ol {
  margin: 14px 0 0;
  padding-left: 22px;
  display: grid;
  gap: 10px;
  font-size: 13px;
  line-height: 1.55;
}

.dialoguePanel {
  padding: 16px;
}

.speakerRow {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.portrait {
  width: 46px;
  height: 46px;
  flex: 0 0 auto;
  border: 3px solid var(--line);
  background:
    linear-gradient(#3f302f 0 42%, #ffd2a9 42% 72%, var(--accent) 72%),
    var(--accent);
  box-shadow: 4px 4px 0 var(--line);
}

.speaker {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
}

.chapter {
  margin: 0;
  color: var(--accent-dark);
  font-size: 12px;
}

.dialogue {
  min-height: 58px;
  margin: 0 0 14px;
  font-size: clamp(16px, 2.4vw, 20px);
  line-height: 1.6;
}

.passRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.passRow span {
  color: var(--accent-dark);
  font-size: 12px;
  text-align: right;
}

.passButton,
.choice {
  border: 3px solid var(--line);
  box-shadow: 4px 4px 0 var(--line);
  cursor: pointer;
  transition: transform 120ms ease, box-shadow 120ms ease, background 120ms ease;
}

.passButton {
  min-width: 108px;
  background: var(--accent);
  color: #fffdf8;
  padding: 10px 12px;
}

.choices {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.choice {
  min-height: 58px;
  background: #fffdf8;
  color: #15151a;
  padding: 10px;
  text-align: left;
}

.choice:hover,
.choice:focus-visible,
.passButton:hover,
.passButton:focus-visible {
  outline: none;
  transform: translate(-1px, -1px);
  box-shadow: 5px 5px 0 var(--line);
}

.choice:hover,
.choice:focus-visible {
  background: #ffe6ee;
}

.choice:active,
.passButton:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 var(--line);
}

.mediaViewer {
  padding: 12px;
}

.mediaFrame {
  margin: 0;
  min-height: 132px;
  display: grid;
  place-items: center;
  gap: 8px;
  border: 3px solid var(--line);
  background: #fffdf8;
  color: #15151a;
  padding: 10px;
}

.mediaFrame img,
.mediaFrame video {
  max-width: 100%;
  max-height: 280px;
  border: 3px solid var(--line);
  object-fit: contain;
}

.mediaFrame figcaption {
  font-size: 12px;
  line-height: 1.5;
}

.badgeTray {
  padding: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.badge {
  border: 3px solid var(--line);
  background: var(--accent);
  color: #fffdf8;
  padding: 6px 8px;
  box-shadow: 3px 3px 0 var(--line);
  font-size: 12px;
}

@media (prefers-color-scheme: dark) {
  .location,
  .choice,
  .mediaFrame {
    background: #1d1e25;
    color: var(--ink);
  }

  .choice:hover,
  .choice:focus-visible {
    background: #3a2630;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero,
  .choice,
  .passButton {
    transition-duration: 0.01ms;
  }
}

@media (max-width: 820px) {
  .screenFrame {
    min-height: 360px;
  }

  .screen {
    min-height: 332px;
  }

  .choices {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 2: Create PixelMap**

Create `components/game/PixelMap.tsx`:

```tsx
import { mapPoints } from "@/lib/story/map-graph";
import type { MapPointKey } from "@/lib/story/story-types";
import styles from "./game-components.module.css";

type PixelMapProps = {
  currentPointKey: MapPointKey;
};

export function PixelMap({ currentPointKey }: PixelMapProps) {
  const point = mapPoints[currentPointKey];

  return (
    <div className={styles.screenFrame}>
      <div className={styles.screen}>
        <div className={styles.sky} />
        <div className={styles.map} aria-hidden="true">
          <div className={`${styles.road} ${styles.roadMain}`} />
          <div className={`${styles.road} ${styles.roadAnniversary}`} />
          <div className={`${styles.road} ${styles.roadBirthday}`} />
          <div className={`${styles.road} ${styles.roadChildhood}`} />
          <div className={`${styles.road} ${styles.roadFinal}`} />
          <div className={`${styles.location} ${styles.locationStart}`}>START</div>
          <div className={`${styles.location} ${styles.locationAnniversary}`}>9 JUL</div>
          <div className={`${styles.location} ${styles.locationBirthday}`}>12 JUL</div>
          <div className={`${styles.location} ${styles.locationChildhood}`}>HOME</div>
          <div className={`${styles.location} ${styles.locationFinal}`}>GATE</div>
          <div
            className={styles.hero}
            style={{ "--x": point.x, "--y": point.y } as React.CSSProperties}
          >
            <span className={styles.heroHair} />
            <span className={styles.heroFace} />
            <span className={styles.heroBody} />
            <span className={styles.heroShadow} />
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create dialogue and choice components**

Create `components/game/DialogueBox.tsx`:

```tsx
import styles from "./game-components.module.css";

type DialogueBoxProps = {
  speaker: string;
  chapter: string;
  text: string;
  lineNumber: number;
  lineTotal: number;
  isTyping: boolean;
  onPass: () => void;
};

export function DialogueBox({
  speaker,
  chapter,
  text,
  lineNumber,
  lineTotal,
  isTyping,
  onPass
}: DialogueBoxProps) {
  return (
    <section className={styles.dialoguePanel} aria-live="polite">
      <div className={styles.speakerRow}>
        <span className={styles.portrait} aria-hidden="true" />
        <div>
          <p className={styles.speaker}>{speaker}</p>
          <p className={styles.chapter}>{chapter}</p>
        </div>
      </div>
      <p className={styles.dialogue}>{text}</p>
      <div className={styles.passRow}>
        <button className={styles.passButton} type="button" onClick={onPass}>
          {isTyping ? "SKIP" : "PASS"}
        </button>
        <span>
          ประโยค {lineNumber}/{lineTotal} - กด PASS หรือ Space
        </span>
      </div>
    </section>
  );
}
```

Create `components/game/ChoicePanel.tsx`:

```tsx
import type { StoryChoice } from "@/lib/story/story-types";
import styles from "./game-components.module.css";

type ChoicePanelProps = {
  choices: StoryChoice[];
  visible: boolean;
  onChoose: (choiceIndex: number) => void;
};

export function ChoicePanel({ choices, visible, onChoose }: ChoicePanelProps) {
  if (!visible) return null;

  return (
    <div className={styles.choices}>
      {choices.map((choice, index) => (
        <button
          className={styles.choice}
          key={choice.label}
          type="button"
          onClick={() => onChoose(index)}
        >
          {index + 1}. {choice.label}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Create journal, badge, and media components**

Create `components/game/JournalLog.tsx`:

```tsx
import type { JournalEntry } from "@/lib/story/game-reducer";
import styles from "./game-components.module.css";

type JournalLogProps = {
  entries: JournalEntry[];
};

export function JournalLog({ entries }: JournalLogProps) {
  return (
    <aside className={styles.journal} aria-label="story journal">
      <h2>Journey Log</h2>
      <ol>
        {entries.map((entry) => (
          <li key={entry.id}>{entry.text}</li>
        ))}
      </ol>
    </aside>
  );
}
```

Create `components/game/BadgeTray.tsx`:

```tsx
import type { Badge } from "@/lib/story/game-reducer";
import styles from "./game-components.module.css";

type BadgeTrayProps = {
  badges: Badge[];
};

export function BadgeTray({ badges }: BadgeTrayProps) {
  if (badges.length === 0) return null;

  return (
    <div className={styles.badgeTray} aria-label="earned badges">
      {badges.map((badge) => (
        <span className={styles.badge} key={badge.id}>
          {badge.label}
        </span>
      ))}
    </div>
  );
}
```

Create `components/game/MemoryViewer.tsx`:

```tsx
import type { MemoryMedia } from "@/lib/story/story-types";
import styles from "./game-components.module.css";

type MemoryViewerProps = {
  media: MemoryMedia[];
};

export function MemoryViewer({ media }: MemoryViewerProps) {
  if (media.length === 0) {
    return (
      <section className={styles.mediaViewer} aria-label="memory viewer">
        <div className={styles.mediaFrame}>ยังไม่มี memory ในฉากนี้</div>
      </section>
    );
  }

  return (
    <section className={styles.mediaViewer} aria-label="memory viewer">
      {media.map((item, index) => {
        if (item.type === "image") {
          return (
            <figure className={styles.mediaFrame} key={`${item.src}-${index}`}>
              <img src={item.src} alt={item.alt} />
              {item.caption ? <figcaption>{item.caption}</figcaption> : null}
            </figure>
          );
        }

        if (item.type === "gallery") {
          return (
            <div className={styles.mediaFrame} key={`gallery-${index}`}>
              {item.items.map((galleryItem) => (
                <figure key={galleryItem.src}>
                  <img src={galleryItem.src} alt={galleryItem.alt} />
                  {galleryItem.caption ? <figcaption>{galleryItem.caption}</figcaption> : null}
                </figure>
              ))}
            </div>
          );
        }

        return (
          <figure className={styles.mediaFrame} key={`${item.src}-${index}`}>
            <video controls playsInline preload="metadata" poster={item.poster}>
              <source src={item.src} type="video/mp4" />
            </video>
            {item.caption ? <figcaption>{item.caption}</figcaption> : null}
          </figure>
        );
      })}
    </section>
  );
}
```

- [ ] **Step 5: Create GameClient**

Create `app/game/GameClient.tsx`:

```tsx
"use client";

import { useEffect, useMemo, useReducer, useState } from "react";
import { BadgeTray } from "@/components/game/BadgeTray";
import { ChoicePanel } from "@/components/game/ChoicePanel";
import { DialogueBox } from "@/components/game/DialogueBox";
import { JournalLog } from "@/components/game/JournalLog";
import { MemoryViewer } from "@/components/game/MemoryViewer";
import { PixelMap } from "@/components/game/PixelMap";
import { createInitialGameState, gameReducer } from "@/lib/story/game-reducer";
import { storyNodes } from "@/lib/story/story-data";
import styles from "./game.module.css";

export function GameClient() {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialGameState);
  const [typedText, setTypedText] = useState("");
  const node = storyNodes[state.currentNodeId];
  const currentLine = node.lines[state.currentLineIndex];

  useEffect(() => {
    if (!state.isTyping) {
      setTypedText(currentLine.text);
      return;
    }

    setTypedText("");
    let index = 0;
    const timer = window.setInterval(() => {
      setTypedText((value) => value + currentLine.text[index]);
      index += 1;

      if (index >= currentLine.text.length) {
        window.clearInterval(timer);
        dispatch({ type: "COMPLETE_TYPING" });
      }
    }, 18);

    return () => window.clearInterval(timer);
  }, [currentLine.text, state.currentLineIndex, state.currentNodeId, state.isTyping]);

  useEffect(() => {
    let index = 0;
    const route = state.route;
    if (route.length === 0) return;

    dispatch({ type: "ARRIVE_AT_POINT", point: route[0] });

    const timer = window.setInterval(() => {
      index += 1;
      if (index >= route.length) {
        window.clearInterval(timer);
        return;
      }

      dispatch({ type: "ARRIVE_AT_POINT", point: route[index] });
    }, 390);

    return () => window.clearInterval(timer);
  }, [state.route]);

  const lineNumber = state.currentLineIndex + 1;
  const lineTotal = node.lines.length;

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        dispatch({ type: "PASS" });
        return;
      }

      if (!state.choicesVisible) return;

      const numeric = Number(event.key);
      if (numeric >= 1 && numeric <= node.choices.length) {
        dispatch({ type: "SELECT_CHOICE", choiceIndex: numeric - 1 });
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [node.choices.length, state.choicesVisible]);

  const dialogueText = useMemo(() => typedText || currentLine.text, [currentLine.text, typedText]);

  return (
    <main className={styles.gameShell}>
      <section className={styles.topBar}>
        <div>
          <p className={styles.kicker}>Anniversary Quest</p>
          <h1>2 Years 5 Months + Birthday</h1>
        </div>
        <div className={styles.dateBadges}>
          <span>9 Jul</span>
          <span>12 Jul</span>
        </div>
      </section>

      <section className={styles.gameLayout}>
        <div className={styles.leftColumn}>
          <PixelMap currentPointKey={state.currentPointKey} />
          <MemoryViewer media={state.activeMedia} />
        </div>
        <div className={styles.rightColumn}>
          <BadgeTray badges={state.badges} />
          <JournalLog entries={state.journal} />
        </div>
      </section>

      <DialogueBox
        speaker={node.speaker}
        chapter={node.chapter}
        text={dialogueText}
        lineNumber={lineNumber}
        lineTotal={lineTotal}
        isTyping={state.isTyping}
        onPass={() => dispatch({ type: "PASS" })}
      />
      <ChoicePanel
        choices={node.choices}
        visible={state.choicesVisible}
        onChoose={(choiceIndex) => dispatch({ type: "SELECT_CHOICE", choiceIndex })}
      />
    </main>
  );
}
```

- [ ] **Step 6: Create game page styles**

Create `app/game/game.module.css`:

```css
.gameShell {
  width: min(1120px, calc(100% - 28px));
  min-height: 100dvh;
  margin: 0 auto;
  padding: 22px 0;
  display: grid;
  grid-template-rows: auto 1fr auto auto;
  gap: 16px;
}

.topBar {
  min-height: 88px;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border: 4px solid var(--line);
  box-shadow: 8px 8px 0 var(--line);
  background: var(--panel);
}

.kicker {
  margin: 0;
  color: var(--accent-dark);
  font-size: 12px;
}

.topBar h1 {
  margin: 4px 0 0;
  font-size: clamp(24px, 4vw, 42px);
  line-height: 1.05;
}

.dateBadges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.dateBadges span {
  border: 3px solid var(--line);
  background: var(--accent);
  color: #fffdf8;
  padding: 8px 10px;
  box-shadow: 4px 4px 0 var(--line);
  white-space: nowrap;
}

.gameLayout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 16px;
}

.leftColumn,
.rightColumn {
  display: grid;
  gap: 16px;
  align-content: start;
}

@media (max-width: 820px) {
  .gameShell {
    width: min(100% - 20px, 640px);
    padding: 10px 0;
  }

  .topBar {
    align-items: flex-start;
    flex-direction: column;
  }

  .gameLayout {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 7: Run build**

Run:

```bash
npm run build
```

Expected: build succeeds after CSS module classes are fully defined.

- [ ] **Step 8: Commit**

```bash
git add components/game app/game/GameClient.tsx app/game/game.module.css
git commit -m "feat: build pixel story game UI"
```

## Task 7: Protect Game Route and Add Media Folders

**Files:**
- Create: `app/game/page.tsx`
- Create: `public/memories/images/.gitkeep`
- Create: `public/memories/videos/.gitkeep`

**Interfaces:**
- Consumes: `hasAccessCookie`
- Produces: protected `/game` route

- [ ] **Step 1: Create protected game page**

Create `app/game/page.tsx`:

```tsx
import { redirect } from "next/navigation";
import { hasAccessCookie } from "@/lib/auth/access-cookie";
import { GameClient } from "./GameClient";

export default async function GamePage() {
  if (!(await hasAccessCookie())) {
    redirect("/register");
  }

  return <GameClient />;
}
```

- [ ] **Step 2: Create media folders**

Run:

```bash
mkdir -p public/memories/images public/memories/videos
touch public/memories/images/.gitkeep public/memories/videos/.gitkeep
```

Expected: media directories exist and can be committed.

- [ ] **Step 3: Add local env for development**

Create `.env.local` locally only:

```env
ANNIVERSARY_ALLOWED_NAME=Perthyw
ANNIVERSARY_ALLOWED_CODE=12/07/2003
ANNIVERSARY_COOKIE_SECRET=dev-secret-change-before-deploy
```

Expected: `.env.local` is ignored by git.

- [ ] **Step 4: Run local app**

Run:

```bash
npm run dev
```

Expected: Next.js starts on `http://localhost:3000` or the next available port.

- [ ] **Step 5: Manual verification**

Open the app and verify:

```text
/ redirects to /register without a cookie
wrong name/code shows an in-game style error
Perthyw + 12/07/2003 redirects to /game
/game shows the pixel game
PASS advances dialogue
choices appear only after all lines
selecting a choice changes node
```

- [ ] **Step 6: Commit**

```bash
git add app/game/page.tsx public/memories/images/.gitkeep public/memories/videos/.gitkeep
git commit -m "feat: protect game route and add media folders"
```

## Task 8: Final Verification and Documentation

**Files:**
- Modify: `STORY_STRUCTURE.md`
- Create: `README.md`

**Interfaces:**
- Produces: setup instructions for local dev, env vars, media folders, and deployment notes

- [ ] **Step 1: Update story notes**

Append to `STORY_STRUCTURE.md`:

```md
## Next.js Implementation Notes

The Next.js version uses `lib/story/story-data.ts` as the source of truth for story nodes. Media files are referenced from `/public/memories/images` and `/public/memories/videos`.

Register access is controlled by `.env.local`:

- `ANNIVERSARY_ALLOWED_NAME`
- `ANNIVERSARY_ALLOWED_CODE`
- `ANNIVERSARY_COOKIE_SECRET`

Do not commit `.env.local`.
```

- [ ] **Step 2: Create README**

Create `README.md`:

```md
# Anniversary Quest

A private pixel story game for a 2 years 5 months anniversary and birthday celebration.

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Edit `.env.local`:

```env
ANNIVERSARY_ALLOWED_NAME=Perthyw
ANNIVERSARY_ALLOWED_CODE=12/07/2003
ANNIVERSARY_COOKIE_SECRET=replace-with-a-long-random-string
```

Open `http://localhost:3000`.

## Media

Put images in:

```text
public/memories/images/
```

Put short optimized MP4 videos in:

```text
public/memories/videos/
```

Keep the GitHub repo private because media files are personal.

## Scripts

```bash
npm run dev
npm run build
npm run test
```

## Deployment

Deploy through Vercel and set the same environment variables in the Vercel project settings.
```

- [ ] **Step 3: Run full verification**

Run:

```bash
npm run test
npm run build
```

Expected: tests pass and production build succeeds.

- [ ] **Step 4: Manual responsive check**

Open local app and check:

```text
desktop: register and game layouts fit without broken wrapping
mobile width: game stacks map, media, journal, dialogue, choices cleanly
video element renders controls when a video media item is added
dark mode keeps location labels readable
```

- [ ] **Step 5: Commit**

```bash
git add README.md STORY_STRUCTURE.md
git commit -m "docs: add setup and story implementation notes"
```

## Plan Self-Review

- Spec coverage: register gate, cookie protection, media model, graph map movement, PASS dialogue, choices, journal, badges, private repo guidance, and Vercel env setup are covered by tasks.
- Placeholder scan: no task depends on unspecified files or undefined interfaces. CSS migration in Task 6 intentionally references the existing prototype CSS as source material because full class bodies are large and already available in `reference/static-prototype/styles.css`.
- Type consistency: `MapPointKey`, `StoryNodeId`, `MemoryMedia`, `StoryNode`, `GameState`, and reducer actions are defined before any task consumes them.
- Scope check: no database, no real auth, no protected media streaming, no admin editor, and no free-walk collision system are included.
