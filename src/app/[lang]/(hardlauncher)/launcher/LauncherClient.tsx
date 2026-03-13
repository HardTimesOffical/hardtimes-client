'use client';
// app/[lang]/launcher/LauncherClient.tsx
// Receives pre-loaded dictionary from the Server Component as props.
// All interactivity lives here.

import React, { useState, useEffect, useRef } from 'react';

// ─── Types ────────────────────────────────────────────────────────
interface LauncherDict {
  nav: { home: string; servers: string; download: string; community: string };
  hero: {
    badge: string;
    title: string;
    titleAccent: string;
    subtitle: string;
    downloadWindows: string;
    downloadMac: string;
    downloadLinux: string;
    version: string;
    winRequirement: string;
    macRequirement: string;
    linuxRequirement: string;
    javaNote: string;
  };
  features: {
    sectionLabel: string;
    sectionTitle: string;
    sectionSubtitle: string;
    items: { title: string; description: string; tag: string; img?: string }[];
  };
  cta: { title: string; subtitle: string; button: string };
  footer: {
    tagline: string;
    linksTitle: string;
    links: Record<string, string>;
    legalTitle: string;
    legal: Record<string, string>;
    disclaimer: string;
    copyright: string;
  };
}

// ─── Inline SVG Icons ─────────────────────────────────────────────
const IconWindows = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
  </svg>
);
const IconApple = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
  </svg>
);
const IconLinux = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.059.03.12.057.183.082.253.104.62.274.99.274.328 0 .680-.1.985-.369a.55.55 0 00.103-.1c.18.045.355.073.518.073.508 0 .911-.212 1.228-.53.198-.198.347-.437.455-.686.081-.229.159-.453.27-.643.27-.468.692-.685 1.135-.965.436-.28.884-.598 1.143-1.098.182-.35.27-.764.21-1.256-.121-.879-.668-1.49-1.24-1.803a3.38 3.38 0 01.217-.41c.324-.612.646-1.48.752-2.453.14-1.325-.06-2.57-.8-3.576a7.407 7.407 0 00-.508-.637c-.226-.256-.46-.5-.66-.756C14.452 4.1 14.12 2.9 13.3 1.74A3.2 3.2 0 0012.504 0z" />
  </svg>
);

// ─── Scroll-reveal Feature Card ───────────────────────────────────
function FeatureCard({
  item,
  index,
}: {
  item: LauncherDict['features']['items'][0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const isEven = index % 2 === 0;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const imgSrc =
    item.img ??
    '/banner/image.png';


  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(48px)',
        transition: `opacity 0.65s ease ${index * 0.14}s, transform 0.65s ease ${index * 0.14}s`,
        flexDirection: isEven ? 'row' : 'row-reverse',
      }}
      className="flex bg-[#1c1c1c] border-2 border-[#2a2a2a] overflow-hidden group hover:border-[#4caf50]/40 transition-all duration-300 max-md:flex-col"
    >
      {/* Image */}
      <div className="md:w-[45%] h-56 md:h-auto relative overflow-hidden flex-shrink-0">
        <img
          src={imgSrc}
          alt={item.title}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
        />
        <div
          className="absolute inset-0"
          style={{
            background: isEven
              ? 'linear-gradient(to right, rgba(28,28,28,0.55), transparent)'
              : 'linear-gradient(to left, rgba(28,28,28,0.55), transparent)',
          }}
        />
        <span className="absolute top-3 left-3 bg-[#4caf50] text-black font-mono text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest">
          {item.tag}
        </span>
      </div>

      {/* Text */}
      <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1 h-7 bg-[#4caf50]" />
          <span className="text-[#4caf50] font-mono text-[11px] uppercase tracking-widest">
            Feature 0{index + 1}
          </span>
        </div>
        <h3 className="font-mono text-2xl md:text-3xl font-black text-white mb-3 uppercase tracking-tight leading-tight">
          {item.title}
        </h3>
        <p className="text-[#666] text-sm md:text-base leading-relaxed">{item.description}</p>
        <div className="mt-5 flex items-center gap-2 text-[#f59e0b] font-mono text-[11px] uppercase tracking-widest">
          <span className="w-4 h-px bg-[#f59e0b]" />
          Learn more →
        </div>
      </div>
    </div>
  );
}

