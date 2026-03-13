import ServerList from "../ServersList";
import ServerFilters from "@/app/components/servercard/ServerFilters";
import HeroSection from "@/app/components/header/HeroSection";
import { Metadata } from "next";
import PromoBanner from "@/app/components/blocks/PromoBanner";
import ForumPosts from "@/app/components/blocks/ForumPosts";
import { WeeklyLeaderboard } from "@/app/components/dashboard/WeeklyLeaderboard";
import YandexAds from "@/app/components/yandex/YandexAds";

export const metadata: Metadata = {
  title: "Новые сервера Майнкрафт 2026 — Список серверов Minecraft",
  description: "Список только что открывшихся серверов Minecraft. Будь первым в таблице лидеров на новых майнкрафт серверах. Актуальный онлайн, честные отзывы модами, выживанием и SkyBlock. Обновление в реальном времени!",
  keywords: ["открытие серверов майнкрафт", "новые сервера minecraft 2026", "свежие проекты майнкрафт", "мониторинг серверов"],
  alternates: {
    canonical: 'https://hardmonitoring.ru/monitoring/new',
  },
};

export default async function NewServersPage({ searchParams }: { searchParams: any }) {
  const filters = await searchParams;
  const containerWidth = "max-w-[1132px]";

  // Микроразметка: Хлебные крошки
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://hardmonitoring.ru" },
      { "@type": "ListItem", "position": 2, "name": "Мониторинг", "item": "https://hardmonitoring.ru/monitoring" },
      { "@type": "ListItem", "position": 3, "name": "Новые сервера", "item": "https://hardmonitoring.ru/monitoring/new" }
    ]
  };

  return (
    <div className="flex min-h-screen bg-background transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="flex-1 flex flex-col items-center min-w-0 transition-all duration-300">
        <HeroSection />

        <div className={`w-full ${containerWidth} px-4 sm:px-6 lg:px-8 py-10 mx-auto`}>
          
          <div className="w-full flex flex-col gap-6 md:gap-8 mb-10">
            <header>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                {/* Индикатор Live — хороший сигнал для ПФ (поведенческих факторов) */}
                <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-xl">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">
                    Обновлено сейчас
                  </span>
                </div>
                {/* В H1 добавляем ключевое слово на русском */}
                <h1 className="text-xl md:text-2xl font-[1000] text-foreground-bright uppercase tracking-tighter italic leading-none">
                  Новые <span className="text-accent underline decoration-green-500/30">Сервера</span> Minecraft
                </h1>
              </div>
              <p className="text-xs md:text-sm text-muted font-bold uppercase tracking-tight opacity-80 max-w-2xl ml-1">
                Список последних открытий: станьте первым на свежих игровых проектах с уникальными модами и экономикой.
              </p>
            </header>

            <nav className="relative z-20 flex flex-col gap-6" aria-label="Фильтрация новых серверов">
              <PromoBanner />
              <ServerFilters />
            </nav>
          </div>

          <div className="flex flex-col lg:flex-row items-start gap-8">
            
            <section className="flex-1 w-full min-w-0 order-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-4 bg-green-500" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted">Недавние открытия</h2>
              </div>

              <div className="relative z-10">
                {/* Передаем sort="new" — это важно для релевантности страницы */}
                <ServerList filters={filters} game="all" sort="new" />
              </div>
            </section>

            <aside className="w-full flex flex-col gap-5 lg:w-[280px] shrink-0 order-2 lg:sticky lg:top-6">
                 <h3 className="sr-only">Дополнительная информация</h3>
                 <ForumPosts />
                 <WeeklyLeaderboard/>
                 <YandexAds/>
            </aside>
          </div>

          {/* SEO-блок для низкочастотных запросов */}
          <section className="mt-20 border-t border-border/50 pt-10 opacity-60 text-xs">
            <h2 className="font-bold mb-2">Почему стоит играть на новых серверах?</h2>
            <p className="leading-relaxed">
              Новые сервера майнкрафт — это возможность начать игру на равных условиях с другими игроками. 
              В нашем списке "Новые Сервера" отображаются проекты, которые были добавлены в базу за последние 24-48 часов. 
              Многие из этих серверов предлагают бонусы для первых игроков. Не забудьте проверить версию игры и наличие необходимых плагинов перед входом.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}