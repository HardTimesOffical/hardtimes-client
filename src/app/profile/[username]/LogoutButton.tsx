"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { HiOutlineCog6Tooth, HiOutlineArrowLeftOnRectangle } from "react-icons/hi2";
import { useAuth } from "@/context/AuthContext"; // Импортируем твой контекст

export default function LogoutButton() {
  const { logout } = useAuth(); // Используем метод из контекста

  const handleLogout = async () => {
    await logout(); // Это очистит localStorage, Cookies и сделает редирект
  };

  // Базовый стиль Синегорск: строгие углы, мелкий шрифт, широкий трекинг
  const baseButtonStyle = `
    flex items-center justify-center gap-2 w-full h-9 
    text-[9px] uppercase tracking-[0.25em] font-medium
    transition-all duration-300 border relative overflow-hidden group
  `;

  return (
    <div className="flex flex-col gap-2 w-full mt-2">
      
      {/* Кнопка Настроек (Оливковая тема) */}
      <Link 
        href="/settings" 
        className={`${baseButtonStyle} bg-[#1a1a1a] border-white/5 text-[#8da081]/70 hover:text-white hover:border-[#8da081]/40`}
      >
        {/* Декоративный элемент в углу */}
        <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-[#8da081] opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <HiOutlineCog6Tooth className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
        Настройки
      </Link>

      {/* Кнопка Выхода (Приглушенная серая тема) */}
      <button 
        onClick={handleLogout} 
        className={`${baseButtonStyle} bg-transparent border-white/5 text-white/30 hover:bg-white/[0.02] hover:border-white/20 hover:text-white/80`}
      >
        <HiOutlineArrowLeftOnRectangle className="w-3.5 h-3.5" />
        Выйти
      </button>
    </div>
  );
}