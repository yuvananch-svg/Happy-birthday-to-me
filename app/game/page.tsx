import { redirect } from "next/navigation";
import { hasAccessCookie } from "@/lib/auth/has-access-cookie";
import { isStaticExportMode } from "@/lib/auth/static-mode";
import { GameClient } from "./GameClient";

export default async function GamePage() {
  if (!isStaticExportMode() && !(await hasAccessCookie())) {
    redirect("/register");
  }

  return <GameClient />;
}
