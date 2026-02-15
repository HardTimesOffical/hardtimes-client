"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineUsers, HiOutlineServerStack, HiOutlineBolt } from 'react-icons/hi2';

const GAMES = [
  { name: "Minecraft", color: "text-accent" },
  { name: "Hytale", color: "text-purple-400" },
  { name: "VoxelCore", color: "text-blue-400" }
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
      className="relative w-full flex flex-col items-center pt-12 pb-7 overflow-hidden border-b border-border bg-surface transition-all duration-300"
    >
      {/* Сетка фона — теперь видна всегда, но очень слабая */}
      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none" 
        style={{ 
          backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`, 
          backgroundSize: '32px 32px' 
        }} 
      />

      {/* Контейнер внутри. px-4 sm:px-8 здесь не дают фону сжаться, только контенту */}
      <div className="relative z-10 w-full px-4 sm:px-8 flex flex-row items-center justify-between gap-4 max-w-[1132px] mx-auto">
        
        {/* ЛЕВАЯ ЧАСТЬ */}
        <div className="flex flex-col gap-1 items-start shrink-0">
          <h1 className="text-foreground-bright text-lg md:text-2xl font-[1000] tracking-tighter uppercase flex items-center gap-x-2 md:gap-x-3 leading-none text-nowrap">
            <span className="opacity-30 italic">Search</span>
            <div className="relative h-[20px] md:h-[28px] overflow-hidden min-w-[80px] md:min-w-[130px]">
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

        {/* ЦЕНТРАЛЬНАЯ ЧАСТЬ */}
        <div className="hidden lg:flex items-center gap-10 border-x border-border px-10 py-1">
          <StatItem label="Servers" value={stats.servers} icon={<HiOutlineServerStack />} />
          <StatItem label="Online" value={stats.players > 999 ? `${(stats.players / 1000).toFixed(1)}k` : stats.players} icon={<HiOutlineUsers />} />
          <StatItem label="Uptime" value="99.9%" icon={<HiOutlineBolt />} />
        </div>
        
        <div className="hidden md:block shrink-0 min-w-[100px] text-[8px] font-black text-muted/10 tracking-[0.5em] uppercase">
          Core_v3
        </div>
      </div>

      {/* Подпись версии */}
      <div className="w-full max-w-[1132px] mx-auto px-4 sm:px-8 mt-4">
        <div className="text-muted/20 font-mono text-[7px] tracking-[0.4em] uppercase">
          HardMonitoring // 2026
        </div>
      </div>
    </section>
  );
}

function StatItem({ label, value, icon }: { label: string, value: string | number, icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-accent w-4 h-4">{icon}</div>
      <div className="flex flex-col leading-none text-left">
        <span className="text-[14px] font-black text-foreground-bright uppercase tracking-tighter">{value}</span>
        <span className="text-[7px] font-bold text-muted uppercase tracking-widest leading-tight">{label}</span>
      </div>
    </div>
  );
}