"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { HiOutlineCog6Tooth, HiOutlineArrowLeftOnRectangle } from "react-icons/hi2";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // 1. Очистка данных
    localStorage.removeItem("accessToken"); 
    
    // 2. Редирект и обновление
    router.push("/login");
    router.refresh(); 
  };

  const baseButtonStyle = "flex items-center justify-center gap-2 w-full h-10 font-bold text-[10px] uppercase tracking-[0.15em] transition-all duration-200 border";

  return (
    <div className="flex flex-col gap-2 w-full">
      
      {/* Кнопка Настроек */}
      <Link 
        href="/settings" 
        className={`${baseButtonStyle} bg-[#242424] border-white/5 text-zinc-400 hover:text-white hover:border-[#5a6e60]/50 hover:bg-[#2a2a2a]`}
      >
        <HiOutlineCog6Tooth className="w-4 h-4" />
        Настройки
      </Link>

      {/* Кнопка Выхода */}
      <button 
        onClick={handleLogout} 
        className={`${baseButtonStyle} bg-transparent border-red-900/20 text-red-900/60 hover:bg-red-900/10 hover:border-red-900/40 hover:text-red-500`}
      >
        <HiOutlineArrowLeftOnRectangle className="w-4 h-4" />
        Выйти из системы
      </button>

    </div>
  );
}