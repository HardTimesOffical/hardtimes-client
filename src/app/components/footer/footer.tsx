"use client";
import React from "react";
import styles from "./footer.module.css";
import { FaTelegramPlane, FaEnvelope } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* Левая часть: Бренд */}
        <div className={styles.left}>
          <h2 className="text-xl font-black uppercase tracking-tighter text-foreground-bright transition-colors">
            HARD<span className="text-accent">TIMES</span>
          </h2>
          <p className="text-[10px] font-bold text-muted uppercase tracking-widest mt-2 transition-colors">
            © {currentYear} Все права защищены
          </p>
        </div>

        {/* Правая часть: Техподдержка */}
        <div className={styles.right}>
          <div className="flex flex-col md:flex-row gap-6 md:gap-12">
            
            {/* Telegram */}
            <a 
              href="https://t.me/megashield_quazar" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 bg-surface border border-border rounded-xl flex items-center justify-center text-muted group-hover:bg-blue-500/10 group-hover:text-blue-500 transition-all">
                <FaTelegramPlane size={18} />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase text-muted tracking-tighter transition-colors">
                  Поддержка TG
                </p>
                <span className="text-sm font-bold text-foreground-bright group-hover:text-blue-500 transition-colors">
                  @megashield_quazar
                </span>
              </div>
            </a>

            {/* Email */}
            <a 
              href="mailto:hardtime.offical@gmail.com" 
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 bg-surface border border-border rounded-xl flex items-center justify-center text-muted group-hover:bg-accent/10 group-hover:text-accent transition-all">
                <FaEnvelope size={18} />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase text-muted tracking-tighter transition-colors">
                  Почта проекта
                </p>
                <p className="text-sm font-bold text-foreground-bright group-hover:text-accent transition-colors">
                  hardtimes.offical@gmail.com
                </p>
              </div>
            </a>

          </div>
        </div>
      </div>
    </footer>
  );
}