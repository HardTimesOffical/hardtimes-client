"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineUsers, HiOutlineServerStack, HiOutlineBolt } from 'react-icons/hi2';

const GAMES = [
  { name: "Minecraft", color: "text-white dark:text-accent" },
  { name: "Hytale", color: "text-purple-100 dark:text-purple-400" },
  { name: "VoxelCore", color: "text-blue-100 dark:text-blue-400" }
];

export default function HeroSection() {
  const [index, setIndex] = useState(0);
  const [stats, setStats] = useState({ servers: 0, players: 0, users: 0 });
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, "");

  useEffect(() => {
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % GAMES.length), 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${SERVER_URL}/servers/stats-global`);
        const data = await res.json();
        setStats({
          servers: data.totalServers || 0,
          players: data.totalPlayers || 0,
          users: data.totalUsers || 0
        });
      } catch (e) { console.error(e); }
    };
    fetchStats();
  }, [SERVER_URL]);

  return (
    <section 
      className="relative w-full flex flex-col items-center pt-18 pb-7 px-8 overflow-hidden border-b border-border 
                 bg-gradient-to-r from-orange-500 to-orange-600 dark:from-transparent dark:to-transparent dark:bg-surface 
                 transition-all duration-300"
    >
      {/* Сетка для темной темы */}
      <div 
        className="absolute inset-0 opacity-[0.1] pointer-events-none hidden dark:block" 
        style={{ 
          backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`, 
          backgroundSize: '32px 32px' 
        }} 
      />

      <div className="relative z-10 w-full max-w-[1400px] flex flex-row items-center justify-between gap-4">
        
        {/* ЛЕВАЯ ЧАСТЬ: Поиск (текст уменьшен на мобильных) */}
        <div className="flex flex-col gap-1 items-start shrink-0">
          <h1 className="text-white dark:text-foreground-bright text-xs md:text-2xl font-[1000] tracking-tighter uppercase flex items-center gap-x-2 md:gap-x-3 leading-none text-nowrap">
            <span className="opacity-80 dark:opacity-30">Поиск</span>
            <div className="relative h-[14px] md:h-[28px] overflow-hidden min-w-[70px] md:min-w-[130px]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={GAMES[index].name}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`absolute inset-0 ${GAMES[index].color}`}
                >
                  {GAMES[index].name}
                </motion.span>
              </AnimatePresence>
            </div>
          </h1>
        </div>

        {/* ЦЕНТРАЛЬНАЯ ЧАСТЬ: Статистика */}
        <div className="hidden lg:flex items-center gap-10 border-x border-white/20 dark:border-border px-10 py-1">
          <StatItem label="Серверов" value={stats.servers} icon={<HiOutlineServerStack />} />
          <StatItem label="Игроков" value={stats.players > 999 ? `${(stats.players / 1000).toFixed(1)}k` : stats.players} icon={<HiOutlineUsers />} />
          <StatItem label="Аптайм" value="99.9%" icon={<HiOutlineBolt />} />
        </div>
        
        {/* ПРАВАЯ ЧАСТЬ: Пусто для центровки статистики */}
        <div className="hidden md:block shrink-0 min-w-[100px]" />
      </div>

      {/* Подпись версии внизу */}
      <div className="absolute bottom-2 left-8 text-white/30 dark:text-muted/20 font-mono text-[7px] tracking-[0.4em] uppercase">
        HardMonitoring // 2026
      </div>
    </section>
  );
}

function StatItem({ label, value, icon }: { label: string, value: string | number, icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-white/60 dark:text-accent w-4 h-4">{icon}</div>
      <div className="flex flex-col leading-none text-left">
        <span className="text-[14px] font-black text-white dark:text-foreground-bright uppercase tracking-tighter">{value}</span>
        <span className="text-[7px] font-bold text-white/50 dark:text-muted uppercase tracking-widest leading-tight">{label}</span>
      </div>
    </div>
  );
}