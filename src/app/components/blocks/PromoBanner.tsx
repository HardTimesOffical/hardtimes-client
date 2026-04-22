"use client";

import React from 'react';
import Link from 'next/link';
import { FaDownload } from 'react-icons/fa';

export default function PromoBanner() {
  return (
    <div className="w-full mb-6 select-none px-2 sm:px-0">
      <div className="relative w-full min-h-[110px] bg-[#0a0a0a] border border-[#1a1a1a] flex flex-wrap items-center justify-between p-4 sm:p-6 overflow-hidden">
        
        {/* Зеленая полоска слева */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]" />

        {/* Левый блок: Название и описание */}
        <div className="flex flex-col z-10 min-w-fit">
          <h2 className="text-2xl sm:text-3xl font-[950] text-white tracking-tighter uppercase leading-none">
            HARDLAUNCHER<span className="text-green-500">.</span>
          </h2>
          <p className="text-[10px] sm:text-[11px] font-medium text-neutral-500 mt-1 uppercase tracking-tight">
            Твой путь в мир кубов начинается здесь
          </p>
        </div>

        {/* Средний блок: Характеристики (скрываются на мобилках, если места мало) */}
        <div className="hidden md:flex items-center gap-6 px-6 border-l border-neutral-900 mx-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-neutral-200 uppercase">Авто</span>
            <span className="text-[9px] font-bold text-neutral-600 uppercase">Сборки</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-neutral-200 uppercase">Free</span>
            <span className="text-[9px] font-bold text-neutral-600 uppercase">Доступ</span>
          </div>
        </div>

        {/* Правый блок: Кнопка и Реклама */}
        <div className="flex flex-col items-end gap-2 z-10 ml-auto">
          <Link 
            href="/ru/launcher" 
            className="bg-[#22c55e] hover:bg-[#16a34a] text-white px-5 py-2.5 text-xs font-black uppercase flex items-center gap-2 transition-all active:translate-y-[2px] shadow-[0_3px_0_rgb(21,128,61)] active:shadow-none"
          >
            Играть <FaDownload className="text-[10px]" />
          </Link>
          
          <Link 
            href="https://t.me/constdev" 
            target="_blank"
            className="text-[9px] font-bold text-neutral-700 hover:text-green-500 uppercase transition-colors"
          >
            Разместить рекламу
          </Link>
        </div>

        {/* Фоновый шум для стиля */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>
    </div>
  );
}