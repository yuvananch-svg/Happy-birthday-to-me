"use client";

import { useEffect, useRef } from "react";
import { withBasePath } from "@/lib/navigation";
import styles from "./register.module.css";

const LOGIN_BACKGROUND_VIDEO = withBasePath("/videos/login-background.mp4");

export function RegisterBackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    void video.play().catch(() => {
      // Autoplay may be blocked; static first frame still shows.
    });
  }, []);

  return (
    <div className={styles.background} aria-hidden="true">
      <video
        ref={videoRef}
        className={styles.backgroundVideo}
        src={LOGIN_BACKGROUND_VIDEO}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />
      <div className={styles.backgroundOverlay} />
    </div>
  );
}
