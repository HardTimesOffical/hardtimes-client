'use client'

import React from 'react';
import Link from 'next/link';
import { HiOutlineCode, HiArrowLeft, HiOutlineLightBulb } from 'react-icons/hi';

export default function Maintenance() {
  return (
    // Обертка на весь экран с очень светлым серым фоном
    <div className="flex flex-col items-center pt-25 justify-center min-h-screen bg-[#f8f9fa] px-6 text-center">
      
      {/* Основная карточка */}
      <div className="w-full max-w-xl bg-white border border-gray-100 p-12 rounded-[40px] shadow-sm">
        
        {/* Анимированная иконка с мягким свечением */}
        <div className="relative mb-8 flex justify-center">
          <div className="absolute w-24 h-24 bg-orange-500/10 blur-2xl rounded-full animate-pulse" />
          <div className="relative w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center text-orange-500 border border-orange-100">
            <HiOutlineCode className="w-10 h-10 animate-bounce" />
          </div>
        </div>

        {/* Заголовок и текст */}
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 uppercase italic tracking-tighter mb-4">
          Раздел в <span className="text-orange-500">разработке</span>
        </h1>
        
        <p className="text-gray-500 font-medium mb-10 leading-relaxed">
          Мы создаем нечто крутое! Этот раздел библиотеки контента скоро станет доступен для всех игроков.
        </p>

        {/* Мини-инфо блоки */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-left">
            <HiOutlineLightBulb className="w-5 h-5 text-orange-500" />
            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Моды и паки</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-left">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">ЛАПКИ УСТАЛИ НО МЫ ПРОДОЛЖАЕМ РАЗРАБОТКУ</span>
          </div>
        </div>

        {/* Кнопка — теперь она основной темный акцент на светлом фоне */}
        <Link 
          href="/"
          className="inline-flex items-center gap-3 px-10 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-500 transition-all duration-300 shadow-xl shadow-gray-200"
        >
          <HiArrowLeft className="w-4 h-4" />
          Вернуться назад
        </Link>
      </div>
      
      {/* Копирайт внизу страницы */}
      <p className="mt-8 text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
        HardTimes &copy; 2026
      </p>
    </div>
  );
}