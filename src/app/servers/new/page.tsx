import Sidebar from "@/app/components/dashboard/dashboard"; // Путь к новому Sidebar
import ServerList from "../ServersList";
import ServerFilters from "@/app/components/servercard/ServerFilters";
import HeroSection from "@/app/components/header/HeroSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Новые сервера Майнкрафт — Свежие проекты",
  description: "Список только что добавленных серверов Minecraft. Будь первым на новом сервере!",
};

export default async function NewServersPage({ searchParams }: { searchParams: any }) {
  // В Next.js 15 searchParams — это Promise
  const filters = await searchParams;

  return (
    <div className="flex min-h-screen bg-[#f8f9fa]">
      {/* 1. Навигация слева */}
      <Sidebar />

      {/* 2. Основная область */}
      <main className="flex-1 flex flex-col items-center min-w-0">
        
        {/* Воспроизводим поведение showHero={true} */}
        <HeroSection />

        <div className="w-full max-w-[1000px] px-4 md:px-6 py-8">
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-green-500 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider animate-pulse">
                New
              </span>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight uppercase italic">
                New Minecraft <span className="text-green-600">Servers</span>
              </h1>
            </div>
            <p className="text-gray-500 font-medium">
              Самые свежие проекты, добавленные в наш мониторинг за последние 24 часа.
            </p>
          </header>

          <div className="flex flex-col gap-6">
            <ServerFilters />
            
            {/* Контейнер для списка с сортировкой по новизне */}
            <div className="list-con">
              <ServerList filters={filters} game="all" sort="new" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}