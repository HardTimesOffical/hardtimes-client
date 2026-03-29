"use client";
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { HiPlus } from 'react-icons/hi';

// Новая палитра «Синегорск»
const BRAND_COLOR = '#84a98c'; 
const BORDER_COLOR = 'rgba(255, 255, 255, 0.08)';
const BG_GLASS = 'rgba(255, 255, 255, 0.03)';

export const HeaderBalance = () => {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <Link href="/shop" className="group flex items-center no-underline select-none">
      <div
        className="flex items-center gap-2 pl-2.5 pr-1.5 py-1.5
          border backdrop-blur-md transition-all duration-200
          group-hover:bg-white/[0.05] group-active:scale-95"
        style={{ 
          borderColor: BORDER_COLOR,
          backgroundColor: BG_GLASS
        }}
      >
        {/* Иконка валюты: Звезда с мягким свечением */}
        <div className="relative flex items-center justify-center">
          <svg
            width="11" height="11" viewBox="0 0 24 24"
            fill={BRAND_COLOR}
            className="shrink-0 transition-transform duration-300 group-hover:rotate-[15deg]"
            style={{ filter: `drop-shadow(0 0 4px ${BRAND_COLOR}66)` }}
          >
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        </div>

        {/* Значение баланса: Переведено на font-mc-pixel для стиля */}
        <div className="flex items-baseline gap-1">
          <span
            className="font-mc-pixel text-[11px] leading-none tracking-tight text-[#f2f2f2]"
          >
            {user.balance?.toLocaleString('ru-RU') ?? 0}
          </span>

          {/* Валюта (HC) — теперь еще меньше и прозрачнее */}
          <span className="font-mc-pixel text-[7px] text-[#7d8581] leading-none uppercase">
            HC
          </span>
        </div>

        {/* Кнопка "Плюс" — стала более минималистичной */}
        <div
          className="w-4 h-4 flex items-center justify-center ml-1
            border border-white/10 transition-all duration-200
            group-hover:border-[#84a98c]/40 group-hover:bg-[#84a98c]/10"
        >
          <HiPlus className="w-2.5 h-2.5 text-[#7d8581] group-hover:text-[#f2f2f2] transition-colors" />
        </div>
      </div>
    </Link>
  );
};