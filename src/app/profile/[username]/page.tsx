"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import LogoutButton from "@/app/profile/[username]/LogoutButton";
import ProfileTabs from "@/app/profile/[username]/profileTabs";
import api from "@/lib/api";
import FollowsModal from "@/app/profile/[username]/FollowsModal";

interface ProfileUser {
  _id: string; // Добавили ID для подписки
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
  followersCount: number;
  followingCount : number;
}

export default function ProfilePage({ params }: { params: { username: string } }) {
  const resolvedParams = React.use(params as any) as { username: string };
  const { username } = resolvedParams;
  const { user: currentUser } = useAuth();
  
  const [profileUser, setProfileUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"profile" | "servers">("profile");
  
  // Состояние подписки
  const [isFollowed, setIsFollowed] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [followItems, setFollowItems] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);

  const isOwner = currentUser?.username === username;

  const BRAND = "#84a98c";
  const BG_MAIN = "#0a0b0b";

  useEffect(() => {
    setLoading(true);
    api.get(`/users/${username}`)
      .then((res) => {
        setProfileUser(res.data);
        // Проверяем статус подписки, если это не наш профиль и мы залогинены
        if (currentUser && currentUser.username !== username) {
          api.get(`/follows/status/${res.data._id}`)
            .then(statusRes => setIsFollowed(statusRes.data.isFollowed))
            .catch(err => console.error("Ошибка статуса подписки:", err));
        }
      })
      .catch((err) => console.error("Ошибка:", err))
      .finally(() => setLoading(false));
  }, [username, currentUser]);

  const handleFollow = async () => {
    if (!profileUser || followLoading) return;
    setFollowLoading(true);
    try {
      const res = await api.post(`/follows/toggle`, {
        targetId: profileUser._id,
        targetType: "User"
      });
      setIsFollowed(res.data.followed);
    } catch (err) {
      console.error("Ошибка при подписке:", err);
    } finally {
      setFollowLoading(false);
    }
  };

    const handleOpenList = async (type: "followers" | "following") => {
    setModalTitle(type === "followers" ? "Подписчики" : "Подписки");
    setModalOpen(true);
    setModalLoading(true);

    try {
      // Вызываем твой API роут
      const res = await api.get(`/follows/list/${profileUser?._id}?type=${type}`);
      setFollowItems(res.data);
    } catch (err) {
      console.error("Ошибка загрузки списка:", err);
    } finally {
      setModalLoading(false);
    }
  };

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
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 pointer-events-none"
           style={{ background: BRAND }} />

      <div className="w-[440px] bg-[#161817] border border-white/10 relative animate-scale-in shadow-[0_0_60px_rgba(0,0,0,0.8)] h-fit z-10">
        
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l opacity-50" style={{ borderColor: BRAND }} />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r opacity-50" style={{ borderColor: BRAND }} />

        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <div className="w-1 h-3" style={{ backgroundColor: BRAND }} />
            <span className="font-mc-pixel text-[10px] uppercase tracking-widest text-[#f2f2f2]">
              Профиль пользователя
            </span>
          </div>
          {!isOwner && (
                <button
                  onClick={currentUser ? handleFollow : () => window.location.href = '/login'}
                  disabled={followLoading}
                  className={`
                    relative group overflow-hidden
                    px-4 py-2 
                    font-mc-pixel text-[10px] uppercase tracking-tighter
                    border-2 transition-all duration-200
                    active:translate-y-[2px] active:shadow-none
                    disabled:opacity-50 disabled:cursor-wait
                  `}
                  style={{ 
                    borderColor: BRAND,
                    color: isFollowed ? '#fff' : BRAND,
                    backgroundColor: isFollowed ? BRAND : 'transparent',
                    boxShadow: isFollowed ? `0 4px 0 0 ${BRAND}44` : `0 4px 0 0 ${BRAND}22`,
                  }}
                >
                  {/* Эффект свечения при наведении */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"
                    style={{ backgroundColor: BRAND }}
                  />

                  <span className="relative z-10 flex items-center gap-2 justify-center">
                    {followLoading ? (
                      <span className="animate-pulse">Обработка...</span>
                    ) : (
                      <>
                        {currentUser ? (
                          isFollowed ? (
                            <>
                              <span className="text-[12px]">✓</span> Вы подписаны
                            </>
                          ) : (
                            <>
                              <span className="text-[12px]">+</span> Подписаться
                            </>
                          )
                        ) : (
                          "Войти и подписаться"
                        )}
                      </>
                    )}
                  </span>
                </button>
              )}
        </div>

        <div className="p-4 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-black border-2 p-1 shrink-0" style={{ borderColor: BRAND }}>
              <div className="w-full h-full bg-[#1e211f] overflow-hidden">
                <img src={profileUser.avatar || "/default.png"} className="w-full h-full object-cover pixelated" alt="avatar" />
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="font-mc-pixel text-[9px] uppercase text-[#7d8581]">Никнейм</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mc-pixel text-[14px] text-[#f2f2f2] uppercase">{profileUser.username}</span>
                    <span className="px-1.5 py-0.5 border text-[8px] font-mc-pixel uppercase" 
                          style={{ color: BRAND, borderColor: `${BRAND}40`, backgroundColor: `${BRAND}10` }}>
                      {profileUser.role || "Игрок"}
                    </span>
                  </div>
                  <div className="flex gap-6 border-t border-white/5 pt-4">
                    <div className="cursor-pointer group" onClick={() => handleOpenList("followers")}>
                      <span className="block font-mc-pixel text-[8px] text-[#7d8581] uppercase">Подписчики</span>
                      <span className="font-mc-pixel text-[12px] text-[#f2f2f2] group-hover:text-[#84a98c]">
                        {profileUser?.followersCount || 0}
                      </span>
                    </div>
                    <div className="cursor-pointer group" onClick={() => handleOpenList("following")}>
                      <span className="block font-mc-pixel text-[8px] text-[#7d8581] uppercase">Подписки</span>
                      <span className="font-mc-pixel text-[12px] text-[#f2f2f2] group-hover:text-[#84a98c]">
                        {profileUser?.followingCount || 0}
                      </span>
                    </div>
                  </div>
                </div>
                
              </div>

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
      <FollowsModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        items={followItems}
        loading={modalLoading}
      />
    </div>
  );
}