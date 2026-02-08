"use client";

import Link from 'next/link';
import { HiPaperAirplane, HiMegaphone } from 'react-icons/hi2';

export default function PromoBanner() {
  const config = {
    title: "BestDev",
    tagline: "СТУДИЯ РАЗРАБОТКИ",
    subtitle: "реализация любых идей: от плагинов и ботов до хостинга серверов",
    buttonText: "Перейти в Telegram",
    tgLink: "https://t.me/bestdevstudio",
    advertiseLink: "https://t.me/SamuraiMFG",
    stats: [
      { label: "заказов", value: "99+" },
      { label: "отзывов", value: "99+" },
      { label: "работ", value: "99+" },
    ]
  };

  return (
    <div className="w-full mb-8">
      <Link 
        href={config.tgLink}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block w-full overflow-hidden rounded-2xl shadow-2xl bg-[#080808] group border border-white/10"
      >
        {/* --- ВИЗУАЛЬНЫЙ ФОН: МАЙНКРАФТ ИНЖЕНЕРИЯ --- */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Сетка чанков */}
          <div className="absolute inset-0 opacity-[0.05]" 
               style={{ backgroundImage: 'radial-gradient(#FFD700 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />

          {/* Технический узел справа (Пиксельные блоки) */}
          <div className="absolute right-0 top-0 h-full w-1/2 overflow-hidden">
            {/* Большая "шестерня" из блоков */}
            <div className="absolute right-12 top-1/2 -translate-y-1/2 w-40 h-40 opacity-20 group-hover:opacity-40 transition-opacity duration-700">
                {/* Внешний контур из пикселей */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 border-4 border-[#FFD700]" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-10 border-4 border-[#FFD700]" />
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 border-4 border-[#FFD700]" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 border-4 border-[#FFD700]" />
                {/* Центральное ядро */}
                <div className="absolute inset-10 border-2 border-[#FFD700] rotate-45 animate-[spin_10s_linear_infinite]" />
                <div className="absolute inset-14 bg-[#FFD700]/40" />
            </div>

            {/* Редстоун-сигнал (Линии) */}
            <svg className="absolute inset-0 w-full h-full opacity-20">
              <path d="M50,20 L150,20 L150,150 L250,150" stroke="#FFD700" strokeWidth="2" fill="none" strokeDasharray="8 4" />
              <circle cx="50" cy="20" r="3" fill="#FFD700" className="animate-pulse" />
              <circle cx="250" cy="150" r="3" fill="#FFD700" />
            </svg>
          </div>

          {/* Плавающие блоки кода/модов слева */}
          <div className="absolute left-10 top-1/2 -translate-y-1/2 space-y-2 opacity-10">
            <div className="w-12 h-2 bg-[#FFD700]" />
            <div className="w-8 h-2 bg-[#FFD700]" />
            <div className="w-16 h-2 bg-white" />
          </div>
        </div>

        {/* --- КОНТЕНТ БАННЕРА --- */}
        <div className="relative w-full min-h-[190px] md:min-h-[220px] p-6 md:p-10 flex flex-col md:flex-row justify-between items-center z-10 gap-8">
          
          {/* ТЕКСТОВАЯ ГРУППА */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="relative inline-block">
              <h2 className="text-5xl md:text-7xl font-[1000] text-white tracking-tighter uppercase leading-none">
                {config.title}<span className="text-[#FFD700]">.</span>
              </h2>
              <div className="mt-2 flex items-center gap-2">
                <span className="bg-[#FFD700] text-black text-[9px] font-black px-1.5 py-0.5 rounded-sm">PRO</span>
                <span className="text-[#FFD700] text-[11px] font-black tracking-[0.4em] uppercase">
                  {config.tagline}
                </span>
              </div>
            </div>

            {/* СТАТИСТИКА (Пиксельный стиль) */}
            <div className="flex justify-center md:justify-start gap-8 mt-8">
              {config.stats.map((stat, i) => (
                <div key={i} className="relative pl-4 border-l-2 border-[#FFD700]/30">
                  <span className="block text-white text-xl md:text-2xl font-black leading-none">{stat.value}</span>
                  <span className="block text-gray-500 text-[9px] uppercase font-bold tracking-widest mt-1">{stat.label}</span>
                </div>
              ))}
            </div>

            <p className="text-gray-500 text-[10px] md:text-[11px] font-bold max-w-[340px] leading-tight mt-6 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1 h-1 bg-[#FFD700] rounded-full animate-ping" />
              {config.subtitle}
            </p>
          </div>

          {/* ГРУППА ДЕЙСТВИЯ */}
          <div className="flex flex-col items-center md:items-end gap-6">
            {/* Технологический индикатор (Слоты модов) */}
            <div className="hidden lg:flex gap-1">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className={`w-6 h-6 border ${i === 2 ? 'bg-[#FFD700] border-[#FFD700]' : 'border-white/10 bg-white/5'}`} />
                ))}
            </div>

            <div className="relative group/btn">
                {/* Свечение кнопки */}
                <div className="absolute -inset-1 bg-[#FFD700] rounded-xl blur opacity-20 group-hover/btn:opacity-40 transition duration-500" />
                
                <div className="relative inline-flex items-center gap-4 px-10 py-5 bg-[#FFD700] hover:bg-white text-black rounded-xl font-[1000] text-xs transition-all duration-300 active:scale-95 uppercase tracking-widest shadow-2xl">
                    <HiPaperAirplane size={18} className="rotate-45" />
                    {config.buttonText}
                </div>
            </div>
            
            <div className="text-right flex flex-col items-center md:items-end">
                <span className="text-gray-600 text-[8px] font-black tracking-[0.3em] uppercase">Development Environment</span>
                <span className="text-[#FFD700] text-[10px] font-black tracking-[0.1em] mt-0.5">@bestdevsbot</span>
            </div>
          </div>
        </div>

        {/* Полоска опыта (Exp Bar) внизу */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
            <div className="h-full bg-gradient-to-r from-[#FFD700] to-[#b8860b] w-2/3 shadow-[0_0_15px_#FFD700] relative">
                <div className="absolute right-0 top-0 h-full w-20 bg-white/20 animate-[pulse_1s_infinite]" />
            </div>
        </div>
      </Link>

      {/* КНОПКА РЕКЛАМЫ */}
      <div className="mt-3 flex justify-end px-2">
        <Link 
          href={config.advertiseLink}
          className="flex items-center gap-2 text-[10px] font-black text-white/20 hover:text-[#FFD700] transition-all uppercase tracking-[0.3em] group"
        >
          <HiMegaphone size={14} className="opacity-30 group-hover:opacity-100 group-hover:animate-bounce" />
          Заказать рекламу на сайте
        </Link>
      </div>
    </div>
  );
}