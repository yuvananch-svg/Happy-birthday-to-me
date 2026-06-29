import { redirect } from "next/navigation";
import { HomeRedirect } from "./HomeRedirect";
import { isStaticExportMode } from "@/lib/auth/static-mode";

export default function HomePage() {
  if (isStaticExportMode()) {
    return <HomeRedirect />;
  }

  redirect("/register");
}
