import { existsSync, mkdirSync, renameSync } from "node:fs";

const serverOnlyDir = ".server-only";

if (!existsSync(serverOnlyDir)) {
  mkdirSync(serverOnlyDir, { recursive: true });
}

const moves = [
  ["middleware.ts", `${serverOnlyDir}/middleware.ts`],
  ["app/api", `${serverOnlyDir}/app-api`]
];

for (const [from, to] of moves) {
  if (existsSync(from)) {
    renameSync(from, to);
    console.log(`Moved ${from} -> ${to}`);
  }
}
