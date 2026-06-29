"use client";

import { registerPath } from "@/lib/auth/paths";

const target = registerPath();

export function HomeRedirect() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.location.replace(${JSON.stringify(target)});`
      }}
    />
  );
}
