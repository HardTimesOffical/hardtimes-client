import Sidebar from "@/app/components/dashboard/dashboard";
import ServerList from "../ServersList";
import ServerFilters from "@/app/components/servercard/ServerFilters";
import PromoBanner from "@/app/components/blocks/PromoBanner";
import ForumPosts from "@/app/components/blocks/ForumPosts";
import HeroSection from "@/app/components/header/HeroSection";
import { Metadata } from "next";
import { WeeklyLeaderboard } from "@/app/components/dashboard/WeeklyLeaderboard";


export const metadata: Metadata = {
  title: "Сервера Майнкрафт Бедрок (PE) — ТОП мониторинг серверов Bedrock Edition",
  description: "Самый актуальный список серверов Minecraft Bedrock Edition (PE). Сортировка по онлайну, версиям и режимам.",
};

export default async function BedrockServersPage({ searchParams }: { searchParams: any }) {
  const filters = await searchParams;

  // Наша золотая ширина для контента
  const containerWidth = "max-w-[1132px]";

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-200">
      <Sidebar />

      <main className="flex-1 w-full relative overflow-x-hidden transition-all duration-300">
        
        {/* 1. HERO SECTION — Первый и свободный */}
        <HeroSection />

        {/* 2. ОСНОВНОЙ КОНТЕНТ — Центрированный контейнер */}
        <div className="flex flex-col items-center w-full px-4 py-10 relative z-10">
          
          {/* ВЕРХНИЙ БЛОК: Заголовок раздела, Реклама и Фильтры */}
          <div className={`w-full ${containerWidth} flex flex-col gap-10 mb-10`}>
            
            {/* Специфичный заголовок для Bedrock (как в твоем примере) */}
            <header className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-surface border border-border rounded-xl shadow-sm">
                   <img className="w-5 h-5 md:w-6 md:h-6" src="/icons/bedrock.svg" alt="Bedrock Icon" />
                </div>
                <h1 className="text-xl md:text-2xl font-[1000] text-foreground-bright tracking-tighter uppercase leading-none italic">
                  Minecraft <span className="text-accent">Bedrock</span>
                </h1>
              </div>
              <p className="text-xs md:text-sm text-muted font-medium max-w-2xl leading-relaxed ml-1">
                Лучшие сервера для мобильных устройств (iOS/Android) и Windows. 
                Играй на популярных портах в самом удобном мониторинге.
              </p>
            </header>

            <div className="flex flex-col gap-6">
              <PromoBanner />
              <ServerFilters />
            </div>
          </div>

          {/* НИЖНИЙ БЛОК: Сетка (Сервера + Форум) */}
          <div className={`w-full ${containerWidth} flex flex-col lg:flex-row items-start gap-8`}>
            
            {/* СПИСОК СЕРВЕРОВ */}
            <div className="flex-1 w-full min-w-0 order-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-4 bg-accent" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted">Pocket_Edition_Nodes</h2>
              </div>
              
              <div className="relative z-10">
                <ServerList filters={filters} game="bedrock" />
              </div>
            </div>

            {/* САЙДБАР: Форум */}
              <aside className="w-full flex flex-col gap-5 lg:w-[280px] shrink-0 order-2">
                 <ForumPosts />
                 <WeeklyLeaderboard/>
              </aside>
          </div>
        </div>
      </main>
    </div>
  );
}