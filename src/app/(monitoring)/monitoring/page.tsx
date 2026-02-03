import { Metadata } from "next";
import Sidebar from "@/app/components/dashboard/dashboard"; 
import ServerList from "./servers/ServersList";
import ServerFilters from "@/app/components/servercard/ServerFilters";
import HeroSection from "@/app/components/header/HeroSection";

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
    /* Используем bg-background и убираем жесткий цвет */
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-200 main-layout-root">
      
      {/* 1. Левое меню */}
      <Sidebar />

      {/* 2. Основная область: md:pl-20 для корректного отступа от узкого сайдбара */}
      <main className="flex-1 flex flex-col items-center min-w-0 transition-all duration-300">
        
        {/* Обновленный HeroSection (уже с pt-18 и адаптивной темой) */}
        <HeroSection />

        {/* Контентная часть */}
        <div className="w-full max-w-[1000px] px-4 md:px-6 pt-10 pb-20">
          
          <div className="flex flex-col gap-8">
            <header className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                {/* Декоративная полоска слева от заголовка в стиле GitHub */}
                <div className="w-1 h-8 bg-accent rounded-full" />
                <h1 className="text-xl font-[1000] text-foreground-bright tracking-tighter uppercase leading-none" translate="no">
                  Топ <span translate="no" className="text-accent">Серверов</span>
                </h1>
              </div>
              <p className="text-muted text-sm font-medium ml-4">
                Лучшие игровые площадки, выбранные сообществом HardMonitoring
              </p>
            </header>

            {/* Панель фильтров */}
            <div className="relative z-30">
              <ServerFilters />
            </div>

            {/* Список серверов */}
            <div className="w-full">
              <ServerList filters={filters} game="all" />
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}