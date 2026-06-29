"use client";

import { useState } from "react";
import styles from "./register.module.css";

const WRONG_CREDENTIALS_FIRST =
  "รหัสไม่ถูกต้อง ลองใหม่อีกครั้งนะคนเก่ง";
const WRONG_CREDENTIALS_REPEAT =
  "ทำไมไม่ลองอวยพรวันเกิดให้ตัวเองดูล่ะ";

function wrongCredentialsMessage(attempt: number): string {
  return attempt >= 2 ? WRONG_CREDENTIALS_REPEAT : WRONG_CREDENTIALS_FIRST;
}

export function RegisterForm() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ name: name.trim(), code: code.trim() })
    });

    const payload = (await response.json().catch(() => ({}))) as {
      ok?: boolean;
      message?: string;
    };

    setIsSubmitting(false);

    if (!response.ok || !payload.ok) {
      if (response.status === 401) {
        const nextAttempt = failedAttempts + 1;
        setFailedAttempts(nextAttempt);
        setMessage(wrongCredentialsMessage(nextAttempt));
      } else {
        setMessage(payload.message || "ประตูยังไม่เปิด ลองใหม่อีกครั้งนะ");
      }
      return;
    }

    setFailedAttempts(0);
    window.location.assign("/game");
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <label>
        <span>ชื่อของคนที่น่ารักที่สุดในโลก</span>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="name"
          placeholder="พิมพ์ชื่อเล่นของเธอ"
        />
      </label>

      <label>
        <span>ลองเดารหัสดูสิ้</span>
        <input
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="รหัสลับ..."
        />
      </label>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
      </button>

      {message ? <p className={styles.error}>{message}</p> : null}
    </form>
  );
}
