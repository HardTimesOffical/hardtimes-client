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
          Add Server +
        </Link>
        <Link href="/settings" className={styles.navItem}>
          Settings
        </Link>

        <button
          className={styles.navItem}
          onClick={async () => {
            await auth.logout();
          }}
        >
          Sign Out
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
