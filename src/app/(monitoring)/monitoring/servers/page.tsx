import Sidebar from "../../../components/dashboard/dashboard";
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
    url: "https://hardmonitoring.ru/monitoring/servers",
    type: "website",
  },
};

export default function ServersPage() {
  return (
    /* Внешний контейнер: теперь использует фоновый цвет темы */
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-200">
      
      {/* 1. Навигация слева */}
      <Sidebar />

      {/* 2. Основная область контента с учетом ширины сайдбара */}
      <main className="flex-1 w-full relative overflow-x-hidden md:pl-20 transition-all duration-300">
        
        {/* Декоративная сетка (адаптивная) */}
        <div 
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" 
          style={{ 
            backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`, 
            backgroundSize: '30px 30px' 
          }} 
        />

        {/* Эффект свечения (акцентный оранжевый вместо синего) */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

        <section className="flex flex-col items-center w-full px-4 py-12 md:py-16 relative z-10">
          
          {/* Текстовый блок заголовка */}
          <div className="w-full max-w-[1000px] mb-10">
            {/* Убрали italic и перевели на яркий текст темы */}
            <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter uppercase text-foreground-bright">
              Game Server <span className="text-accent">Monitoring</span> <span className="text-muted">&</span> Analytics
            </h1>
            
            <p className="text-muted max-w-2xl text-base md:text-lg font-medium leading-relaxed">
              Explore the best servers for <span className="text-foreground-bright font-bold">Minecraft</span>, 
              <span className="text-foreground-bright font-bold"> Hytale</span>, and <span className="text-foreground-bright font-bold">VoxelCore</span> universes. 
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