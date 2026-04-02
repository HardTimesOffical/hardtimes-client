"use client";

import React from "react";
import Link from "next/link";

interface FollowItem {
  _id: string;
  username?: string; // Для игроков
  name?: string;     // Для серверов
  avatar?: string;
  logo?: string;
  role?: string;
  slug?: string;     // Признак сервера
  type: "User" | "Server";
}

interface FollowsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;       // "Подписчики" или "Подписки"
  items: FollowItem[];
  loading: boolean;
}

export default function FollowsModal({ isOpen, onClose, title, items, loading }: FollowsModalProps) {
  if (!isOpen) return null;

  const BRAND = "#84a98c";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Задний фон (Backdrop) */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" 
        onClick={onClose} 
      />

      {/* Контейнер модалки */}
      <div className="w-full max-w-[400px] bg-[#161817] border border-white/10 relative animate-scale-in shadow-[0_0_60px_rgba(0,0,0,0.7)] z-10 flex flex-col max-h-[70vh]">
        
        {/* Стилизованные углы */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l opacity-50" style={{ borderColor: BRAND }} />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r opacity-50" style={{ borderColor: BRAND }} />

        {/* Шапка модалки */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <div className="w-1 h-3" style={{ backgroundColor: BRAND }} />
            <span className="font-mc-pixel text-[10px] uppercase tracking-widest text-[#f2f2f2]">
              {title}
            </span>
          </div>
          <button 
            onClick={onClose} 
            className="text-[#7d8581] hover:text-white transition-colors p-1"
          >
            X
          </button>
        </div>

        {/* Список */}
        <div className="p-2 overflow-y-auto custom-scrollbar flex-1 min-h-[200px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-4 h-4 border-2 border-t-transparent animate-spin rounded-full" style={{ borderColor: `${BRAND} transparent ${BRAND} ${BRAND}` }} />
              <span className="font-mc-pixel text-[8px] text-[#7d8581] uppercase tracking-tighter">
                Синхронизация данных...
              </span>
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center">
              <span className="font-mc-pixel text-[9px] text-[#4a4f4d] uppercase">
                Список пуст
              </span>
            </div>
          ) : (
            <div className="space-y-1">
              {items.map((item) => {
                // Определяем тип контента для ссылки и отображения
                const isServer = item.type === "Server" || !!item.slug;
                const url = isServer ? `/monitoring/${item.slug}` : `/profile/${item.username}`;
                const displayName = isServer ? item.name : item.username;
                const displayImage = isServer ? item.logo : item.avatar;
                const subText = isServer ? "Сервер" : (item.role || "Игрок");

                return (
                  <Link 
                    href={url} 
                    key={item._id}
                    onClick={onClose}
                    className="flex items-center gap-3 p-2 bg-black/20 border border-white/5 hover:border-[#84a98c]/40 hover:bg-[#84a98c]/5 transition-all group"
                  >
                    {/* Иконка/Аватар */}
                    <div className="w-10 h-10 bg-[#1e211f] border border-white/10 shrink-0 p-0.5 group-hover:border-[#84a98c]/60 transition-colors">
                      <img 
                        src={displayImage || "/default.png"} 
                        alt="icon" 
                        className="w-full h-full object-cover pixelated opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                    </div>

                    {/* Текст */}
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <span className="font-mc-pixel text-[11px] text-[#f2f2f2] uppercase truncate group-hover:text-[#84a98c] transition-colors">
                        {displayName}
                      </span>
                      <span className="font-mc-pixel text-[7px] text-[#7d8581] uppercase tracking-wider">
                        {subText}
                      </span>
                    </div>

                    {/* Декор стрелочка */}
                    <div className="text-[#333] group-hover:text-[#84a98c] transition-colors pr-2">
                      <span className="font-mc-pixel text-[10px]"> &gt; </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Футер модалки (опционально) */}
        <div className="p-2 border-t border-white/5 bg-black/20 text-center">
             <span className="font-mc-pixel text-[7px] text-[#4a4f4d] uppercase tracking-[0.2em]">
                HardMonitoring System v1.0
             </span>
        </div>
      </div>
    </div>
  );
}