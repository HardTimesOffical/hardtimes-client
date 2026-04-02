"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { getPlayerStats } from "@/lib/xp"; 
import { 
  HiOutlineFire, 
  HiOutlineTrophy, 
  HiOutlineSparkles, 
  HiOutlineBolt 
} from "react-icons/hi2";

export interface ILeaderboardPlayer {
  _id: string;
  username: string;
  avatar?: string;
  role: string;
  xp: number;
  serverCount: number;
  totalVotes: number;
  totalBoosts: number;
}

const BRAND = "#84a98c";
const GOLD = "#FFD700";
const SILVER = "#C0C0C0";
const BRONZE = "#CD7F32";

export default function LeaderboardPage() {
  const [players, setPlayers] = useState<ILeaderboardPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/users/leaderboard")
      .then(res => setPlayers(res.data.slice(0, 20)))
      .catch(err => console.error("Ошибка загрузки рейтинга:", err))
      .finally(() => setLoading(false));
  }, []);

  const topThree = players.slice(0, 3);
  const others = players.slice(3);

  return (
    <div className="relative min-h-screen bg-[#050505] text-white font-mc-pixel overflow-hidden">
      {/* ДИНАМИЧЕСКИЙ ФОН С ГЛУБОКИМ СВЕЧЕНИЕМ */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-1/4 w-[600px] h-[600px] bg-brand/15 blur-[160px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-5%] right-1/4 w-[500px] h-[500px] bg-[#bb6bd9]/10 blur-[140px] rounded-full" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
        {/* Дополнительный градиент для мягкости */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/80 to-[#050505]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-28 pb-20 relative z-10">
        
        {/* ЗАГОЛОВОК */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1 border border-brand/20 bg-brand/5 text-brand text-[10px] uppercase tracking-[0.3em] mb-6 backdrop-blur-md">
            <HiOutlineSparkles /> Зал Славы: Топ 20
          </div>
          <h1 className="text-6xl md:text-7xl uppercase tracking-tighter font-black mb-4">
            РЕЙТИНГ<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-[#6fcf97] drop-shadow-[0_0_20px_rgba(132,169,140,0.4)]"> МОНИТОРИНГА</span>
          </h1>
          <p className="text-[11px] text-[#666] uppercase tracking-[0.15em] max-w-2xl mx-auto leading-relaxed px-4">
            Глобальный рейтинг по <span className="text-white">уровню активности</span>. Твой уровень растет за счет развития проектов, голосов сообщества и личного вклада в экосистему.
          </p>
        </div>

        {/* ПЬЕДЕСТАЛ (ТОП-3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-24 items-end">
          <div className="order-2 md:order-1">
            {topThree[1] && <TopCard player={topThree[1]} place={2} color={SILVER} />}
          </div>
          <div className="order-1 md:order-2">
            {topThree[0] && <TopCard player={topThree[0]} place={1} color={GOLD} />}
          </div>
          <div className="order-3">
            {topThree[2] && <TopCard player={topThree[2]} place={3} color={BRONZE} />}
          </div>
        </div>

        {/* ТАБЛИЦА ОСТАЛЬНЫХ */}
        <div className="bg-[#0c0d0d]/90 border border-white/5 backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden">
          <div className="grid grid-cols-12 px-8 py-5 text-[10px] uppercase text-[#444] tracking-[0.2em] bg-white/[0.03] border-b border-white/5 font-bold">
            <div className="col-span-1 text-center font-black">Ранг</div>
            <div className="col-span-4">Игрок</div>
            <div className="col-span-3">Прогресс / Уровень</div>
            <div className="col-span-2 text-center">Голоса</div>
            <div className="col-span-2 text-right">Бусты</div>
          </div>

          <div className="divide-y divide-white/5">
            {others.map((player, idx) => {
              const stats = getPlayerStats(player.xp);
              return (
                <div key={player._id} className="grid grid-cols-12 items-center px-8 py-6 hover:bg-white/[0.04] transition-all group border-l-2 border-transparent hover:border-l-brand">
                  <div className="col-span-1 text-[16px] font-black text-[#1a1a1a] group-hover:text-brand/50 transition-colors italic text-center">
                    {idx + 4}
                  </div>
                  <div className="col-span-4 flex items-center gap-4">
                    <div className="w-12 h-12 border border-white/10 bg-[#050505] shrink-0 relative overflow-hidden group-hover:border-brand/30 transition-colors">
                      {player.avatar && (
                        <img src={player.avatar} className="w-full h-full object-cover" alt="" />
                      )}
                    </div>
                    <Link href={`/profile/${player.username}`} className="text-[15px] group-hover:text-brand transition-colors truncate uppercase font-bold tracking-tight">
                      {player.username}
                    </Link>
                  </div>
                  
                  <div className="col-span-3 px-4">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-brand text-[10px] font-black uppercase">Ур. {stats.level}</span>
                      <span className="text-[#333] text-[9px] font-mono font-bold">{stats.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-brand to-[#6fcf97] shadow-[0_0_15px_rgba(132,169,140,0.4)] transition-all duration-1000"
                        style={{ width: `${stats.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="col-span-2 text-center text-[#f2994a] text-[15px] font-black drop-shadow-md">
                    {player.totalVotes}
                  </div>
                  <div className="col-span-2 text-right">
                    <span className={`px-3 py-1 text-[10px] font-black italic rounded-sm tracking-tighter ${player.totalBoosts > 0 ? 'text-[#bb6bd9] bg-[#bb6bd9]/10 border border-[#bb6bd9]/20 shadow-[0_0_15px_rgba(187,107,217,0.1)]' : 'text-[#222]'}`}>
                      {player.totalBoosts > 0 ? `+${player.totalBoosts} БУСТ` : '0 БУСТ'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {loading && (
          <div className="py-24 text-center text-brand animate-pulse uppercase tracking-[0.5em] text-[12px] font-black">
            Синхронизация данных...
          </div>
        )}
      </div>
    </div>
  );
}

function TopCard({ player, place, color }: { player: ILeaderboardPlayer; place: number; color: string }) {
  const isFirst = place === 1;
  const stats = getPlayerStats(player.xp);
  
  return (
    <div 
      className={`relative p-8 bg-gradient-to-b from-[#111312] to-[#050505] border border-white/5 transition-all duration-500 hover:scale-[1.03] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)] group ${isFirst ? 'md:-translate-y-12 ring-1 ring-brand/10' : ''}`}
    >
      {/* ФОНОВОЕ СВЕЧЕНИЕ КАРТОЧКИ */}
      <div 
        className="absolute inset-0 opacity-10 transition-opacity pointer-events-none blur-3xl group-hover:opacity-20" 
        style={{ backgroundColor: color }} 
      />

      {/* РАНГ (МАРКЕР) */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
        <div className="px-6 py-1 text-[14px] font-black uppercase italic shadow-2xl" style={{ backgroundColor: color, color: '#000' }}>
          МЕСТО {place}
        </div>
      </div>

      <div className="flex flex-col items-center text-center mt-6 relative z-10">
        <div className="relative mb-10">
          {/* ФРЕЙМ АВАТАРКИ */}
          <div className="w-32 h-32 relative">
             <div className="absolute inset-0 border-2 rotate-45 border-white/10 group-hover:border-brand/40 transition-colors duration-500" />
             <div className="absolute inset-2 bg-[#000] overflow-hidden">
                {player.avatar && (
                  <img src={player.avatar} className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-700" alt="" />
                )}
             </div>
          </div>
          {isFirst && (
            <HiOutlineTrophy className="absolute -top-12 -right-12 text-7xl text-yellow-400 drop-shadow-[0_0_25px_rgba(255,215,0,0.6)] animate-bounce" />
          )}
        </div>

        {/* НИК (Горизонтальный и читабельный) */}
        <Link href={`/profile/${player.username}`} className="text-2xl text-white mb-2 hover:text-brand transition-colors uppercase font-black tracking-tight drop-shadow-lg">
          {player.username}
        </Link>
        
        <div className="inline-flex items-center gap-3 mb-8 px-5 py-2 bg-brand/5 border border-brand/20 rounded-sm">
           <span className="text-brand text-[13px] font-black uppercase tracking-tighter">Уровень {stats.level}</span>
           <div className="w-1 h-1 bg-brand/40 rounded-full animate-pulse" />
           <span className="text-[#555] text-[10px] uppercase font-bold">{player.xp} XP</span>
        </div>

        {/* СТАТИСТИКА */}
        <div className="grid grid-cols-2 w-full gap-4 pt-8 border-t border-white/5">
          <div className="text-center group/stat">
            <p className="text-[9px] text-[#444] uppercase mb-1 font-bold tracking-widest group-hover/stat:text-[#f2994a] transition-colors">Голоса</p>
            <p className="text-[#f2994a] text-2xl font-black flex items-center justify-center gap-1 drop-shadow-md">
              <HiOutlineFire className="text-lg" /> {player.totalVotes}
            </p>
          </div>
          <div className="text-center border-l border-white/5 group/stat">
            <p className="text-[9px] text-[#444] uppercase mb-1 font-bold tracking-widest group-hover/stat:text-[#bb6bd9] transition-colors">Бусты</p>
            <p className="text-[#bb6bd9] text-2xl font-black flex items-center justify-center gap-1 drop-shadow-md">
              <HiOutlineBolt className="text-lg" /> {player.totalBoosts}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}