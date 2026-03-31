'use client';
import Link from 'next/link';
import {
  HiArrowRight,
  HiSignal,
  HiStar,
  HiChatBubbleLeftRight,
  HiShieldCheck,
  HiNoSymbol,
  HiBolt,
  HiComputerDesktop,
  HiServer,
  HiUserGroup,
  HiCubeTransparent,
  HiSparkles,
} from 'react-icons/hi2';

// ── Палитра ──────────────────────────────────────────────────
const BRAND = '#84a98c';
const ICE   = '#a8d4e8';
const BLUE  = '#4a9ebb';
const AMBER = '#d4a853';
const CORAL = '#c47a5a';

// ── Pixel divider ─────────────────────────────────────────────
function PixelDivider({ color = BRAND }: { color?: string }) {
  return (
    <div className="flex gap-px">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} style={{ width: 8, height: 8, background: i % 2 === 0 ? color : `${color}45` }} />
      ))}
    </div>
  );
}

// ── Section label ─────────────────────────────────────────────
function SectionLabel({ children, color = BRAND }: { children: React.ReactNode; color?: string }) {
  return (
    <div className="flex items-center gap-2">
      <div style={{ width: 4, height: 14, background: color, flexShrink: 0 }} />
      <span className="font-mc-pixel text-[9px] uppercase tracking-widest" style={{ color }}>
        {children}
      </span>
    </div>
  );
}

