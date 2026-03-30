'use client';

import React, { useState, useEffect, useRef } from 'react';

interface LauncherDict {
  nav: { home: string; servers: string; download: string; community: string };
  hero: {
    badge: string; title: string; titleAccent: string; subtitle: string;
    downloadWindows: string; downloadMac: string; downloadLinux: string;
    version: string; winRequirement: string; macRequirement: string;
    linuxRequirement: string; javaNote: string;
  };
  features: {
    sectionLabel: string; sectionTitle: string; sectionSubtitle: string;
    items: { title: string; description: string; tag: string; img?: string }[];
  };
  cta: { title: string; subtitle: string; button: string };
  footer: {
    tagline: string; linksTitle: string; links: Record<string, string>;
    legalTitle: string; legal: Record<string, string>;
    disclaimer: string; copyright: string;
  };
}

// ── Pixel divider ────────────────────────────────────────────
const PixelDivider = ({ color = '#84a98c' }: { color?: string }) => (
  <div className="flex gap-px my-1">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="w-2 h-2" style={{ background: i % 2 === 0 ? color : `${color}50` }} />
    ))}
  </div>
);

// ── Section label ────────────────────────────────────────────
const SectionLabel = ({ children, color = '#84a98c' }: { children: React.ReactNode; color?: string }) => (
  <div className="flex items-center gap-2 mb-1">
    <div className="w-1 h-3" style={{ background: color }} />
    <span className="font-mc-pixel text-[9px] uppercase tracking-widest" style={{ color }}>
      {children}
    </span>
  </div>
);

// ── Scroll reveal ────────────────────────────────────────────
function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

// ── Comparison table data ─────────────────────────────────────
const COMPARISON = [
  { feature: 'Без вирусов и майнеров',      us: true,  tlauncher: false, note: 'Без вирусов и стиллеров' },
  { feature: 'Без рекламы',       us: true,  tlauncher: false, note: 'Никаких всплывающих окон' },
  { feature: 'Быстрый запуск',    us: true,  tlauncher: true,  note: 'Оптимизирован под слабые ПК' },
  { feature: 'Сервера HardTimes', us: true,  tlauncher: false, note: 'Встроенный мониторинг' },
  { feature: 'Ely.by скины',      us: true,  tlauncher: true,  note: 'Alex / Steve / Custom' },
  { feature: 'Автообновление',    us: true,  tlauncher: true,  note: 'Всегда свежая версия' },
  { feature: 'Без регистрации',   us: true,  tlauncher: false, note: 'Играй без аккаунта Mojang' },
];

