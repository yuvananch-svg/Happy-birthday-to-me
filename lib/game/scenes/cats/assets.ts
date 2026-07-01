import { withBasePath } from "@/lib/navigation";

/** Locked cat reference assets — Fon & Fu (2026-06-30). */

/** Runtime — web-optimized portraits for dialogue / memory popups. */
export const FON_REFERENCE_IMAGE = withBasePath("/npc/fon-canonical-web.png");
export const FU_REFERENCE_IMAGE = withBasePath("/npc/fu-canonical-web.png");

/** Full-resolution sources kept in repo for pixel/sprite work. */
export const FON_CANONICAL_SOURCE = withBasePath("/npc/fon-canonical.png");
export const FU_CANONICAL_SOURCE = withBasePath("/npc/fu-canonical.png");

/** Higgsfield share + CDN URLs — for regeneration only, not loaded at runtime. */
export const CAT_CANONICAL_SOURCE_URLS = {
  fon: {
    share: "https://higgsfield.ai/s/Bglmi5w26L0",
    image:
      "https://d8j0ntlcm91z4.cloudfront.net/user_3EX64v0MwwRZPobOdtptsAMM5pN/hf_20260628_161120_ae7fbe3f-441b-41b6-b742-bad38fbf15d0.png"
  },
  fu: {
    share: "https://higgsfield.ai/s/kUtMNzZprnM",
    image:
      "https://d8j0ntlcm91z4.cloudfront.net/user_3EX64v0MwwRZPobOdtptsAMM5pN/hf_20260628_161125_7fe1ae0b-ec8d-4d1d-8bdf-66ef035d3912.png"
  }
} as const;
