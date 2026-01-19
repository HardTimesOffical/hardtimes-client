'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  HiOutlineHome, HiOutlineFire, HiOutlineCube, 
  HiOutlineDeviceMobile, HiOutlineLightningBolt,
  HiOutlineShoppingBag, HiOutlinePlusCircle,
  HiOutlineUser, HiOutlineLogout, HiX
} from 'react-icons/hi';

interface SidebarProps {
  isMobileOpen?: boolean;
  setIsMobileOpen?: (val: boolean) => void;
}

const Sidebar = ({ isMobileOpen, setIsMobileOpen }: SidebarProps) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  const mainItems = [
    { name: 'Главная', href: '/', icon: HiOutlineHome },
    { name: 'Новые сервера', href: '/servers/new', icon: HiOutlineFire, color: 'text-orange-500' },
  ];

  const gameItems = [
    { name: 'Java Edition', href: '/servers/java', icon: HiOutlineCube, color: 'text-green-500' },
    { name: 'Bedrock Edition', href: '/servers/bedrock', icon: HiOutlineDeviceMobile, color: 'text-blue-500' },
    { name: 'Hytale', href: '/servers/hytale', icon: HiOutlineLightningBolt, color: 'text-purple-500' },
  ];

  const otherItems = [
    { name: 'Магазин', href: '/shop', icon: HiOutlineShoppingBag },
    { name: 'Добавить сервер', href: '/workbench', icon: HiOutlinePlusCircle },
  ];

  return (
    <>
      {/* Оверлей — теперь виден только на мобилках */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[110] md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen?.(false)}
        />
      )}

      {/* ФАНТОМНЫЙ БЛОК УДАЛЕН, ЧТОБЫ УБРАТЬ ПУСТОТУ СПРАВА */}

      <aside 
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className={`
          fixed top-0 left-0 bottom-0 flex flex-col bg-white border-r border-gray-100 
          transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] z-[120]
          /* Ширина на мобилках и десктопе */
          ${isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}
          ${isExpanded ? 'md:w-64 shadow-2xl shadow-gray-200' : 'md:w-20'}
        `}
      >
        <button 
          onClick={() => setIsMobileOpen?.(false)}
          className="absolute top-4 right-4 p-2 md:hidden text-gray-400"
        >
          <HiX className="w-6 h-6" />
        </button>

        <div className="h-20 flex items-center px-5 shrink-0">
          <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center shrink-0 text-white font-black italic text-xl shadow-lg shadow-gray-200">
            H
          </div>
          <span className={`ml-4 font-black text-xl tracking-tighter text-gray-900 uppercase italic transition-all duration-300 ${isExpanded || isMobileOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 pointer-events-none'}`}>
            Hard<span className="text-orange-500">Times</span>
          </span>
        </div>

        <nav className="flex-1 flex flex-col gap-6 px-3 py-4 overflow-y-auto overflow-x-hidden scrollbar-hide">
          <div className="space-y-1">
            {mainItems.map((item) => (
              <SidebarLink key={item.href} item={item} isExpanded={isExpanded || isMobileOpen} isActive={pathname === item.href} />
            ))}
          </div>

          <div className="space-y-1">
            <p className={`text-[10px] font-black text-gray-300 uppercase tracking-widest ml-3 mb-2 transition-opacity ${isExpanded || isMobileOpen ? 'opacity-100' : 'opacity-0'}`}>
              Игры
            </p>
            {gameItems.map((item) => (
              <SidebarLink key={item.href} item={item} isExpanded={isExpanded || isMobileOpen} isActive={pathname === item.href} />
            ))}
          </div>

          <div className="space-y-1">
            {otherItems.map((item) => (
              <SidebarLink key={item.href} item={item} isExpanded={isExpanded || isMobileOpen} isActive={pathname === item.href} />
            ))}
          </div>
        </nav>

        <div className="p-3 border-t border-gray-50 bg-white shrink-0 overflow-hidden">
          {user ? (
            <div className={`flex items-center gap-3 p-2 rounded-2xl transition-all duration-300 ${isExpanded || isMobileOpen ? 'bg-gray-50' : 'bg-transparent'}`}>
              <Link href={`/profile/${user.username}`} className="shrink-0">
                <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-gray-100">
                  {user.avatar ? (
                    <img src={user.avatar} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-orange-500 to-yellow-400 flex items-center justify-center text-white font-bold uppercase">
                      {user.username?.charAt(0)}
                    </div>
                  )}
                </div>
              </Link>
              
              {/* Исправлен блок с текстом: whitespace-nowrap и overflow-hidden */}
              <div className={`flex flex-1 items-center justify-between min-w-0 transition-all duration-300 ${isExpanded || isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none translate-x-10'}`}>
                <div className="min-w-0 overflow-hidden pr-2">
                  <p className="text-xs font-black text-gray-900 truncate uppercase">{user.username}</p>
                  <p className="text-[10px] font-bold text-orange-500 uppercase whitespace-nowrap">
                    {user.balance || 0} звезд
                  </p>
                </div>
                <button onClick={() => logout()} className="p-2 text-gray-400 hover:text-red-500 shrink-0">
                  <HiOutlineLogout className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login" className={`flex items-center gap-4 p-3 rounded-2xl text-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-all ${isExpanded || isMobileOpen ? 'px-4' : 'justify-center'}`}>
              <HiOutlineUser className="w-6 h-6 shrink-0" />
              <span className={`font-black text-sm uppercase transition-opacity ${isExpanded || isMobileOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>Войти</span>
            </Link>
          )}
        </div>
      </aside>
    </>
  );
};

const SidebarLink = ({ item, isExpanded, isActive }: any) => {
  const Icon = item.icon;
  return (
    <Link 
      href={item.href} 
      className={`
        flex items-center p-3 rounded-2xl transition-all duration-200 group relative
        ${isActive ? 'bg-gray-900 text-white shadow-lg shadow-gray-200' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'}
        ${isExpanded ? 'gap-4 px-4' : 'justify-center'}
      `}
    >
      <Icon className={`w-6 h-6 shrink-0 ${isActive ? 'text-white' : item.color || 'group-hover:text-gray-900'}`} />
      <span className={`font-bold text-sm tracking-tight whitespace-nowrap transition-all duration-300 ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 absolute pointer-events-none'}`}>
        {item.name}
      </span>
    </Link>
  );
};

export default Sidebar;