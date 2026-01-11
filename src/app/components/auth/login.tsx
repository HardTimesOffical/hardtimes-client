"use client";
import React, { useState } from "react";
import axios from "axios";
import styles from "./auth.module.css";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const auth = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      const data = res.data;
      if (!data?.accessToken) throw new Error("No access token received");

      auth.login(data.accessToken, data.user);
      router.push("/"); 
    } catch (err: any) {
      const message = err?.response?.data?.message || err.message || "Ошибка входа";
      setError(message);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.heading}>Войти</h2>
        <p className={styles.subheading}>Введите свои данные чтобы войти в аккаунт</p>
      </header>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="email">Email</label>
          <input
            className={styles.input}
            type="email"
            id="email"
            placeholder="mail@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="password">Пароль</label>
          <div className={styles.inputWrap}>
            <input
              className={styles.input}
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowPassword(s => !s)}
            >
              {showPassword ? "🔒" : "👁️"}
            </button>
          </div>
        </div>

        {error && <div className={styles.errorBox}>{error}</div>}

        <button className={styles.submit} type="submit">
          Продолжить
        </button>

        <footer className={styles.footer}>
          <span>Нету аккаунта?</span>
          <Link href="/register" className={styles.link}>Создать аккаунт</Link>
        </footer>
      </form>
    </div>
  );
}