"use client";
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { HiPlus } from 'react-icons/hi';

// Цвета MC-зелёного — те же что в Header
const GREEN       = '#5aac44';
const GREEN_DARK  = '#3c8527';
const GREEN_INNER = '#2a5e1a';

export const HeaderBalance = () => {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <Link href="/shop" className="group flex items-center no-underline">
      <div
        className="flex items-center gap-2 pl-2.5 pr-1 py-1
          border border-border bg-surface transition-all duration-150
          group-hover:border-[#3c8527] group-active:scale-95"
      >
        {/* Звезда */}
        <svg
          width="13" height="13" viewBox="0 0 24 24"
          fill={GREEN}
          className="shrink-0 transition-transform duration-150 group-hover:scale-110"
        >
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>

        {/* Баланс: font-standard — обычный читаемый шрифт */}
        <span
          className="font-standard font-black text-[13px] leading-none tracking-tight text-foreground-bright"
        >
          {user.balance?.toLocaleString('ru-RU') ?? 0}
        </span>

        {/* Единица измерения: мелкий пиксельный */}
        <span className="font-mc-pixel text-[9px] text-muted leading-none -ml-1">
          HC
        </span>

        {/* Кнопка пополнить */}
        <div
          className="w-5 h-5 flex items-center justify-center ml-1
            transition-all duration-150"
          style={{
            background: 'var(--border)',
            boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.08), inset -1px -1px 0 rgba(0,0,0,0.2)',
          }}
        >
          <HiPlus className="w-3 h-3 text-muted group-hover:text-white transition-colors" />
        </div>
      </div>
    </Link>
  );
};