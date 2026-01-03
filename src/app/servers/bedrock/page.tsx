import ServerList from "../ServersList";
import DashboardLayout from "@/app/components/dashboard/dashboard";
import { Metadata } from "next";

// Улучшенная метадата для SEO Bedrock серверов
export const metadata: Metadata = {
  title: "Сервера Майнкрафт Бедрок (PE) — ТОП мониторинг серверов Bedrock Edition",
  description: "Самый актуальный список серверов Minecraft Bedrock Edition (PE). Сортировка по онлайну, версиям и режимам. Найди лучший сервер для игры на телефоне или ПК!",
  keywords: [
    "сервера майнкрафт бедрок", 
    "minecraft bedrock servers", 
    "мониторинг серверов mcpe", 
    "сервера майнкрафт пе", 
    "рейтинг серверов бедрок"
  ],
  alternates: {
    canonical: "https://yourdomain.com/servers/bedrock", // Замени на свой домен
  },
  openGraph: {
    title: "ТОП Серверов Minecraft Bedrock Edition",
    description: "Реальный онлайн, лучшие режимы и честный рейтинг Bedrock серверов.",
    url: "https://yourdomain.com/servers/bedrock",
    type: "website",
  },
};

export default function BedrockServersPage() {
  return (
    <DashboardLayout>
      <div className="list-con">
        {/* H1 — главный фактор для SEO на странице */}
        <h1 className="text-2xl font-bold mb-4 tracking-tight text-white">
          Minecraft Bedrock Edition Servers
        </h1>  
        
        {/* Контейнер для списка серверов */}
        <div className="min-h-screen">
          <ServerList game="bedrock" />
        </div>
      </div>
    </DashboardLayout>
  );
}