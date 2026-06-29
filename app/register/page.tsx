import { RegisterBackgroundVideo } from "./RegisterBackgroundVideo";
import { RegisterForm } from "./RegisterForm";
import styles from "./register.module.css";

export default async function RegisterPage() {
  return (
    <main className={styles.page}>
      <RegisterBackgroundVideo />
      <section className={styles.card} aria-labelledby="register-title">
        <p className={styles.kicker}>Memory Farm</p>
        <h1 id="register-title">Happy Birthday</h1>
        <RegisterForm />
      </section>
    </main>
  );
}
