import { withBasePath } from "@/lib/navigation";

/** Outdoor farm hub — Higgsfield share `uluE0Nb8i70`. */

export const FARM_SCENE_IMAGE = withBasePath("/scenes/farm/farm-outdoor.png");

/** Higgsfield source URL — for regeneration only, not loaded at runtime. */
export const FARM_CANONICAL_SOURCE_URLS = {
  sceneShare: "https://higgsfield.ai/s/uluE0Nb8i70",
  scene:
    "https://d8j0ntlcm91z4.cloudfront.net/user_3EX64v0MwwRZPobOdtptsAMM5pN/hf_20260628_160127_086db1ab-dcb9-4354-a35d-7b62f0cbe35e.png"
} as const;
