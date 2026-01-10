"use client";
import React, { PropsWithChildren, useState } from "react";
import Link from "next/link";
import styles from "./dashboard.module.css";
import AuthSlot from "./AuthSlot";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

interface DashboardProps extends PropsWithChildren {
    variant?: "default" | "serverPage";
}

export default function DashboardLayout({ children, variant }: DashboardProps) {
    const { t } = useLanguage();
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    // 1. Логика определения типов страниц
    const isJavaPage = pathname === '/servers/java';
    const isBedrockPage = pathname === '/servers/bedrock';
    const isHytalePage = pathname === '/servers/hytale';
    // Проверяем, что это страница конкретного сервера (не главная, не списки, не админка)
    const isServerSinglePage = variant === "serverPage" || (
        pathname !== '/' && 
        !pathname.startsWith('/servers') && 
        !pathname.startsWith('/dashboard')
    );

    // 2. Определяем итоговую тему
    let currentTheme = "default";
    if (isJavaPage) currentTheme = "java";
    else if (isBedrockPage) currentTheme = "bedrock";
    else if (isServerSinglePage) currentTheme = "server";

    return (
        <div 
            className={styles.container} 
            data-theme={currentTheme} // Используем динамическую тему здесь
        > 
            <button
                className={`${styles.hamburger} ${open ? styles.hidden : ""}`}
                onClick={() => setOpen(true)}
                aria-label="Open menu"
            >
                <span />
                <span />
                <span />
            </button>

            <aside className={`${styles.sidebar} ${open ? styles.open : ""}`}>
                <div className={styles.logoWrap}>
                    <Link className={styles.brand} href="/">
                        HardTimes
                    </Link>
                </div>

                <div className={styles.buttonsWrap}>
                    <nav className={styles.nav}>
                        <div className={styles.sectionTitle}>{t.dashboard.general}</div>
                        
                        <Link
                            className={`${styles.navItem} ${isJavaPage ? styles.navItemActive : ""}`}
                            href="/servers/java"
                        >                      
                            <img className="w-6" src="/icons/java.svg" alt="Java" />
                            Java
                        </Link>

                        <Link
                            className={`${styles.navItem} ${isBedrockPage ? styles.navItemActive : ""}`}
                            href="/servers/bedrock"
                        >
                            <img className="w-6" src="/icons/bedrock.svg" alt="Bedrock" />
                            Bedrock
                        </Link>
                        
                        <Link
                            className={`${styles.navItem} ${isHytalePage ? styles.navItemActive : ""}`}
                            href="/servers/hytale"
                        >
                            <img className="w-6" src="/icons/bedrock.svg" alt="Bedrock" />
                            Hytale
                        </Link>

                        <div className={styles.sectionTitle}>{t.dashboard.info}</div>
                        <Link
                            className={styles.navItem}
                            href="https://discord.gg/KHU93fphJK"
                            target="_blank"
                        >
                            Discord
                        </Link>
                    </nav>
                </div>
                <div className={styles.dashboardmodule}>
                    <div className={styles.actions}>
                        <AuthSlot />
                    </div>
                </div>
            </aside>

            <div
                className={`${styles.overlay} ${open ? styles.show : ""}`}
                onClick={() => setOpen(false)}
            />

            <main className={`${styles.main} flex-1`}>
                <div className={styles.content}>{children}</div>
            </main>
        </div>
    );
}