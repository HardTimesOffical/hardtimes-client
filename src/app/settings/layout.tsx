"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import DashboardLayout from "../components/dashboard/dashboard";
import styles from './settings.module.css';

export default function SettingsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  // Проверяем, находится ли пользователь в корне настроек
  const isRootSettings = pathname === "/settings" || pathname === "/settings/";

  return (
    <DashboardLayout>
      <div className={`${styles.settingsLayout} ${isRootSettings ? styles.showMenu : styles.showContent}`}>
        
        {/* Боковое меню */}
        <aside className={styles.sidebar}>
          <h2 className="text-xl font-bold mb-4 px-4 md:hidden">Настройки</h2>
          <nav className={styles.nav}>
            <Link href="/settings/profile" className={styles.sidebarLink}>
              👤 Profile
            </Link>
            <Link href="/settings/security" className={styles.sidebarLink}>
              🔒 Security
            </Link>
            <Link href="/settings/language" className={styles.sidebarLink}>
              🎨 Language
            </Link>
          </nav>
        </aside>

        {/* Контентная часть */}
        <section className={styles.content}>
          {/* Кнопка "Назад" только для мобилок */}
          {!isRootSettings && (
            <Link href="/settings" className={styles.backButton}>
              ← Назад
            </Link>
          )}
          {children}
        </section>
      </div>
    </DashboardLayout>
  );
}