import { withBasePath } from "@/lib/navigation";

export function registerPath(): string {
  return withBasePath("/register");
}

export function gamePath(): string {
  return withBasePath("/game");
}
