"use client";

import { useLayoutEffect, useState } from "react";
import { hasClientAccess } from "@/lib/auth/client-access";
import { registerPath } from "@/lib/auth/paths";
import { isStaticExportMode } from "@/lib/auth/static-mode";
import { BedroomGameClient } from "./BedroomGameClient";

function redirectToRegister(): void {
  window.location.replace(registerPath());
}

export function GameClient() {
  const [authed, setAuthed] = useState(() => {
    if (typeof window === "undefined") return false;
    return isStaticExportMode() && hasClientAccess();
  });

  useLayoutEffect(() => {
    let cancelled = false;

    async function verifyAccess() {
      if (isStaticExportMode()) {
        if (!hasClientAccess()) {
          redirectToRegister();
          return;
        }

        if (!cancelled) {
          setAuthed(true);
        }
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
          redirectToRegister();
          return;
        }

        setAuthed(true);
      } catch {
        if (!cancelled) {
          redirectToRegister();
        }
      }
    }

    void verifyAccess();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!authed) {
    return null;
  }

  return <BedroomGameClient />;
}
