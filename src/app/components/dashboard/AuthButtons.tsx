"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import styles from "./dashboard.module.css";

export default function AuthButtons() {
  const auth = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={styles.navItemPlaceholder} />;
  }

  if (auth.user) {
    return (
      <>
        <Link className={styles.navItem} href="/workbench">
          <img src="/icons/plus.svg" className='icon' alt="" />
          {/* Оборачиваем текст в span */}
          <span translate="no">Сервер</span>
        </Link>
        <Link href="/settings" className={styles.navItem}>
          <img src="/icons/settings.svg" className='icon' alt="" />
          <span translate="no">Настройки</span>
        </Link>

        <button
          className={styles.navItem}
          onClick={async (e) => {
            // Предотвращаем стандартное поведение на всякий случай
            e.preventDefault(); 
            await auth.logout();
          }}
        >
          <img src="/icons/sign_out.svg" className='icon' alt="" />
          <span translate="no">Выйти</span>
        </button>
      </>
    );
  }

  return (
    <Link className={styles.navItem} href="/login">
      <span>Войти</span>
    </Link>
  );
}