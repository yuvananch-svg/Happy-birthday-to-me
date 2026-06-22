# Anniversary Quest Next.js Design

## Summary

Build a private, media-first Next.js version of the Anniversary Quest prototype. The app combines two events: the 2 years 5 months anniversary on July 9 and the birthday on July 12. It should feel like a retro pixel story game, not a normal landing page.

The player enters through a soft register gate using a name and birthday code. After access is granted, the player enters a branching story game with PASS-to-read dialogue, map movement constrained to route graph waypoints, journal entries, badges, and memory media reveals for images and videos.

## Goals

- Migrate the current static prototype into a maintainable Next.js App Router project.
- Add a server-side soft register gate using environment variables.
- Preserve and improve the current game feel: pixel map, dialogue box, PASS flow, choices, journal, and route-following character movement.
- Support local project media committed to a private GitHub repo.
- Keep the first version simple enough to finish before July 9 while leaving room for more story content.

## Non-Goals

- No real account system.
- No database.
- No email, OAuth, or auth provider.
- No protected media streaming in the first version.
- No admin story editor.
- No free-walk tile collision system.
- No multiplayer, leaderboard, or analytics dashboard.

## Technology

- Next.js App Router
- TypeScript
- React client components for game state and interaction
- CSS Modules plus global CSS tokens
- Local public assets for images and videos
- Environment variables for access credentials
- Private GitHub repo for project and media storage
- Vercel as the recommended deployment target

## Project Structure

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
    map-graph.ts
    route-finding.ts
    story-data.ts
    story-types.ts

public/
  memories/
    images/
      .gitkeep
    videos/
      .gitkeep

docs/
  superpowers/
    specs/
    plans/
