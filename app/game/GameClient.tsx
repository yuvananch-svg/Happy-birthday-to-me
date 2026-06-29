"use client";

import { useEffect, useState } from "react";
import { BedroomGameClient } from "./BedroomGameClient";

export function GameClient() {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function verifyAccess() {
      try {
        const response = await fetch("/api/auth/status", {
          credentials: "same-origin",
          cache: "no-store"
        });
        const payload = (await response.json().catch(() => ({}))) as { ok?: boolean };

        if (cancelled) return;

        if (!response.ok || !payload.ok) {
          window.location.replace("/register");
          return;
        }

        setAuthed(true);
      } catch {
        if (!cancelled) {
          window.location.replace("/register");
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
