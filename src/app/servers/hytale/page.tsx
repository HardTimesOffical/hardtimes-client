import Sidebar from "@/app/components/dashboard/dashboard"; // Твой новый независимый Sidebar
import ServerList from "../ServersList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Сервера Hytale | Мониторинг и Топ серверов Hytale",
  description: "Откройте для себя лучшие сервера Hytale в нашем мониторинге. Рейтинги, отзывы, актуальный онлайн и поиск по категориям.",
  keywords: ["сервера hytale", "hytale servers", "мониторинг hytale", "хайтал сервера"],
  openGraph: {
    title: "Топ серверов Hytale — Найди свой проект",
    description: "Рейтинг и список лучших игровых площадок Hytale.",
    url: "https://serverswamp.ru/hytale",
    siteName: "HardMonitoring",
    images: [{ url: "/icons/Hytale_Logo.png", width: 800, height: 600 }],
    locale: "ru_RU",
    type: "website",
  },
};

export default function HytaleServersPage() {
  return (
    /* Внешний контейнер в новой архитектуре Sidebar + Main */
    <div className="flex min-h-screen bg-[#0d0a16] text-white">
      
      {/* 1. Боковое меню */}
      <Sidebar />

      {/* 2. Основная область контента */}
      <main className="flex-1 w-full relative overflow-hidden">
        
        {/* Магическое фиолетовое свечение (атмосфера Hytale) */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[10%] w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex flex-col items-center w-full px-4 py-12 md:py-20 relative z-10">
          
          {/* Заголовок и Логотип */}
          <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-[1000px] mb-12 gap-6 bg-white/5 p-8 rounded-[2rem] border border-white/10 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <img 
                className="w-24 h-auto object-contain drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]" 
                src="/icons/Hytale_Logo.png" 
                alt="Hytale Logo" 
              />
              <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic">
                  Hytale <span className="text-purple-500">Servers</span>
                </h1>
                <p className="text-gray-400 text-sm font-medium mt-1">Будь первым в новом мире приключений</p>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="bg-purple-600 shadow-[0_0_20px_rgba(147,51,234,0.3)] text-white text-[10px] px-4 py-1.5 rounded-full font-black animate-pulse tracking-widest">
                COMING SOON
              </span>
            </div>
          </div>
          
          {/* Список серверов */}
          <div className="w-full max-w-[1000px] min-h-[400px]">
            <div className="flex items-center justify-center p-10 border-2 border-dashed border-white/5 rounded-[2rem] mb-6">
               <p className="text-gray-500 text-center italic">
                 Раздел находится в режиме ожидания запуска игры. <br/> 
                 Здесь появятся первые сервера сразу после выхода беты.
               </p>
            </div>
            
            {/* Если есть предзаполненные сервера или анонсы */}
            <ServerList game="hytale" />
          </div>

        </div>
      </main>
    </div>
  );
}