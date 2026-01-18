import { Metadata } from "next";
import DashboardLayout from "./components/dashboard/dashboard";
import ServerList from "./servers/ServersList";
import ServerFilters from "./components/servercard/ServerFilters";

export const metadata: Metadata = {
  title: "Мониторинг серверов Майнкрафт — Топ список Java и Bedrock",
  description: "Актуальный список серверов Minecraft. Рейтинг, онлайн, версии и описание лучших проектов для игры с друзьями.",
  openGraph: {
    title: "HardTimes — Все сервера Minecraft в одном месте",
    description: "Найди свой идеальный сервер прямо сейчас!",
  }
};
export default async function Home({ searchParams }: { searchParams: any }) {
  // Важно: в Next.js 15 searchParams это Promise
  const filters = await searchParams;

  return (
    <DashboardLayout showHero={true}>
      {/* 1. Создаем центрирующий контейнер */}
      <div className="w-full flex justify-center px-4 mainContainer">
        
        {/* 2. Ограничиваем ширину контента (например, 1000px или 1200px) */}
        <div className="w-full max-w-[1000px] pt-[12px]">
          
          {/* Если на главной нужен заголовок, добавь его здесь */}
          <h1 className="text-2xl font-bold mb-4 text1 tracking-tight uppercase">
            Top Rated Servers
          </h1>
          <ServerFilters/>

          <ServerList filters={filters} game="all" />
        </div>
        
      </div>
    </DashboardLayout>
  );
}