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
  title: "Сервера Майнкрафт Java Edition | мониторинг серверов Джава Майнкрафт c IP",
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
    canonical: 'https://hardmonitoring.ru/monitoring/servers/java',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    title: "Сервера Майнкрафт Java Edition — рейтинг серверов Minecraft",
    description: "Мониторинг серверов Майнкрафт Java Edition. Актуальный рейтинг серверов Minecraft с IP-адресами и живым онлайном.",
    url: 'https://hardmonitoring.ru/monitoring/servers/java',
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
  "url": "https://hardmonitoring.ru/monitoring/servers/java",
};

export default async function JavaServersPage({ searchParams }: { searchParams: Promise<any> }) {
  const params = await searchParams;
  const containerWidth = "max-w-[1132px]";
const COLORS = {
    brand: "#84a98c",
    border: "rgba(255, 255, 255, 0.08)",
    bgElevated: "rgba(22, 24, 23, 0.6)",
  };

  return (
    <div className="flex min-h-screen text-foreground relative" style={{ backgroundColor: '#0a0b0b' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Fixed BG ── */}
      <div className="fixed inset-0 z-0 pointer-events-none" 
        style={{ 
          backgroundImage: "url('https://i.pinimg.com/1200x/1c/86/12/1c86122cdfc9fac2b55523ee09b14ccb.jpg')", 
          backgroundSize: "cover", 
          backgroundPosition: "center", 
          filter: "saturate(0.5) brightness(0.65)" 
        }} 
      />
      <div className="fixed inset-0 z-0 pointer-events-none" 
        style={{ background: "linear-gradient(to bottom, transparent 0%, #0a0b0b 69%, #0a0b0b 100%)" }} 
      />

      <div className="relative z-10 flex-1 flex flex-col min-w-0">
        <HeroSection />

        <main className="w-full flex flex-col items-center relative z-20">
          <div className={`w-full ${containerWidth} px-4 sm:px-6 lg:px-8 pt-10 pb-20 mx-auto`}>

            {/* ── Заголовок раздела ── */}
            <div className="flex flex-col gap-1 mb-8">
              <div className="flex items-center gap-3">
                <div
                  className="w-[3px] h-6 shrink-0"
                  style={{ background: `linear-gradient(to bottom, ${COLORS.brand}, #3c8527)` }}
                />
                <h1 className="font-mc-pixel text-[#f2f2f2] uppercase tracking-widest"
                  style={{ fontSize: 'clamp(14px, 2vw, 17px)' }}>
                  Сервера Minecraft <span style={{ color: COLORS.brand }}>Java</span> Edition
                </h1>
              </div>
              <p className="font-mc-pixel text-[9px] text-[#7d8581] uppercase tracking-wide ml-[18px]">
                Рейтинг серверов Майнкрафт Java — актуальный онлайн и IP-адреса
              </p>
            </div>

            {/* ── ОБЩИЙ ВИЗУАЛЬНЫЙ БЛОК ── */}
            <div className="relative border backdrop-blur-md p-1 shadow-2xl"
                 style={{ 
                   borderColor: COLORS.border, 
                   backgroundColor: COLORS.bgElevated 
                 }}>
              
              {/* Декоративные зеленые углы */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 opacity-80" style={{ borderColor: COLORS.brand }} />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 opacity-80" style={{ borderColor: COLORS.brand }} />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 opacity-80" style={{ borderColor: COLORS.brand }} />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 opacity-80" style={{ borderColor: COLORS.brand }} />

              <div className="flex flex-col lg:flex-row items-start gap-0 lg:divide-x lg:divide-white/5">

                {/* Левая колонка */}
                <div className="w-full lg:flex-1 min-w-0 flex flex-col p-4 gap-6">
                  <div className="overflow-hidden border border-white/5 bg-white/[0.02] p-1">
                    <PromoBanner />
                  </div>
                  <div className="border-t pt-5" style={{ borderColor: COLORS.border }}>
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

                {/* Правая колонка */}
                <aside className="w-full lg:w-[300px] shrink-0 flex flex-col gap-6 p-4">
                  <div className="flex items-center gap-2 pb-2 border-b" style={{ borderColor: COLORS.border }}>
                    <div className="w-[2px] h-4 shrink-0" style={{ background: COLORS.brand }} />
                    <span className="font-mc-pixel text-[9px] text-[#7d8581] uppercase tracking-[0.2em]">
                      Активность
                    </span>
                  </div>
                  <div className="flex flex-col gap-5">
                    <ForumPosts />
                    <WeeklyLeaderboard />
                    <YandexAds />
                  </div>
                </aside>
              </div>
            </div>
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
    </div>
  );
}