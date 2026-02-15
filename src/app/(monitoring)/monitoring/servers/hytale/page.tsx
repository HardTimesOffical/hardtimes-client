import Sidebar from "@/app/components/dashboard/dashboard";
import ServerList from "../ServersList";
import { Metadata } from "next";
import PromoBanner from "@/app/components/blocks/PromoBanner";
import ForumPosts from "@/app/components/blocks/ForumPosts";
import ServerFilters from "@/app/components/servercard/ServerFilters";
import { WeeklyLeaderboard } from "@/app/components/dashboard/WeeklyLeaderboard";

export const metadata: Metadata = {
  title: "Сервера Hytale 2026 | Мониторинг Хайтейл",
  description: "Актуальный список игровых миров Hytale, рейтинг и онлайн 24/7.",
};

export default function HytaleServersPage() {
  const containerWidth = "max-w-[1132px]";

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-200 main-layout-root">
      <Sidebar />

      {/* md:pl-16 lg:pl-20 для отступа от сайдбара */}
      <main className="flex-1 w-full relative overflow-x-hidden transition-all duration-300">
        
        {/* Фоновое свечение */}
        <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-indigo-500/5 blur-[100px] pointer-events-none" />
        
        <div className="flex flex-col items-center w-full px-4 py-6 md:py-10 relative z-10">
          
          <div className={`w-full ${containerWidth} mx-auto`}>
            
            {/* ШАПКА: Лаконичная и адаптивная */}
            <div className="relative mb-8">
              <div className="relative bg-surface border border-border px-5 py-5 md:px-8 md:py-8 flex items-center justify-between overflow-hidden shadow-sm">
                
                <div className="flex items-center gap-4 md:gap-5">
                  <div className="relative shrink-0">
                    <img 
                      className="w-8 h-8 md:w-12 md:h-12 object-contain relative z-10 grayscale-[0.5] hover:grayscale-0 transition-all duration-500" 
                      src="/icons/Hytale_Logo.png" 
                      alt="Hytale" 
                    />
                  </div>
                  <h1 className="text-lg md:text-2xl font-[1000] uppercase tracking-tighter leading-none text-foreground-bright italic">
                    Hytale<span className="text-indigo-500">Servers</span>
                  </h1>
                </div>

                {/* Скрываем на совсем маленьких экранах для чистоты */}
                <div className="hidden sm:flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  <span className="text-[9px] md:text-[10px] font-black text-muted uppercase tracking-widest">Global Monitoring</span>
                </div>
              </div>
            </div>

            {/* ВЕРХ: Реклама и Фильтры */}
            <div className="flex flex-col gap-6 mb-8 md:mb-10">
              <div className="w-full overflow-hidden">
                <PromoBanner />
              </div>
              <ServerFilters />
            </div>

            {/* НИЖНИЙ БЛОК: Две колонки */}
            <div className="flex flex-col lg:flex-row items-start gap-6 md:gap-8">
              
              {/* Список серверов (Основная колонка) */}
              <div className="flex-1 w-full min-w-0 order-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-4 bg-indigo-500" />
                  <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted">Список серверов</h2>
                </div>
                
                <div className="relative min-h-[400px]">
                  <ServerList game="hytale" />
                </div>
              </div>

              {/* Сайдбар: Форум (На мобилках уходит под список) */}
              <aside className="w-full flex flex-col gap-5 lg:w-[280px] shrink-0 order-2">
                 <ForumPosts />
                 <WeeklyLeaderboard/>
              </aside>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}