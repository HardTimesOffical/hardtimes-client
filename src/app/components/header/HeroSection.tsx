"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlus, HiOutlineUsers, HiOutlineServerStack, HiOutlineBolt } from 'react-icons/hi2';

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

      {/* Контейнер теперь распределяет контент по всей доступной ширине */}
      <div className="relative z-10 w-full max-w-[1400px] flex flex-row items-center justify-between gap-4">
        
        {/* ЛЕВАЯ ЧАСТЬ: Поиск */}
        <div className="flex flex-col gap-1 items-start shrink-0">
          <h1 className="text-white dark:text-foreground-bright text-xl md:text-2xl font-[1000] tracking-tighter uppercase flex items-center gap-x-3 leading-none">
            <span className="opacity-80 dark:opacity-30">Поиск</span>
            <div className="relative h-[28px] overflow-hidden min-w-[130px]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={GAMES[index].name}
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -15, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`absolute inset-0 ${GAMES[index].color}`}
                >
                  {GAMES[index].name}
                </motion.span>
              </AnimatePresence>
            </div>
          </h1>
        </div>

        {/* ЦЕНТРАЛЬНАЯ ЧАСТЬ: Статистика (всегда по центру благодаря justify-between родителя) */}
        <div className="hidden lg:flex items-center gap-10 border-x border-white/20 dark:border-border px-10 py-1">
          <StatItem label="Серверов" value={stats.servers} icon={<HiOutlineServerStack />} />
          <StatItem label="Игроков" value={stats.players > 999 ? `${(stats.players / 1000).toFixed(1)}k` : stats.players} icon={<HiOutlineUsers />} />
          <StatItem label="Аптайм" value="99.9%" icon={<HiOutlineBolt />} />
        </div>
        
        {/* ПРАВАЯ ЧАСТЬ: Кнопка (теперь прижата к правому краю) */}
        <div className="flex items-center shrink-0">
          <Link 
            href="/monitoring/workbench" 
            className="bg-white dark:bg-foreground-bright text-orange-600 dark:text-contrast-text px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-wider hover:scale-105 transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-black/5"
          >
            <HiPlus className="w-4 h-4" />
            Добавить сервер
          </Link>
        </div>
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