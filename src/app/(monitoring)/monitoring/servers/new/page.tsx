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
  title: "Новые сервера Майнкрафт. Мониторинг лучших серверов Майнкрафт и IP",
  description: "Новые сервера Майнкрафт — список новых серверов Minecraft с актуальным онлайном. Мониторинг новых серверов Майнкрафт: IP-адреса, версии, режимы. Будь первым на новом сервере.",
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
    canonical: 'https://minecraftmonitoring-mc.ru/monitoring/servers/new',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    title: "Новые сервера Майнкрафт.  рейтинг серверов Minecraft c IP",
    description: "Мониторинг новых серверов Майнкрафт. Свежие сервера Minecraft с актуальным онлайном и IP-адресами.",
    url: 'https://minecraftmonitoring-mc.ru/monitoring/servers/new',
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
                  Новые сервера <span style={{ color: COLORS.brand }}>Майнкрафт</span>
                </h1>
              </div>
              <p className="font-mc-pixel text-[9px] text-[#7d8581] uppercase tracking-wide ml-[18px]">
                Свежие сервера Minecraft — актуальный онлайн и IP-адреса
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
                  <ServerList filters={filters} game="all" sort="new" />
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
    </div>
  );
}