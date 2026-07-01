import { withBasePath } from "@/lib/navigation";

/** Outdoor farm hub — Higgsfield share `uluE0Nb8i70`. */

export const FARM_SCENE_IMAGE = withBasePath("/scenes/farm/farm-outdoor.png");

/** Forest / pond-east continuation — Higgsfield share `8MmqSnQ9w_E`. */

export const FARM_POND_EAST_SCENE_IMAGE = withBasePath("/scenes/farm/farm-pond-east.png");

/** Noodle vendor NPC sprites at pond stall (locked 2026-06-30). */
export const NOODLE_VENDOR_TURNAROUND = withBasePath("/npc/noodle-vendor/noodle-vendor-turnaround.png");
export const NOODLE_VENDOR_FRONT = withBasePath("/npc/noodle-vendor/noodle-vendor-front.png");
export const NOODLE_VENDOR_BACK = withBasePath("/npc/noodle-vendor/noodle-vendor-back.png");
export const NOODLE_VENDOR_LEFT = withBasePath("/npc/noodle-vendor/noodle-vendor-left.png");
export const NOODLE_VENDOR_RIGHT = withBasePath("/npc/noodle-vendor/noodle-vendor-right.png");

/**
 * F3 first-date memory photo — path reserved; real photo pending from user.
 * Share `W65AAjRSE8M` resolves to vendor turnaround sheet, not a couple memory.
 */
export const NOODLE_F3_MEMORY_IMAGE = withBasePath("/memories/images/noodle-f3.png");

/**
 * In-scene vendor placement on `farm-outdoor.png` (6336×2688).
 * Tune if sprite drifts from stall art.
 */
export const NOODLE_VENDOR_STALL = {
  x: 2780,
  y: 1285,
  width: 108,
  height: 148
} as const;

/** Higgsfield source URLs — for regeneration only, not loaded at runtime. */
export const FARM_CANONICAL_SOURCE_URLS = {
  sceneShare: "https://higgsfield.ai/s/uluE0Nb8i70",
  scene:
    "https://d8j0ntlcm91z4.cloudfront.net/user_3EX64v0MwwRZPobOdtptsAMM5pN/hf_20260628_160127_086db1ab-dcb9-4354-a35d-7b62f0cbe35e.png",
  pondEastShare: "https://higgsfield.ai/s/8MmqSnQ9w_E",
  pondEast:
    "https://d8j0ntlcm91z4.cloudfront.net/user_3EX64v0MwwRZPobOdtptsAMM5pN/hf_20260630_171721_ea38f060-e647-4f69-bc41-a24073bd35a8.png"
} as const;

export const NOODLE_VENDOR_CANONICAL_SOURCE_URLS = {
  turnaroundShare: "https://higgsfield.ai/s/W65AAjRSE8M",
  turnaround:
    "https://d8j0ntlcm91z4.cloudfront.net/user_3EX64v0MwwRZPobOdtptsAMM5pN/hf_20260630_165810_b2ada276-66ac-4812-a777-081c2a62cbda.png",
  front:
    "https://d8j0ntlcm91z4.cloudfront.net/user_3EX64v0MwwRZPobOdtptsAMM5pN/hf_20260630_165752_75ea2369-173a-43b7-838b-464c2ee796b3.png",
  back:
    "https://d8j0ntlcm91z4.cloudfront.net/user_3EX64v0MwwRZPobOdtptsAMM5pN/hf_20260630_165849_35e61c61-0510-4149-a34b-073a63d8acfc.png",
  left:
    "https://d8j0ntlcm91z4.cloudfront.net/user_3EX64v0MwwRZPobOdtptsAMM5pN/hf_20260630_165948_8e0b066f-60f7-4902-b88c-8f9e089e6ad7.png",
  right:
    "https://d8j0ntlcm91z4.cloudfront.net/user_3EX64v0MwwRZPobOdtptsAMM5pN/hf_20260630_170033_ac09c2e6-1372-49cd-af00-bc9d7e786aa9.png"
} as const;

/** Reserved for F3 popup once a real first-date photo is provided. */
export const NOODLE_F3_MEMORY_CANONICAL_SOURCE_URLS = {
  share: null,
  image: null
} as const;
