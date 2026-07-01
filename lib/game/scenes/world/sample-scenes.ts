import { withBasePath } from "@/lib/navigation";

/** Sample world-zone backgrounds for F4–F9 review (Nano Banana Pro, 4K 21:9, 2026-07-01). */

export const FOREST_F4_F5_SAMPLE = withBasePath("/scenes/samples/forest-f4-f5-sample.png");
export const CAMP_F6_SAMPLE = withBasePath("/scenes/samples/camp-f6-sample.png");
export const SALA_F7_SAMPLE = withBasePath("/scenes/samples/sala-f7-sample.png");
export const FLOWER_FIELD_F9_SAMPLE = withBasePath("/scenes/samples/flower-field-f9-sample.png");

/** Higgsfield source URLs — for regeneration only, not loaded at runtime. */
export const SAMPLE_SCENE_SOURCE_URLS = {
  forestF4F5:
    "https://d8j0ntlcm91z4.cloudfront.net/user_3EX64v0MwwRZPobOdtptsAMM5pN/hf_20260630_170706_d0588434-8fbb-41ae-afc4-701d240ca69a.png",
  campF6:
    "https://d8j0ntlcm91z4.cloudfront.net/user_3EX64v0MwwRZPobOdtptsAMM5pN/hf_20260630_170755_af998c55-e116-4fea-b32c-49c343743779.png",
  salaF7:
    "https://d8j0ntlcm91z4.cloudfront.net/user_3EX64v0MwwRZPobOdtptsAMM5pN/hf_20260630_170845_bb7e99d1-b1fb-477a-a77a-1de50be489fc.png",
  flowerFieldF9:
    "https://d8j0ntlcm91z4.cloudfront.net/user_3EX64v0MwwRZPobOdtptsAMM5pN/hf_20260630_170937_40cf4eb6-3e0c-415e-b0b9-e91823d18aa5.png"
} as const;
