"use client";
import React from "react";
import { FaTelegramPlane, FaEnvelope, FaDiscord } from "react-icons/fa";
import Link from "next/link";

const MC_GREEN = '#5aac44';
const MC_GREEN_DARK = '#3c8527';

// Стиль для активных элементов в духе кнопок Minecraft
const MC_BUTTON_STYLE: React.CSSProperties = {
  background: '#3c8527',
  boxShadow: [
    'inset 1px 1px 0 #5aac44',
    'inset -1px -1px 0 #2a5e1a',
    '0 2px 0 #000',
  ].join(', '),
};

const NAV_LINKS = [
  { label: 'Мониторинг', href: '/monitoring' },
  { label: 'Контент', href: '/content' },
  { label: 'Форум', href: '/forum' },
  { label: 'Добавить сервер', href: '/monitoring/workbench' },
  { label: 'Магазин', href: '/shop' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#121212] border-t border-white/5 mt-auto relative overflow-hidden">
      
      {/* ── Верхний пиксельный бордюр ── */}
      <div className="h-[2px] w-full bg-[#1a1a1a] flex">
        <div className="h-full w-1/3 bg-[#3c8527]/30" />
        <div className="h-full w-1/6 bg-[#5aac44]/20" />
        <div className="h-full w-1/2 bg-transparent" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Колонка 1: Бренд и Описание */}
          <div className="col-span-1 md:col-span-1 flex flex-col gap-5">
            <Link href="/" className="inline-flex items-center gap-3 no-underline group">
              <div 
                className="w-8 h-8 flex items-center justify-center font-mc-pixel text-[14px] text-white"
                style={MC_BUTTON_STYLE}
              >
                H
              </div>
              <span className="font-mc-title text-[15px] text-white tracking-wider">
                HARD<span style={{ color: MC_GREEN }}>TIMES</span>
              </span>
            </Link>

            <p className="font-standard text-[12px] text-zinc-500 leading-relaxed">
              Сервис для игроков Minecraft. Мониторинг серверов, форум и живое сообщество.
            </p>

            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 rounded-sm bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-600 hover:text-white hover:border-[#3c8527] transition-all">
                <FaDiscord size={14} />
              </a>
              <a href="https://t.me/megashield_quazar" className="w-8 h-8 rounded-sm bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-600 hover:text-white hover:border-[#3c8527] transition-all">
                <FaTelegramPlane size={14} />
              </a>
            </div>
          </div>

          {/* Колонка 2: Навигация */}
          <div className="flex flex-col gap-4">
            <h4 className="font-mc-pixel text-[10px] text-zinc-400 uppercase tracking-[0.2em]">Меню</h4>
            <nav className="flex flex-col gap-2.5">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[13px] text-zinc-500 hover:text-[#5aac44] transition-colors flex items-center gap-2 group w-fit"
                >
                  <span className="w-1 h-1 bg-zinc-800 group-hover:bg-[#5aac44] transition-colors" />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Колонка 3: Контакты */}
          <div className="flex flex-col gap-6">
            <h4 className="font-mc-pixel text-[10px] text-zinc-400 uppercase tracking-[0.2em]">Связь</h4>
            
            <a href="https://t.me/megashield_quazar" className="group block">
               <p className="text-[9px] text-zinc-600 uppercase mb-1">Telegram Support</p>
               <p className="text-[13px] text-zinc-300 group-hover:text-white transition-colors font-medium">@megashield_quazar</p>
            </a>

            <a href="mailto:hardtimes.offical@gmail.com" className="group block">
               <p className="text-[9px] text-zinc-600 uppercase mb-1">Business Email</p>
               <p className="text-[13px] text-zinc-300 group-hover:text-white transition-colors font-medium">hardtimes.offical@gmail.com</p>
            </a>
          </div>

        </div>

        {/* ── Нижняя подпись ── */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-[10px] text-zinc-700 uppercase tracking-[0.2em]">
              Not an official Minecraft product.
            </p>
          </div>
          
          <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
            &copy; {year} HardTimes <span className="mx-2 text-zinc-800">|</span> All Rights Reserved
          </p>
        </div>
      </div>

      {/* Легкий градиент снизу */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#5aac44]/10 to-transparent" />
    </footer>
  );
}