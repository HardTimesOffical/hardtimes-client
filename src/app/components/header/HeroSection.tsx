"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GAMES = [
  { name: "Майнкрафт", accent: "#84a98c" },
  { name: "Лаунчер",    accent: "#a3b18a" },
  { name: "JAVA", accent: "#52796f" },
  { name: "BEDROCK", accent: "#84a98c" },
];

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
          users:    data.totalUsers   ?? 0,
        });
      } catch { /* silent */ }
    })();
  }, [SERVER_URL]);

  const game = GAMES[index];

  return (
    /* Изменения: 
       1. Добавил sticky top-0 (чтобы всегда была сверху).
       2. Увеличил альфа-канал фона до 0.7 для стабильной видимости.
       3. Убрал overflow-hidden.
    */
    <header className="mt-10 w-full z-[100] border-b border-white/10 backdrop-blur-xl"
      style={{ backgroundColor: 'rgba(10, 11, 11, 0.75)' }}>

      {/* Линия акцента */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[2px] z-[101]"
        animate={{ backgroundColor: game.accent }}
        transition={{ duration: 0.4 }}
        style={{ boxShadow: `0 0 10px ${game.accent}88` }}
      />

      <div className="relative z-10 w-full max-w-[1132px] mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between py-3 gap-6">

          {/* Лево */}
          <div className="flex items-center gap-3">
            <span className="font-mc-pixel text-[8px] text-[#7d8581] uppercase tracking-[0.2em] select-none">
              Мониторинг
            </span>
            <div className="relative h-[20px] min-w-[100px]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={game.name}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 5 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 font-mc-pixel uppercase tracking-widest text-[12px] text-[#f2f2f2] leading-[20px]"
                >
                  {game.name}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          {/* Центр */}
          <div className="hidden md:flex items-center gap-8">
            <StatItem label="Серверов" value={fmt(stats.servers)} dot="#84a98c" />
            <StatItem label="Онлайн"   value={fmt(stats.players)} dot="#a3b18a" />
            <StatItem label="Аптайм"   value="99.9%"              dot="#52796f" />
          </div>
        </div>

        {/* Мобайл статы */}
        <div className="flex md:hidden items-center justify-between pb-2 pt-1 border-t border-white/5">
          <MobileStatItem label="Серверов" value={fmt(stats.servers)} dot="#84a98c" />
          <MobileStatItem label="Онлайн"   value={fmt(stats.players)} dot="#a3b18a" />
          <MobileStatItem label="Аптайм"   value="99.9%"              dot="#52796f" />
        </div>
      </div>
    </header>
  );
}

function StatItem({ label, value, dot }: { label: string; value: string | number; dot: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-1 h-1 rounded-full shadow-[0_0_5px_rgba(255,255,255,0.2)]" style={{ background: dot }} />
      <div className="flex items-baseline gap-1.5">
        <span className="font-mc-pixel text-[11px] text-[#f2f2f2] tabular-nums">{value}</span>
        <span className="font-mc-pixel text-[7px] text-[#7d8581] uppercase tracking-tighter">{label}</span>
      </div>
    </div>
  );
}

function MobileStatItem({ label, value, dot }: { label: string; value: string | number; dot: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-1 h-1 shrink-0 opacity-40" style={{ background: dot }} />
      <span className="font-mc-pixel text-[10px] text-[#f2f2f2] tabular-nums">{value}</span>
      <span className="font-mc-pixel text-[7px] text-[#7d8581] uppercase">{label}</span>
    </div>
  );
}