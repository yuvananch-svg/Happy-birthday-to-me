"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./register.module.css";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, code })
    });

    const payload = (await response.json().catch(() => ({}))) as {
      ok?: boolean;
      message?: string;
    };

    setIsSubmitting(false);

    if (!response.ok || !payload.ok) {
      setMessage(payload.message || "ประตูยังไม่เปิด ลองใหม่อีกครั้งนะ");
      return;
    }

    router.push("/game");
    router.refresh();
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <label>
        <span>ชื่อผู้เล่น</span>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="name"
          placeholder="Perthyw"
        />
      </label>

      <label>
        <span>รหัสวันเกิด</span>
        <input
          value={code}
          onChange={(event) => setCode(event.target.value)}
          inputMode="numeric"
          placeholder="12/07/2003"
        />
      </label>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "กำลังเปิดประตู..." : "เปิดประตูความทรงจำ"}
      </button>

      {message ? <p className={styles.error}>{message}</p> : null}
    </form>
  );
}
