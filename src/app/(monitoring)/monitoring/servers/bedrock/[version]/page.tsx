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

const VERSIONS = GAME_VERSIONS["Minecraft Bedrock"] || [];

// Добавляем проверку на существование строки
const toSlug   = (v: string) => v.toString().trim().replace(/\./g, "-");
const fromSlug = (s: string) => s.toString().trim().replace(/-/g, ".");

export async function generateStaticParams() {
  return VERSIONS.map(v => ({ version: toSlug(v) }));
}

export const revalidate = 3600;

export async function generateMetadata(
  { params }: { params: Promise<{ version: string }> }
): Promise<Metadata> {
  const { version: versionSlug } = await params;
  
  // Если slug пустой, отдаем общие данные
  if (!versionSlug) return { title: "Сервера Майнкрафт Bedrock" };
  
  const version = fromSlug(versionSlug);
  
  if (!VERSIONS.includes(version)) return { title: "Сервера Майнкрафт Bedrock" };

  const baseUrl = "https://hardmonitoring.ru";

  return {
    title: `Сервера Майнкрафт ${version} Bedrock | Рейтинг лучших PE серверов`,
    description: `Мониторинг серверов Майнкрафт ${version} Bedrock Edition (PE) — актуальный список IP адресов с онлайном. Найди лучший сервер Minecraft ${version} для телефона или Windows 10.`,
    alternates: {
      canonical: `${baseUrl}/monitoring/servers/bedrock/${versionSlug}`,
    },
    openGraph: {
      title: `Сервера Майнкрафт ${version} Bedrock — IP адреса и рейтинг`,
      description: `Рейтинг и мониторинг серверов Minecraft Bedrock Edition ${version}.`,
      url: `${baseUrl}/monitoring/servers/bedrock/${versionSlug}`,
      siteName: "MinecraftMonitoring",
      locale: "ru_RU",
      type: "website",
    },
  };
}

export default async function BedrockVersionPage({
  params,
  searchParams,
}: {
  params: Promise<{ version: string }>;
  searchParams: Promise<any>;
}) {
  const resolvedParams = await params;
  const versionSlug = resolvedParams?.version;

  if (!versionSlug) notFound();

  const version = fromSlug(versionSlug);
  if (!VERSIONS.includes(version)) notFound();

  const filters = await searchParams;
  const containerWidth = "max-w-[1132px]";
  const baseUrl = "https://hardmonitoring.ru";

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Мониторинг", "item": baseUrl },
        { "@type": "ListItem", "position": 2, "name": "Bedrock Edition", "item": `${baseUrl}/monitoring/servers/bedrock` },
        { "@type": "ListItem", "position": 3, "name": `Версия ${version}`, "item": `${baseUrl}/monitoring/servers/bedrock/${versionSlug}` },
      ],
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
          <div className={`w-full ${containerWidth} px-4 pt-10 pb-20 mx-auto`}>

            {/* ── Заголовок ── */}
            <div className="flex flex-col gap-1 mb-8">
              <div className="flex items-center gap-3">
                <div
                  className="w-[3px] h-6 shrink-0"
                  style={{ background: `linear-gradient(to bottom, ${COLORS.brand}, #3c8527)` }}
                />
                <h1 className="font-mc-pixel text-[#f2f2f2] uppercase tracking-widest"
                  style={{ fontSize: 'clamp(14px, 2vw, 17px)' }}>
                  Сервера Майнкрафт Bedrock <span style={{ color: COLORS.brand }}>{version}</span>
                </h1>
              </div>
              <p className="font-mc-pixel text-[9px] text-[#7d8581] uppercase tracking-wide ml-[18px]">
                Список серверов Minecraft Bedrock (PE) версии {version}
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
                    game="bedrock"
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
          </div>
        </main>
      </div>
    </div>
  );
}