// ─── Main Client Component ────────────────────────────────────────
export default function LauncherClient({
  dict,
  lang,
}: {
  dict: LauncherDict;
  lang: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Helper: build locale-aware href
  const localePath = (path: string) => `/${lang}${path}`;

  return (
    <div
      className="min-h-screen bg-[#111] text-white overflow-x-hidden"
      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
    >
      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 inset-x-0 z-50 h-14 bg-[#111]/90 backdrop-blur-sm border-b-2 border-[#222]">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          {/* Logo */}
          <a href='/' className="flex items-center gap-2 no-underline">
            <img src="/icon.png" className="w-9 h-9  place-items-center text-black font-black text-sm"/>
            <span className="font-mono font-bold text-[13px] uppercase tracking-widest">
              Hard<span className="text-blue-400">Monitoring</span>
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-0.5">
            {[
              { label: dict.nav.home, href:'/' },
              { label: dict.nav.servers, href: '/monitoring' },
              { label: dict.nav.community, href: '/forum' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest text-[#666] hover:text-white hover:bg-[#1e1e1e] border border-transparent hover:border-[#2a2a2a] transition-all no-underline"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Language switcher */}
          <div className="hidden md:flex items-center gap-1 ml-4">
            {['ru', 'en'].map((l) => (
              <a
                key={l}
                href={`/${l}/launcher`}
                className={`px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest border transition-all no-underline ${
                  l === lang
                    ? 'border-[#4caf50] text-[#4caf50] bg-[#4caf50]/10'
                    : 'border-[#2a2a2a] text-[#555] hover:text-white hover:border-[#444]'
                }`}
              >
                {l}
              </a>
            ))}
          </div>

          {/* Burger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden w-9 h-9 flex items-center justify-center border-2 border-[#2a2a2a] hover:border-[#4caf50] hover:text-[#4caf50] text-[#666] transition-all bg-transparent cursor-pointer"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                <line x1="2" y1="2" x2="16" y2="16" /><line x1="16" y1="2" x2="2" y2="16" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                <line x1="2" y1="4" x2="16" y2="4" /><line x1="2" y1="9" x2="16" y2="9" /><line x1="2" y1="14" x2="16" y2="14" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className="md:hidden overflow-hidden border-t-2 border-[#222] bg-[#111] transition-all duration-300"
          style={{ maxHeight: menuOpen ? '320px' : '0' }}
        >
          <div className="px-4 py-3 flex flex-col gap-1">
            {[
              { label: dict.nav.home, href: localePath('/'), icon: '⬛' },
              { label: dict.nav.servers, href: localePath('/servers'), icon: '🌍' },
              { label: dict.nav.download, href: localePath('/launcher'), icon: '⬇' },
              { label: dict.nav.community, href: localePath('/community'), icon: '👥' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 font-mono text-[13px] uppercase tracking-wider text-[#999] hover:text-white hover:bg-[#1e1e1e] border border-transparent hover:border-[#4caf50]/25 transition-all no-underline"
              >
                <span>{item.icon}</span>
                {item.label}
              </a>
            ))}
            {/* Lang switcher mobile */}
            <div className="flex gap-2 px-4 pt-1 pb-2 border-t border-[#1e1e1e] mt-1">
              {['ru', 'en'].map((l) => (
                <a
                  key={l}
                  href={`/${l}/launcher`}
                  className={`flex-1 text-center py-2 font-mono text-[11px] uppercase tracking-widest border transition-all no-underline ${
                    l === lang
                      ? 'border-[#4caf50] text-[#4caf50] bg-[#4caf50]/10'
                      : 'border-[#2a2a2a] text-[#555]'
                  }`}
                >
                  {l}
                </a>
              ))}
            </div>
            <a
              href={localePath('/launcher')}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-[#4caf50] text-black font-mono text-[12px] uppercase tracking-widest font-bold hover:bg-[#66bb6a] transition-all no-underline"
            >
              ⬇ {dict.hero.downloadWindows}
            </a>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col pt-14">
        {/* Background image */}
        <div className="absolute inset-0 pt-14">
          <img
            src="https://i.pinimg.com/originals/a2/84/f6/a284f6be7a5f6e83360e2545e8d3c590.gif"
            alt="Minecraft landscape"
            className="w-full h-full object-cover object-center"
            style={{ filter: 'saturate(0.6) brightness(0.35)' }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(17,17,17,0.1) 0%, rgba(17,17,17,0.45) 35%, rgba(17,17,17,0.88) 68%, #111111 100%)',
            }}
          />
          {/* Scanlines */}
          <div
            className="absolute inset-0 opacity-[0.025] pointer-events-none"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 4px)',
            }}
          />
        </div>

        <div className="relative flex-1 flex flex-col items-center justify-center text-center px-4 py-24 gap-0">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 border border-[#4caf50]/40 bg-[#4caf50]/08 px-4 py-1.5 font-mono text-[11px] text-[#4caf50] uppercase tracking-widest">
            <span className="w-1.5 h-1.5 bg-[#4caf50] animate-pulse" />
            {dict.hero.badge}
          </div>

          {/* Title */}
          <h1 className="font-mono font-black text-[clamp(48px,10vw,96px)] uppercase leading-none tracking-tighter mb-5">
            {dict.hero.title}{' '}
            <span
              className="text-[#4caf50]"
              style={{ textShadow: '0 0 50px rgba(76,175,80,0.55)' }}
            >
              {dict.hero.titleAccent}
            </span>
          </h1>

          <p className="max-w-xl text-[#777] text-[15px] md:text-lg mb-12 leading-relaxed">
            {dict.hero.subtitle}
          </p>

          {/* Download buttons */}
          <div className="flex flex-col items-center gap-2.5 w-full max-w-md">
            {/* Windows — primary */}
            <a
              href="https://github.com/HardTimesOffical/HardLauncher/releases/download/v1.0.10/HardLauncher-Setup-1.0.10.exe"
              className="w-full flex items-center justify-between gap-3 px-5 py-4 bg-[#4caf50] text-black font-mono text-[12px] font-bold uppercase tracking-widest hover:bg-[#66bb6a] active:scale-[0.98] transition-all no-underline"
              style={{ boxShadow: '4px 4px 0 #2e7d32' }}
            >
              <span className="flex items-center gap-3">
                <IconWindows />
                {dict.hero.downloadWindows}
              </span>
              <span className="text-[10px] font-normal opacity-60">{dict.hero.winRequirement}</span>
            </a>

            {/* macOS — secondary */}
              {/* <a
                href="https://github.com/HardTimesOffical/HardLauncher/releases/download/v1.0.10/HardLauncher-Setup-1.0.10.dmg"
                className="w-full flex items-center justify-between gap-3 px-5 py-3.5 bg-transparent text-white font-mono text-[12px] uppercase tracking-widest hover:bg-[#1e1e1e] active:scale-[0.98] transition-all no-underline border-2 border-[#333] hover:border-[#4caf50]/40"
                style={{ boxShadow: '4px 4px 0 #1a1a1a' }}
              >
                <span className="flex items-center gap-3">
                  <IconApple />
                  {dict.hero.downloadMac}
                </span>
                <span className="text-[10px] font-normal opacity-50">{dict.hero.macRequirement}</span>
              </a> */}

              {/* Linux — tertiary */}
              {/* <a
                href="/downloads/HardLauncher.AppImage"
                className="w-full flex items-center justify-between gap-3 px-5 py-3.5 bg-transparent text-[#666] font-mono text-[12px] uppercase tracking-widest hover:bg-[#1a1a1a] hover:text-[#aaa] active:scale-[0.98] transition-all no-underline border-2 border-[#222] hover:border-[#333]"
              >
                <span className="flex items-center gap-3">
                  <IconLinux />
                  {dict.hero.downloadLinux}
                </span>
                <span className="text-[10px] font-normal opacity-50">{dict.hero.linuxRequirement}</span>
              </a> */}

            <p className="text-[#3a3a3a] font-mono text-[11px] uppercase tracking-widest mt-1">
              {dict.hero.version} · {dict.hero.javaNote}
            </p>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-[#3a3a3a] font-mono text-[10px] uppercase tracking-widest animate-bounce">
            <span>Scroll</span>
            <span>▼</span>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="max-w-6xl mx-auto py-24 px-4">
        <div className="text-center mb-14">
          <p className="font-mono text-[#f59e0b] text-[11px] uppercase tracking-widest">
            {dict.features.sectionLabel}
          </p>
          <h2 className="font-mono font-black text-[clamp(28px,5vw,48px)] uppercase tracking-tight mt-2 mb-3">
            {dict.features.sectionTitle}
          </h2>
          <p className="text-[#555] max-w-lg mx-auto text-[14px] leading-relaxed">
            {dict.features.sectionSubtitle}
          </p>
          {/* Pixel divider */}
          <div className="flex justify-center gap-0.5 mt-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="w-3 h-3"
                style={{ background: i % 2 === 0 ? '#4caf50' : '#2e7d32' }}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-0.5">
          {dict.features.items.map((item, i) => (
            <FeatureCard key={i} item={item} index={i} />
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="relative overflow-hidden border-t-2 border-b-2 border-[#222]"
        style={{ background: 'linear-gradient(135deg, #1a2e1a 0%, #111 50%, #2a1a0e 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(#4caf50 1px, transparent 1px), linear-gradient(90deg, #4caf50 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="relative max-w-3xl mx-auto py-20 px-4 text-center">
          <p className="font-mono text-[#f59e0b] text-[11px] uppercase tracking-widest mb-3">
            ⚡ Get Started
          </p>
          <h2 className="font-mono font-black text-[clamp(32px,6vw,60px)] uppercase tracking-tight mb-4">
            {dict.cta.title}
          </h2>
          <p className="text-[#666] max-w-md mx-auto mb-8 text-[14px] leading-relaxed">
            {dict.cta.subtitle}
          </p>
          <a
            href="https://github.com/HardTimesOffical/HardLauncher/releases/download/v1.0.10/HardLauncher-Setup-1.0.10.exe"
            className="inline-flex items-center gap-3 px-10 py-4 bg-[#4caf50] text-black font-mono text-[13px] font-bold uppercase tracking-widest hover:bg-[#66bb6a] transition-all no-underline"
            style={{ boxShadow: '6px 6px 0 #2e7d32' }}
          >
            ⬇ {dict.cta.button}
          </a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0d0d0d] border-t-4 border-[#1a1a1a]">
        <div className="max-w-6xl mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-[#4caf50] grid place-items-center text-black font-black">
                ▪
              </div>
              <span className="font-mono font-bold text-[14px] uppercase tracking-widest">
                Hard<span className="text-[#4caf50]">Launcher</span>
              </span>
            </div>
            <p className="text-[#555] text-[13px] max-w-xs mb-5 leading-relaxed">
              {dict.footer.tagline}
            </p>
            <div className="flex gap-1.5">
              {['Discord', 'GitHub', 'Telegram'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="px-3 py-1.5 border border-[#222] text-[#555] hover:text-white hover:border-[#444] font-mono text-[10px] uppercase tracking-wider transition-all no-underline"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-[#4caf50] mb-4">
              {dict.footer.linksTitle}
            </h4>
            <ul className="flex flex-col gap-2 list-none p-0 m-0">
              {Object.entries(dict.footer.links).map(([key, label]) => (
                <li key={key}>
                  <a
                    href={localePath(`/${key === 'home' ? '' : key}`)}
                    className="text-[#555] hover:text-white font-mono text-[11px] uppercase tracking-wider transition-colors no-underline"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-[#f59e0b] mb-4">
              {dict.footer.legalTitle}
            </h4>
            <ul className="flex flex-col gap-2 list-none p-0 m-0">
              {Object.entries(dict.footer.legal).map(([key, label]) => (
                <li key={key}>
                  <a
                    href="#"
                    className="text-[#555] hover:text-white font-mono text-[11px] uppercase tracking-wider transition-colors no-underline"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t-2 border-[#1a1a1a] bg-[#080808]">
          <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="font-mono text-[10px] text-[#333] uppercase tracking-widest text-center md:text-left">
              {dict.footer.disclaimer}
            </p>
            <p className="font-mono text-[10px] text-[#444] whitespace-nowrap">
              {dict.footer.copyright}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
