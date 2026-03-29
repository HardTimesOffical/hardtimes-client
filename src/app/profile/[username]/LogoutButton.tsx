"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function LogoutButton() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  // Твои константы цветов
  const COLORS = {
    brand: "#84a98c",
    danger: "#ff3333",
    bgSubtle: "#1e211f",
    border: "rgba(255, 255, 255, 0.08)",
    textDim: "#7d8581",
    textLight: "#f2f2f2"
  };

  const baseStyle = "flex items-center justify-center w-full h-8 font-mc-pixel text-[8px] uppercase tracking-[0.2em] transition-all border relative group";

  return (
    <div className="flex flex-col gap-1.5 w-full">
      
      {/* Кнопка Настроек (Оливковая) */}
      <Link 
        href="/settings" 
        className={baseStyle}
        style={{ 
          backgroundColor: COLORS.bgSubtle, 
          borderColor: COLORS.border,
          color: COLORS.textDim 
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = COLORS.brand;
          e.currentTarget.style.color = COLORS.brand;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = COLORS.border;
          e.currentTarget.style.color = COLORS.textDim;
        }}
      >
        {/* Угловой пиксель при наведении */}
        <div className="absolute top-0 left-0 w-1 h-1 border-t border-l opacity-0 group-hover:opacity-100 transition-opacity" 
             style={{ borderColor: COLORS.brand }} />
        
        Настройки
      </Link>

      {/* Кнопка Выхода (Красная) */}
      <button 
        onClick={handleLogout} 
        className={baseStyle}
        style={{ 
          backgroundColor: "rgba(255, 51, 51, 0.05)", 
          borderColor: "rgba(255, 51, 51, 0.1)",
          color: COLORS.danger 
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = COLORS.danger;
          e.currentTarget.style.backgroundColor = "rgba(255, 51, 51, 0.1)";
          e.currentTarget.style.boxShadow = "inset 0 0 10px rgba(255, 51, 51, 0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(255, 51, 51, 0.1)";
          e.currentTarget.style.backgroundColor = "rgba(255, 51, 51, 0.05)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {/* Угловой пиксель для кнопки выхода */}
        <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r opacity-0 group-hover:opacity-100 transition-opacity" 
             style={{ borderColor: COLORS.danger }} />
             
        Выйти из системы
      </button>
    </div>
  );
}