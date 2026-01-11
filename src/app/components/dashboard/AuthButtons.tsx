"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import styles from "./dashboard.module.css";
import { useLanguage } from '@/context/LanguageContext';


export default function AuthButtons() {
  const { t } = useLanguage();
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
        <img src="/icons/plus.svg" className='icon'/>
         Сервер
        </Link>
        <Link href="/settings" className={styles.navItem}>
          <img src="/icons/settings.svg" className='icon'/>
          Настройки
        </Link>

        <button
          className={styles.navItem}
          onClick={async () => {
            await auth.logout();
          }}
        >
          <img src="/icons/sign_out.svg" className='icon'/>
          Выйти
        </button>
      </>
    );
  }

  return (
    <Link className={styles.navItem} href="/login">
      Войти
    </Link>
  );
}
