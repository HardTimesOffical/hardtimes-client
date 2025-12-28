"use client";
import React, { PropsWithChildren, useState } from "react";
import Link from "next/link";
import styles from "./dashboard.module.css";
import AuthSlot from "./AuthSlot";
import { usePathname } from "next/navigation";
// УДАЛИТЕ импорт LanguageProvider отсюда
import { useLanguage } from "@/context/LanguageContext";

export default function DashboardLayout({ children }: PropsWithChildren) {
    // Теперь t будет приходить из глобального провайдера в RootLayout
    const { t } = useLanguage();
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    return (
        <div className={`${styles.container} min-h-screen`}> 
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
                        <img src="/icons/logo.svg" alt="Logo" />
                    </Link>
                </div>

                <div className={styles.buttonsWrap}>
                    <nav className={styles.nav}>
                        {/* Ключи должны совпадать с вашим JSON (t.dashboard.general) */}
                        <div className={styles.sectionTitle}>{t.dashboard.general}</div>
                        
                        <Link
                            className={`${styles.navItem} ${
                                pathname === "/servers/java" ? styles.navItemActive : ""
                            }`}
                            href="/servers/java"
                        >                      
                            <img className="w-6" src="/icons/java.svg" alt="Java" />
                            Java
                        </Link>

                        <Link
                            className={`${styles.navItem} ${
                                pathname === "/servers/bedrock" ? styles.navItemActive : ""
                            }`}
                            href="/servers/bedrock"
                        >
                            <img className="w-6" src="/icons/bedrock.svg" alt="Bedrock" />
                            Bedrock
                        </Link>

                        <div className={styles.sectionTitle}>{t.dashboard.info}</div>
                        <Link
                            className={styles.navItem}
                            href="https://discord.gg/KHU93fphJK"
                            target="_blank"
                        >
                            Discord
                        </Link>
                        <Link
                            className={styles.navItem}
                            href="https://onlybuilders.ru/feed"
                            target="_blank"
                        >
                            For Builders
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