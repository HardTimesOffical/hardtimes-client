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

  const baseUrl = "https://minecraftmonitoring-mc.ru";

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
  const baseUrl = "https://minecraftmonitoring-mc.ru";

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

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="flex-1 flex flex-col items-center min-w-0">
        <HeroSection />
        <div className={`w-full ${containerWidth} px-4 pt-8 pb-10 mx-auto`}>

          <div className="flex flex-col gap-1 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-[3px] h-6 shrink-0 bg-gradient-to-bottom from-[#5aac44] to-[#2a5e1a]" />
              <h1 className="font-mc-title text-foreground-bright text-[19px]">
                Сервера Майнкрафт Bedrock <span className="text-[#5aac44]">{version}</span>
              </h1>
            </div>
            <p className="font-standard text-[12px] text-muted ml-[18px]">
              Список серверов Minecraft Bedrock (PE) версии {version}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-start gap-6">
            <div className="w-full lg:flex-1 min-w-0 flex flex-col gap-4">
              <PromoBanner />
              <ServerFilters />
              <ServerList
                filters={{ ...filters, version }}
                game="bedrock"
                sort={filters.sort || "rating"}
              />
            </div>
            <aside className="w-full lg:w-[268px] shrink-0 flex flex-col gap-4">
              <ForumPosts />
              <WeeklyLeaderboard />
              <YandexAds />
            </aside>
          </div>
          <Footer />
        </div>
      </main>
    </div>
  );
}