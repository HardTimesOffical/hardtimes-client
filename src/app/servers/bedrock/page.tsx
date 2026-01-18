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
    <DashboardLayout showHero={true}>
      {/* Добавляем flex flex-col items-center для центровки контента */}
      <div className="list-con flex flex-col items-center w-full px-4">
        
        {/* Ограничиваем ширину заголовка и центрируем его */}
        <div className="w-full max-w-[1000px]">
          <h1 className="text-2xl font-bold mb-4 tracking-tight text-white text-left uppercase">
            Minecraft Bedrock Edition Servers
          </h1>  
        </div>
        
        {/* Контейнер для списка серверов с центровкой контента внутри */}
        <div className="min-h-screen w-full flex justify-center">
          <div className="w-full max-w-[1000px]">
            <ServerList game="bedrock" />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}