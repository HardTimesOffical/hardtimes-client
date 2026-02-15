import Sidebar from "@/app/components/dashboard/dashboard"; 
import ServerList from "../ServersList";
import ServerFilters from "@/app/components/servercard/ServerFilters";
import HeroSection from "@/app/components/header/HeroSection";
import { Metadata } from "next";
import PromoBanner from "@/app/components/blocks/PromoBanner";
import ForumPosts from "@/app/components/blocks/ForumPosts";
import { WeeklyLeaderboard } from "@/app/components/dashboard/WeeklyLeaderboard";

export const metadata: Metadata = {
  title: "Сервера Майнкрафт Java Edition — ТОП мониторинг и IP адреса",
  description: "Список лучших серверов Minecraft Java Edition. Удобный поиск по версиям, актуальный онлайн и честный рейтинг.",
};

export default async function JavaServersPage({ searchParams }: { searchParams: Promise<any> }) {
  const params = await searchParams;

  // Унифицированная ширина мониторинга
  const containerWidth = "max-w-[1132px]";

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-200">
      <Sidebar />
      
      {/* Добавлена адаптивная компенсация Sidebar (md:pl-16 lg:pl-20) */}
      <main className="flex-1 flex flex-col items-center min-w-0 transition-all duration-300">
        <HeroSection />

        {/* ГЛАВНЫЙ ЦЕНТРИРОВАННЫЙ КОНТЕЙНЕР */}
        <div className={`w-full ${containerWidth} px-4 sm:px-6 lg:px-8 py-10 mx-auto`}>
          
          {/* ВЕРХНИЙ БЛОК: Заголовок, Реклама и Фильтры */}
          <div className="flex flex-col gap-6 md:gap-8 mb-10">
            <header>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-surface border border-border rounded-xl shadow-sm">
                   <img className="w-6 h-6" src="/icons/java.svg" alt="Java Icon" />
                </div>
                <h1 className="text-xl md:text-xl font-black text-foreground-bright tracking-tighter uppercase leading-none">
                  Minecraft <span className="text-green-500">Java</span> Edition
                </h1>
              </div>
              <p className="text-xs md:text-sm text-muted font-medium max-w-2xl ml-1">
                Лучшие классические сервера для ПК. Выбирай версию, проверяй онлайн и заходи играть.
              </p>
            </header>

            <section className="relative z-30 flex flex-col gap-6">
              <PromoBanner />
              <ServerFilters />
            </section>
          </div>

          {/* НИЖНИЙ БЛОК: Сетка контента (Список + Форум) */}
          <div className="flex flex-col lg:flex-row items-start gap-8">
            
            {/* Левая колонка: Список серверов (Приоритет order-1 на мобильных) */}
            <div className="flex-1 w-full min-w-0 order-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-4 bg-green-500" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted">Java_Servers</h2>
              </div>
              
              <div className="relative z-10">
                <ServerList 
                  filters={{
                    version: params.version,
                    category: params.category,
                    lang: params.lang
                  }} 
                  sort={params.sort || "rating"}
                  game="java" 
                />
              </div>
            </div>

            {/* Правая колонка: Форум (order-2 — уходит под список на мобильных) */}
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