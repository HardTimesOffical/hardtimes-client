import { Metadata } from "next";
import DashboardLayout from "./components/dashboard/dashboard";
import ServerList from "./servers/ServersList";

export const metadata: Metadata = {
  title: "Мониторинг серверов Майнкрафт — Топ список Java и Bedrock",
  description: "Актуальный список серверов Minecraft. Рейтинг, онлайн, версии и описание лучших проектов для игры с друзьями.",
  openGraph: {
    title: "ServerSwamp — Все сервера Minecraft в одном месте",
    description: "Найди свой идеальный сервер прямо сейчас!",
  }
};

export default function Home() {
  return (
    <DashboardLayout>
      {/* 1. Создаем центрирующий контейнер */}
      <div className="w-full flex justify-center px-4">
        
        {/* 2. Ограничиваем ширину контента (например, 1000px или 1200px) */}
        <div className="w-full max-w-[1000px] pt-[12px]">
          
          {/* Если на главной нужен заголовок, добавь его здесь */}
          <h1 className="text-2xl font-bold mb-6 text-white uppercase hidden md:block">
            Top Rated Servers
          </h1>

          <ServerList game="all" />
        </div>
        
      </div>
    </DashboardLayout>
  );
}