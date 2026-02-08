import Sidebar from "@/app/components/dashboard/dashboard"; 
import ServerList from "../ServersList";
import ServerFilters from "@/app/components/servercard/ServerFilters";
import HeroSection from "@/app/components/header/HeroSection";
import { Metadata } from "next";
import PromoBanner from "@/app/components/blocks/PromoBanner";

export const metadata: Metadata = {
  title: "Новые сервера Майнкрафт — Свежие проекты",
  description: "Список только что добавленных серверов Minecraft. Будь первым на новом сервере!",
};

export default async function NewServersPage({ searchParams }: { searchParams: any }) {
  // В Next.js 15 searchParams — это Promise
  const filters = await searchParams;

  return (
    <div className="flex min-h-screen bg-background transition-colors duration-300">
      {/* 1. Навигация слева */}
      <Sidebar />

      {/* 2. Основная область */}
      <main className="flex-1 flex flex-col items-center min-w-0">
        
        {/* Шапка сайта */}
        <HeroSection />

        <div className="w-full max-w-5xl px-4 md:px-8 py-10">
          
          {/* HEADER СЕКЦИИ */}
          <header className="mb-10">
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
              
              <h1 className="text-xl md:text-xl font-[1000] text-foreground-bright uppercase tracking-tighter italic">
                New <span className="text-accent underline decoration-green-500/30">Servers</span>
              </h1>
            </div>
            
            <p className="text-sm md:text-base text-muted font-bold uppercase tracking-tight opacity-80 max-w-2xl">
              Самые свежие проекты, добавленные в наш мониторинг. Будь первым, кто начнет историю на новом сервере.
            </p>
          </header>

          {/* КОНТЕНТ: Фильтры + Список */}
          <div className="flex flex-col gap-8">
            
            {/* Панель фильтров (теперь она сворачивается внутри компонента) */}
            <section className="relative z-20">
              <PromoBanner/>
              <ServerFilters />
            </section>
            
            {/* Основной список серверов */}
            <div className="relative z-10">
              <ServerList filters={filters} game="all" sort="new" />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}