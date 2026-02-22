'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HiPaperAirplane, HiMegaphone } from 'react-icons/hi2';

export default function PromoBanner() {
  const SLIDE_DURATION = 8000; // 8 секунд на слайд
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);

  const slides = [
    {
      id: 1,
      style: 'gold',
      title: "BestDev",
      tagline: "СТУДИЯ РАЗРАБОТКИ",
      subtitle: "реализация любых идей: от плагинов и ботов до хостинга серверов",
      buttonText: "В ТЕЛЕГРАМ",
      link: "https://t.me/bestdevstudio",
      accentColor: "#FFD700",
      botName: "@bestdevsbot",
      stats: [
        { label: "ЗАКАЗОВ", value: "99+" },
        { label: "ОТЗЫВОВ", value: "99+" },
        { label: "РАБОТ", value: "99+" },
      ]
    },
    {
      id: 2,
      style: 'military',
      title: "Eternal Rage",
      tagline: "САМЫЙ ВАЙБОВЫЙ СЕРВЕР",
      subtitle: "Ультимативный микс классики и кастома ⚔️ Честная анархия, продвинутые механики и ничего лишнего. Заходи и доминируй!",
      buttonText: "ИГРАТЬ",
      link: "https://t.me/EternalRageSrv",
      accentColor: "#dc2626",
      botName: "СЕРВЕР: E_RAGE",
      bgImage: "https://cdna.artstation.com/p/assets/images/images/042/400/690/large/mariana-salimena-swamp-b-artstation.jpg?1634406924", 
      stats: [
        { label: "АПТАЙМ", value: "100%" },
        { label: "ПИНГ", value: "НИЗКИЙ" },
      ]
    }
  ];

  // Выбор случайного слайда при первой загрузке
  useEffect(() => {
    setCurrentSlide(Math.floor(Math.random() * slides.length));
  }, [slides.length]);

  // Логика прогресс-бара и автопереключения
  useEffect(() => {
    setProgress(0); // Сброс полоски при смене слайда
    
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const currentProgress = (elapsedTime / SLIDE_DURATION) * 100;

      if (currentProgress >= 100) {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        setProgress(0);
      } else {
        setProgress(currentProgress);
      }
    }, 50); // Обновление каждые 50мс для плавности

    return () => clearInterval(interval);
  }, [currentSlide, slides.length]);

  const handleManualSwitch = (index: number) => {
    setCurrentSlide(index);
    setProgress(0);
  };

  return (
    <div className="w-full mb-6 relative group/carousel">
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#080808] shadow-xl">
        <div 
          className="flex transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1)" 
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div key={slide.id} className={`w-full shrink-0 relative ${slide.style === 'military' ? 'font-mono' : ''}`}>
              <Link 
                href={slide.link}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block w-full group/slide overflow-hidden"
              >
                
                {/* --- ФОНОВЫЙ ДЕКОР --- */}
                <div className="absolute inset-0 z-0">
                  {slide.style === 'military' ? (
                    <>
                      <img src={slide.bgImage} alt="" className="w-full h-full object-cover opacity-60 grayscale group-hover/slide:grayscale-0 transition-all duration-1000" />
                      <div className="absolute inset-0 bg-gradient-to-l from-black via-black/80 to-transparent" />
                      <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />
                      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-red-600/50" />
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `radial-gradient(${slide.accentColor} 0.5px, transparent 0.5px)`, backgroundSize: '24px 24px' }} />
                      <div className="absolute right-0 top-0 h-full w-1/2 overflow-hidden">
                        <div className="absolute right-8 top-1/2 -translate-y-1/2 w-32 h-32 opacity-10 group-hover/slide:opacity-30 transition-opacity duration-700">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 border-2" style={{ borderColor: slide.accentColor }} />
                          <div className="absolute inset-8 border rotate-45 animate-[spin_12s_linear_infinite]" style={{ borderColor: slide.accentColor }} />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* --- КОНТЕНТ --- */}
                <div className={`relative w-full min-h-[160px] p-6 flex flex-col md:flex-row justify-between items-center z-10 gap-6 
                  ${slide.style === 'military' ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className={`flex flex-col items-center text-center 
                    ${slide.style === 'military' ? 'md:items-end md:text-right' : 'md:items-start md:text-left'}`}
                  >
                    <div className="relative inline-block">
                      <h2 className={`text-4xl md:text-5xl font-[1000] text-white tracking-tighter uppercase leading-none 
                        ${slide.style === 'military' ? 'italic' : ''}`}
                      >
                        {slide.title}<span style={{ color: slide.accentColor }}>.</span>
                      </h2>
                      <div className={`mt-1 flex items-center gap-2 ${slide.style === 'military' ? 'justify-end' : ''}`}>
                        <span style={{ backgroundColor: slide.accentColor }} className="text-black text-[8px] font-black px-1 py-0.5 rounded-sm">PRO</span>
                        <span style={{ color: slide.accentColor }} className="text-[10px] font-black tracking-[0.3em] uppercase">
                          {slide.tagline}
                        </span>
                      </div>
                    </div>

                    <div className={`flex justify-center gap-6 mt-4 ${slide.style === 'military' ? 'md:flex-row-reverse' : ''}`}>
                      {slide.stats.map((stat, i) => (
                        <div key={i} className={`relative pl-3 border-l-2`} style={{ borderColor: `${slide.accentColor}${slide.style === 'military' ? '' : '4d'}` }}>
                          <span className="block text-white text-lg md:text-xl font-black leading-none">{stat.value}</span>
                          <span className="block text-gray-500 text-[8px] uppercase font-bold tracking-widest mt-0.5">{stat.label}</span>
                        </div>
                      ))}
                    </div>

                    <p className={`text-gray-500 text-[9px] font-bold max-w-[350px] leading-tight mt-4 uppercase tracking-wider flex items-center gap-2 
                      ${slide.style === 'military' ? 'text-white/40 border-r border-red-600/30 pr-2 border-l-0 flex-row-reverse' : ''}`}
                    >
                      {slide.style !== 'military' && <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: slide.accentColor }} />}
                      {slide.subtitle}
                    </p>
                  </div>

                  <div className={`flex flex-col items-center gap-4 ${slide.style === 'military' ? 'md:items-start' : 'md:items-end'}`}>
                    <div className="relative group/btn">
                      <div className="absolute -inset-1 rounded-lg blur opacity-10 group-hover/btn:opacity-30 transition duration-500" style={{ backgroundColor: slide.accentColor }} />
                      <div 
                        style={{ 
                          backgroundColor: slide.style === 'military' ? 'transparent' : slide.accentColor,
                          border: slide.style === 'military' ? `1px solid ${slide.accentColor}` : 'none'
                        }}
                        className={`relative inline-flex items-center gap-3 px-8 py-3 rounded-lg font-[1000] text-[10px] transition-all duration-300 active:scale-95 uppercase tracking-widest shadow-xl
                          ${slide.style === 'military' ? 'text-white hover:bg-red-600 rounded-none' : 'hover:bg-white text-black'}`}
                      >
                        <HiPaperAirplane size={14} className={slide.style === 'military' ? '-rotate-135' : 'rotate-45'} />
                        {slide.buttonText}
                      </div>
                    </div>
                    <span style={{ color: slide.accentColor }} className={`text-[9px] font-black tracking-[0.1em] ${slide.style === 'military' ? 'opacity-40' : ''}`}>
                      {slide.botName}
                    </span>
                  </div>
                </div>

                {/* --- ДИНАМИЧЕСКИЙ ПРОГРЕСС-БАР --- */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5 z-20">
                  <div 
                    className="h-full transition-all duration-75 ease-linear shadow-[0_0_15px]" 
                    style={{ 
                      width: `${progress}%`, 
                      backgroundColor: slide.accentColor, 
                      boxShadow: `0 0 10px ${slide.accentColor}` 
                    }} 
                  />
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* ИНДИКАТОРЫ */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-30">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => handleManualSwitch(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentSlide === i ? 'w-8 bg-white' : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* НИЖНЯЯ КНОПКА */}
      <div className="mt-2 flex justify-end px-1">
        <Link 
          href="https://t.me/SamuraiMFG"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.05] text-[9px] font-black text-white/50 hover:text-white hover:bg-white/5 transition-all uppercase tracking-[0.2em] group"
        >
          <HiMegaphone size={12} className="group-hover:animate-shake group-hover:text-red-500" />
          РЕКЛАМНЫЙ КАБИНЕТ
        </Link>
      </div>
    </div>
  );
}