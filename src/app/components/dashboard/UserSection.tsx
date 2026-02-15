'use client';
import Link from "next/link";
import { HiOutlineUser} from "react-icons/hi2";
import { HiOutlineLogout } from "react-icons/hi";

interface UserSectionProps {
  user: any;
  isSidebarOpen: boolean;
  logout: () => void;
}

export default function UserSection({ user, isSidebarOpen, logout }: UserSectionProps) {
  return (
    <div className="p-2 border-t border-border mt-auto shrink-0">
      {user ? (
        <div className="relative flex items-center group">
          {/* Ссылка на профиль */}
          <Link 
            href="/profile" 
            className={`flex flex-1 items-center gap-2 p-1.5 rounded-xl transition-all hover:bg-surface-light ${
              isSidebarOpen ? 'bg-surface' : 'justify-center'
            }`}
          >
            {/* Аватар */}
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-[10px] text-white font-bold shrink-0 relative overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} className="w-full h-full object-cover" alt="avatar" />
              ) : (
                user.username?.charAt(0).toUpperCase()
              )}
              <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 border-2 border-card rounded-full" />
            </div>

            {/* Инфо (только если открыт сайдбар) */}
            {isSidebarOpen && (
              <div className="flex flex-1 items-center justify-between min-w-0 pr-7"> 
                <div className="truncate pr-1">
                  <p className="text-[10px] font-black truncate uppercase text-foreground-bright leading-tight">
                    {user.username}
                  </p>
                  <p className="text-[8px] font-bold text-accent uppercase">
                    {user.balance || 0} звезд
                  </p>
                </div>
              </div>
            )}
          </Link>

          {/* Кнопка выхода (вне Link, но позиционирована поверх) */}
          {isSidebarOpen && (
            <button 
              onClick={(e) => {
                e.preventDefault(); // На всякий случай
                logout();
              }} 
              className="absolute right-2 text-muted hover:text-red-500 transition-colors shrink-0 p-1 z-10"
              title="Выйти"
            >
              <HiOutlineLogout className="w-3.5 h-3.5"/>
            </button>
          )}
        </div>
      ) : (
        /* Кнопка входа */
        <Link 
          href="/login" 
          className="flex items-center gap-2 p-2 rounded-lg bg-accent text-white justify-center shadow-lg hover:opacity-90 active:scale-95 transition-all"
        >
          <HiOutlineUser className="w-4 h-4 shrink-0" />
          {isSidebarOpen && <span className="font-black text-[9px] uppercase tracking-wider">Войти</span>}
        </Link>
      )}
    </div>
  );
}