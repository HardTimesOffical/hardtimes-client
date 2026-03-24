import ServerList from "../ServersList";
import ServerFilters from "@/app/components/servercard/ServerFilters";
import HeroSection from "@/app/components/header/HeroSection";
import { Metadata } from "next";
import PromoBanner from "@/app/components/blocks/PromoBanner";
import ForumPosts from "@/app/components/blocks/ForumPosts";
import { WeeklyLeaderboard } from "@/app/components/dashboard/WeeklyLeaderboard";
import YandexAds from "@/app/components/yandex/YandexAds";
import Footer from "@/app/components/footer/footer";

export const metadata: Metadata = {
  title: "Сервера Майнкрафт Java Edition | Рейтинг лучших серверов Майнкрафт",
  description: "Мониторинг серверов Майнкрафт Java Edition — актуальный рейтинг серверов Minecraft с живым онлайном. Найди сервер по версии (1.8–1.21), модам и режиму. IP-адреса серверов Майнкрафт Java.",
  keywords: [
    "сервера майнкрафт java edition",
    "мониторинг серверов майнкрафт java",
    "рейтинг серверов майнкрафт java",
    "сервера майнкрафт java",
    "топ серверов майнкрафт java edition",
    "ip адреса серверов майнкрафт java",
    "сервера minecraft java edition",
    "сервера майнкрафт java 1.21",
    "сервера майнкрафт java 1.20",
    "сервера майнкрафт java 1.16.5",
    "сервера майнкрафт java с модами",
    "сервера майнкрафт java выживание",
    "сервера майнкрафт java анархия",
    "список серверов майнкрафт java",
    "найти сервер майнкрафт java",
  ],
  alternates: {
    canonical: 'https://minecraftmonitoring-mc.ru/monitoring/servers/java',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    title: "Сервера Майнкрафт Java Edition — рейтинг серверов Minecraft",
    description: "Мониторинг серверов Майнкрафт Java Edition. Актуальный рейтинг серверов Minecraft с IP-адресами и живым онлайном.",
    url: 'https://minecraftmonitoring-mc.ru/monitoring/servers/java',
    siteName: 'Мониторинг серверов Майнкрафт',
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Сервера Майнкрафт Java Edition — рейтинг серверов",
    description: "Мониторинг серверов Майнкрафт Java Edition с живым онлайном и IP-адресами.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Рейтинг серверов Майнкрафт Java Edition",
  "description": "Мониторинг серверов Minecraft Java Edition — актуальный рейтинг с IP-адресами и живым онлайном",
  "url": "https://minecraftmonitoring-mc.ru/monitoring/servers/java",
};

export default async function JavaServersPage({ searchParams }: { searchParams: Promise<any> }) {
  const params = await searchParams;
  const containerWidth = "max-w-[1132px]";

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex-1 flex flex-col items-center min-w-0">
        <HeroSection />

        <div className={`w-full ${containerWidth} px-4 sm:px-6 lg:px-8 pt-8 pb-10 mx-auto`}>

          {/* ── Заголовок ── */}
          <div className="flex flex-col gap-1 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-[3px] h-6 shrink-0"
                style={{ background: 'linear-gradient(to bottom, #5aac44, #2a5e1a)' }} />
              <h1 className="font-mc-title text-foreground-bright"
                style={{ fontSize: 'clamp(14px, 2vw, 19px)', textShadow: '2px 2px 0 rgba(0,0,0,0.3)' }}>
                Сервера Minecraft <span style={{ color: '#5aac44' }}>Java</span> Edition
              </h1>
            </div>
            <p className="font-standard text-[12px] text-muted ml-[18px]">
              Рейтинг серверов Майнкрафт Java — актуальный онлайн и IP-адреса серверов
            </p>
          </div>

          {/* ── Двухколоночный layout ── */}
          <div className="flex flex-col lg:flex-row items-start gap-6">

            {/* Левая: промо + фильтры + список */}
            <div className="w-full lg:flex-1 min-w-0 flex flex-col gap-4">
              <div className="border border-border overflow-hidden">
                <PromoBanner />
              </div>
              <div className="border-t border-border pt-3">
                <ServerFilters />
              </div>
              <ServerList
                filters={{
                  version:  params.version,
                  category: params.category,
                  lang:     params.lang,
                }}
                sort={params.sort || "rating"}
                game="java"
              />
            </div>

            {/* Правая: сайдбар */}
            <aside className="w-full lg:w-[268px] shrink-0 flex flex-col gap-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <div className="w-[3px] h-4 shrink-0"
                  style={{ background: 'linear-gradient(to bottom, #5aac44, #2a5e1a)' }} />
                <span className="font-mc-title text-[10px] text-muted uppercase tracking-wider">
                  Активность
                </span>
              </div>
              <ForumPosts />
              <WeeklyLeaderboard />
              <YandexAds />
            </aside>
          </div>

          <Footer />

          {/* ── SEO-текст для Яндекса ── */}
          <section className="sr-only" aria-hidden="true">
            <h2>Мониторинг серверов Майнкрафт Java Edition — рейтинг серверов Minecraft</h2>
            <p>
              Мониторинг серверов Майнкрафт Java Edition — актуальный рейтинг серверов Minecraft
              с живым онлайном и рабочими IP-адресами. Сервера Майнкрафт Java проверяются
              автоматически, чтобы вы видели только доступные серверы с реальным онлайном.
            </p>
            <h3>Сервера Майнкрафт Java по версиям</h3>
            <p>
              Найдите сервер Майнкрафт Java нужной версии: сервера Minecraft Java 1.21,
              сервера Майнкрафт Java 1.20, классические сервера Java 1.16.5 и 1.12.2.
              Мониторинг серверов Майнкрафт Java поддерживает все популярные версии игры.
            </p>
            <h3>Сервера Майнкрафт Java с модами</h3>
            <p>
              Сервера Майнкрафт Java с модами Forge, Fabric и NeoForge. Найди сервер
              Майнкрафт Java с техническими модами, магией или приключениями через
              фильтры мониторинга серверов.
            </p>
            <h3>Рейтинг серверов Майнкрафт Java по режимам</h3>
            <p>
              Рейтинг серверов Майнкрафт Java включает выживание, анархию, SkyBlock,
              PvP и мини-игры. Мониторинг серверов Minecraft Java показывает онлайн
              и IP-адреса серверов для каждого режима.
            </p>
            <h3>Добавить сервер Майнкрафт Java в мониторинг</h3>
            <p>
              Добавь сервер Майнкрафт Java Edition в мониторинг бесплатно — получи
              трафик игроков которые ищут сервера Майнкрафт Java прямо сейчас.
            </p>
          </section>

        </div>
      </main>
    </div>
  );
}