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
                Сервера Minecraft <span style={{ color: '#5aac44' }}>Bedrock</span> Edition
              </h1>
            </div>
            <p className="font-standard text-[12px] text-muted ml-[18px]">
              Мониторинг серверов Майнкрафт Bedrock — IP-адреса серверов для Android, iOS и Windows
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
              <ServerList filters={filters} game="bedrock" />
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
  );
}