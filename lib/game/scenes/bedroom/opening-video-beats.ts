export type IntroPhase =
  | "silent"
  | "hero-dialogue"
  | "video-resume"
  | "mother-dialogue"
  | "room-dialogue"
  | "done";

export const OPENING_VIDEO_MARKERS = {
  HERO_PAUSE_AT: 5.0,
  MOTHER_PAUSE_AT: 10.0,
  RESUME_FROM: 5.0,
  RESUME_TO: 10.0
} as const;

/** Dialogue indices within INTRO_CUTSCENE (D1 = 0 … D11 = 10). */
export const INTRO_BEATS = {
  HERO_END_INDEX: 3,
  MOTHER_END_INDEX: 5,
  ROOM_START_INDEX: 5,
  LAST_INDEX: 10
} as const;
