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
        "http://localhost:5000/auth/login",
        { email, password },
        { withCredentials: true }
      );

      const data = res.data;

      if (!data?.accessToken) {
        throw new Error("No access token received");
      }

      // сохраняем в контекст
      auth.login(data.accessToken, data.user);

      router.push("/"); // или /dashboard
    } catch (err: any) {
      console.error("Login error", err);
      const message =
        err?.response?.data?.message ||
        err.message ||
        "Login failed";
      setError(message);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Sign In</h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div>
          <label className={styles.label} htmlFor="email">Email:</label>
          <input
            className={styles.input}
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className={styles.label} htmlFor="password">Password:</label>
          <div className={styles.inputWrap}>
            <input
              className={styles.input}
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowPassword(s => !s)}
            >
              {showPassword ? "👁️" : "👁"}
            </button>
          </div>
        </div>

        {error && <p className={styles.error}>{error}</p>}
        <div className="pt-4 flex flex-row justify-end">
            <button className={styles.submit} type="submit">
             Sign In
            </button>
        </div>
        <Link href="/register">Doesn't have an account?</Link>
      </form>
    </div>
  );
}
