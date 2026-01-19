"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlus, HiOutlineCpuChip, HiOutlineUsers, HiOutlineServerStack, HiOutlineBolt } from 'react-icons/hi2';

const GAMES = [
  { name: "Minecraft", color: "text-white" },
  { name: "Hytale", color: "text-purple-200" },
  { name: "VoxelCore", color: "text-blue-200" }
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
          servers: data.totalServers || 346,
          players: data.totalPlayers || 43200,
          users: data.totalUsers || 12500
        });
      } catch (e) { console.error(e); }
    };
    fetchStats();
  }, [SERVER_URL]);

  return (
    <section 
      className="relative w-full flex flex-col items-center pt-10 pb-8 px-4 overflow-hidden rounded-b-[32px] shadow-lg shadow-orange-500/20"
      translate="no"
    >
      {/* Фон */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-orange-500 via-orange-600 to-red-600" />
      <div className="absolute inset-0 z-0 opacity-10 bg-[url('/icons/grid.svg')] bg-center scale-150" />

      <div className="relative mt-15 z-10 max-w-[800px] w-full flex flex-col items-center text-center">
        
        {/* Чип-индикатор (микро) */}
        <div className="flex items-center gap-1.5 bg-black/10 backdrop-blur-md px-2 py-0.5 rounded-md mb-4 border border-white/10">
          <HiOutlineCpuChip className="text-white w-2.5 h-2.5" />
          <span className="text-white/60 text-[6px] font-black uppercase tracking-[0.2em]">
            Status: <span className="text-white">Active</span>
          </span>
        </div>

        {/* Заголовок (уменьшен) */}
        <h1 translate='no' className="text-white text-sm md:text-base font-black tracking-tight uppercase flex flex-col sm:flex-row items-center gap-x-2 italic leading-tight">
          <span>Найди свой сервер</span>
          <div className="relative h-[20px] overflow-hidden min-w-[100px] text-center sm:text-left">
            <AnimatePresence mode="wait">
              <motion.span
                key={GAMES[index].name}
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -15, opacity: 0 }}
                transition={{ duration: 0.4, ease: "circOut" }}
                className={`absolute inset-0 ${GAMES[index].color}`}
              >
                {GAMES[index].name}
              </motion.span>
            </AnimatePresence>
          </div>
        </h1>
        
        {/* Кнопки */}
        <div className="flex items-center gap-2 mt-6 mb-10">
          <Link href="/workbench" className="bg-white text-orange-600 px-4 py-1.5 rounded-lg font-black text-[9px] uppercase tracking-wider hover:bg-gray-50 transition-all active:scale-95 flex items-center gap-1.5 shadow-xl shadow-black/10">
            <HiPlus className="w-3 h-3" />
            Добавить
          </Link>
          <button className="bg-black/10 text-white border border-white/10 px-4 py-1.5 rounded-lg font-black text-[9px] uppercase tracking-wider hover:bg-black/20 transition-all">
            Инфо
          </button>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-3 gap-1 border-t border-white/10 pt-6 w-full max-w-[360px]">
          <StatItem label="Серверов" value={stats.servers} icon={<HiOutlineServerStack />} />
          <StatItem label="Игроков" value={stats.players > 999 ? `${(stats.players / 1000).toFixed(1)}k` : stats.players} icon={<HiOutlineUsers />} />
          <StatItem label="Аптайм" value="99.9%" icon={<HiOutlineBolt />} />
        </div>
      </div>

      {/* Декор ID */}
      <div className="absolute bottom-3 right-4 text-white/10 font-mono text-[6px] tracking-widest uppercase">
        Ver. 2.0.4 // HardTime
      </div>
    </section>
  );
}

function StatItem({ label, value, icon }: { label: string, value: string | number, icon: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="text-white/30 w-2 h-2 mb-1">{icon}</div>
      <span className="text-xs font-black text-white leading-none tracking-tighter italic">{value}</span>
      <span className="text-[6px] font-bold text-white/30 uppercase tracking-[0.15em]">{label}</span>
    </div>
  );
}