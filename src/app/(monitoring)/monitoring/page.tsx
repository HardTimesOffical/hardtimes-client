import { Metadata } from "next";
import ServerList from "./servers/ServersList";
import ServerFilters from "@/app/components/servercard/ServerFilters";
import HeroSection from "@/app/components/header/HeroSection";
import PromoBanner from "@/app/components/blocks/PromoBanner";
import ForumPosts from "@/app/components/blocks/ForumPosts";
import { WeeklyLeaderboard } from "@/app/components/dashboard/WeeklyLeaderboard";
import YandexAds from "@/app/components/yandex/YandexAds";

export const metadata: Metadata = {
  title: "Сервера майнкрафт. Топ лучших серверов Майнкрафт с IP мониторинг",
  description: "Мониторинг серверов Майнкрафт — актуальный рейтинг серверов Minecraft Java и Bedrock. Найди сервер по версии, модам или режиму. IP-адреса серверов с живым онлайном.",
  keywords: [
    "мониторинг серверов майнкрафт",
    "сервера майнкрафт",
    "топ серверов майнкрафт",
    "рейтинг серверов майнкрафт",
    "сервера minecraft",
    "мониторинг minecraft серверов",
    "сервера майнкрафт java",
    "сервера майнкрафт bedrock",
    "сервера майнкрафт java edition",
    "сервера майнкрафт bedrock edition",
    "лучшие сервера майнкрафт",
    "сервера майнкрафт 2026",
    "ip адрес сервера майнкрафт",
    "найти сервер майнкрафт",
    "сервера майнкрафт онлайн",
    "сервера майнкрафт с модами",
    "сервера майнкрафт выживание",
    "сервера майнкрафт анархия",
    "сервера майнкрафт мини игры",
    "добавить сервер майнкрафт в мониторинг",
  ],
  alternates: {
    canonical: 'https://minecraftmonitoring-mc.ru',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    title: "Мониторинг серверов Майнкрафт — топ серверов 2026",
    description: "Актуальный мониторинг серверов Майнкрафт. Топ серверов Minecraft Java и Bedrock с живым онлайном, IP-адресами и рейтингом.",
    url: 'https://minecraftmonitoring-mc.ru',
    siteName: 'Мониторинг серверов Майнкрафт',
    locale: 'ru_RU',
    type: 'website',
    images: [
      {
        url: 'https://minecraftmonitoring-mc.ru/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Мониторинг серверов Майнкрафт — топ серверов',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Мониторинг серверов Майнкрафт",
    description: "Топ серверов Minecraft Java и Bedrock с живым онлайном. Актуальный рейтинг и IP-адреса серверов.",
    images: ['https://minecraftmonitoring-mc.ru/og-image.jpg'],
  },
};

export default async function Home({ searchParams }: { searchParams: any }) {
  const filters = await searchParams;
  const containerWidth = "max-w-[1200px]";
  const COLORS = {
    brand: "#84a98c",
    border: "rgba(255, 255, 255, 0.08)", // Чуть отчетливее, так как нет ховера
    bgElevated: "rgba(22, 24, 23, 0.6)", // Полупрозрачность зафиксирована
  };

  return (
    <div className="flex min-h-screen text-foreground relative" style={{ backgroundColor: '#0a0b0b' }}>
      {/* Fixed BG */}
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

        {/* ── Hero ── */}
        <div className="w-full">
          <HeroSection />
        </div>

        <main className="w-full flex flex-col items-center relative z-20">
          <div className={`w-full ${containerWidth} px-4 sm:px-6 lg:px-8 pt-10 pb-20 mx-auto`}>

            {/* ── Заголовок ── */}
            <div className="flex flex-col gap-1 mb-8">
              <div className="flex items-center gap-3">
                <div
                  className="w-[3px] h-6 shrink-0"
                  style={{ background: `linear-gradient(to bottom, ${COLORS.brand}, #3c8527)` }}
                />
                <h1 className="font-mc-pixel text-[#f2f2f2] uppercase tracking-widest"
                  style={{ fontSize: 'clamp(14px, 2vw, 17px)' }}>
                  Топ Серверов
                </h1>
              </div>
              <p className="font-mc-pixel text-[9px] text-[#7d8581] uppercase tracking-wide ml-[18px]">
                Лучшие игровые сервера нашего мониторинга
              </p>
            </div>

            {/* ── ОБЩИЙ ВИЗУАЛЬНЫЙ БЛОК (Статичный) ── */}
            <div className="relative border backdrop-blur-md p-1 shadow-2xl"
                 style={{ 
                   borderColor: COLORS.border, 
                   backgroundColor: COLORS.bgElevated 
                 }}>
              
              {/* Декоративные зеленые углы (Горят всегда) */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 opacity-80" style={{ borderColor: COLORS.brand }} />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 opacity-80" style={{ borderColor: COLORS.brand }} />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 opacity-80" style={{ borderColor: COLORS.brand }} />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 opacity-80" style={{ borderColor: COLORS.brand }} />

              {/* Контент колонок */}
              <div className="flex flex-col lg:flex-row items-start gap-0 lg:divide-x lg:divide-white/5">

                {/* Левая колонка */}
                <div className="w-full lg:flex-1 min-w-0 flex flex-col p-4 gap-6">
                  <div className="overflow-hidden border border-white/5 bg-white/[0.02] p-1">
                    <PromoBanner />
                  </div>
                  <div className="border-t pt-5" style={{ borderColor: COLORS.border }}>
                    <ServerFilters />
                  </div>
                  <ServerList filters={filters} game="all" />
                </div>

                {/* Правая колонка */}
                <aside className="w-full lg:w-[300px] shrink-0 flex flex-col gap-6 p-1">
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
              <h2>Мониторинг серверов Майнкрафт — рейтинг лучших серверов Майнкрафт</h2>
              <p>
                Мониторинг серверов Майнкрафт с актуальным онлайном и IP-адресами серверов Minecraft.
                Наш рейтинг серверов Майнкрафт обновляется в реальном времени — вы всегда видите
                живой онлайн и доступность каждого сервера Майнкрафт.
              </p>

              <h3>Топ серверов Майнкрафт Java Edition</h3>
              <p>
                Топ серверов Майнкрафт Java Edition — сервера с модами Forge, Fabric и NeoForge,
                кастомными плагинами и уникальными режимами. Найдите сервер Майнкрафт Java
                по версии от 1.8 до 1.21 в нашем мониторинге серверов.
              </p>

              <h3>Сервера Майнкрафт Bedrock Edition</h3>
              <p>
                Сервера Майнкрафт Bedrock Edition для игры на Windows, Android, iOS, Xbox и PlayStation.
                Мониторинг серверов Bedrock показывает актуальный онлайн и IP-адреса серверов Minecraft
                для кроссплатформенной игры.
              </p>

              <h3>Сервера Майнкрафт с модами</h3>
              <p>
                Мониторинг серверов Майнкрафт с модами — выживание с Forge, технические сервера
                с Industrial Craft, магические сервера с Thaumcraft. Найди сервер Майнкрафт
                с нужными модами через фильтры нашего мониторинга.
              </p>

              <h3>Рейтинг серверов Майнкрафт по режимам</h3>
              <p>
                Рейтинг серверов Майнкрафт включает все популярные режимы: выживание, анархия,
                мини-игры, SkyBlock, PvP и творческий режим. Мониторинг серверов Minecraft
                поможет найти сервер с нужным режимом и стабильным онлайном.
              </p>

              <h3>Добавить сервер в мониторинг Майнкрафт</h3>
              <p>
                Владелец сервера Майнкрафт? Добавь свой сервер в мониторинг бесплатно.
                Тысячи игроков ежедневно ищут сервера Minecraft в нашем рейтинге —
                добавь IP-адрес сервера Майнкрафт и получи живой трафик игроков.
              </p>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}