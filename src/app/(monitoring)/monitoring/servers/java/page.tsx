import ServerList from "../ServersList";
import ServerFilters from "@/app/components/servercard/ServerFilters";
import HeroSection from "@/app/components/header/HeroSection";
import { Metadata } from "next";
import PromoBanner from "@/app/components/blocks/PromoBanner";
import ForumPosts from "@/app/components/blocks/ForumPosts";
import { WeeklyLeaderboard } from "@/app/components/dashboard/WeeklyLeaderboard";
import YandexAds from "@/app/components/yandex/YandexAds";

export const metadata: Metadata = {
  title: "Сервера Майнкрафт Java Edition — IP адреса серверов и ТОП рейтинг",
  description: "Список лучших серверов Minecraft Java Edition (ПК). Удобный поиск майнкрафт серверов по версиям (1.21.11, 1.21, 1.16.5 и др.), актуальный онлайн, честные отзывы и только рабочие IP адреса.",
  keywords: [
    "сервера майнкрафт java edition",
    "мониторинг серверов java",
    "айпи адреса майнкрафт на пк",
    "сервера майнкрафт 1.21 java",
    "топ серверов майнкрафт джава",
    "cписок серверов майнкрафт"
  ],
  alternates: {
    canonical: 'https://hardmonitoring.ru/monitoring/java',
  },
};

export default async function JavaServersPage({ searchParams }: { searchParams: Promise<any> }) {
  const params = await searchParams;
  const containerWidth = "max-w-[1132px]";

  // Микроразметка: Сообщаем поисковику, что это каталог серверов
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Рейтинг серверов Minecraft Java Edition",
    "description": "Лучшие сервера Майнкрафт на ПК с актуальным онлайном",
    "url": "https://hardmonitoring.ru/monitoring/java",
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <main className="flex-1 flex flex-col items-center min-w-0 transition-all duration-300">
        <HeroSection />

        <div className={`w-full ${containerWidth} px-4 sm:px-6 lg:px-8 py-10 mx-auto`}>
          
          <div className="flex flex-col gap-6 md:gap-8 mb-10">
            <header>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-surface border border-border rounded-xl shadow-sm">
                   {/* SEO: Добавляем alt для иконки */}
                   <img className="w-6 h-6" src="/icons/java.svg" alt="Логотип Minecraft Java Edition" />
                </div>
                {/* SEO: Главный заголовок с ключевыми словами */}
                <h1 className="text-xl md:text-2xl font-black text-foreground-bright tracking-tighter uppercase leading-none">
                  Сервера Minecraft <span className="text-green-500">Java</span> Edition
                </h1>
              </div>
              <p className="text-xs md:text-sm text-muted font-medium max-w-2xl ml-1">
                Рейтинг классических серверов на ПК. Выбирайте по версии или плагинам, копируйте IP и начинайте выживание прямо сейчас.
              </p>
            </header>

            <section className="relative z-30 flex flex-col gap-6" aria-label="Фильтры поиска серверов">
              <PromoBanner />
              <ServerFilters />
            </section>
          </div>

          <div className="flex flex-col lg:flex-row items-start gap-8">
            
            <section className="flex-1 w-full min-w-0 order-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-4 bg-green-500" aria-hidden="true" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted">
                  Top_PC_Nodes
                </h2>
              </div>
              
              <div className="relative z-10">
                <ServerList 
                  filters={{
                    version: params.version,
                    category: params.category,
                    lang: params.lang
                  }} 
                  sort={params.sort || "rating"}
                  game="java" 
                />
              </div>
            </section>

            <aside className="w-full flex flex-col gap-5 lg:w-[280px] shrink-0 order-2 lg:sticky lg:top-6">
                 <h3 className="sr-only">Популярное на форуме</h3>
                 <ForumPosts />
                 <WeeklyLeaderboard/>
                 <YandexAds/>
            </aside>
          </div>
          
          {/* SEO ТЕКСТ: "Подвал" для роботов (и людей) */}
          <footer className="mt-20 border-t border-border/50 pt-8 opacity-50 text-[11px] leading-relaxed">
            <h2 className="text-sm font-bold mb-3 uppercase tracking-wider">О мониторинге Java Edition</h2>
            <p className="mb-4">
              Майнкрафт остается самой популярной платформой для игры с модами и сложными плагинами. 
              Наш мониторинг предоставляет актуальный список <strong>IP адресов майнкрафт</strong> для всех версий: 
              от легендарной <strong>1.12.2</strong> и <strong>1.16.5</strong> до новейших <strong>1.21</strong>.
            </p>
            <p>
              Мы используем автоматизированные системы проверки, чтобы вы видели только рабочие сервера. 
              В рейтинге участвуют проекты с режимами Анархия, Скайблок, Креатив и выживание с экономикой.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}