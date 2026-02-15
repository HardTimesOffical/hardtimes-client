import Sidebar from "@/app/components/dashboard/dashboard"; 
import ServerList from "../ServersList";
import ServerFilters from "@/app/components/servercard/ServerFilters";
import HeroSection from "@/app/components/header/HeroSection";
import { Metadata } from "next";
import PromoBanner from "@/app/components/blocks/PromoBanner";
import ForumPosts from "@/app/components/blocks/ForumPosts";

export const metadata: Metadata = {
  title: "Новые сервера Майнкрафт — Свежие проекты",
  description: "Список только что добавленных серверов Minecraft. Будь первым на новом сервере!",
};

export default async function NewServersPage({ searchParams }: { searchParams: any }) {
  const filters = await searchParams;

  // Наша унифицированная ширина: 1132px
  const containerWidth = "max-w-[1132px]";

  return (
    <div className="flex min-h-screen bg-background transition-colors duration-300">
      <Sidebar />

      {/* md:pl-16 lg:pl-20 гарантирует, что контент не залезет под сайдбар */}
      <main className="flex-1 flex flex-col items-center min-w-0 transition-all duration-300">
        <HeroSection />

        {/* ГЛАВНЫЙ ЦЕНТРИРОВАННЫЙ КОНТЕЙНЕР */}
        <div className={`w-full ${containerWidth} px-4 sm:px-6 lg:px-8 py-10 mx-auto`}>
          
          {/* ВЕРХНИЙ БЛОК: Заголовок, Реклама и Фильтры */}
          <div className="w-full flex flex-col gap-6 md:gap-8 mb-10">
            <header>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-xl">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">
                    Live Updates
                  </span>
                </div>
                <h1 className="text-xl md:text-2xl font-[1000] text-foreground-bright uppercase tracking-tighter italic leading-none">
                  New <span className="text-accent underline decoration-green-500/30">Servers</span>
                </h1>
              </div>
              <p className="text-xs md:text-sm text-muted font-bold uppercase tracking-tight opacity-80 max-w-2xl ml-1">
                Самые свежие проекты, добавленные в наш мониторинг за последнее время.
              </p>
            </header>

            <section className="relative z-20 flex flex-col gap-6">
              <PromoBanner />
              <ServerFilters />
            </section>
          </div>

          {/* НИЖНИЙ БЛОК: Две колонки */}
          <div className="flex flex-col lg:flex-row items-start gap-8">
            
            {/* Левая колонка: Список новых серверов */}
            <div className="flex-1 w-full min-w-0 order-1">
              {/* Небольшой визуальный разделитель */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-4 bg-green-500" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted">Recent_Deployments</h2>
              </div>

              <div className="relative z-10">
                <ServerList filters={filters} game="all" sort="new" />
              </div>
            </div>

            {/* Правая колонка: Форум (на мобилках снизу, на десктопе сбоку, не фиксирован) */}
            <aside className="w-full lg:w-[280px] shrink-0 order-2">
               <ForumPosts />
            </aside>

          </div>
        </div>
      </main>
    </div>
  );
}