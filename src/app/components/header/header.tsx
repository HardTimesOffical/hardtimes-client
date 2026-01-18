"use client";
import React from "react";
import styles from "./header.module.css";
import { HeaderBalance } from "./HeaderBalance";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  // Используем user напрямую из контекста. 
  // Когда в Login сработает auth.login(), этот user мгновенно станет не null.
  const { user } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Левая часть */}
        <div className={styles.left}>
          <Link href="/"><img src="/icons/logo.png" alt="logo" className="h-8"/></Link>
        </div>

        {/* Центр */}
        <nav className={styles.navCenter}>
          <Link href="/java" className={styles.navLink}>
            <img src="/icons/top.svg" alt="" /> Топ сервера
          </Link>
          <Link href="/servers/new" className={styles.navLink}>
            <img src="/icons/new.svg" alt="" /> Новые сервера
          </Link>
          <Link href="/workbench" className={styles.navLink}>
            <img src="/icons/plus.svg" alt="" /> Добавить сервер
          </Link>
        </nav>

        {/* Правая часть */}
        <div className={styles.right}>
          <Link href="https://discord.gg/..." target="_blank" className={styles.socialIcon}>
            <img src="/icons/discord.svg" alt="discord"/>
          </Link>
          
          <div className={styles.authArea}>
            {/* Проверяем наличие user из контекста */}
            {user ? (
              <div className="flex items-center gap-4">
                <HeaderBalance />
                
                {/* ИСПРАВЛЕНО: Убрали вложенный Link в Link */}
                <div className="flex gap-2">
                   <Link 
                    href={`/profile/${user.username}`} 
                    className={styles.avatarPlaceholder}
                   >
                     {user.username?.[0].toUpperCase() || 'U'}
                   </Link>
                </div>
              </div>
            ) : (
              <Link href="/login" className={styles.loginBtn}>
                <img src="/icons/login.svg" alt=""/>
                <span>Войти в профиль</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}