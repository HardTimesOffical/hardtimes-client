import Sidebar from "../../../components/dashboard/dashboard";
import ServerList from "./ServersList";
import ServerFilters from "@/app/components/servercard/ServerFilters";
import PromoBanner from "@/app/components/blocks/PromoBanner";
import ForumPosts from "@/app/components/blocks/ForumPosts";
import HeroSection from "@/app/components/header/HeroSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Мониторинг серверов Minecraft, Hytale & VoxelCore | Поиск игровых миров",
  description: "Единая платформа мониторинга воксельных игр. Найди лучшие сервера Minecraft...",
};

export default function ServersPage() {
  const containerWidth = "max-w-[1132px]";

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-200">
      <Sidebar />

      {/* Добавляем items-center здесь, чтобы Hero и Контент выравнивались по оси */}
      <main className="flex-1 w-full flex flex-col items-center relative overflow-x-hidden transition-all duration-300 md:pl-16 lg:pl-20">
        
        {/* 1. HERO SECTION — Растягиваем на весь main */}
        <div className="w-full">
           <HeroSection />
        </div>

        {/* 2. ОСНОВНОЙ КОНТЕНТ */}
        <div className="flex flex-col items-center w-full px-4 py-10 relative z-10">
          
          {/* ВЕРХНИЙ БЛОК: Реклама и Фильтры */}
          <div className={`w-full ${containerWidth} flex flex-col gap-10 mb-10`}>
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
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted">Active_Nodes</h2>
              </div>
              <ServerList game="all" />
            </div>

            {/* САЙДБАР: Форум */}
            <aside className="w-full lg:w-[280px] shrink-0 order-2 lg:sticky lg:top-6">
               <ForumPosts />
            </aside>

          </div>
        </div>
      </main>
    </div>
  );
}