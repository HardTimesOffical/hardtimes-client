import { Metadata } from "next";
import Sidebar from "./components/dashboard/dashboard"; // Импортируем новый независимый Sidebar
import ServerList from "./servers/ServersList";
import ServerFilters from "./components/servercard/ServerFilters";
import HeroSection from "./components/header/HeroSection";

export const metadata: Metadata = {
  title: "Мониторинг серверов Майнкрафт — Топ список Java и Bedrock",
  description: "Актуальный список серверов Minecraft. Рейтинг, онлайн, версии и описание лучших проектов для игры с друзьями.",
  openGraph: {
    title: "HardTimes — Все сервера Minecraft в одном месте",
    description: "Найди свой идеальный сервер прямо сейчас!",
  }
};

export default async function Home({ searchParams }: { searchParams: any }) {
  const filters = await searchParams;

  return (
    /* Внешний контейнер, который объединяет меню и контент */
    <div className="flex min-h-screen bg-[#f8f9fa] main-layout-root">
      
      {/* 1. Левое меню (Sidebar) */}
      <Sidebar />

      {/* 2. Основная рабочая область */}
      <main className="flex-1 flex flex-col items-center min-w-0">
        
        {/* HeroSection теперь вызывается здесь, если он нужен на главной */}
        <HeroSection />

        {/* Контентная часть с ограничением ширины */}
        <div className="w-full max-w-[1000px] px-4 md:px-6 pt-6 pb-20">
          
          <div className="flex flex-col gap-6">
            <header className="flex flex-col gap-2">
              <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase italic" translate="no">
                Топ <span translate="no" className="text-orange-500">Серверов</span>
              </h1>
              <p className="text-gray-500 text-sm font-medium">
                Лучшие сервера, выбранные сообществом
              </p>
            </header>

            {/* Фильтры */}
            <ServerFilters />

            {/* Список серверов */}
            <ServerList filters={filters} game="all" />
          </div>
          
        </div>
      </main>
    </div>
  );
}