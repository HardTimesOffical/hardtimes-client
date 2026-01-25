import Sidebar from "@/app/components/dashboard/dashboard"; // Твой новый независимый Sidebar
import ServerList from "../ServersList";
import HeroSection from "@/app/components/header/HeroSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Сервера Майнкрафт Бедрок (PE) — ТОП мониторинг серверов Bedrock Edition",
  description: "Самый актуальный список серверов Minecraft Bedrock Edition (PE). Сортировка по онлайну, версиям и режимам. Найди лучший сервер для игры на телефоне или ПК!",
  keywords: [
    "сервера майнкрафт бедрок", 
    "minecraft bedrock servers", 
    "мониторинг серверов mcpe", 
    "сервера майнкрафт пе", 
    "рейтинг серверов бедрок"
  ],
  alternates: {
    canonical: "https://hardmonitoring.ru/hardmonitoring/servers/bedrock", // Обновил домен
  },
  openGraph: {
    title: "ТОП Серверов Minecraft Bedrock Edition",
    description: "Реальный онлайн, лучшие режимы и честный рейтинг Bedrock серверов.",
    url: "https://hardmonitoring.ru/hardmonitoring/servers/bedrock",
    type: "website",
  },
};

export default function BedrockServersPage() {
  return (
    /* Внешний контейнер: Sidebar + Контент */
    <div className="flex min-h-screen bg-[#f8f9fa]">
      
      {/* 1. Навигация слева */}
      <Sidebar />

      {/* 2. Основная область */}
      <main className="flex-1 flex flex-col items-center min-w-0">
        
        {/* Шапка (Hero) */}
        <HeroSection />

        <div className="w-full max-w-[1000px] px-4 md:px-6 py-10">
          
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                 {/* Иконка Bedrock */}
                 <img className="w-6 h-6" src="/icons/bedrock.svg" alt="Bedrock Icon" />
              </div>
              <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tighter uppercase italic">
                Minecraft <span className="text-orange-500">Bedrock</span> Edition
              </h1>
            </div>
            <p className="text-gray-500 font-medium max-w-2xl leading-relaxed">
              Лучшие сервера для мобильных устройств (iOS/Android) и Windows 10. 
              Играй с друзьями на самых популярных портах.
            </p>
          </header>

          {/* Список серверов */}
          <div className="list-con w-full">
             <ServerList game="bedrock" />
          </div>
          
        </div>
      </main>
    </div>
  );
}