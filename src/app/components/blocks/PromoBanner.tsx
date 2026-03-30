"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HiArrowRight, HiMegaphone } from 'react-icons/hi2';

const SLIDE_DURATION = 5000;
const FIXED_HEIGHT = '137px';

const slides = [
  {
    id: 'launcher',
    type: 'content',
    href: '/ru/launcher',
    internal: true,
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
    bg: 'grid',
  },
  {
    id: 'promo-image',
    type: 'image',
    href: 'https://clc.li/minely-monitor3453',
    internal: false, // Внешняя ссылка
    image: '/banner/minely.png',
    accent: '#5a6e60',
  }
];

export default function PromoBanner() {
  const [current, setCurrent] = useState(() => Math.floor(Math.random() * slides.length));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full mb-4">
      {/* ── Основной контейнер с фиксированной высотой ── */}
      <div className="relative w-full overflow-hidden border border-border bg-[#0d0d0d]" 
           style={{ height: FIXED_HEIGHT }}>
        
        {slides.map((slide, index) => {
          const isActive = index === current;
          const isImage = slide.type === 'image';

          return (
            <div
              key={slide.id}
              className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out"
              style={{ 
                opacity: isActive ? 1 : 0, 
                pointerEvents: isActive ? 'auto' : 'none',
                zIndex: isActive ? 10 : 0
              }}
            >
              {slide.internal ? (
                <Link href={slide.href} className="block w-full h-full outline-none">
                  <SlideContent slide={slide} isImage={isImage} current={current} index={index} />
                </Link>
              ) : (
                <a href={slide.href} target="_blank" rel="noopener noreferrer" className="block w-full h-full outline-none">
                  <SlideContent slide={slide} isImage={isImage} current={current} index={index} />
                </a>
              )}
            </div>
          );
        })}
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
          Рекламный кабинет
        </a>
      </div>
    </div>
  );
}

// Вспомогательный компонент для содержимого слайда
function SlideContent({ slide, isImage, current, index }: any) {
  if (isImage) {
    return (
      <div className="relative w-full h-full group">
        <img src={slide.image} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
        <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/60 border border-white/10 font-mc-pixel text-[8px] text-white/40 uppercase">Promo</div>
        
        {/* Точки переключения */}
        <div className="absolute bottom-3 right-5 flex items-center gap-1.5 z-20">
          {slides.map((_, i) => (
            <div key={i} className="transition-all duration-200"
              style={{
                width: current === i ? '20px' : '6px',
                height: '3px',
                background: current === i ? slide.accent : 'rgba(255,255,255,0.3)',
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Сетка фона */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }} />
      
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent 40%, #0d0d0d 100%)' }} />

      <div className="absolute left-0 top-0 bottom-0 w-[3px]"
        style={{ background: `linear-gradient(to bottom, ${slide.accent}, ${slide.accentDark})` }} />

      <div className="relative z-10 flex h-full items-center justify-between gap-5 px-6 py-2">
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mc-pixel text-[8px] uppercase tracking-widest px-2 py-0.5"
              style={{ background: `${slide.accent}18`, color: slide.accent, border: `1px solid ${slide.accent}33` }}>
              {slide.tag}
            </span>
          </div>

          <h2 className="font-mc-title text-white leading-none"
            style={{ fontSize: 'clamp(20px, 3vw, 30px)', textShadow: '2px 2px 0 rgba(0,0,0,0.6)' }}>
            {slide.title}<span style={{ color: slide.accent }}>.</span>
          </h2>

          <div className="flex items-center gap-4">
            {slide.stats?.map((s: any, i: number) => (
              <div key={i} className="flex flex-col leading-none border-l-2 pl-2" style={{ borderColor: `${slide.accent}44` }}>
                <span className="font-standard font-black text-[12px] text-white">{s.value}</span>
                <span className="font-mc-pixel text-[7px] text-muted uppercase tracking-widest mt-0.5">{s.label}</span>
              </div>
            ))}
            <p className="font-standard text-[11px] text-white/40 truncate ml-2">{slide.subtitle}</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="inline-flex items-center gap-2 px-4 py-2 font-standard font-bold text-[11px] text-white transition-all bg-accent"
            style={{
              background: slide.accentDark,
              boxShadow: `inset 1px 1px 0 ${slide.accent}, inset -1px -1px 0 rgba(0,0,0,0.4), 0 2px 0 rgba(0,0,0,0.5)`,
            }}>
            {slide.cta}
            <HiArrowRight className="w-3 h-3" />
          </div>

          <div className="flex items-center gap-1.5 mt-1">
            {slides.map((_, i) => (
              <div key={i} className="transition-all duration-200"
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
    </div>
  );
}