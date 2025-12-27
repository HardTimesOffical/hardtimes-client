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
         {t.dashboard.addServer}
        </Link>
        <Link href="/settings" className={styles.navItem}>
          {t.dashboard.settings}
        </Link>

        <button
          className={styles.navItem}
          onClick={async () => {
            await auth.logout();
          }}
        >
          {t.dashboard.signOut}
        </button>
      </>
    );
  }

  return (
    <Link className={styles.navItem} href="/login">
      Sign In
    </Link>
  );
}
