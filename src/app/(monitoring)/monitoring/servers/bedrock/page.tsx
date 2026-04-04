import ServerList from "../ServersList";
import ServerFilters from "@/app/components/servercard/ServerFilters";
import PromoBanner from "@/app/components/blocks/PromoBanner";
import ForumPosts from "@/app/components/blocks/ForumPosts";
import HeroSection from "@/app/components/header/HeroSection";
import { Metadata } from "next";
import { WeeklyLeaderboard } from "@/app/components/dashboard/WeeklyLeaderboard";
import YandexAds from "@/app/components/yandex/YandexAds";
import Footer from "@/app/components/footer/footer";

export const metadata: Metadata = {
  title: "Сервера Майнкрафт Bedrock Edition | Рейтинг лучших серверов Майнкрафт",
  description: "Мониторинг серверов Майнкрафт Bedrock Edition — актуальный рейтинг серверов Minecraft PE для Android, iOS и Windows. IP-адреса серверов Майнкрафт Bedrock с живым онлайном.",
  keywords: [
    "сервера майнкрафт bedrock",
    "мониторинг серверов майнкрафт bedrock",
    "рейтинг серверов майнкрафт bedrock",
    "сервера minecraft bedrock edition",
    "сервера майнкрафт pe",
    "сервера майнкрафт pocket edition",
    "мониторинг серверов майнкрафт pe",
    "ip адреса серверов майнкрафт bedrock",
    "сервера майнкрафт bedrock на телефон",
    "сервера майнкрафт bedrock android",
    "сервера майнкрафт bedrock ios",
    "сервера майнкрафт bedrock windows",
    "сервера майнкрафт bedrock с модами",
    "сервера майнкрафт bedrock выживание",
    "список серверов майнкрафт bedrock",
    "топ серверов майнкрафт bedrock",
  ],
  alternates: {
    canonical: 'https://hardmonitoring.ru/monitoring/servers/bedrock',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    title: "Сервера Майнкрафт Bedrock Edition — рейтинг серверов Minecraft",
    description: "Мониторинг серверов Майнкрафт Bedrock Edition. Актуальный рейтинг серверов Minecraft PE с IP-адресами и живым онлайном для Android, iOS и Windows.",
    url: 'https://hardmonitoring.ru/monitoring/servers/bedrock',
    siteName: 'Мониторинг серверов Майнкрафт',
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Сервера Майнкрафт Bedrock — рейтинг серверов",
    description: "Мониторинг серверов Майнкрафт Bedrock Edition с IP-адресами и живым онлайном.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Мониторинг серверов Майнкрафт",        "item": "https://hardmonitoring.ru" },
    { "@type": "ListItem", "position": 2, "name": "Рейтинг серверов Майнкрафт",           "item": "https://hardmonitoring.ru/monitoring" },
    { "@type": "ListItem", "position": 3, "name": "Сервера Майнкрафт Bedrock Edition",    "item": "https://hardmonitoring.ru/monitoring/servers/bedrock" },
  ],
};

export default async function BedrockServersPage({ searchParams }: { searchParams: any }) {
  const filters = await searchParams;
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
                  Сервера Minecraft <span style={{ color: COLORS.brand }}>Bedrock</span> Edition
                </h1>
              </div>
              <p className="font-mc-pixel text-[9px] text-[#7d8581] uppercase tracking-wide ml-[18px]">
                Мониторинг серверов Майнкрафт Bedrock — IP для Android, iOS и Windows
              </p>
            </div>

            {/* ── ОБЩИЙ ВИЗУАЛЬНЫЙ БЛОК (Связываем всё воедино) ── */}
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
                  <ServerList filters={filters} game="bedrock" />
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
            <h2>Мониторинг серверов Майнкрафт Bedrock Edition — рейтинг серверов Minecraft PE</h2>
            <p>
              Мониторинг серверов Майнкрафт Bedrock Edition — актуальный рейтинг серверов
              Minecraft PE с живым онлайном и рабочими IP-адресами. Сервера Майнкрафт Bedrock
              проверяются автоматически — вы всегда видите доступные серверы с реальным онлайном.
            </p>
            <h3>Сервера Майнкрафт Bedrock для Android и iOS</h3>
            <p>
              Сервера Майнкрафт Bedrock Edition для мобильных устройств Android и iOS.
              Мониторинг серверов Майнкрафт PE показывает актуальные IP-адреса серверов
              Minecraft с поддержкой телефонов и планшетов.
            </p>
            <h3>Сервера Майнкрафт Bedrock для Windows</h3>
            <p>
              Сервера Майнкрафт Bedrock Edition для Windows 10 и Windows 11.
              Кроссплатформенные сервера Minecraft Bedrock позволяют играть
              вместе игрокам на ПК, телефоне, Xbox и PlayStation.
            </p>
            <h3>Рейтинг серверов Майнкрафт Bedrock по режимам</h3>
            <p>
              Рейтинг серверов Майнкрафт Bedrock включает выживание, мини-игры,
              PvP и творческий режим. Мониторинг серверов Minecraft Bedrock
              поможет найти сервер с нужным режимом и стабильным онлайном.
            </p>
            <h3>Добавить сервер Майнкрафт Bedrock в мониторинг</h3>
            <p>
              Добавь свой сервер Майнкрафт Bedrock Edition в мониторинг бесплатно.
              Тысячи игроков ежедневно ищут сервера Minecraft PE — добавь IP-адрес
              сервера Майнкрафт Bedrock и получи живой трафик.
            </p>
          </section>

        </div>
      </main>
    </div>
    </div>
  );
}