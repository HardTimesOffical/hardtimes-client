"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import LogoutButton from "@/app/profile/[username]/LogoutButton";
import ProfileTabs from "@/app/profile/[username]/profileTabs";
import api from "@/lib/api";

interface ProfileUser {
  username: string;
  avatar?: string;
  level: number;
  xp: number;
  xpRequiredForNext: number;
  progressPercentage: number;
  bio?: string;
  role?: string;
  votesTotal: number;
  votesWeekly: number;
  balance: number;
}

export default function ProfilePage({ params }: { params: { username: string } }) {
  const resolvedParams = React.use(params as any) as { username: string };
  const { username } = resolvedParams;
  const { user: currentUser } = useAuth();
  
  const [profileUser, setProfileUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"profile" | "servers">("profile");

  const isOwner = currentUser?.username === username;

  // Твои цвета
  const BRAND = "#84a98c";
  const BG_MAIN = "#0a0b0b";
  const BG_ELEVATED = "#161817";

  useEffect(() => {
    setLoading(true);
    api.get(`/users/${username}`)
      .then((res) => setProfileUser(res.data))
      .catch((err) => console.error("Ошибка:", err))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex justify-center bg-[#0a0b0b]">
        <div className="w-[440px] h-[300px] border border-white/5 flex items-center justify-center bg-[#161817]">
           <span className="font-mc-pixel text-[11px] text-[#7d8581] uppercase animate-pulse">Загрузка профиля...</span>
        </div>
      </div>
    );
  }

  if (!profileUser) return null;

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 flex justify-center relative overflow-hidden" 
         style={{ background: BG_MAIN }}>
      
      {/* ЭФФЕКТ 3D СВЕЧЕНИЯ ЗА БЛОКОМ */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 pointer-events-none"
           style={{ background: BRAND }} />

      <div className="w-[440px] bg-[#161817] border border-white/10 relative animate-scale-in shadow-[0_0_60px_rgba(0,0,0,0.8)] h-fit z-10">
        
        {/* Углы */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l opacity-50" style={{ borderColor: BRAND }} />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r opacity-50" style={{ borderColor: BRAND }} />

        {/* Шапка */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <div className="w-1 h-3" style={{ backgroundColor: BRAND }} />
            <span className="font-mc-pixel text-[10px] uppercase tracking-widest text-[#f2f2f2]">
              Профиль пользователя
            </span>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Основная инфо */}
          <div className="flex items-start gap-4">
            {/* Аватар */}
            <div className="w-20 h-20 bg-black border-2 p-1 shrink-0" style={{ borderColor: BRAND }}>
              <div className="w-full h-full bg-[#1e211f] overflow-hidden">
                <img src={profileUser.avatar || "/default.png"} className="w-full h-full object-cover pixelated" alt="avatar" />
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <div className="space-y-1">
                <span className="font-mc-pixel text-[9px] uppercase text-[#7d8581]">Никнейм</span>
                <div className="flex items-center gap-2">
                  <span className="font-mc-pixel text-[14px] text-[#f2f2f2] uppercase">{profileUser.username}</span>
                  <span className="px-1.5 py-0.5 border text-[8px] font-mc-pixel uppercase" 
                        style={{ color: BRAND, borderColor: `${BRAND}40`, backgroundColor: `${BRAND}10` }}>
                    {profileUser.role || "Игрок"}
                  </span>
                </div>
              </div>

              {/* Уровень и XP */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-mc-pixel text-[8px] uppercase">
                  <span style={{ color: "#7d8581" }}>Уровень {profileUser.level}</span>
                  <span style={{ color: BRAND }}>{profileUser.xp} XP</span>
                </div>
                <div className="h-1 w-full bg-black/40 border border-white/5">
                  <div className="h-full transition-all duration-1000 shadow-[0_0_8px_rgba(132,169,140,0.4)]" 
                       style={{ width: `${profileUser.progressPercentage}%`, backgroundColor: BRAND }} />
                </div>
              </div>
            </div>
          </div>

          {/* Табы (Только обводка) */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setTab("profile")}
              className="py-2 font-mc-pixel text-[9px] uppercase border transition-all"
              style={{ 
                borderColor: tab === "profile" ? BRAND : "#2d322f",
                color: tab === "profile" ? BRAND : "#7d8581",
              }}
            >
              Данные
            </button>
            <button
              onClick={() => setTab("servers")}
              className="py-2 font-mc-pixel text-[9px] uppercase border transition-all"
              style={{ 
                borderColor: tab === "servers" ? BRAND : "#2d322f",
                color: tab === "servers" ? BRAND : "#7d8581",
              }}
            >
              Серверы
            </button>
          </div>

          {/* Контент вкладок */}
          <div className="min-h-[160px]">
            {tab === "profile" ? (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <span className="font-mc-pixel text-[9px] uppercase text-[#7d8581]">Биография</span>
                  <div className="p-3 bg-black/20 border border-white/5">
                    <p className="font-mc-pixel text-[10px] leading-relaxed text-[#aaaaaa]">
                      {profileUser.bio || "Информация отсутствует."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 border border-white/5 bg-white/[0.02]">
                    <span className="block font-mc-pixel text-[8px] text-[#7d8581] uppercase mb-1">Голосов всего</span>
                    <span className="font-mc-pixel text-[12px] text-[#f2f2f2]">{profileUser.votesTotal}</span>
                  </div>
                  <div className="p-3 border border-white/5 bg-white/[0.02]">
                    <span className="block font-mc-pixel text-[8px] text-[#7d8581] uppercase mb-1">Баланс звезд</span>
                    <span className="font-mc-pixel text-[12px] text-[#f2f2f2]">{profileUser.balance} ⭐</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="animate-fade-in">
                <ProfileTabs user={profileUser} isOwner={isOwner} />
              </div>
            )}
              {isOwner && <LogoutButton />}
          </div>
        </div>
      </div>
    </div>
  );
}