// ── Feature card ─────────────────────────────────────────────
function FeatureCard({ item, index }: { item: LauncherDict['features']['items'][0]; index: number }) {
  const { ref, visible } = useReveal(0.1);
  const isEven = index % 2 === 0;
  const imgSrc = item.img ?? '/banner/image.png';

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.6s ease ${index * 0.12}s, transform 0.6s ease ${index * 0.12}s`,
        flexDirection: isEven ? 'row' : 'row-reverse',
      }}
      className="flex border border-white/5 overflow-hidden group max-md:flex-col transition-all duration-300"
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(132,169,140,0.3)'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.05)'}
    >
      <div className="md:w-[42%] h-52 md:h-auto relative overflow-hidden flex-shrink-0">
        <img
          src={imgSrc}
          alt={item.title}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
        />
        <div
          className="absolute inset-0"
          style={{
            background: isEven
              ? 'linear-gradient(to right, rgba(10,11,11,0.7), transparent)'
              : 'linear-gradient(to left, rgba(10,11,11,0.7), transparent)',
          }}
        />
        <span
          className="absolute top-3 left-3 font-mc-pixel text-[8px] uppercase tracking-widest px-2 py-1"
          style={{ background: '#84a98c', color: '#0a0b0b' }}
        >
          {item.tag}
        </span>
      </div>
      <div className="flex-1 p-8 md:p-10 flex flex-col justify-center" style={{ background: '#161817' }}>
        <SectionLabel>Feature 0{index + 1}</SectionLabel>
        <PixelDivider />
        <h3 className="font-mc-pixel text-xl md:text-2xl text-[#f2f2f2] uppercase tracking-tight leading-tight mt-3 mb-3">
          {item.title}
        </h3>
        <p className="text-[#7d8581] text-sm leading-relaxed font-sans">{item.description}</p>
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────
export default function LauncherClient({ dict, lang }: { dict: LauncherDict; lang: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const compRef = useRef<HTMLDivElement>(null);
  const [compVisible, setCompVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const el = compRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setCompVisible(true); }, { threshold: 0.05 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const localePath = (path: string) => `/${lang}${path}`;

  return (
    <div className="min-h-screen text-[#f2f2f2] overflow-x-hidden" style={{ background: '#0a0b0b', fontFamily: 'inherit' }}>

      {/* ────────── NAVBAR ────────── */}
      <nav
        className="fixed top-0 inset-x-0 z-50 h-14 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(10,11,11,0.97)' : 'rgba(10,11,11,0.6)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 no-underline group">
            <img src="/icon.png" className="w-8 h-8" alt="logo" />
            <span className="font-mc-pixel text-[11px] uppercase tracking-widest text-[#f2f2f2]">
              Hard<span style={{ color: '#84a98c' }}>Launcher</span>
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-0">
            {[
              { label: dict.nav.home,      href: '/' },
              { label: dict.nav.servers,   href: '/monitoring' },
              { label: dict.nav.community, href: '/forum' },
            ].map(item => (
              <a
                key={item.label}
                href={item.href}
                className="px-4 py-1.5 font-mc-pixel text-[9px] uppercase tracking-widest text-[#7d8581] hover:text-[#f2f2f2] border border-transparent transition-all no-underline"
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'transparent'}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Lang + CTA */}
          <div className="hidden md:flex items-center gap-2">
            {['ru', 'en'].map(l => (
              <a
                key={l}
                href={`/${l}/launcher`}
                className="px-2 py-1 font-mc-pixel text-[8px] uppercase tracking-widest border transition-all no-underline"
                style={
                  l === lang
                    ? { borderColor: '#84a98c', color: '#84a98c', background: 'rgba(132,169,140,0.08)' }
                    : { borderColor: 'rgba(255,255,255,0.08)', color: '#7d8581' }
                }
              >
                {l}
              </a>
            ))}
            <a
              href="https://github.com/HardTimesOffical/HardLauncher/releases/download/v1.0.10/HardLauncher-Setup-1.0.10.exe"
              className="flex items-center gap-2 px-4 py-2 font-mc-pixel text-[9px] uppercase tracking-widest border transition-all no-underline"
              style={{ background: '#84a98c', color: '#0a0b0b', borderColor: '#84a98c' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.85'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
            >
              ⬇ {dict.hero.downloadWindows}
            </a>
          </div>

          {/* Burger */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="md:hidden w-9 h-9 flex items-center justify-center border transition-all"
            style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'transparent', color: '#7d8581', cursor: 'pointer' }}
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className="md:hidden overflow-hidden transition-all duration-300"
          style={{
            maxHeight: menuOpen ? '300px' : '0',
            borderTop: menuOpen ? '1px solid rgba(255,255,255,0.05)' : 'none',
            background: '#0d0e0d',
          }}
        >
          <div className="px-4 py-3 flex flex-col gap-1">
            {[
              { label: dict.nav.home,      href: '/' },
              { label: dict.nav.servers,   href: '/monitoring' },
              { label: dict.nav.community, href: '/forum' },
            ].map(item => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2.5 font-mc-pixel text-[10px] uppercase tracking-widest text-[#7d8581] hover:text-[#f2f2f2] border border-transparent hover:border-white/5 transition-all no-underline"
              >
                {item.label}
              </a>
            ))}
            <a
              href="https://github.com/HardTimesOffical/HardLauncher/releases/download/v1.0.10/HardLauncher-Setup-1.0.10.exe"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-3 font-mc-pixel text-[10px] uppercase tracking-widest border no-underline mt-1"
              style={{ background: '#84a98c', color: '#0a0b0b', borderColor: '#84a98c' }}
            >
              ⬇ {dict.hero.downloadWindows}
            </a>
          </div>
        </div>
      </nav>

      {/* ────────── HERO ────────── */}
      <section className="relative min-h-screen flex flex-col pt-14">
        {/* BG */}
        <div className="absolute inset-0 pt-14">
          <img
            src="https://i.pinimg.com/originals/a2/84/f6/a284f6be7a5f6e83360e2545e8d3c590.gif"
            alt=""
            className="w-full h-full object-cover object-center"
            style={{ filter: 'saturate(0.4) brightness(0.72)' }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, rgba(10,11,11,0.2) 0%, rgba(10,11,11,0.55) 40%, rgba(10,11,11,0.92) 75%, #0a0b0b 100%)',
            }}
          />
          {/* Pixel scanlines */}
          <div
            className="absolute inset-0 opacity-[0.018] pointer-events-none"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg,#84a98c 0px,#84a98c 1px,transparent 1px,transparent 3px)' }}
          />
        </div>

        <div className="relative flex-1 flex flex-col items-center justify-center text-center px-4 py-28 gap-0">
          {/* Badge */}
          <div
            className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 font-mc-pixel text-[9px] uppercase tracking-widest border"
            style={{ borderColor: 'rgba(132,169,140,0.35)', background: 'rgba(132,169,140,0.06)', color: '#84a98c' }}
          >
            <span className="w-1.5 h-1.5 animate-pulse" style={{ background: '#84a98c' }} />
            {dict.hero.badge}
          </div>

          {/* Title */}
          <h1
            className="font-mc-pixel uppercase leading-none tracking-tight mb-5"
            style={{ fontSize: 'clamp(36px,8vw,80px)' }}
          >
            {dict.hero.title}{' '}
            <span style={{ color: '#84a98c', textShadow: '0 0 60px rgba(132,169,140,0.4)' }}>
              {dict.hero.titleAccent}
            </span>
          </h1>

          <p className="max-w-lg font-sans text-[#7d8581] text-base mb-10 leading-relaxed">
            {dict.hero.subtitle}
          </p>

          {/* Download button */}
          <div className="flex flex-col items-center gap-3 w-full max-w-sm">
            <a
              href="https://github.com/HardTimesOffical/HardLauncher/releases/download/v1.0.10/HardLauncher-Setup-1.0.10.exe"
              className="w-full flex items-center justify-between gap-3 px-5 py-4 font-mc-pixel text-[10px] uppercase tracking-widest border transition-all no-underline group"
              style={{ background: '#84a98c', color: '#0a0b0b', borderColor: '#84a98c' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.88'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
            >
              <span className="flex items-center gap-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
                </svg>
                {dict.hero.downloadWindows}
              </span>
              <span className="opacity-50 text-[8px]">{dict.hero.winRequirement}</span>
            </a>
            <p className="font-mc-pixel text-[8px] uppercase tracking-widest" style={{ color: '#3a3f3a' }}>
              {dict.hero.version} · {dict.hero.javaNote}
            </p>
          </div>

          {/* Stats row */}
          <div
            className="flex items-center gap-0 mt-14 border"
            style={{ borderColor: 'rgba(255,255,255,0.05)' }}
          >
            {[
              { label: 'Загрузок', value: '10 000+' },
              { label: 'Серверов', value: '50+' },
              { label: 'Версия',   value: 'v1.0.10' },
            ].map((s, i) => (
              <div
                key={s.label}
                className="px-6 py-3 text-center"
                style={{
                  borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  background: 'rgba(22,24,23,0.8)',
                }}
              >
                <p className="font-mc-pixel text-base" style={{ color: '#84a98c' }}>{s.value}</p>
                <p className="font-mc-pixel text-[7px] uppercase tracking-widest mt-0.5" style={{ color: '#7d8581' }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Scroll */}
          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 font-mc-pixel text-[8px] uppercase tracking-widest animate-bounce"
            style={{ color: '#3a3f3a' }}
          >
            <span>Scroll</span>
            <span>▼</span>
          </div>
        </div>
      </section>

      {/* ────────── COMPARISON ────────── */}
      <section className="max-w-5xl mx-auto py-24 px-4" ref={compRef}>
        <div className="text-center mb-12">
          <SectionLabel color="#f2c94c">Сравнение</SectionLabel>
          <PixelDivider color="#f2c94c" />
          <h2 className="font-mc-pixel text-3xl md:text-4xl uppercase tracking-tight mt-4 mb-3 text-[#f2f2f2]">
            Почему не TLauncher?
          </h2>
          <p className="font-sans text-[#7d8581] max-w-md mx-auto text-sm leading-relaxed">
            TLauncher удобен, но содержит рекламу и вредоносное ПО. Мы сделали честную альтернативу.
          </p>
        </div>

        {/* Table */}
        <div className="border overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>

          {/* Header */}
          <div className="grid grid-cols-[1fr_auto_auto] gap-0">
            <div
              className="px-4 py-3 font-mc-pixel text-[8px] uppercase tracking-widest border-b border-r"
              style={{ color: '#7d8581', borderColor: 'rgba(255,255,255,0.06)', background: '#111312' }}
            />
            <div
              className="px-6 py-3 text-center border-b border-r font-mc-pixel text-[9px] uppercase tracking-widest"
              style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(132,169,140,0.08)', color: '#84a98c', minWidth: 120 }}
            >
              HardLauncher
            </div>
            <div
              className="px-6 py-3 text-center border-b font-mc-pixel text-[9px] uppercase tracking-widest"
              style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#111312', color: '#7d8581', minWidth: 120 }}
            >
              TLauncher
            </div>
          </div>

          {/* Rows */}
          {COMPARISON.map((row, i) => (
            <div
              key={row.feature}
              className="grid grid-cols-[1fr_auto_auto] transition-colors"
              style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.015)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
            >
              {/* Feature */}
              <div
                style={{
                  opacity: compVisible ? 1 : 0,
                  transform: compVisible ? 'translateX(0)' : 'translateX(-16px)',
                  transition: `opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s`,
                  borderRight: '1px solid rgba(255,255,255,0.04)',
                  padding: '0.875rem 1rem',
                }}
              >
                <p className="font-mc-pixel text-[10px] text-[#f2f2f2]">{row.feature}</p>
                <p className="font-mc-pixel text-[8px] mt-0.5" style={{ color: '#7d8581' }}>{row.note}</p>
              </div>

              {/* HardLauncher */}
              <div
                className="flex items-center justify-center border-r"
                style={{
                  borderColor: 'rgba(255,255,255,0.04)',
                  background: 'rgba(132,169,140,0.04)',
                  minWidth: 120,
                  opacity: compVisible ? 1 : 0,
                  transition: `opacity 0.5s ease ${i * 0.06 + 0.1}s`,
                }}
              >
                {row.us
                  ? <span className="font-mc-pixel text-sm" style={{ color: '#84a98c' }}>✓</span>
                  : <span className="font-mc-pixel text-sm" style={{ color: '#3a3f3a' }}>—</span>
                }
              </div>

              {/* TLauncher */}
              <div
                className="flex items-center justify-center"
                style={{
                  minWidth: 120,
                  opacity: compVisible ? 1 : 0,
                  transition: `opacity 0.5s ease ${i * 0.06 + 0.2}s`,
                }}
              >
                {row.tlauncher
                  ? <span className="font-mc-pixel text-sm" style={{ color: '#7d8581' }}>✓</span>
                  : <span className="font-mc-pixel text-sm" style={{ color: 'rgba(235,87,87,0.6)' }}>✗</span>
                }
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div
          className="mt-4 px-5 py-4 border flex items-center gap-4"
          style={{ borderColor: 'rgba(132,169,140,0.2)', background: 'rgba(132,169,140,0.05)' }}
        >
          <div className="w-1 h-8 flex-shrink-0" style={{ background: '#84a98c' }} />
          <p className="font-mc-pixel text-[9px] uppercase tracking-widest" style={{ color: '#84a98c' }}>
            HardLauncher выигрывает по 6 из 7 критериев — без компромиссов с безопасностью
          </p>
        </div>
      </section>

      {/* ────────── SECURITY BLOCK ────────── */}
      <section className="border-t border-b" style={{ borderColor: 'rgba(255,255,255,0.05)', background: '#0d0e0d' }}>
        <div className="max-w-5xl mx-auto py-20 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: 'rgba(255,255,255,0.05)' }}>
            {[
              {
                icon: '🛡',
                title: 'Без вирусов',
                desc: 'Нам важно сохранять безопасность наших пользователей. Никаких скрытых процессов.',
                color: '#84a98c',
              },
              {
                icon: '⚡',
                title: 'Быстрый старт',
                desc: 'Установка занимает меньше минуты. Оптимизирован для слабых машин — запускается даже на 4 ГБ RAM.',
                color: '#f2c94c',
              },
              {
                icon: '🎮',
                title: 'Встроенный мониторинг',
                desc: 'Прямо из лаунчера видишь серверы HardTimes: онлайн, режим, версию. Один клик — и ты в игре.',
                color: '#29a8eb',
              },
            ].map(card => (
              <div
                key={card.title}
                className="p-8 flex flex-col gap-3 relative"
                style={{ background: '#0d0e0d' }}
              >
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l opacity-40" style={{ borderColor: card.color }} />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r opacity-40" style={{ borderColor: card.color }} />
                <span className="text-3xl">{card.icon}</span>
                <div className="w-1 h-1" style={{ background: card.color }} />
                <h3 className="font-mc-pixel text-[13px] uppercase tracking-tight text-[#f2f2f2]">{card.title}</h3>
                <p className="font-sans text-[#7d8581] text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────── FEATURES ────────── */}
      <section className="max-w-5xl mx-auto py-24 px-4">
        <div className="mb-12">
          <SectionLabel>Возможности</SectionLabel>
          <PixelDivider />
          <h2 className="font-mc-pixel text-3xl md:text-4xl uppercase tracking-tight mt-4 text-[#f2f2f2]">
            {dict.features.sectionTitle}
          </h2>
          <p className="font-sans text-[#7d8581] text-sm mt-2 max-w-md leading-relaxed">
            {dict.features.sectionSubtitle}
          </p>
        </div>
        <div className="flex flex-col gap-px" style={{ background: 'rgba(255,255,255,0.03)' }}>
          {dict.features.items.map((item, i) => (
            <FeatureCard key={i} item={item} index={i} />
          ))}
        </div>
      </section>

      {/* ────────── CTA ────────── */}
      <section
        className="relative overflow-hidden border-t border-b"
        style={{ borderColor: 'rgba(255,255,255,0.05)', background: '#0d0e0d' }}
      >
        {/* Grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(132,169,140,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(132,169,140,0.04) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="relative max-w-3xl mx-auto py-24 px-4 text-center">
          <SectionLabel color="#84a98c">Начать сейчас</SectionLabel>
          <PixelDivider />
          <h2 className="font-mc-pixel text-4xl md:text-5xl uppercase tracking-tight mt-4 mb-3 text-[#f2f2f2]">
            {dict.cta.title}
          </h2>
          <p className="font-sans text-[#7d8581] max-w-sm mx-auto mb-8 text-sm leading-relaxed">
            {dict.cta.subtitle}
          </p>
          <a
            href="https://github.com/HardTimesOffical/HardLauncher/releases/download/v1.0.10/HardLauncher-Setup-1.0.10.exe"
            className="inline-flex items-center gap-3 px-10 py-4 font-mc-pixel text-[11px] uppercase tracking-widest border transition-all no-underline"
            style={{ background: '#84a98c', color: '#0a0b0b', borderColor: '#84a98c' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.85'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
          >
            ⬇ {dict.cta.button}
          </a>
          <p className="font-mc-pixel text-[8px] uppercase tracking-widest mt-4" style={{ color: '#3a3f3a' }}>
            Только для Windows · Бесплатно навсегда
          </p>
        </div>
      </section>

      {/* ────────── FOOTER ────────── */}
      <footer style={{ background: '#080909', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-5xl mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <img src="/icon.png" className="w-7 h-7" alt="logo" />
              <span className="font-mc-pixel text-[11px] uppercase tracking-widest text-[#f2f2f2]">
                Hard<span style={{ color: '#84a98c' }}>Launcher</span>
              </span>
            </div>
            <p className="font-sans text-[#7d8581] text-xs max-w-xs mb-4 leading-relaxed">
              {dict.footer.tagline}
            </p>
            <p className="font-mc-pixel text-[8px] uppercase tracking-widest" style={{ color: '#3a3f3a' }}>
              {dict.footer.disclaimer}
            </p>
          </div>

          {/* Links */}
          <div>
            <div className="flex items-center gap-1.5 mb-4">
              <div className="w-1 h-3" style={{ background: '#84a98c' }} />
              <h4 className="font-mc-pixel text-[8px] uppercase tracking-widest" style={{ color: '#84a98c' }}>
                {dict.footer.linksTitle}
              </h4>
            </div>
            <ul className="flex flex-col gap-2 list-none p-0 m-0">
              {Object.entries(dict.footer.links).map(([key, label]) => (
                <li key={key}>
                  <a
                    href={localePath(`/${key === 'home' ? '' : key}`)}
                    className="font-mc-pixel text-[9px] uppercase tracking-widest transition-colors no-underline"
                    style={{ color: '#7d8581' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#f2f2f2'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#7d8581'}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <div className="flex items-center gap-1.5 mb-4">
              <div className="w-1 h-3" style={{ background: '#f2c94c' }} />
              <h4 className="font-mc-pixel text-[8px] uppercase tracking-widest" style={{ color: '#f2c94c' }}>
                {dict.footer.legalTitle}
              </h4>
            </div>
            <ul className="flex flex-col gap-2 list-none p-0 m-0">
              {Object.entries(dict.footer.legal).map(([key, label]) => (
                <li key={key}>
                  <a
                    href="#"
                    className="font-mc-pixel text-[9px] uppercase tracking-widest transition-colors no-underline"
                    style={{ color: '#7d8581' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#f2f2f2'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#7d8581'}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', background: '#050606' }}>
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
            <PixelDivider color="#3a3f3a" />
            <p className="font-mc-pixel text-[8px] uppercase tracking-widest" style={{ color: '#3a3f3a' }}>
              {dict.footer.copyright}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}