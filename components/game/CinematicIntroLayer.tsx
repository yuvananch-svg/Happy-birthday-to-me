"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { OPENING_INTRO_VIDEO } from "@/lib/game/scenes/bedroom/assets";
import { OPENING_VIDEO_MARKERS, type IntroPhase } from "@/lib/game/scenes/bedroom/opening-video-beats";
import styles from "./cinematic-intro.module.css";

type CinematicIntroLayerProps = {
  introPhase: IntroPhase;
  onHeroPause: () => void;
  onMotherPause: () => void;
  onFadeComplete: () => void;
};

export function CinematicIntroLayer({
  introPhase,
  onHeroPause,
  onMotherPause,
  onFadeComplete
}: CinematicIntroLayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroPauseFired = useRef(false);
  const motherPauseFired = useRef(false);
  const roomDialogueReadyFired = useRef(false);
  const onFadeCompleteRef = useRef(onFadeComplete);
  const [needsTap, setNeedsTap] = useState(false);

  onFadeCompleteRef.current = onFadeComplete;

  const startPlayback = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.readyState < HTMLMediaElement.HAVE_METADATA) {
      video.load();
    }

    try {
      await video.play();
      setNeedsTap(false);
    } catch {
      setNeedsTap(true);
    }
  }, []);

  const handleVideoError = useCallback(() => {
    if (introPhase !== "silent" || heroPauseFired.current) return;

    heroPauseFired.current = true;
    setNeedsTap(false);
    onHeroPause();
  }, [introPhase, onHeroPause]);

  useEffect(() => {
    if (introPhase === "silent") {
      heroPauseFired.current = false;
      motherPauseFired.current = false;
      roomDialogueReadyFired.current = false;
      void startPlayback();
    }
  }, [introPhase, startPlayback]);

  useEffect(() => {
    if (introPhase !== "video-resume") return;

    const video = videoRef.current;
    if (!video) return;

    motherPauseFired.current = false;
    video.currentTime = OPENING_VIDEO_MARKERS.RESUME_FROM;
    void video.play();
  }, [introPhase]);

  useEffect(() => {
    if (introPhase !== "room-dialogue") return;
    if (roomDialogueReadyFired.current) return;

    const video = videoRef.current;
    if (video) {
      video.currentTime = OPENING_VIDEO_MARKERS.MOTHER_PAUSE_AT;
      video.pause();
    }

    roomDialogueReadyFired.current = true;
    onFadeCompleteRef.current();
  }, [introPhase]);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const time = video.currentTime;

    if (
      introPhase === "silent" &&
      time >= OPENING_VIDEO_MARKERS.HERO_PAUSE_AT &&
      !heroPauseFired.current
    ) {
      heroPauseFired.current = true;
      video.pause();
      onHeroPause();
    }

    if (
      introPhase === "video-resume" &&
      time >= OPENING_VIDEO_MARKERS.MOTHER_PAUSE_AT &&
      !motherPauseFired.current
    ) {
      motherPauseFired.current = true;
      video.pause();
      onMotherPause();
    }
  }, [introPhase, onHeroPause, onMotherPause]);

  if (introPhase === "done") return null;

  return (
    <div className={styles.overlay} aria-hidden="true">
      <video
        ref={videoRef}
        className={styles.video}
        src={OPENING_INTRO_VIDEO}
        playsInline
        muted
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onError={handleVideoError}
      />

      {needsTap && introPhase === "silent" ? (
        <button type="button" className={styles.startOverlay} onClick={() => void startPlayback()}>
          <span>แตะเพื่อเริ่ม</span>
        </button>
      ) : null}
    </div>
  );
}
