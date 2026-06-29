"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { hasClientAccess } from "@/lib/auth/client-access";
import { isStaticExportMode } from "@/lib/auth/static-mode";
import { BedroomGameClient } from "./BedroomGameClient";

export function GameClient() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function verifyAccess() {
      if (isStaticExportMode()) {
        if (cancelled) return;

        if (!hasClientAccess()) {
          router.replace("/register");
          return;
        }

        setAuthed(true);
        return;
      }

      try {
        const response = await fetch("/api/auth/status", {
          credentials: "same-origin",
          cache: "no-store"
        });
        const payload = (await response.json().catch(() => ({}))) as { ok?: boolean };

        if (cancelled) return;

        if (!response.ok || !payload.ok) {
          router.replace("/register");
          return;
        }

        setAuthed(true);
      } catch {
        if (!cancelled) {
          router.replace("/register");
        }
      }
    }

    void verifyAccess();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!authed) {
    return null;
  }

  return <BedroomGameClient />;
}