// ── Corner accents ────────────────────────────────────────────
function Corners({ color = BRAND, size = 10 }: { color?: string; size?: number }) {
  const s = `${size}px`;
  const b = `1px solid ${color}`;
  return (
    <>
      <div style={{ position: 'absolute', top: 0, left: 0, width: s, height: s, borderTop: b, borderLeft: b, opacity: 0.55 }} />
      <div style={{ position: 'absolute', top: 0, right: 0, width: s, height: s, borderTop: b, borderRight: b, opacity: 0.55 }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: s, height: s, borderBottom: b, borderLeft: b, opacity: 0.55 }} />
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: s, height: s, borderBottom: b, borderRight: b, opacity: 0.55 }} />
    </>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative" style={{ color: '#f2f2f2' }}>

      {/* ══════════════════════════════════════════════
          ГЛОБАЛЬНЫЙ ФОН — фиксированная картинка
      ══════════════════════════════════════════════ */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src="/banner/banner.jpg"
          alt=""
          className="w-full h-full object-fit object-center"
          style={{ filter: 'saturate(0.5) brightness(1)' }}
        />
        {/* Затемнение снизу — контент читается */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(10,11,11,0.55) 0%, rgba(10,11,11,0.82) 40%, rgba(10,11,11,0.97) 75%, #0a0b0b 100%)',
        }} />
        {/* Пиксельные сканлайны */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(0deg,rgba(132,169,140,0.012) 0,rgba(132,169,140,0.012) 1px,transparent 1px,transparent 3px)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* ══════════════════════════════════════════════
          HERO — центрированный, вертикально по центру
      ══════════════════════════════════════════════ */}
      <section
        className="relative z-10 flex flex-col items-center justify-center text-center px-4"
        style={{ minHeight: 'clamp(520px, 80vh, 820px)', paddingTop: 80, paddingBottom: 60 }}
      >
        {/* Лёгкое радиальное свечение за заголовком */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600, height: 400,
            background: `radial-gradient(ellipse, ${BRAND}18 0%, transparent 70%)`,
            filter: 'blur(40px)',
          }}
        />

        <div className="relative flex flex-col items-center max-w-3xl">
          {/* Бейдж */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 font-mc-pixel text-[8px] uppercase tracking-widest border"
            style={{ borderColor: `${BRAND}35`, background: `${BRAND}0d`, color: BRAND }}
          >
            <span style={{ width: 6, height: 6, background: BRAND, display: 'inline-block', animation: 'pulse 2s infinite' }} />
            Мониторинг серверов Minecraft
          </div>

          {/* Заголовок */}
          <h1
            className="font-mc-pixel uppercase leading-[1.05] mb-6"
            style={{
              fontSize: 'clamp(36px, 7vw, 65px)',
              color: '#f2f2f2',
              textShadow: `0 0 60px ${BRAND}30, 0 2px 0 rgba(0,0,0,0.5)`,
            }}
          >
            Топ серверов<br />
            <span style={{ color: BRAND }}>Minecraft</span>
          </h1>

          <p
            className="font-mc-pixel text-[10px] uppercase tracking-wide leading-relaxed mb-10"
            style={{ color: '#7d8581', maxWidth: 440 }}
          >
            Актуальный рейтинг Java и Bedrock серверов с живым онлайном, IP-адресами и сообществом игроков
          </p>

          {/* Кнопки */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/monitoring"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 font-mc-pixel text-[10px] uppercase tracking-widest no-underline border transition-all"
              style={{ background: BRAND, color: '#0a0b0b', borderColor: BRAND }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.85'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
            >
              <HiServer className="w-4 h-4" />
              Найти сервер
            </Link>
            <Link
              href="/ru/launcher"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 font-mc-pixel text-[10px] uppercase tracking-widest no-underline border transition-all"
              style={{ background: 'transparent', color: ICE, borderColor: `${BLUE}45` }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = `${BLUE}18`;
                el.style.borderColor = BLUE;
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'transparent';
                el.style.borderColor = `${BLUE}45`;
              }}
            >
              <HiComputerDesktop className="w-4 h-4" />
              Скачать лаунчер
            </Link>
            <Link
              href="/forum"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 font-mc-pixel text-[10px] uppercase tracking-widest no-underline border transition-all"
              style={{ background: 'transparent', color: '#7d8581', borderColor: 'rgba(255,255,255,0.08)' }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = '#f2f2f2';
                el.style.borderColor = 'rgba(255,255,255,0.2)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = '#7d8581';
                el.style.borderColor = 'rgba(255,255,255,0.08)';
              }}
            >
              <HiChatBubbleLeftRight className="w-4 h-4" />
              Форум
            </Link>
          </div>

          {/* Статистика */}
          <div
            className="flex items-stretch mt-10 border"
            style={{ borderColor: 'rgba(255,255,255,0.07)' }}
          >
            {[
              { icon: <HiServer className="w-3.5 h-3.5" />, label: 'Серверов', value: '200+' },
              { icon: <HiUserGroup className="w-3.5 h-3.5" />, label: 'Игроков', value: '5K+' },
              { icon: <HiStar className="w-3.5 h-3.5" />, label: 'Голосов', value: '10K+' },
            ].map((s, i) => (
              <div
                key={s.label}
                className="px-6 py-3 text-center flex flex-col items-center gap-1"
                style={{
                  background: 'rgba(10,11,11,0.7)',
                  borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}
              >
                <span style={{ color: BRAND }}>{s.icon}</span>
                <p className="font-mc-pixel text-sm" style={{ color: '#f2f2f2' }}>{s.value}</p>
                <p className="font-mc-pixel text-[7px] uppercase tracking-widest" style={{ color: '#7d8581' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div
          className="absolute bottom-6 left-1/2 flex flex-col items-center gap-1 font-mc-pixel text-[7px] uppercase tracking-widest"
          style={{ transform: 'translateX(-50%)', color: '#2d3530', animation: 'bounce 2s infinite' }}
        >
          <span>Scroll</span>
          <span>▼</span>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          РАЗДЕЛЫ САЙТА — три карточки (над лаунчером)
      ══════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-[1100px] mx-auto px-4 md:px-8 py-16 w-full">
        <div className="flex items-end justify-between mb-8">
          <div>
            <SectionLabel color={BRAND}>Разделы сайта</SectionLabel>
            <div className="mt-2 mb-3"><PixelDivider color={BRAND} /></div>
            <h2 className="font-mc-pixel text-xl md:text-2xl uppercase tracking-tight" style={{ color: '#f2f2f2' }}>
              Что здесь есть
            </h2>
          </div>
          <Link
            href="/monitoring"
            className="font-mc-pixel text-[8px] uppercase tracking-widest no-underline transition-colors hidden md:block"
            style={{ color: '#7d8581' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#f2f2f2'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#7d8581'}
          >
            Все разделы <HiArrowRight className="inline w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: 'rgba(255,255,255,0.05)' }}>
          {[
            {
              href: '/monitoring',
              tag: 'Мониторинг',
              heading: 'Топ серверов\nMinecraft',
              desc: 'Актуальный рейтинг серверов Java и Bedrock. Живой онлайн, IP-адреса, фильтры по режимам и версиям.',
              cta: 'Смотреть серверы',
              accent: BRAND,
              icon: <HiServer className="w-5 h-5" />,
              img: 'https://i.pinimg.com/1200x/1c/86/12/1c86122cdfc9fac2b55523ee09b14ccb.jpg',
            },
            {
              href: '/forum',
              tag: 'Сообщество',
              heading: 'Форум\nигроков',
              desc: 'Обсуждения, гайды, поиск команды. Живое общение сообщества Minecraft.',
              cta: 'Открыть форум',
              accent: AMBER,
              icon: <HiChatBubbleLeftRight className="w-5 h-5" />,
              img: 'https://i.pinimg.com/webp/1200x/f7/f3/8f/f7f38f14c444548b8d2f780d28eff584.webp',
            },
            {
              href: '/ru/launcher',
              tag: 'Лаунчер',
              heading: 'HardLauncher\nдля Windows',
              desc: 'Бесплатный лаунчер без рекламы и вирусов. Запуск Minecraft в один клик, без аккаунта Mojang.',
              cta: 'Скачать лаунчер',
              accent: BLUE,
              icon: <HiComputerDesktop className="w-5 h-5" />,
              img: '/banner/download-banner.png',
            },
          ].map(card => (
            <Link
              key={card.href}
              href={card.href}
              className="group flex flex-col no-underline relative"
              style={{ background: 'rgba(13,15,14,0.92)' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(22,24,23,0.97)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(13,15,14,0.92)'}
            >
              {/* Картинка */}
              <div className="relative overflow-hidden" style={{ height: 160 }}>
                <img
                  src={card.img}
                  alt={card.heading.replace('\n', ' ')}
                  className="w-full h-full object-cover transition-all duration-600 group-hover:scale-105"
                  style={{ filter: 'saturate(0.45) brightness(0.38)' }}
                />
                <div className="absolute inset-0" style={{
                  background: 'linear-gradient(to bottom, transparent 40%, rgba(13,15,14,0.95) 100%)',
                }} />
                {/* Иконка + тег */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <div
                    className="p-1.5 border flex items-center justify-center"
                    style={{ borderColor: `${card.accent}40`, background: `${card.accent}15`, color: card.accent }}
                  >
                    {card.icon}
                  </div>
                  <span
                    className="font-mc-pixel text-[7px] uppercase tracking-widest px-2 py-1"
                    style={{ background: card.accent, color: '#080909' }}
                  >
                    {card.tag}
                  </span>
                </div>
              </div>

              <div className="flex flex-col flex-1 px-5 pt-3 pb-6">
                <h3
                  className="font-mc-pixel whitespace-pre-line leading-snug mb-2.5"
                  style={{ fontSize: 'clamp(12px, 1.2vw, 15px)', color: '#f2f2f2' }}
                >
                  {card.heading}
                </h3>
                <p className="font-mc-pixel text-[8px] uppercase tracking-wide leading-relaxed flex-1 mb-4" style={{ color: '#7d8581' }}>
                  {card.desc}
                </p>
                <div
                  className="flex items-center gap-1.5 font-mc-pixel text-[9px] uppercase tracking-widest transition-all duration-150 group-hover:gap-2.5"
                  style={{ color: card.accent }}
                >
                  {card.cta} <HiArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>

              {/* Нижняя акцент-линия */}
              <div
                className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ background: card.accent }}
              />
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          ИНФОРМАЦИОННЫЕ БЛОКИ — 3 фичи
      ══════════════════════════════════════════════ */}
      <section className="relative z-10" style={{ background: 'rgba(8,10,9,0.9)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-[1100px] mx-auto px-4 md:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: 'rgba(255,255,255,0.04)' }}>
            {[
              {
                icon: <HiSignal className="w-6 h-6" />,
                title: 'Живой онлайн',
                desc: 'Статус каждого сервера обновляется каждые несколько минут. Реальный онлайн и пинг без задержек.',
                color: BRAND,
              },
              {
                icon: <HiSparkles className="w-6 h-6" />,
                title: 'Буст серверов',
                desc: 'Помогай любимым серверам подниматься в рейтинге через систему голосов и буст-звёзд.',
                color: AMBER,
              },
              {
                icon: <HiChatBubbleLeftRight className="w-6 h-6" />,
                title: 'Живое сообщество',
                desc: 'Форум, обсуждения, гайды и поиск тиммейтов. Всё что нужно — в одном месте.',
                color: CORAL,
              },
            ].map(block => (
              <div
                key={block.title}
                className="p-7 flex flex-col gap-4 relative"
                style={{ background: 'rgba(10,11,11,0.95)' }}
              >
                <Corners color={block.color} size={10} />
                <div
                  className="p-2.5 w-fit border"
                  style={{ borderColor: `${block.color}30`, background: `${block.color}10`, color: block.color }}
                >
                  {block.icon}
                </div>
                <div style={{ width: 4, height: 4, background: block.color }} />
                <h3 className="font-mc-pixel text-[13px] uppercase tracking-tight" style={{ color: '#f2f2f2' }}>
                  {block.title}
                </h3>
                <p className="font-mc-pixel text-[8px] uppercase tracking-wide leading-relaxed" style={{ color: '#7d8581' }}>
                  {block.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          ЛАУНЧЕР — акцентный блок (снежная тема)
      ══════════════════════════════════════════════ */}
      <section className="relative z-10" style={{ background: 'rgba(6,12,18,0.95)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-[1100px] mx-auto px-4 md:px-8 py-14">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px border overflow-hidden" style={{ borderColor: `${BLUE}22` }}>

            {/* Левая — картинка */}
            <div className="relative overflow-hidden" style={{ minHeight: 300 }}>
              <img
                src="/banner/download-banner.png"
                alt="Launcher"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: 'saturate(0.5) brightness(0.32)' }}
              />
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(to right, rgba(6,12,18,0) 0%, rgba(6,12,18,0.95) 100%)',
              }} />
              {/* Пиксельные снежинки */}
              {[
                { top: '18%', left: '10%', s: 3, o: 0.5 },
                { top: '45%', left: '22%', s: 2, o: 0.35 },
                { top: '12%', left: '58%', s: 4, o: 0.38 },
                { top: '65%', left: '52%', s: 2, o: 0.55 },
                { top: '32%', left: '78%', s: 3, o: 0.32 },
                { top: '75%', left: '35%', s: 2, o: 0.28 },
              ].map((p, i) => (
                <div key={i} className="absolute" style={{ top: p.top, left: p.left, width: p.s, height: p.s, background: '#fff', opacity: p.o }} />
              ))}
              <div className="absolute bottom-4 left-4">
                <span className="font-mc-pixel text-[7px] uppercase tracking-widest px-2 py-1 border" style={{ color: ICE, borderColor: `${BLUE}40`, background: 'rgba(6,12,18,0.75)' }}>
                  v1.0.12 · Windows
                </span>
              </div>
            </div>

            {/* Правая — текст */}
            <div className="p-8 md:p-10 flex flex-col justify-center" style={{ background: 'rgba(8,14,20,0.97)' }}>
              <SectionLabel color={ICE}>HardLauncher</SectionLabel>
              <div className="mt-3 mb-4"><PixelDivider color={BLUE} /></div>

              <h2 className="font-mc-pixel text-xl md:text-2xl uppercase tracking-tight leading-tight mb-3" style={{ color: '#e8f4f8' }}>
                Играй без лишних<br />
                <span style={{ color: ICE }}>заморочек</span>
              </h2>
              <p className="font-mc-pixel text-[9px] uppercase tracking-wide leading-relaxed mb-6" style={{ color: '#4a6a7a' }}>
                Бесплатный лаунчер без вирусов и рекламы. Установка за одну минуту — сразу в игру.
              </p>

              {/* Плюшки с иконками */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { icon: <HiShieldCheck className="w-3.5 h-3.5" />, label: 'Без вирусов' },
                  { icon: <HiNoSymbol className="w-3.5 h-3.5" />,    label: 'Без рекламы' },
                  { icon: <HiBolt className="w-3.5 h-3.5" />,         label: 'Быстрый запуск' },
                  { icon: <HiServer className="w-3.5 h-3.5" />,       label: 'Мониторинг серверов' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2">
                    <span style={{ color: BLUE }}>{item.icon}</span>
                    <span className="font-mc-pixel text-[8px] uppercase tracking-widest" style={{ color: ICE }}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                href="/ru/launcher"
                className="inline-flex items-center justify-between px-5 py-3.5 font-mc-pixel text-[10px] uppercase tracking-widest no-underline border transition-all"
                style={{ background: BLUE, color: '#06080a', borderColor: BLUE }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.85'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
              >
                <span className="flex items-center gap-2.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
                  </svg>
                  Скачать для Windows · Бесплатно
                </span>
                <span style={{ opacity: 0.4, fontSize: 8 }}>↓ .exe</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          БАННЕРНАЯ СЕТКА 2×2
      ══════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-[1100px] mx-auto px-4 md:px-8 py-16 w-full">
        <div className="flex items-end justify-between mb-8">
          <div>
            <SectionLabel color={AMBER}>Популярное</SectionLabel>
            <div className="mt-2 mb-3"><PixelDivider color={AMBER} /></div>
            <h2 className="font-mc-pixel text-xl md:text-2xl uppercase tracking-tight" style={{ color: '#f2f2f2' }}>
              Популярные разделы
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ background: 'rgba(255,255,255,0.04)' }}>
          {[
            {
              href: '/monitoring?game=java',
              label: 'Java серверы',
              sub: 'Minecraft Java',
              desc: 'Моды, плагины, кастомные режимы',
              accent: BRAND,
              icon: <HiServer className="w-4 h-4" />,
              img: 'https://i.pinimg.com/1200x/1c/86/12/1c86122cdfc9fac2b55523ee09b14ccb.jpg',
            },
            {
              href: '/monitoring?game=bedrock',
              label: 'Bedrock серверы',
              sub: 'Minecraft Bedrock',
              desc: 'Мобильные и консольные игроки',
              accent: '#5a9e7a',
              icon: <HiCubeTransparent className="w-4 h-4" />,
              img: 'https://i.pinimg.com/webp/1200x/f7/f3/8f/f7f38f14c444548b8d2f780d28eff584.webp',
            },
            {
              href: '/forum',
              label: 'Форум',
              sub: 'Сообщество',
              desc: 'Обсуждения и гайды',
              accent: AMBER,
              icon: <HiChatBubbleLeftRight className="w-4 h-4" />,
              img: 'https://i.pinimg.com/webp/1200x/f7/f3/8f/f7f38f14c444548b8d2f780d28eff584.webp',
            },
            {
              href: '/ru/launcher',
              label: 'Лаунчер',
              sub: 'HardLauncher',
              desc: 'Скачай и играй бесплатно',
              accent: BLUE,
              icon: <HiComputerDesktop className="w-4 h-4" />,
              img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=65&auto=format&fit=crop',
            },
          ].map(banner => (
            <Link
              key={banner.href}
              href={banner.href}
              className="group relative overflow-hidden no-underline flex flex-col"
              style={{ minHeight: 200, background: 'rgba(12,14,13,0.95)' }}
            >
              <div className="absolute inset-0">
                <img
                  src={banner.img}
                  alt={banner.label}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                  style={{ filter: 'saturate(0.4) brightness(0.3)' }}
                />
                <div className="absolute inset-0" style={{
                  background: 'linear-gradient(to top, rgba(10,11,11,0.97) 40%, transparent 100%)',
                }} />
              </div>
              <div className="relative mt-auto p-4">
                <div className="flex items-center gap-1.5 mb-1.5" style={{ color: banner.accent }}>
                  {banner.icon}
                  <p className="font-mc-pixel text-[7px] uppercase tracking-widest">{banner.sub}</p>
                </div>
                <h3 className="font-mc-pixel leading-tight mb-1.5" style={{ fontSize: 'clamp(11px, 1.1vw, 13px)', color: '#f2f2f2' }}>
                  {banner.label}
                </h3>
                <p className="font-mc-pixel text-[7px] uppercase tracking-wide leading-relaxed" style={{ color: 'rgba(255,255,255,0.32)' }}>
                  {banner.desc}
                </p>
                <div
                  className="flex items-center gap-1 mt-3 font-mc-pixel text-[8px] uppercase tracking-widest transition-all duration-150 group-hover:gap-2"
                  style={{ color: banner.accent }}
                >
                  Перейти <HiArrowRight className="w-3 h-3" />
                </div>
              </div>
              <div
                className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: banner.accent }}
              />
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          БЫСТРЫЕ ТЕГИ
      ══════════════════════════════════════════════ */}
      <div className="relative z-10 max-w-[1100px] mx-auto px-4 md:px-8 pb-20 w-full">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { href: '/monitoring?game=java',    label: 'Java серверы',    color: BRAND },
            { href: '/monitoring?game=bedrock', label: 'Bedrock серверы', color: BRAND },
            { href: '/forum',                   label: 'Форум',           color: AMBER },
            { href: '/monitoring?sort=new',     label: 'Новые серверы',   color: AMBER },
            { href: '/ru/launcher',             label: 'Лаунчер',         color: BLUE  },
            { href: '/monitoring?sort=rating',  label: 'Топ рейтинг',     color: CORAL },
          ].map(tag => (
            <Link
              key={tag.href}
              href={tag.href}
              className="font-mc-pixel text-[8px] uppercase tracking-widest border px-3 py-1.5 no-underline transition-all"
              style={{ color: '#7d8581', borderColor: 'rgba(255,255,255,0.06)', background: 'transparent' }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = tag.color;
                el.style.borderColor = `${tag.color}45`;
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = '#7d8581';
                el.style.borderColor = 'rgba(255,255,255,0.06)';
              }}
            >
              {tag.label}
            </Link>
          ))}
        </div>
      </div>

      {/* SEO */}
      <section className="sr-only" aria-hidden="true">
        <h2>HardTimes — мониторинг серверов Minecraft в России</h2>
        <p>Мониторинг серверов Майнкрафт с актуальным онлайном. Java и Bedrock серверы в одном месте.</p>
      </section>
    </div>
  );
}