"use client";

import Link from 'next/link';
import { HiPaperAirplane, HiMegaphone } from 'react-icons/hi2';

export default function PromoBanner() {
  const config = {
    title: "BestDev",
    tagline: "СТУДИЯ РАЗРАБОТКИ",
    subtitle: "реализация любых идей: от плагинов и ботов до хостинга серверов",
    buttonText: "В Telegram", // Немного сократил для компактности
    tgLink: "https://t.me/bestdevstudio",
    advertiseLink: "https://t.me/SamuraiMFG",
    stats: [
      { label: "заказов", value: "99+" },
      { label: "отзывов", value: "99+" },
      { label: "работ", value: "99+" },
    ]
  };

  return (
    <div className="w-full mb-6"> {/* Уменьшил mb-8 -> mb-6 */}
      <Link 
        href={config.tgLink}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block w-full overflow-hidden rounded-xl shadow-xl bg-[#080808] group border border-white/10"
      >
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 opacity-[0.05]" 
               style={{ backgroundImage: 'radial-gradient(#FFD700 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
          
          <div className="absolute right-0 top-0 h-full w-1/2 overflow-hidden">
            <div className="absolute right-8 top-1/2 -translate-y-1/2 w-32 h-32 opacity-10 group-hover:opacity-30 transition-opacity duration-700">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 border-2 border-[#FFD700]" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 border-2 border-[#FFD700]" />
                <div className="absolute inset-8 border border-[#FFD700] rotate-45 animate-[spin_12s_linear_infinite]" />
            </div>
          </div>
        </div>
        <div className="relative w-full min-h-[140px] md:min-h-[160px] p-4 md:p-6 flex flex-col md:flex-row justify-between items-center z-10 gap-4">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="relative inline-block">
              <h2 className="text-4xl md:text-5xl font-[1000] text-white tracking-tighter uppercase leading-none">
                {config.title}<span className="text-[#FFD700]">.</span>
              </h2>
              <div className="mt-1 flex items-center gap-2">
                <span className="bg-[#FFD700] text-black text-[8px] font-black px-1 py-0.5 rounded-sm">PRO</span>
                <span className="text-[#FFD700] text-[10px] font-black tracking-[0.3em] uppercase">
                  {config.tagline}
                </span>
              </div>
            </div>

            <div className="flex justify-center md:justify-start gap-6 mt-4">
              {config.stats.map((stat, i) => (
                <div key={i} className="relative pl-3 border-l-2 border-[#FFD700]/30">
                  <span className="block text-white text-lg md:text-xl font-black leading-none">{stat.value}</span>
                  <span className="block text-gray-500 text-[8px] uppercase font-bold tracking-widest mt-0.5">{stat.label}</span>
                </div>
              ))}
            </div>

            <p className="text-gray-500 text-[9px] font-bold max-w-[300px] leading-tight mt-4 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-1 bg-[#FFD700] rounded-full shrink-0" />
              {config.subtitle}
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="relative group/btn">
                <div className="absolute -inset-1 bg-[#FFD700] rounded-lg blur opacity-10 group-hover/btn:opacity-30 transition duration-500" />
                
                {/* Кнопка стала компактнее: px-10 py-5 -> px-6 py-3 */}
                <div className="relative inline-flex items-center gap-3 px-6 py-3 bg-[#FFD700] hover:bg-white text-black rounded-lg font-[1000] text-[10px] transition-all duration-300 active:scale-95 uppercase tracking-widest shadow-xl">
                    <HiPaperAirplane size={14} className="rotate-45" />
                    {config.buttonText}
                </div>
            </div>
            
            <div className="text-right flex flex-col items-center md:items-end">
                <span className="text-[#FFD700] text-[9px] font-black tracking-[0.1em]">@bestdevsbot</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white/5">
            <div className="h-full bg-[#FFD700] w-2/3 shadow-[0_0_10px_#FFD700]" />
        </div>
      </Link>
      <div className="mt-2 flex justify-end px-1">
        <Link 
          href={config.advertiseLink}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05] text-[9px] font-black text-white/50 hover:text-white hover:bg-[#FFD700]/10 hover:border-[#FFD700]/30 transition-all uppercase tracking-[0.2em] group"
        >
          <div className="relative flex items-center justify-center">
            <HiMegaphone size={12} className="group-hover:text-[#FFD700] group-hover:animate-shake relative z-10" />
            <span className="absolute inset-0 bg-[#FFD700] rounded-full blur-sm opacity-0 group-hover:opacity-20 animate-ping" />
          </div>
          Заказать рекламу
        </Link>
      </div>
    </div>
  );
}