'use client';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { 
  HiPlus, 
  HiUser, 
  HiBars3BottomLeft 
} from 'react-icons/hi2';
import { useAuth } from '@/context/AuthContext';

interface MobileNavProps {
  onMenuClick: () => void;
}

export default function MobileNav({ onMenuClick }: MobileNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  // Показываем только в разделе форум
  if (!pathname.startsWith('/forum')) return null;

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] 
                    bg-[var(--background)]/95 backdrop-blur-md 
                    border-t border-[var(--border)] 
                    pb-safe shadow-[0_-8px_20px_rgba(0,0,0,0.05)]">
      
      <div className="flex items-center justify-around h-14">
        
        {/* 1. БУРГЕР (ОТКРЫТИЕ САЙДБАРА) */}
        <button 
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onMenuClick();
          }}
          className="flex flex-col items-center justify-center w-full h-full text-[var(--muted)] hover:text-blue-500 active:scale-90 transition-all"
        >
          <HiBars3BottomLeft className="w-6 h-6" />
          <span className="text-[8px] font-black uppercase mt-0.5 tracking-tighter">Меню</span>
        </button>

        {/* 2. СОЗДАТЬ */}
        <button 
          onClick={() => router.push('/forum/create-post')}
          className={`flex flex-col items-center justify-center w-full h-full transition-all ${
            isActive('/forum/create-post') ? 'text-blue-500' : 'text-[var(--muted)]'
          }`}
        >
          <HiPlus className="w-6 h-6" />
          <span className="text-[8px] font-black uppercase mt-0.5 tracking-tighter">Создать</span>
        </button>

        {/* 3. ПРОФИЛЬ */}
        <button 
          onClick={() => user ? router.push(`/profile/${user.username}`) : router.push('/login')}
          className={`flex flex-col items-center justify-center w-full h-full transition-all ${
            isActive('/profile') ? 'text-blue-500' : 'text-[var(--muted)]'
          }`}
        >
          {user?.avatar ? (
            <img 
              src={user.avatar} 
              className={`w-6 h-6 rounded-full object-cover border-2 ${
                isActive('/profile') ? 'border-blue-500' : 'border-transparent'
              }`} 
              alt="" 
            />
          ) : (
            <HiUser className="w-6 h-6" />
          )}
          <span className="text-[8px] font-black uppercase mt-0.5 tracking-tighter">Профиль</span>
        </button>

      </div>
    </nav>
  );
}