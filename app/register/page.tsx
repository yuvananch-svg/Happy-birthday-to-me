import { redirect } from "next/navigation";
import { hasAccessCookie } from "@/lib/auth/access-cookie";
import { RegisterForm } from "./RegisterForm";
import styles from "./register.module.css";

export default async function RegisterPage() {
  if (await hasAccessCookie()) {
    redirect("/game");
  }

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="register-title">
        <p className={styles.kicker}>Memory Gate</p>
        <h1 id="register-title">ประตูเมืองความทรงจำ</h1>
        <p className={styles.copy}>
          ใส่ชื่อกับรหัสวันเกิด เพื่อเปิดทางเข้าเควสต์เล็กๆ ที่ทำไว้ให้คนเดียว
        </p>
        <RegisterForm />
      </section>
    </main>
  );
}
