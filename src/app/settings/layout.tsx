"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import DashboardLayout from "../components/dashboard/dashboard";
import styles from './settings.module.css';
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";


export default function SettingsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { t } = useLanguage();
  
  // Проверяем, находится ли пользователь в корне настроек
  const isRootSettings = pathname === "/settings" || pathname === "/settings/";

  return (
    <DashboardLayout>
      <LanguageProvider>
      <div className={`${styles.settingsLayout} ${isRootSettings ? styles.showMenu : styles.showContent}`}>
        
        {/* Боковое меню */}
        <aside className={styles.sidebar}>
          <h2 className="text-xl font-bold mb-4 px-4 md:hidden">{t.settings.title}</h2>
          <nav className={styles.nav}>
            <Link href="/settings/profile" className={styles.sidebarLink}>
              👤 {t.settings.profile}
            </Link>
            <Link href="/settings/security" className={styles.sidebarLink}>
              🔒 {t.settings.security}
            </Link>
            <Link href="/settings/language" className={styles.sidebarLink}>
              🎨 {t.settings.language}
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
      </LanguageProvider>
    </DashboardLayout>
    
    
  );
}