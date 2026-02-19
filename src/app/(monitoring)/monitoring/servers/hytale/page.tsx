import Sidebar from "@/app/components/dashboard/dashboard";
import ServerList from "../ServersList";
import { Metadata } from "next";
import PromoBanner from "@/app/components/blocks/PromoBanner";
import ForumPosts from "@/app/components/blocks/ForumPosts";
import ServerFilters from "@/app/components/servercard/ServerFilters";
import { WeeklyLeaderboard } from "@/app/components/dashboard/WeeklyLeaderboard";
import YandexAds from "@/app/components/yandex/YandexAds";

export const metadata: Metadata = {
  title: "Сервера Hytale — Мониторинг, рейтинг и дата выхода Хайтейл",
  description: "Первый в СНГ мониторинг серверов Hytale. Актуальный список игровых миров, новости разработки и честный рейтинг. Будь первым, кто узнает об открытии серверов Хайтейл!",
  keywords: [
    "сервера hytale", 
    "хайтейл сервера", 
    "мониторинг hytale", 
    "дата выхода hytale", 
    "hytale новости", 
    "игра хайтейл"
  ],
  alternates: {
    canonical: 'https://hardmonitoring.ru/monitoring/hytale',
  },
};

export default function HytaleServersPage() {
  const containerWidth = "max-w-[1132px]";

  // Микроразметка для организации/сообщества
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Series",
    "name": "Мониторинг серверов Hytale",
    "description": "База данных и рейтинг серверов будущей игры Hytale",
    "publisher": {
      "@type": "Organization",
      "name": "HardTimes"
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-200 main-layout-root">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Sidebar />

      <main className="flex-1 w-full relative overflow-x-hidden transition-all duration-300">
        <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-indigo-500/5 blur-[100px] pointer-events-none" />
        
        <div className="flex flex-col items-center w-full px-4 py-6 md:py-10 relative z-10">
          <div className={`w-full ${containerWidth} mx-auto`}>
            
            {/* ШАПКА: Используем <header> */}
            <header className="relative mb-8">
              <div className="relative bg-surface border border-border px-5 py-5 md:px-8 md:py-8 flex items-center justify-between overflow-hidden shadow-sm rounded-2xl">
                <div className="flex items-center gap-4 md:gap-5">
                  <div className="relative shrink-0">
                    <img 
                      className="w-8 h-8 md:w-12 md:h-12 object-contain relative z-10 grayscale-[0.5] hover:grayscale-0 transition-all duration-500" 
                      src="/icons/Hytale_Logo.png" 
                      alt="Логотип игры Хайтейл" 
                    />
                  </div>
                  {/* H1 с ключевым словом на русском и английском */}
                  <h1 className="text-lg md:text-2xl font-[1000] uppercase tracking-tighter leading-none text-foreground-bright italic">
                    Сервера Hytale<span className="text-indigo-500"> / Хайтейл</span>
                  </h1>
                </div>

                <div className="hidden sm:flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  <span className="text-[9px] md:text-[10px] font-black text-muted uppercase tracking-widest italic">Ожидание релиза 2026</span>
                </div>
              </div>
            </header>

            {/* Реклама и Фильтры */}
            <nav className="flex flex-col gap-6 mb-8 md:mb-10" aria-label="Фильтрация серверов Hytale">
              <PromoBanner />
              <ServerFilters />
            </nav>

            <div className="flex flex-col lg:flex-row items-start gap-6 md:gap-8">
              {/* Список серверов */}
              <section className="flex-1 w-full min-w-0 order-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-4 bg-indigo-500" />
                  <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted italic">Предстоящие_Проекты</h2>
                </div>
                
                <div className="relative min-h-[400px]">
                  <ServerList game="hytale" />
                </div>
              </section>

              {/* Сайдбар */}
              <aside className="w-full flex flex-col gap-5 lg:w-[280px] shrink-0 order-2 lg:sticky lg:top-6">
                 <h3 className="sr-only">Сообщество и рейтинги</h3>
                 <ForumPosts />
                 <WeeklyLeaderboard/>
                 <YandexAds/>
              </aside>
            </div>

            {/* ВАЖНО: SEO-текст для новой игры */}
            <article className="mt-16 p-8 border border-border/50 rounded-3xl bg-surface/30 opacity-60 hover:opacity-100 transition-opacity">
              <h2 className="text-sm font-black uppercase tracking-widest mb-4 text-indigo-400 italic">Что такое Hytale?</h2>
              <div className="text-xs md:text-sm leading-relaxed space-y-4">
                <p>
                  <strong>Hytale</strong> — это амбициозная RPG-песочница от студии Hypixel Studios. Наш мониторинг подготавливает 
                  площадку для будущих игроков, где можно будет найти лучшие <strong>сервера Хайтейл</strong> сразу после релиза.
                </p>
                <p>
                  Мы планируем поддерживать все типы проектов: от классического выживания в мире Хайтел до уникальных мини-игр и 
                  творческих серверов. Добавляйте свои будущие проекты в наш список заранее, чтобы собрать аудиторию к моменту выхода игры.
                </p>
              </div>
            </article>

          </div>
        </div>
      </main>
    </div>
  );
}