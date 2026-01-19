"use client";
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { HiPlus } from 'react-icons/hi'; // Для консистентности с остальными иконками

export const HeaderBalance = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Link href="/shop" className="group flex items-center">
      <div className="flex items-center gap-2.5 bg-white border border-gray-100 pl-3 pr-1.5 py-1.5 rounded-xl transition-all duration-300 hover:border-orange-200 hover:shadow-md hover:shadow-orange-500/5 group-active:scale-95">
        
        {/* Иконка звезды в оранжевом цвете */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-orange-500 transition-transform group-hover:rotate-12">
           <path 
             d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
             fill="currentColor" 
           />
        </svg>

        {/* Сумма баланса */}
        <div className="flex items-center gap-1">
          <span className="text-gray-900 font-black text-sm tracking-tight">
            {user.balance?.toLocaleString() ?? 0}
          </span>
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
            HC
          </span>
        </div>

        {/* Кнопка плюса (пополнить) */}
        <div className="ml-1 w-6 h-6 rounded-lg bg-gray-900 flex items-center justify-center text-white transition-colors group-hover:bg-orange-500 shadow-sm">
          <HiPlus className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
};