"use client";

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/5 backdrop-blur-md mt-auto"
      style={{ backgroundColor: 'rgba(10, 11, 11, 0.8)' }}>
      
      <div className="max-w-[1132px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Секция 1: О проекте */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#84a98c] shadow-[0_0_8px_#84a98c]" />
              <span className="font-mc-pixel text-[13px] text-[#f2f2f2] uppercase tracking-widest">
                HardMonitoring
              </span>
            </div>
            
            {/* Добавлен leading-[1.6] чтобы строки не клеились */}
            <p className="font-mc-pixel text-[9px] text-[#7d8581] leading-[1.6] uppercase opacity-80">
              Лучший инструмент для поиска серверов и продвижения ваших проектов.
            </p>

            {/* Юридический дисклеймер */}
            <p className="font-mc-pixel text-[7px] text-[#7d8581]/50 leading-[1.4] uppercase">
              NOT AN OFFICIAL MINECRAFT PRODUCT. NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT.
            </p>
            
            <div className="flex flex-col gap-2 mt-2">
              <Link href="/ru/launcher" className="flex items-center justify-center h-9 bg-[#84a98c]/10 border border-[#84a98c]/30 hover:bg-[#84a98c]/20 transition-all">
                <span className="font-mc-pixel text-[9px] text-[#84a98c] uppercase tracking-tighter">Установить лаунчер</span>
              </Link>
              <Link href="https://vk.com/hardlauncher" target="_blank" className="flex items-center justify-center h-9 bg-[#4c75a3]/10 border border-[#4c75a3]/30 hover:bg-[#4c75a3]/20 transition-all">
                <span className="font-mc-pixel text-[9px] text-[#4c75a3] uppercase tracking-tighter">ВКонтакте</span>
              </Link>
            </div>
          </div>

          {/* Секция 2: Ссылки */}
          <div className="flex flex-col gap-5">
            <span className="font-mc-pixel text-[10px] text-[#f2f2f2] uppercase opacity-40 tracking-wider">Навигация</span>
            <nav className="flex flex-col gap-3">
              <FooterLink href="/workbench">Добавить сервер</FooterLink>
              <FooterLink href="https://t.me/SakuraMFS">Реклама</FooterLink>
              <FooterLink href="/monitoring">Топ серверов</FooterLink>
              <FooterLink href="/monitoring/new">Новые проекты</FooterLink>
            </nav>
          </div>

          {/* Секция 3: Помощь & Контакты */}
          <div className="flex flex-col gap-5">
            <span className="font-mc-pixel text-[10px] text-[#f2f2f2] uppercase opacity-40 tracking-wider">Связь с нами</span>
            <nav className="flex flex-col gap-3">
              {/* Ссылки на Телеграм */}
              <FooterLink href="https://t.me/megashield_quazar">
                <span className="flex items-center gap-2 text-[#0088cc]">
                  <span className="w-1 h-1 bg-[#0088cc] rounded-full" />
                  Telegram Админ
                </span>
              </FooterLink>
              <FooterLink href="https://t.me/HardTimeMonitoring">
                <span className="flex items-center gap-2 text-[#0088cc]">
                  <span className="w-1 h-1 bg-[#0088cc] rounded-full" />
                  Наш канал
                </span>
              </FooterLink>
            </nav>
          </div>

          {/* Секция 4: Копирайт */}
          <div className="flex flex-col justify-between items-end">
            <div className="font-mc-pixel text-[20px] text-white/[0.03] select-none tracking-tighter">HARDMON</div>
            <div className="flex flex-col gap-1 items-end">
              <span className="font-mc-pixel text-[8px] text-[#7d8581] uppercase text-right leading-tight">
                © {currentYear} HDM TEAM
              </span>
              <span className="font-mc-pixel text-[7px] text-[#7d8581]/40 uppercase text-right tracking-tighter">
                v3.0.2 // build_0326
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="font-mc-pixel text-[10px] text-[#7d8581] hover:text-[#84a98c] uppercase transition-colors">
      {children}
    </Link>
  );
}