// app/page.tsx
import { Metadata } from "next";
import DashboardLayout from "./components/dashboard/dashboard";
import ServerList from "./servers/ServersList";

// Метаданные теперь будут работать, так как компонент серверный
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
    <div className="flex min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <DashboardLayout>
        <div style={{ paddingTop: 12 }}>
          {/* ServerList должен сам внутри себя быть 'use client', если он использует стейты */}
          <ServerList game="all" />
        </div>
      </DashboardLayout>
    </div>
  );
}