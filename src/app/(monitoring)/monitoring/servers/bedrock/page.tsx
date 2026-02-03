import Sidebar from "@/app/components/dashboard/dashboard";
import ServerList from "../ServersList";
import HeroSection from "@/app/components/header/HeroSection";
import { Metadata } from "next";

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
    canonical: "https://hardmonitoring.ru/monitoring/servers/bedrock",
  },
  openGraph: {
    title: "ТОП Серверов Minecraft Bedrock Edition",
    description: "Реальный онлайн, лучшие режимы и честный рейтинг Bedrock серверов.",
    url: "https://hardmonitoring.ru/monitoring/servers/bedrock",
    type: "website",
  },
};

export default function BedrockServersPage() {
  return (
    /* Используем bg-background для адаптивности */
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-200">
      
      {/* 1. Навигация слева */}
      <Sidebar />

      {/* 2. Основная область: md:pl-20 чтобы контент не перекрывался сайдбаром */}
      <main className="flex-1 flex flex-col items-center min-w-0 transition-all duration-300">
        
        {/* Шапка (Hero) — теперь она на всю ширину до сайдбара */}
        <HeroSection />

        <div className="w-full max-w-[1000px] px-4 md:px-6 py-10">
          
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              {/* Используем системный фон поверхности для иконки */}
              <div className="p-2 bg-surface border border-border rounded-xl shadow-sm">
                 <img className="w-6 h-6" src="/icons/bedrock.svg" alt="Bedrock Icon" />
              </div>
              {/* Заголовок: text-foreground-bright для максимального контраста */}
              <h1 className="text-2xl md:text-4xl font-[1000] text-foreground-bright tracking-tighter uppercase leading-none">
                Minecraft <span className="text-accent">Bedrock</span> Edition
              </h1>
            </div>
            <p className="text-muted font-medium max-w-2xl leading-relaxed">
              Лучшие сервера для мобильных устройств (iOS/Android) и Windows 10. 
              Играй с друзьями на самых популярных портах.
            </p>
          </header>

          {/* Список серверов */}
          <div className="w-full">
             {/* ServerList теперь будет использовать bg-card из глобальных стилей */}
             <ServerList game="bedrock" />
          </div>
          
        </div>
      </main>
    </div>
  );
}