import { redirect } from "next/navigation";
import { hasAccessCookie } from "@/lib/auth/access-cookie";
import { GameClient } from "./GameClient";

export default async function GamePage() {
  if (!(await hasAccessCookie())) {
    redirect("/register");
  }

  return <GameClient />;
}
