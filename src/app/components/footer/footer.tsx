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
          <h2 className="text-xl font-black uppercase italic tracking-tighter text-slate-900">
            HARD<span className="text-orange-500">TIMES</span>
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
            © {currentYear} Все права защищены
          </p>
        </div>

        {/* Правая часть: Техподдержка */}
        <div className={styles.right}>
          <div className="flex flex-col md:flex-row gap-6 md:gap-12">
            {/* Telegram */}
            <a 
              href="https://t.me/твой_логин" // ЗАМЕНИ "твой_логин" на реальный @username без знака @
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all">
                <FaTelegramPlane size={18} />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">Поддержка TG</p>
                <Link href="https://t.me/megashield_quazar" className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">@megashield_quazar</Link>
              </div>
            </a>

            {/* Email */}
            <a 
              href="mailto:hardtime.offical@gmail.com" 
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-500 transition-all">
                <FaEnvelope size={18} />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">Почта проекта</p>
                <p className="text-sm font-bold text-slate-700 group-hover:text-orange-600 transition-colors">hardtimes.offical@gmail.com</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}