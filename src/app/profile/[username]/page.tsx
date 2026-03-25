"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import LogoutButton from "@/app/profile/[username]/LogoutButton";
import ProfileTabs from "@/app/profile/[username]/profileTabs";
import api from "@/lib/api";

export default function ProfilePage({ params }: { params: { username: string } }) {
  const { username } = React.use(params as any) as any;
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const isOwner = currentUser?.username === username;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get(`/users/${username}`);
        setProfileUser(data);
      } catch (err) {
        console.error("User not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  // --- СКЕЛЕТОН ЗАГРУЗКИ ---
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] pt-24 flex justify-center px-4">
        <div className="w-full max-w-[900px] flex flex-col md:flex-row gap-6 animate-pulse">
          <div className="w-40 h-40 bg-white/5 border border-white/10" />
          <div className="flex-1 space-y-4">
            <div className="h-8 w-48 bg-white/5" />
            <div className="h-4 w-full bg-white/5" />
          </div>
        </div>
      </div>
    );
  }

  if (!profileUser) return <div className="text-white/50 p-20 text-center font-mono">USER_NOT_FOUND</div>;

  return (
    <div className="min-h-screen bg-[#0d0d0d] pt-24 pb-12 px-4 font-sans selection:bg-[#8da081]/30">
      <div className="max-w-[1000px] mx-auto flex flex-col md:flex-row gap-8 items-start">
        
        {/* SIDEBAR: Компактный и техничный */}
        <aside className="w-full md:w-52 shrink-0">
          
          {/* Аватар: Уменьшен, с пиксельной рамкой */}
          <div className="relative mb-4">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-[#141414] border-2 border-[#1a1a1a] p-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
              <div className="w-full h-full border border-white/5 overflow-hidden bg-[#1a1a1a] flex items-center justify-center">
                <img 
                  src={profileUser.avatar || "/default-steve.png"} 
                  className={`w-full h-full object-cover ${!profileUser.avatar ? 'pixelated scale-75' : ''}`} 
                  alt={username}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/default-steve.png";
                  }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight uppercase leading-none">
                {profileUser.username}
              </h1>
            </div>

            {/* Компактный прогресс-бар */}
            <div className="w-full mt-4">
              <div className="flex justify-between items-end mb-2 px-0.5">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white uppercase tracking-tight">
                    Уровень {profileUser.level}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#8da081] font-mono font-bold block">
                    {profileUser.progressPercentage}%
                  </span>
                  <span className="text-[8px] text-white/20 font-mono uppercase">
                    {profileUser.xp || 0} XP
                  </span>
                </div>
              </div>

              {/* Контейнер полоски: h-4 для уверенной толщины и техно-стиля */}
              <div className="h-4 w-full bg-black/80 border border-white/10 p-[1px] relative shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)]">
                
                {/* Сама полоска: более яркий оливковый с внутренним свечением */}
                <div 
                  className="h-full bg-gradient-to-r from-[#6b7a62] to-[#8da081] relative transition-all duration-1000 ease-out overflow-hidden"
                  style={{ width: `${profileUser.progressPercentage}%` }}
                >
                  {/* Стеклянный блик (верхняя треть) */}
                  <div className="absolute top-0 left-0 w-full h-[35%] bg-white/10" />
                  
                  {/* Пиксельная сетка поверх полоски */}
                  <div className="absolute inset-0 opacity-30" 
                      style={{ 
                        backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.5) 1px, transparent 1px)', 
                        backgroundSize: '4px 4px' 
                      }} 
                  />

                  {/* Яркий край полоски (акцент) */}
                  <div className="absolute top-0 right-0 h-full w-[2px] bg-white/40 shadow-[0_0_10px_#8da081]" />
                </div>

                {/* Фоновые деления (шкала) */}
                <div className="absolute inset-0 pointer-events-none flex justify-between px-[1px]">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="h-full w-[1px] bg-white/5" />
                  ))}
                </div>
              </div>
              
              <div className="mt-2 flex justify-between items-center">
                <p className="text-[8px] text-white/20 uppercase tracking-wider">
                  До цели: {profileUser.xpRequiredForNext || 0} XP
                </p>
              </div>
            </div>

            {/* Кнопки: только суть */}
            {isOwner && (
              <div className="pt-4 border-t border-white/5">
                <LogoutButton />
              </div>
            )}
          </div>
        </aside>

        {/* MAIN CONTENT: Без лишних фоновых блоков */}
        <main className="flex-1 w-full">
          <div className="relative border-l border-white/5 pl-8 h-full">
             <ProfileTabs user={profileUser} isOwner={isOwner} />
          </div>
        </main>

      </div>

      <style jsx global>{`
        .pixelated { image-rendering: pixelated; }
        .clip-path-pixel { clip-path: polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%); }
      `}</style>
    </div>
  );
}