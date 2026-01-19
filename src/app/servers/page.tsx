import Sidebar from "../components/dashboard/dashboard";// Используем новый независимый Sidebar
import ServerList from "./ServersList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Мониторинг серверов Minecraft, Hytale & VoxelCore | Поиск игровых миров",
  description: "Единая платформа мониторинга воксельных игр. Найди лучшие сервера Minecraft (Java/Bedrock), готовься к выходу Hytale и тестируй проекты на VoxelCore. Статистика онлайна и удобный поиск.",
  keywords: [
    "сервера майнкрафт", 
    "мониторинг hytale", 
    "voxelcore сервера", 
    "список серверов hytale", 
    "игровой мониторинг воксельных игр"
  ],
  openGraph: {
    title: "Multi-Game Server Monitoring | Minecraft, Hytale, VoxelCore",
    description: "Рейтинг и онлайн серверов для самых популярных воксельных проектов.",
    url: "https://hardmonitoring.ru/servers",
    type: "website",
  },
};

export default function ServersPage() {
  return (
    /* Внешний контейнер: Sidebar + Контент */
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">
      
      {/* 1. Навигация слева */}
      <Sidebar />

      {/* 2. Основная область контента */}
      <main className="flex-1 w-full relative overflow-x-hidden">
        
        {/* Декоративный эффект свечения на фоне (опционально) */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

        <section className="flex flex-col items-center w-full px-4 py-12 md:py-16 relative z-10">
          
          {/* Текстовый блок заголовка */}
          <div className="w-full max-w-[1000px] mb-10">
            <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter uppercase italic">
              Game Server <span className="text-blue-500">Monitoring</span> <span className="text-gray-600">&</span> Analytics
            </h1>
            
            <p className="text-gray-400 max-w-2xl text-base md:text-lg font-medium leading-relaxed">
              Explore the best servers for <span className="text-white">Minecraft</span>, 
              <span className="text-white"> Hytale</span>, and <span className="text-white">VoxelCore</span> universes. 
              Track real-time stats and join the top communities.
            </p>
          </div>

          {/* Список серверов */}
          <div className="w-full max-w-[1000px]">
            <ServerList game="all" />
          </div>

        </section>
      </main>
    </div>
  );
}