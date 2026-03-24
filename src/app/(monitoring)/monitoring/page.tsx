import { Metadata } from "next";
import ServerList from "./servers/ServersList";
import ServerFilters from "@/app/components/servercard/ServerFilters";
import HeroSection from "@/app/components/header/HeroSection";
import PromoBanner from "@/app/components/blocks/PromoBanner";
import ForumPosts from "@/app/components/blocks/ForumPosts";
import { WeeklyLeaderboard } from "@/app/components/dashboard/WeeklyLeaderboard";
import YandexAds from "@/app/components/yandex/YandexAds";

export const metadata: Metadata = {
  title: "Мониторинг серверов Майнкрафт | Топ лучших серверов Майнкрафт",
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
  const containerWidth = "max-w-[1132px]";

  return (
    <div className="flex min-h-screen text-foreground transition-colors duration-200 relative">
      {/* Fixed BG */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ backgroundImage: "url('https://www.minecraft.net/content/dam/games/minecraft/key-art/MC_Vanilla_PMP_Keyart_1280x720.jpg')", backgroundSize: "cover", backgroundPosition: "center top", filter: "saturate(0.35) brightness(0.15)" }} />
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent 0%, var(--background) 50%)" }} />

      <div className="relative z-10 flex-1 flex flex-col min-w-0">

        {/* ── Hero на всю ширину ── */}
        <div className="w-full">
          <HeroSection />
        </div>

        <main className="w-full flex flex-col items-center">
          <div className={`w-full ${containerWidth} px-4 sm:px-6 lg:px-8 pt-8 pb-20 mx-auto`}>

            {/* ── Заголовок раздела ── */}
            <div className="flex flex-col gap-1 mb-5">
              {/* Пиксельный акцент-маркер */}
              <div className="flex items-center gap-3">
                <div
                  className="w-[3px] h-6 shrink-0"
                  style={{ background: 'linear-gradient(to bottom, #5aac44, #2a5e1a)' }}
                />
                <h1 className="font-mc-title text-foreground-bright"
                  style={{ fontSize: 'clamp(14px, 2vw, 19px)', textShadow: '2px 2px 0 rgba(0,0,0,0.3)' }}>
                  Топ Серверов
                </h1>
              </div>
              <p className="font-standard text-[12px] text-muted ml-[18px]">
                Лучшие игровые сервера мониторинга HardMonitoring
              </p>
            </div>

            {/* ── Двухколоночный layout: левая (контент) + правая (сайдбар) ── */}
            <div className="flex flex-col lg:flex-row items-start gap-6">

              {/* ── ЛЕВАЯ КОЛОНКА: промо + фильтры + список ── */}
              <div className="w-full lg:flex-1 min-w-0 flex flex-col gap-4">

                {/* Промо-баннер */}
                <div className="border border-border overflow-hidden">
                  <PromoBanner />
                </div>

                {/* Фильтры */}
                <div className="border-t border-border pt-3">
                  <ServerFilters />
                </div>

                {/* Список серверов */}
                <ServerList filters={filters} game="all" />
              </div>

              {/* ── ПРАВАЯ КОЛОНКА: сайдбар с самого верха ── */}
              <aside className="w-full lg:w-[268px] shrink-0 flex flex-col gap-4">

                {/* Заголовок */}
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