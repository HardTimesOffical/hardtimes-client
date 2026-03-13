'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HiArrowRight, HiMegaphone } from 'react-icons/hi2';

const SLIDE_DURATION = 9000;

const slides = [
  {
    id: 'launcher',
    href: '/ru/launcher',
    internal: true,
    tag: 'OFFICIAL',
    tagColor: '#5aac44',
    title: 'HardLauncher',
    subtitle: 'Запускай Minecraft в один клик',
    cta: 'Скачать бесплатно',
    accent: '#5aac44',
    accentDark: '#3c8527',
    stats: [
      { label: 'Обновление', value: 'Авто' },
      { label: 'Цена', value: 'Бесплатно' },
    ],
    // Фон: пиксельная сетка + градиент
    bg: 'grid',
  }
];

export default function PromoBanner() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setCurrent(Math.floor(Math.random() * slides.length));
  }, []);

  useEffect(() => {
    setProgress(0);
    const start = Date.now();
    const iv = setInterval(() => {
      const p = ((Date.now() - start) / SLIDE_DURATION) * 100;
      if (p >= 100) {
        setCurrent(c => (c + 1) % slides.length);
      } else {
        setProgress(p);
      }
    }, 50);
    return () => clearInterval(iv);
  }, [current]);

  const slide = slides[current];

  const Inner = () => (
    <div className="relative w-full overflow-hidden bg-[#0d0d0d] border border-border"
      style={{ minHeight: '140px' }}>

      {/* ── Фоновый декор ── */}
      {slide.bg === 'grid' && (
        <div className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }} />
      )}
      {slide.bg === 'dots' && (
        <div className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage: `radial-gradient(#fff 0.5px, transparent 0.5px)`,
            backgroundSize: '20px 20px',
          }} />
      )}
      {/* Боковой градиент */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent 40%, #0d0d0d 100%)' }} />

      {/* ── Акцентная полоска слева ── */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px]"
        style={{ background: `linear-gradient(to bottom, ${slide.accent}, ${slide.accentDark})` }} />

      {/* ── Контент ── */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between
        gap-5 px-5 py-5 pl-6">

        {/* Левая: тег + заголовок + статы + описание */}
        <div className="flex flex-col gap-3 flex-1 min-w-0">

          {/* Тег */}
          <div className="flex items-center gap-2">
            <span className="font-mc-pixel text-[8px] uppercase tracking-widest px-2 py-0.5"
              style={{ background: `${slide.accent}18`, color: slide.accent, border: `1px solid ${slide.accent}33` }}>
              {slide.tag}
            </span>
          </div>

          {/* Заголовок */}
          <h2 className="font-mc-title text-white leading-none"
            style={{ fontSize: 'clamp(22px, 3.5vw, 38px)', textShadow: '3px 3px 0 rgba(0,0,0,0.6)' }}>
            {slide.title}
            <span style={{ color: slide.accent }}>.</span>
          </h2>

          {/* Статы */}
          <div className="flex items-center gap-5">
            {slide.stats.map((s, i) => (
              <div key={i} className="flex flex-col leading-none border-l-2 pl-2"
                style={{ borderColor: `${slide.accent}44` }}>
                <span className="font-standard font-black text-[13px] text-white">{s.value}</span>
                <span className="font-mc-pixel text-[7px] text-muted uppercase tracking-widest mt-0.5">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Описание */}
          <p className="font-standard text-[12px] leading-relaxed max-w-[400px]"
            style={{ color: 'rgba(255,255,255,0.4)' }}>
            {slide.subtitle}
          </p>
        </div>

        {/* Правая: CTA */}
        <div className="flex flex-col items-center md:items-end gap-2 shrink-0">
          <div
            className="inline-flex items-center gap-2 px-5 py-2.5
              font-standard font-bold text-[12px] text-white
              transition-all duration-150 hover:brightness-110 active:scale-95 cursor-pointer"
            style={{
              background: slide.accentDark,
              boxShadow: `inset 1px 1px 0 ${slide.accent}, inset -1px -1px 0 rgba(0,0,0,0.4), 0 2px 0 rgba(0,0,0,0.5)`,
            }}
          >
            {slide.cta}
            <HiArrowRight className="w-3.5 h-3.5" />
          </div>

          {/* Индикаторы слайдов */}
          <div className="flex items-center gap-1.5 mt-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={e => { e.preventDefault(); setCurrent(i); }}
                className="transition-all duration-200"
                style={{
                  width: current === i ? '20px' : '6px',
                  height: '3px',
                  background: current === i ? slide.accent : 'rgba(255,255,255,0.15)',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Прогресс-бар снизу */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5">
        <div
          className="h-full transition-none"
          style={{ width: `${progress}%`, background: slide.accent }}
        />
      </div>
    </div>
  );

  return (
    <div className="w-full mb-4">
      {slide.internal ? (
        <Link href={slide.href} className="block group">
          <Inner />
        </Link>
      ) : (
        <a href={slide.href} target="_blank" rel="noopener noreferrer" className="block group">
          <Inner />
        </a>
      )}

      {/* Кнопка рекламного кабинета */}
      <div className="mt-1.5 flex justify-end px-0.5">
        <a
          href="https://t.me/SamuraiMFG"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1
            font-mc-pixel text-[8px] uppercase tracking-widest
            text-muted/40 border border-border/30 bg-transparent
            hover:text-muted hover:border-border transition-all duration-150"
        >
          <HiMegaphone className="w-2.5 h-2.5" />
          Рекламный кабинет
        </a>
      </div>
    </div>
  );
}