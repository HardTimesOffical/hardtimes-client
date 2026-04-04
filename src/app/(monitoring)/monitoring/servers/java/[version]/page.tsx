import ServerList from "../../ServersList";
import ServerFilters from "@/app/components/servercard/ServerFilters";
import HeroSection from "@/app/components/header/HeroSection";
import { Metadata } from "next";
import PromoBanner from "@/app/components/blocks/PromoBanner";
import ForumPosts from "@/app/components/blocks/ForumPosts";
import { WeeklyLeaderboard } from "@/app/components/dashboard/WeeklyLeaderboard";
import YandexAds from "@/app/components/yandex/YandexAds";
import Footer from "@/app/components/footer/footer";
import { notFound } from "next/navigation";
import { GAME_VERSIONS } from "@/constants/gameVersions";

const VERSIONS = GAME_VERSIONS["Minecraft Java"];
const toSlug   = (v: string) => v.replace(/\./g, "-");
const fromSlug = (s: string) => s.replace(/-/g, ".");

export async function generateStaticParams() {
  return VERSIONS.map(v => ({ version: toSlug(v) }));
}

export const revalidate = 3600;

export async function generateMetadata(
  { params }: { params: Promise<{ version: string }> }
): Promise<Metadata> {
  const { version: versionSlug } = await params;
  const version = fromSlug(versionSlug);
  if (!VERSIONS.includes(version)) return { title: "Сервера Майнкрафт" };

  return {
    title: `Сервера Майнкрафт ${version} | Рейтинг лучших серверов Майнкрафт`,
    description: `Мониторинг серверов Майнкрафт ${version} Java Edition — актуальный рейтинг серверов Minecraft ${version} с живым онлайном. IP-адреса серверов Майнкрафт ${version}, режимы и моды.`,
    keywords: [
      `сервера майнкрафт ${version}`,
      `мониторинг серверов майнкрафт ${version}`,
      `сервера minecraft ${version}`,
      `топ серверов майнкрафт ${version}`,
      `ip адреса серверов майнкрафт ${version}`,
      `сервера майнкрафт java ${version}`,
      `рейтинг серверов майнкрафт ${version}`,
      `лучшие сервера майнкрафт ${version}`,
      `сервера майнкрафт ${version} с модами`,
      `сервера майнкрафт ${version} выживание`,
      `найти сервер майнкрафт ${version}`,
    ],
    alternates: {
      canonical: `https://hardmonitoring.ru/monitoring/servers/java/${versionSlug}`,
    },
    robots: { index: true, follow: true },
    openGraph: {
      title: `Сервера Майнкрафт ${version} — рейтинг серверов Minecraft`,
      description: `Мониторинг серверов Майнкрафт ${version}. Рейтинг серверов Minecraft с IP-адресами и онлайном.`,
      url: `https://hardmonitoring.ru/monitoring/servers/java/${versionSlug}`,
      siteName: "Мониторинг серверов Майнкрафт",
      locale: "ru_RU",
      type: "website",
    },
  };
}

export default async function JavaVersionPage({
  params,
  searchParams,
}: {
  params: Promise<{ version: string }>;
  searchParams: Promise<any>;
}) {
  const { version: versionSlug } = await params;
  const version = fromSlug(versionSlug);
  if (!VERSIONS.includes(version)) notFound();

  const filters = await searchParams;
  const containerWidth = "max-w-[1132px]";

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Мониторинг серверов Майнкрафт", "item": "https://hardmonitoring.ru" },
        { "@type": "ListItem", "position": 2, "name": "Сервера Java Edition",           "item": "https://hardmonitoring.ru/monitoring/servers/java" },
        { "@type": "ListItem", "position": 3, "name": `Сервера Майнкрафт ${version}`,  "item": `https://hardmonitoring.ru/monitoring/servers/java/${versionSlug}` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": `Рейтинг серверов Майнкрафт ${version}`,
      "description": `Мониторинг серверов Minecraft Java Edition ${version}`,
      "url": `https://minecraftmonitoring-mc.ru/monitoring/servers/java/${versionSlug}`,
    },
  ];
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

            {/* ── Заголовок ── */}
            <div className="flex flex-col gap-1 mb-8">
              <div className="flex items-center gap-3">
                <div
                  className="w-[3px] h-6 shrink-0"
                  style={{ background: `linear-gradient(to bottom, ${COLORS.brand}, #3c8527)` }}
                />
                <h1 className="font-mc-pixel text-[#f2f2f2] uppercase tracking-widest"
                  style={{ fontSize: 'clamp(14px, 2vw, 17px)' }}>
                  Сервера Майнкрафт <span style={{ color: COLORS.brand }}>{version}</span>
                </h1>
              </div>
              <p className="font-mc-pixel text-[9px] text-[#7d8581] uppercase tracking-wide ml-[18px]">
                Мониторинг серверов Minecraft Java {version} — рейтинг и IP-адреса
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
                    filters={{ ...filters, version }}
                    game="java"
                    sort={filters.sort || "rating"}
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

          <section className="sr-only" aria-hidden="true">
            <h2>Мониторинг серверов Майнкрафт {version} — рейтинг серверов Minecraft {version}</h2>
            <p>
              Мониторинг серверов Майнкрафт {version} — актуальный рейтинг серверов Minecraft {version}
              с живым онлайном и рабочими IP-адресами. Сервера Майнкрафт {version} проверяются
              автоматически — вы видите только доступные серверы с реальным онлайном.
            </p>
            <h3>Лучшие сервера Майнкрафт {version} Java Edition</h3>
            <p>
              Найдите лучший сервер Майнкрафт {version} с модами, выживанием, анархией или мини-играми.
              Все IP-адреса серверов Minecraft {version} проверены и актуальны в нашем мониторинге.
            </p>
            <h3>Добавить сервер Майнкрафт {version}</h3>
            <p>
              Добавь сервер Майнкрафт {version} в мониторинг бесплатно.
              Тысячи игроков ищут сервера Minecraft {version} каждый день.
            </p>
          </section>
        </div>
      </main>
    </div>
    </div>
  );
}