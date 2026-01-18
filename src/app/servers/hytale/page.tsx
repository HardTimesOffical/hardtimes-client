import ServerList from "../ServersList";
import DashboardLayout from "@/app/components/dashboard/dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Сервера Hytale | Мониторинг и Топ серверов Hytale",
  description: "Откройте для себя лучшие сервера Hytale в нашем мониторинге. Рейтинги, отзывы, актуальный онлайн и поиск по категориям. Добавьте свой проект в топ!",
  keywords: ["сервера hytale", "hytale servers", "мониторинг hytale", "хайтал сервера", "список серверов hytale"],
  openGraph: {
    title: "Топ серверов Hytale — Найди свой проект",
    description: "Рейтинг и список лучших игровых площадок Hytale.",
    url: "https://serverswamp.ru/hytale", // замени на реальный адрес
    siteName: "MinePromo",
    images: [
      {
        url: "/icons/Hytale_Logo.png", // или специальное промо-изображение
        width: 800,
        height: 600,
      },
    ],
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Сервера Hytale | Лучшие проекты",
    description: "Актуальный список и мониторинг серверов Hytale.",
  },
};

export default function HytaleServersPage() {
  return (
    <DashboardLayout showHero={true}>
      {/* 1. Добавляем items-center для центровки по горизонтали */}
      <div className="list-con flex flex-col items-center w-full">
        
        {/* 2. Убеждаемся, что здесь есть mx-auto, если задана максимальная ширина */}
        <div className="flex flex-row justify-between max-w-[1000px] mb-3 items-center w-full px-2 mx-auto">
          <div className="flex items-center gap-4">
            <img 
              className="w-16 h-auto object-contain" 
              src="/icons/Hytale_Logo.png" 
              alt="Hytale Logo" 
            />
            <h1 className="text-2xl font-bold text-white uppercase tracking-wider">
              Hytale Servers
            </h1>
          </div>
          <span className="bg-purple-600 text-white text-[10px] px-2 py-1 rounded font-bold animate-pulse">
            COMING SOON
          </span>
        </div>
        
        {/* 3. Обернем список серверов в контейнер с центровкой, если внутри ServerList нет своей центровки */}
        <div className="w-full flex justify-center">
             <ServerList game="hytale" />
        </div>

      </div>
    </DashboardLayout>  
  );
}