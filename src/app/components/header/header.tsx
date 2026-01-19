"use client";
import React from "react";
import styles from "./header.module.css";
import { HeaderBalance } from "./HeaderBalance";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { HiMenuAlt2 } from 'react-icons/hi';

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuth();

  return (
    /* md:left-20 гарантирует, что шапка начинается там, где кончается свернутый Sidebar */
    <header className="fixed top-0 right-0 left-0 md:left-20 h-16 md:h-20 bg-black/30 backdrop-blur-md z-[90] transition-all duration-300">
      <div className="h-full max-w-[1400px] mx-auto px-4 md:px-8 flex items-center justify-between">
        
        {/* Левая часть: Бургер и Лого */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="p-2 bg-gray-50 rounded-xl text-gray-900 active:scale-95 transition-all hover:bg-gray-100 md:hidden"
            aria-label="Открыть меню"
          >
            <HiMenuAlt2 className="w-6 h-6" />
          </button>
          
          <Link href="/" className="shrink-0 transition-transform hover:scale-105 active:scale-95">
            <img src="/icons/logo.png" alt="logo" className="h-7 md:h-9 w-auto object-contain"/>
          </Link>
        </div>

        {/* Правая часть: Баланс и Профиль */}
        <div className="flex items-center gap-3 md:gap-6">
          {user ? (
            <>
              <div className="hidden sm:block">
                <HeaderBalance />
              </div>
              
              <Link href={`/profile/${user.username}`} className="relative group">
                <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl overflow-hidden border-2 border-transparent group-hover:border-orange-500 transition-all shadow-sm">
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-orange-500 to-yellow-400 flex items-center justify-center text-white font-bold text-sm">
                      {user.username?.[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </Link>
            </>
          ) : (
            <Link href="/login" className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-orange-500 transition-all shadow-lg shadow-gray-200">
              <span>Войти</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}