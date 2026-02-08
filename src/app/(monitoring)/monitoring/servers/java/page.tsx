import Sidebar from "@/app/components/dashboard/dashboard"; 
import ServerList from "../ServersList";
import ServerFilters from "@/app/components/servercard/ServerFilters";
import HeroSection from "@/app/components/header/HeroSection";
import { Metadata } from "next";
import PromoBanner from "@/app/components/blocks/PromoBanner";

export const metadata: Metadata = {
  title: "Сервера Майнкрафт Java Edition — ТОП мониторинг и IP адреса",
  description: "Список лучших серверов Minecraft Java Edition. Удобный поиск по версиям, актуальный онлайн, подробные описания и честный рейтинг. Найди свой идеальный сервер!",
  keywords: [
    "сервера майнкрафт java edition",
    "мониторинг серверов java",
    "ip адреса серверов майнкрафт",
    "minecraft java servers",
    "лучшие сервера майнкрафт"
  ],
  alternates: {
    canonical: "https://hardmonitoring.ru/monitoring/servers/java",
  },
  openGraph: {
    title: "Мониторинг серверов Minecraft Java Edition",
    description: "Рейтинг, онлайн и лучшие игровые проекты в одном списке.",
    url: "https://hardmonitoring.ru/monitoring/servers/java",
    type: "website",
    siteName: "HardMonitoring"
  },
};

export default async function JavaServersPage({ searchParams }: { searchParams: any }) {
  const filters = await searchParams;

  return (
    // bg-background вместо #f8f9fa
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-200">
      
      {/* 1. Боковое меню */}
      <Sidebar />

      {/* 2. Основной контент (добавили md:pl-20 для компенсации Sidebar) */}
      <main className="flex-1 flex flex-col items-center min-w-0 transition-all duration-300">
        
        {/* Шапка страницы */}
        <HeroSection />

        <div className="w-full max-w-[1000px] px-4 md:px-6 py-10">
          
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              {/* Фон иконки: bg-surface и border-border */}
              <div className="p-2 bg-surface border border-border rounded-xl">
                 <img className="w-6 h-6" src="/icons/java.svg" alt="Java Icon" />
              </div>
              {/* Заголовок: убрали italic, добавили foreground-bright */}
              <h1 className="text-xl md:text-xl font-black text-foreground-bright tracking-tighter uppercase">
                Minecraft <span className="text-green-500">Java</span> Edition
              </h1>
            </div>
            <p className="text-muted font-medium max-w-2xl">
              Лучшие классические сервера для ПК. Выбирай версию, проверяй онлайн и заходи играть.
            </p>
          </header>

          <div className="flex flex-col gap-6">
            {/* Панель фильтров: убедись, что внутри неё используются bg-card и border-border */}
            <PromoBanner/>
            <ServerFilters />

            {/* Список серверов */}
            <div className="w-full">
              <ServerList filters={filters} game="java" />
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}