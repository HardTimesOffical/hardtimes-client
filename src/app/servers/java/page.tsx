import Sidebar from "@/app/components/dashboard/dashboard"; // Твой новый Sidebar
import ServerList from "../ServersList";
import ServerFilters from "@/app/components/servercard/ServerFilters";
import HeroSection from "@/app/components/header/HeroSection";
import { Metadata } from "next";

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
    canonical: "https://hardmonitoring.ru/servers/java",
  },
  openGraph: {
    title: "Мониторинг серверов Minecraft Java Edition",
    description: "Рейтинг, онлайн и лучшие игровые проекты в одном списке.",
    url: "https://hardmonitoring.ru/servers/java",
    type: "website",
    siteName: "HardMonitoring"
  },
};

export default async function JavaServersPage({ searchParams }: { searchParams: any }) {
  // В Next.js 15 searchParams — это Promise
  const filters = await searchParams;

  return (
    <div className="flex min-h-screen bg-[#f8f9fa]">
      {/* 1. Боковое меню */}
      <Sidebar />

      {/* 2. Основной контент */}
      <main className="flex-1 flex flex-col items-center min-w-0">
        
        {/* Заменяем проп showHero={true} прямой вставкой компонента */}
        <HeroSection />

        <div className="w-full max-w-[1000px] px-4 md:px-6 py-10">
          
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-600/10 rounded-lg">
                 <img className="w-6 h-6" src="/icons/java.svg" alt="Java Icon" />
              </div>
              <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tighter uppercase italic">
                Minecraft <span className="text-green-600">Java</span> Edition
              </h1>
            </div>
            <p className="text-gray-500 font-medium max-w-2xl">
              Лучшие классические сервера для ПК. Выбирай версию, проверяй онлайн и заходи играть.
            </p>
          </header>

          <div className="flex flex-col gap-6">
            {/* Панель фильтров */}
            <ServerFilters />

            {/* Список серверов с фильтром по Java */}
            <div className="list-con w-full">
              <ServerList filters={filters} game="java" />
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}