```

## Routing

The root route chooses where to send the visitor:

```text
/          -> redirect to /game if access cookie is valid, otherwise /register
/register  -> name and birthday gate
/api/register -> validates input and sets access cookie
/game      -> protected game route
```

`/game` must redirect to `/register` if the access cookie is missing or invalid.

## Register Gate

The register page is a soft gate. It is meant to make the experience feel personal and private, not to provide strong security.

The form asks for:

- Name
- Birthday code

The API compares normalized values against environment variables:

```env
ANNIVERSARY_ALLOWED_NAME=Perthyw
ANNIVERSARY_ALLOWED_CODE=12/07/2003
ANNIVERSARY_COOKIE_SECRET=replace-with-a-long-random-string
```

Rules:

- Name comparison should trim surrounding whitespace.
- Code comparison should trim surrounding whitespace.
- The API returns a friendly error message for invalid credentials.
- On success, the API sets an httpOnly cookie and returns success.
- The client redirects to `/game` after success.
- `.env.local` must never be committed.
- `.env.example` should be committed with safe sample values.

Cookie settings:

- Name: `anniversary_access`
- `httpOnly: true`
- `sameSite: "lax"`
- `secure: true` in production
- Max age: 30 days

The cookie value should be signed with `ANNIVERSARY_COOKIE_SECRET`. This is still soft protection, but it avoids a plain editable `ok` cookie.

## Game Architecture

`GameClient` owns the interactive state with `useReducer`. It composes the game UI:

- `PixelMap`
- `MemoryViewer`
- `DialogueBox`
- `ChoicePanel`
- `JournalLog`
- `BadgeTray`

Only `GameClient` reads story data directly. Child components receive props and callbacks. This keeps UI components reusable and prevents story logic from leaking everywhere.

Game state includes:

- Current node id
- Current line index
- Typing status
- Choice visibility
- Current map point
- Journal entries
- Earned badges
- Active media

## Story Model

The story is data-driven through TypeScript objects. Each node has a destination map point, ordered lines, choices, optional journal text, and optional rewards.

```ts
export type StoryNode = {
  id: StoryNodeId;
  speaker: string;
  chapter: string;
  destination: MapPointKey;
  lines: StoryLine[];
  choices: StoryChoice[];
  rewards?: StoryReward[];
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
```

The important decision is that media attaches to `StoryLine`, not only to a full node. This lets the game reveal images or videos at the exact moment the player reaches a specific line.

## Media Model

Images and videos are local project assets:

```text
public/memories/images/
public/memories/videos/
```

Supported media types:

```ts
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
```

Media display rules:

- `MemoryViewer` shows the active media for the current story line.
- If there is no media, `MemoryViewer` shows a quiet empty state, not a blank broken frame.
- Videos use `<video controls playsInline preload="metadata">`.
- Videos do not autoplay by default.
- Video files should be short and compressed before commit.
- If a video is larger than about 50-80 MB, use Git LFS or external hosting instead of normal git.

## Map Model

The map is a graph of named points. The story only declares a destination. The route finder calculates the path from the current point to the destination.

Example graph:

```text
anniversary <- anniversaryJunction
                                  |
childhood <- childhoodJunction - start - birthdayJunction -> birthday
                                  |
                           finalJunction -> finalGate
```

Rules:

- Character movement is constrained to graph waypoints.
- Story nodes do not hardcode full routes.
- `findRoute(from, to)` returns the waypoint path.
- If no route is found, the app should keep the character at the current point and report a recoverable error in development.

## Interaction Flow

When entering a node:

1. Find a route from the current map point to the node destination.
2. Move the character along route waypoints.
3. Show the first dialogue line with a typing effect.
4. If the line has media, update `MemoryViewer`.
5. `PASS`, `Space`, or `Enter` advances the line.
6. If text is still typing, PASS completes the current line instead of advancing.
7. After the last line, show choices.
8. Choosing an option appends its journal entry, grants rewards if applicable, and enters the next node.

Choices are not visible until the node's lines are complete.

## Visual Direction

The visual language should remain retro pixel RPG:

- Pixel-style shell and borders
- Game dialogue panel
- Compact map with labeled locations
- Cute central hero character
- Register page styled like an NPC gate
- Warm romantic palette, with one accent color
- Mobile layout stacks cleanly with game first, journal below

The register page should not feel like a corporate login form. It should feel like an in-game door asking for a secret key.

## Privacy and Repository Rules

The GitHub repository should be private because it will contain personal images and videos.

Do not commit:

- `.env.local`
- Uncompressed large raw videos
- Any secret token

Do commit:

- `.env.example`
- Optimized images
- Short optimized videos when file size is reasonable
- Story data with paths to public media

If the app is deployed on Vercel, environment variables must be set in the Vercel project settings.

## Testing Strategy

Minimum tests:

- `route-finding.test.ts`
  - Finds a path from start to anniversary.
  - Finds a path from birthday to finalGate through start.
  - Returns a safe fallback or explicit error behavior for unknown routes.

- `game-reducer.test.ts`
  - Enters a node and shows the first line.
  - PASS completes typing before advancing.
  - PASS advances lines when typing is complete.
  - Choices are hidden until the last line is complete.
  - Selecting a choice changes node.
  - Media on a line becomes active.
  - Badge rewards are recorded once.

- `register` validation
  - Valid name and code succeed.
  - Invalid name or code fails.
  - Inputs are trimmed before comparison.

If setting up a full test runner takes too long, first implementation can prioritize unit tests for `lib/story` and add route handler tests after the app scaffold is stable.

## Migration Plan

The existing static files provide the prototype behavior, but they should not be copied wholesale into Next.js.

Migration mapping:

- `index.html` becomes App Router pages and React components.
- `styles.css` becomes `globals.css` plus component CSS modules.
- `script.js` becomes story data, route finding, reducer, and components.
- `STORY_STRUCTURE.md` remains as a creative notes document and can link to this spec.

## Open Decisions

- Exact final project/repository name.
- Exact media file naming convention.
- Whether to use normal git for videos or Git LFS.
- Whether the first release needs a hidden secret ending unlocked by a second code.

These do not block the implementation plan. The defaults are:

- Project name: `anniversary-quest`
- Media naming: lowercase kebab-case, for example `first-date.jpg`
- Videos: normal git only for short optimized files under about 50-80 MB
- Secret ending: not in the first implementation unless requested

## Acceptance Criteria

- Visiting `/` routes the player to `/register` when not authorized.
- Correct name and code unlock `/game`.
- Incorrect credentials show an in-game style error.
- `/game` cannot be opened without the access cookie.
- The game shows dialogue one line at a time.
- PASS skips typing when text is still typing.
- PASS advances to the next line when typing is complete.
- Choices appear only after the current node's lines are complete.
- Selecting a choice moves to the next node.
- The hero moves along graph waypoints and does not jump off-road.
- Story lines can reveal an image, gallery, or video.
- Journal entries and badges update from story choices/rewards.
- The app works on desktop and mobile.
- `.env.local` is ignored.
- `.env.example` documents required variables.
