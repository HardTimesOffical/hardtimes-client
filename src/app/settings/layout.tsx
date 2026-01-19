"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import DashboardLayout from "../components/dashboard/dashboard";
import styles from './settings.module.css';
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";


export default function SettingsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const user = useAuth().user;
  
  // Проверяем, находится ли пользователь в корне настроек
  const isRootSettings = pathname === "/settings" || pathname === "/settings/";

  return (
      <LanguageProvider>
      <div className="mt-25">
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
            <img src="/icons/lang.svg" className="icon"/>
              {t.settings.language}
            </Link>
          </nav>
        </aside>

        {/* Контентная часть */}
        <section className={styles.content}>
          {/* Кнопка "Назад" только для мобилок */}
          {!isRootSettings && (
            <Link href={`/profile/${user?.username}`} className={styles.backButton}>
              ← Назад
            </Link>
          )}
          {children}
        </section>
      </div>
      </div>
      </LanguageProvider>
    
    
  );
}