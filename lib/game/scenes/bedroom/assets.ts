import { withBasePath } from "@/lib/navigation";

/** Locked mother NPC + F1 memory assets (2026-06-27). */

/** Fullscreen opening cinematic — Higgsfield share `-jc7HRyjwkQ`. */
export const OPENING_INTRO_VIDEO = withBasePath("/cutscenes/opening-intro.mp4");

export const HERO_PORTRAIT_DIALOGUE = withBasePath("/npc/hero-portrait.png");
export const MOTHER_PORTRAIT_DIALOGUE = withBasePath("/npc/mother-portrait.png");
export const MOTHER_F1_MEMORY_IMAGE = withBasePath("/memories/images/mother-f1.png");
export const MOTHER_FULLBODY_NOBG = withBasePath("/npc/mother-fullbody-nobg.png");

/** Higgsfield source URLs — for regeneration only, not loaded at runtime. */
export const HERO_CANONICAL_SOURCE_URLS = {
  turnaroundShare: "https://higgsfield.ai/s/UKlKatmrZIE",
  turnaround:
    "https://d8j0ntlcm91z4.cloudfront.net/user_3EX64v0MwwRZPobOdtptsAMM5pN/hf_20260627_135019_69332c63-4de9-4b30-b683-3f85abe1b835.png",
  /** Turnaround reference used for dialogue portrait gen — share QO8T5U99Eq0. */
  turnaroundRefShare: "https://higgsfield.ai/s/QO8T5U99Eq0",
  turnaroundRef:
    "https://d8j0ntlcm91z4.cloudfront.net/user_3EX64v0MwwRZPobOdtptsAMM5pN/hf_20260627_135425_bef48039-17e3-4049-91c6-338a192b92f1.png",
  /** Nano Banana Pro 4K dialogue bust — share PgKy73rVx4g. */
  dialoguePortraitShare: "https://higgsfield.ai/s/PgKy73rVx4g",
  dialoguePortrait:
    "https://d8j0ntlcm91z4.cloudfront.net/user_3EX64v0MwwRZPobOdtptsAMM5pN/hf_20260628_162325_174aa326-abdc-4af3-bded-7eb8cbb0f9dc.png"
} as const;

export const MOTHER_CANONICAL_SOURCE_URLS = {
  fullbody:
    "https://d8j0ntlcm91z4.cloudfront.net/user_3EX64v0MwwRZPobOdtptsAMM5pN/hf_20260627_165321_f6310576-c9e5-4b11-98be-672872a6d125.png",
  f1Portrait:
    "https://d8j0ntlcm91z4.cloudfront.net/user_3EX64v0MwwRZPobOdtptsAMM5pN/hf_20260627_165035_a2ad359b-14ac-46a8-81b4-0f811a7f1fa6.png"
} as const;

/**
 * In-scene F1 photo frame on doily table.
 * Display coords for `public/scenes/bedroom/bedroom.png` rendered at 3840×2160
 * (native 5504×3072). Tuned to the inner portrait opening on the wooden frame.
 */
export const F1_PHOTO_FRAME = {
  left: 1785,
  top: 252,
  width: 170,
  height: 196,
  interactX: 1900,
  interactY: 565,
  interactRadius: 130
} as const;
