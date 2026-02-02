'use client'

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GAME_PLATFORMS } from '@/constants/project';

export default function ContentPage() {
  return (
    <div className="min-h-screen bg-white p-6 md:p-12 text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Шапка раздела */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-10">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic flex items-center gap-3">
              <span className="w-2 h-10 bg-orange-500"></span>
              Библиотека <span className="text-orange-500">игр</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-3">
              Выберите платформу для просмотра модификаций и ресурсов
            </p>
          </div>
          
          <div className="bg-slate-50 px-4 py-2 rounded border border-slate-100">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Всего платформ: {GAME_PLATFORMS.length}
            </span>
          </div>
        </header>

        {/* Сетка игр (Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {GAME_PLATFORMS.map((game) => (
            <Link key={game.id} href={`/content/${game.id}`}>
              <motion.div
                whileHover={{ y: -2 }}
                className="group relative flex flex-col bg-white border border-slate-200 rounded-xl p-4 transition-all hover:border-orange-500/50 hover:bg-slate-50/50"
              >
                {/* Место под ЛОГОТИП */}
                <div className="aspect-square w-full mb-4 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center overflow-hidden transition-all group-hover:bg-white">
                {/* Проверяем game.icon, так как в типе именно он */}
                {game.icon && game.icon.startsWith('http') ? (
                    <img 
                    src={game.icon} 
                    alt={game.label} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                ) : (
                    <span className="text-4xl grayscale group-hover:grayscale-0 transition-all">
                    {game.icon}
                    </span>
                )}
                </div>

                {/* Инфо */}
                <div className="flex flex-col gap-1">
                  <h3 className="font-bold text-sm text-slate-900 uppercase tracking-tight group-hover:text-orange-600 transition-colors">
                    {game.label}
                  </h3>
                  <div className="flex items-center justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    <span>Перейти</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-orange-500">→</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Текстовая заглушка для большого количества */}
        <div className="mt-16 pt-8 border-t border-slate-50 flex justify-center">
            <div className="flex items-center gap-6 opacity-30">
                 <span className="h-[1px] w-20 bg-slate-400"></span>
                 <p className="text-[9px] font-black uppercase tracking-[0.4em]">HardTimes Repository</p>
                 <span className="h-[1px] w-20 bg-slate-400"></span>
            </div>
        </div>
      </div>
    </div>
  );
}