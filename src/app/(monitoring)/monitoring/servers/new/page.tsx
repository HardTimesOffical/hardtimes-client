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
  title: "Новые сервера Майнкрафт | Рейтинг лучших серверов Майнкрафт",
  description: "Новые сервера Майнкрафт — список свежих серверов Minecraft с актуальным онлайном. Мониторинг новых серверов Майнкрафт: IP-адреса, версии, режимы. Будь первым на новом сервере.",
  keywords: [
    "новые сервера майнкрафт",
    "новые сервера minecraft",
    "мониторинг новых серверов майнкрафт",
    "список новых серверов майнкрафт",
    "свежие сервера майнкрафт",
    "новые сервера майнкрафт java",
    "новые сервера майнкрафт bedrock",
    "новые сервера майнкрафт с модами",
    "новые сервера майнкрафт выживание",
    "новые сервера майнкрафт 2026",
    "открытие серверов майнкрафт",
    "ip адреса новых серверов майнкрафт",
    "новые сервера minecraft java edition",
    "рейтинг новых серверов майнкрафт",
  ],
  alternates: {
    canonical: 'https://hardmonitoring.ru/monitoring/servers/new',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    title: "Новые сервера Майнкрафт — рейтинг серверов Minecraft",
    description: "Мониторинг новых серверов Майнкрафт. Свежие сервера Minecraft с актуальным онлайном и IP-адресами.",
    url: 'https://hardmonitoring.ru/monitoring/servers/new',
    siteName: 'Мониторинг серверов Майнкрафт',
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Новые сервера Майнкрафт — рейтинг серверов",
    description: "Мониторинг новых серверов Майнкрафт с IP-адресами и живым онлайном.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Мониторинг серверов Майнкрафт", "item": "https://hardmonitoring.ru" },
    { "@type": "ListItem", "position": 2, "name": "Рейтинг серверов Майнкрафт",    "item": "https://hardmonitoring.ru/monitoring" },
    { "@type": "ListItem", "position": 3, "name": "Новые сервера Майнкрафт",        "item": "https://hardmonitoring.ru/monitoring/servers/new" },
  ],
};

export default async function NewServersPage({ searchParams }: { searchParams: any }) {
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
                Новые сервера <span style={{ color: '#5aac44' }}>Майнкрафт</span>
              </h1>
            </div>
            <p className="font-standard text-[12px] text-muted ml-[18px]">
              Свежие сервера Minecraft — актуальный онлайн и IP-адреса серверов
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
              <ServerList filters={filters} game="all" sort="new" />
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
            <h2>Новые сервера Майнкрафт — мониторинг свежих серверов Minecraft</h2>
            <p>
              Мониторинг новых серверов Майнкрафт — список свежих серверов Minecraft
              с актуальным онлайном и рабочими IP-адресами. Новые сервера Майнкрафт
              добавляются в мониторинг ежедневно — находи серверы с уникальными модами
              и режимами первым.
            </p>
            <h3>Новые сервера Майнкрафт Java и Bedrock</h3>
            <p>
              Новые сервера Майнкрафт Java Edition и Bedrock Edition в нашем мониторинге.
              Найди свежий сервер Майнкрафт нужной версии с модами Forge или Fabric,
              кастомными плагинами и активной аудиторией игроков.
            </p>
            <h3>Почему стоит играть на новых серверах Майнкрафт</h3>
            <p>
              Новые сервера Майнкрафт дают возможность начать игру на равных условиях.
              Мониторинг новых серверов Minecraft показывает только актуальные проекты
              с живым онлайном — все IP-адреса серверов Майнкрафт проверяются автоматически.
            </p>
            <h3>Добавить новый сервер Майнкрафт в мониторинг</h3>
            <p>
              Открываешь новый сервер Майнкрафт? Добавь его в мониторинг бесплатно
              и получи первых игроков которые ищут новые сервера Minecraft прямо сейчас.
            </p>
          </section>

        </div>
      </main>
    </div>
  );
}