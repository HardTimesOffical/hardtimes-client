"use client";
import React, { useState, useRef, useEffect } from "react";
import { HiBell, HiCheck, HiOutlineEnvelopeOpen } from "react-icons/hi2";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export default function NotificationMenu() {
  const { accessToken, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Считаем количество непрочитанных
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const fetchNotifications = async () => {
    if (!accessToken) return;
    if (isOpen) setIsLoading(true);
    try {
      const response = await fetch(`${SERVER_URL}/notifications`, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  };

  useEffect(() => { if (accessToken) fetchNotifications(); }, [accessToken]);
  useEffect(() => { if (isOpen) fetchNotifications(); }, [isOpen]);

  const markAsRead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation(); // Чтобы не срабатывал переход по ссылке карточки
    if (!accessToken) return;
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    try {
      await fetch(`${SERVER_URL}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
    } catch (e) {}
  };

  const markAllAsRead = async () => {
    if (!accessToken) return;
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    try {
      await fetch(`${SERVER_URL}/notifications/read-all`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
    } catch (e) {}
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!user) return null;

  return (
    <div ref={menuRef} className="relative flex items-stretch">
      {/* Кнопка Колокольчик */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center px-4 h-full hover:bg-white/5 transition-all group relative outline-none"
      >
        <HiBell className={`w-5 h-5 transition-colors ${isOpen ? 'text-[#84a98c]' : 'text-[#7d8581] group-hover:text-white'}`} />
        
        {/* Бадж с числом (НЕ мигающий) */}
        {unreadCount > 0 && (
          <span className="absolute top-3 right-2 min-w-[14px] h-[14px] px-1 flex items-center justify-center bg-[#ff3333] border border-[#0a0b0b] text-[8px] font-mc-pixel text-white leading-none">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Выпадающее окно (Сделано шире - w-96) */}
      {isOpen && (
        <div className="absolute top-full right-0 z-[200] w-80 md:w-96 bg-[#161817] border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
          
          <div className="px-4 py-3 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
            <div className="flex items-center gap-2">
               <span className="font-mc-pixel text-[10px] text-[#f2f2f2] uppercase tracking-wider">Уведомления</span>
               {unreadCount > 0 && <span className="bg-[#ff3333] text-white text-[8px] px-1 font-mc-pixel uppercase">New</span>}
            </div>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="font-mc-pixel text-[8px] text-[#84a98c] uppercase hover:text-white transition-colors outline-none"
              >
                Прочитать все
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto custom-scrollbar bg-[#0e100f]">
            {isLoading ? (
              <div className="py-12 text-center text-[#444] font-mc-pixel text-[9px] uppercase tracking-widest">Загрузка данных...</div>
            ) : notifications.length > 0 ? (
              notifications.map((notif) => (
                <div 
                  key={notif._id}
                  className={`relative p-4 border-b border-white/5 transition-all group/item
                    ${!notif.isRead ? 'bg-white/[0.03]' : 'opacity-40 grayscale-[0.3]'}`}
                >
                  {/* Полоска типа */}
                  <div 
                    className="absolute left-0 top-0 bottom-0 w-[2px]" 
                    style={{ backgroundColor: notif.type === 'SUCCESS' ? '#84a98c' : notif.type === 'ERROR' ? '#ff3333' : '#3b82f6' }}
                  />

                  <div className="flex gap-3">
                    {notif.image && (
                      <div className="w-10 h-10 shrink-0 bg-black/40 border border-white/10 p-0.5">
                        <img src={notif.image} className="w-full h-full object-cover pixelated" alt="" />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-mc-pixel text-[10px] text-white uppercase leading-tight truncate pr-4">
                          {notif.title}
                        </h4>
                        
                        {/* КНОПКА ПРОЧИТАТЬ (ДЛЯ КАЖДОГО) */}
                        {!notif.isRead && (
                          <button 
                            onClick={(e) => markAsRead(notif._id, e)}
                            title="Пометить как прочитанное"
                            className="text-[#444] hover:text-[#84a98c] transition-colors p-1 -mt-1"
                          >
                            <HiCheck className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      
                      <p className="font-standard text-[11px] text-[#7d8581] leading-snug my-1.5">
                        {notif.message}
                      </p>

                      <div className="flex justify-between items-center mt-2">
                        <span className="font-mc-pixel text-[7px] text-[#444] uppercase">
                          {new Date(notif.createdAt).toLocaleDateString()}
                        </span>
                        {notif.link && (
                          <Link 
                            href={notif.link}
                            onClick={() => setIsOpen(false)}
                            className="font-mc-pixel text-[8px] text-[#84a98c] border border-[#84a98c]/20 px-2 py-1 uppercase hover:bg-[#84a98c] hover:text-[#161817] transition-all"
                          >
                            Подробнее
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center flex flex-col items-center gap-2">
                <HiOutlineEnvelopeOpen className="w-6 h-6 text-[#222]" />
                <p className="font-mc-pixel text-[9px] text-[#444] uppercase tracking-widest">Уведомлений нет</p>
              </div>
            )}
          </div>

          <Link href="/profile/notifications" 
            onClick={() => setIsOpen(false)}
            className="block py-3 text-center border-t border-white/5 bg-white/[0.01] font-mc-pixel text-[9px] text-[#7d8581] uppercase tracking-widest hover:text-white transition-all">
            Смотреть все
          </Link>
        </div>
      )}
    </div>
  );
}