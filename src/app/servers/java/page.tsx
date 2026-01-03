import ServerList from "../ServersList";
import DashboardLayout from "@/app/components/dashboard/dashboard";
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
    canonical: "https://yourdomain.com/java", // Замените на ваш домен
  },
  openGraph: {
    title: "Мониторинг серверов Minecraft Java Edition",
    description: "Рейтинг, онлайн и лучшие игровые проекты в одном списке.",
    url: "https://yourdomain.com/java",
    type: "website",
    siteName: "Ваше Название"
  },
};

export default function JavaServersPage() {
  return (
    <DashboardLayout>
      <div className="list-con">
        {/* Семантический заголовок с акцентом на платформу */}
        <h1 className="text-2xl font-bold mb-4 tracking-tight">
          Minecraft Java Edition Servers
        </h1>
        
        {/* Компонент списка с фильтрацией под Java */}
        <div className="w-full">
          <ServerList game="java" />
        </div>
      </div>
    </DashboardLayout>
  );
}