"use client"
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export const HeaderBalance = () => {
  const { user } = useAuth();

  // Если юзера нет, компонент просто ничего не рендерит
  if (!user) return null;

  return (
    <Link href="/shop" className="group flex items-center">
      <div className="flex items-center gap-3 bg-zinc-900/40 border border-zinc-800 px-3 py-1.5 rounded-xl transition-all duration-200">
        <svg width="16" height="16" fill="none" className="text-zinc-500">
           <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
        </svg>
        <div className="flex items-center gap-1.5">
          <span className="text-zinc-100 font-semibold text-sm">
            {user.balance?.toLocaleString() ?? 0}
          </span>
          <span className="text-[10px] font-bold text-zinc-500 uppercase">HC</span>
        </div>
        <div className="ml-1 w-5 h-5 rounded-md bg-zinc-800 flex items-center justify-center text-zinc-400">
          +
        </div>
      </div>
    </Link>
  );
};