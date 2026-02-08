"use client";

import Link from 'next/link';
import { HiPaperAirplane } from 'react-icons/hi2';

export default function PromoBanner() {
  const config = {
    buttonText: "Перейти в Telegram",
    tgLink: "https://t.me/bestdevstudio", 
    imagePath: "/banner/banner1.png", 
  };

  return (
    <div className="w-full mb-8">
      <Link 
        href={config.tgLink}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block w-full overflow-hidden rounded-2xl shadow-xl bg-gray-900"
      >
        <div className="relative w-full aspect-[1280/482] min-h-[160px]">
          
          {/* 1. Фоновое фото */}
          <img 
            src={config.imagePath} 
            alt="Banner" 
            className="absolute inset-0 w-full h-full object-contain md:object-cover z-0"
          />
          
          {/* Градиент внизу для выделения кнопки */}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* 2. Контент (Желтая кнопка) */}
          <div className="absolute inset-0 z-20 p-3 md:p-6 flex flex-col justify-end items-center md:items-start">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 md:px-7 md:py-4 bg-[#FFD700] hover:bg-[#FFC400] text-black rounded-xl font-[900] text-xs md:text-sm shadow-lg transition-colors duration-300 active:opacity-90 w-auto justify-center uppercase tracking-wider">
              <HiPaperAirplane size={18} className="rotate-45 text-black" />
              {config.buttonText}
            </div>
          </div>

          {/* Иконка Telegram в углу (только для десктопа) */}
          <div className="absolute top-4 right-4 z-20 opacity-40 hidden md:block">
              <svg className="w-8 h-8 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.72-2.49 2.77-2.71.01-.03.01-.14-.06-.2-.07-.06-.17-.04-.24-.02-.11.02-1.83 1.16-5.16 3.42-.49.33-.93.5-1.33.49-.44-.01-1.28-.25-1.9-.45-.77-.24-1.37-.37-1.32-.79.03-.21.32-.43.88-.66 3.45-1.5 5.75-2.5 6.89-2.99 3.28-1.4 3.96-1.64 4.41-1.65.1 0 .32.02.46.14.12.1.15.24.16.34z"/>
              </svg>
          </div>
        </div>
      </Link>
    </div>
  );
}