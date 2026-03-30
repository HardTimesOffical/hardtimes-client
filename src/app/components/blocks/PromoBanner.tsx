"use client";

import React from 'react';
import Link from 'next/link';
import { HiArrowRight, HiMegaphone } from 'react-icons/hi2';

const FIXED_HEIGHT = '137px';

// Теперь это просто константа для одного баннера
const launcherData = {
  id: 'launcher',
  href: '/ru/launcher',
  tag: 'OFFICIAL',
  title: 'HardLauncher',
  subtitle: 'Minecraft в один клик',
  cta: 'Скачать',
  accent: '#5aac44',
  accentDark: '#3c8527',
  stats: [
    { label: 'Обновление', value: 'Авто' },
    { label: 'Цена', value: '0₽' },
  ],
};

export default function PromoBanner() {
  return (
    <div className="w-full mb-4">
      {/* ── Основной контейнер ── */}
      <div 
        className="relative w-full overflow-hidden border border-border bg-[#0d0d0d] group" 
        style={{ height: FIXED_HEIGHT }}
      >
        <Link href={launcherData.href} className="block w-full h-full outline-none">
          <div className="relative w-full h-full overflow-hidden">
            
            {/* Сетка фона (Minecraft Style) */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.06]"
              style={{
                backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
                backgroundSize: '24px 24px',
              }} 
            />
            
            {/* Градиент затемнения справа */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent 40%, #0d0d0d 100%)' }} 
            />

            {/* Левая акцентная полоса */}
            <div className="absolute left-0 top-0 bottom-0 w-[3px]"
              style={{ background: `linear-gradient(to bottom, ${launcherData.accent}, ${launcherData.accentDark})` }} 
            />

            <div className="relative z-10 flex h-full items-center justify-between gap-5 px-6 py-2">
              <div className="flex flex-col gap-2 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mc-pixel text-[8px] uppercase tracking-widest px-2 py-0.5"
                    style={{ 
                      background: `${launcherData.accent}18`, 
                      color: launcherData.accent, 
                      border: `1px solid ${launcherData.accent}33` 
                    }}>
                    {launcherData.tag}
                  </span>
                </div>

                <h2 className="font-mc-title text-white leading-none group-hover:translate-x-1 transition-transform duration-300"
                  style={{ fontSize: 'clamp(20px, 3vw, 30px)', textShadow: '2px 2px 0 rgba(0,0,0,0.6)' }}>
                  {launcherData.title}<span style={{ color: launcherData.accent }}>.</span>
                </h2>

                <div className="flex items-center gap-4">
                  {launcherData.stats.map((s, i) => (
                    <div key={i} className="flex flex-col leading-none border-l-2 pl-2" style={{ borderColor: `${launcherData.accent}44` }}>
                      <span className="font-standard font-black text-[12px] text-white">{s.value}</span>
                      <span className="font-mc-pixel text-[7px] text-muted uppercase tracking-widest mt-0.5">{s.label}</span>
                    </div>
                  ))}
                  <p className="font-standard text-[11px] text-white/40 truncate ml-2">{launcherData.subtitle}</p>
                </div>
              </div>

              {/* Кнопка CTA */}
              <div className="flex flex-col items-end gap-2 shrink-0">
                <div className="inline-flex items-center gap-2 px-4 py-2 font-standard font-bold text-[11px] text-white transition-all group-hover:scale-105 active:scale-95"
                  style={{
                    background: launcherData.accentDark,
                    boxShadow: `inset 1px 1px 0 ${launcherData.accent}, inset -1px -1px 0 rgba(0,0,0,0.4), 0 2px 0 rgba(0,0,0,0.5)`,
                  }}>
                  {launcherData.cta}
                  <HiArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Кнопка рекламного кабинета */}
      <div className="mt-1.5 flex justify-end px-0.5">
        <a
          href="https://t.me/SakuraMFS"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1 font-mc-pixel text-[8px] uppercase tracking-widest text-muted/40 border border-border/30 bg-transparent hover:text-muted hover:border-border transition-all duration-150"
        >
          <HiMegaphone className="w-2.5 h-2.5" />
          Разместить рекламу
        </a>
      </div>
    </div>
  );
}