"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GAMES = [
  { name: "Minecraft", accent: "#5aac44" },
  { name: "Hytale",    accent: "#f97316" },
  { name: "VoxelCore", accent: "#eab308" },
];

// ─── Форматирование чисел ─────────────────────────────────────────
function fmt(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export default function HeroSection() {
  const [index, setIndex] = useState(0);
  const [stats, setStats] = useState({ servers: 0, players: 0, users: 0 });
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, "");

  useEffect(() => {
    const t = setInterval(() => setIndex(p => (p + 1) % GAMES.length), 3000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(`${SERVER_URL}/servers/stats-global`);
        const data = await res.json();
        setStats({
          servers: data.totalServers ?? 0,
          players: data.totalPlayers ?? 0,
          users:   data.totalUsers   ?? 0,
        });
      } catch { /* silent */ }
    })();
  }, [SERVER_URL]);

  const game = GAMES[index];

  return (
    <section className="relative pt-[60px] w-full border-b border-border bg-card overflow-hidden">

      {/* Пиксельная сетка фона */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(var(--border) 1px, transparent 1px),
            linear-gradient(90deg, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Акцентная полоска сверху — цвет меняется с игрой */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[3px]"
        animate={{ backgroundColor: game.accent }}
        transition={{ duration: 0.4 }}
        style={{ boxShadow: `0 0 12px ${game.accent}66` }}
      />

      <div className="relative z-10 w-full max-w-[1132px] mx-auto px-4 sm:px-8">

        {/* ── Основная строка ── */}
        <div className="flex items-center justify-between py-4 gap-6">

          {/* Левая часть: заголовок */}
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-standard font-semibold text-[13px] text-muted select-none">
              Мониторинг серверов
            </span>

            {/* Анимированное название игры */}
            <div className="relative overflow-hidden" style={{ height: '22px', minWidth: '110px' }}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={game.name}
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0,  opacity: 1 }}
                  exit={{   y: -12, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="absolute inset-0 font-mc-title"
                  style={{
                    fontSize: '15px',
                    color: game.accent,
                    textShadow: `1px 1px 0 rgba(0,0,0,0.4)`,
                    lineHeight: '22px',
                  }}
                >
                  {game.name}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          {/* Центр: статы */}
          <div className="hidden md:flex items-stretch gap-0 border border-border divide-x divide-border">
            <StatItem
              label="Серверов"
              value={fmt(stats.servers)}
              dot="#5aac44"
            />
            <StatItem
              label="Онлайн"
              value={fmt(stats.players)}
              dot="#f97316"
            />
            <StatItem
              label="Аптайм"
              value="99.9%"
              dot="#eab308"
            />
          </div>

          {/* Правая часть: версия */}
          <span className="hidden lg:block font-mc-pixel text-[8px] text-muted/25 uppercase tracking-[0.4em] select-none">
            v3.0 // 2026
          </span>
        </div>

        {/* ── Мобильные статы ── */}
        <div className="flex md:hidden items-center gap-4 pb-3 border-t border-border pt-3">
          <MobileStatItem label="Серверов" value={fmt(stats.servers)} dot="#5aac44" />
          <MobileStatItem label="Онлайн"   value={fmt(stats.players)} dot="#f97316" />
          <MobileStatItem label="Аптайм"   value="99.9%"              dot="#eab308" />
        </div>

      </div>
    </section>
  );
}

// ─── Стат-элемент (desktop) ──────────────────────────────────────
function StatItem({ label, value, dot }: { label: string; value: string | number; dot: string }) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2">
      {/* Цветная точка вместо иконки */}
      <div className="w-1.5 h-1.5 shrink-0" style={{ background: dot }} />
      <div className="flex flex-col leading-none">
        <span className="font-standard font-black text-[14px] text-foreground-bright tabular-nums">
          {value}
        </span>
        <span className="font-mc-pixel text-[8px] text-muted uppercase tracking-wider mt-0.5">
          {label}
        </span>
      </div>
    </div>
  );
}

// ─── Стат-элемент (mobile) ───────────────────────────────────────
function MobileStatItem({ label, value, dot }: { label: string; value: string | number; dot: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-1 h-1 shrink-0" style={{ background: dot }} />
      <span className="font-standard font-black text-[12px] text-foreground-bright tabular-nums">{value}</span>
      <span className="font-mc-pixel text-[8px] text-muted uppercase tracking-wide">{label}</span>
    </div>
  );
}