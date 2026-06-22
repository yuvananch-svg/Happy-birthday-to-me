import { redirect } from "next/navigation";
import { hasAccessCookie } from "@/lib/auth/access-cookie";

export default async function HomePage() {
  if (await hasAccessCookie()) {
    redirect("/game");
  }

  redirect("/register");
}
