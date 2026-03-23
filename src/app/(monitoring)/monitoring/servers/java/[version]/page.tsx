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
      "url": `https://hardmonitoring.ru/monitoring/servers/java/${versionSlug}`,
    },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="flex-1 flex flex-col items-center min-w-0">
        <HeroSection />
        <div className={`w-full ${containerWidth} px-4 sm:px-6 lg:px-8 pt-8 pb-10 mx-auto`}>

          <div className="flex flex-col gap-1 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-[3px] h-6 shrink-0"
                style={{ background: 'linear-gradient(to bottom, #5aac44, #2a5e1a)' }} />
              <h1 className="font-mc-title text-foreground-bright"
                style={{ fontSize: 'clamp(14px, 2vw, 19px)', textShadow: '2px 2px 0 rgba(0,0,0,0.3)' }}>
                Сервера Майнкрафт <span style={{ color: '#5aac44' }}>{version}</span>
              </h1>
            </div>
            <p className="font-standard text-[12px] text-muted ml-[18px]">
              Мониторинг серверов Minecraft Java {version} — актуальный рейтинг и IP-адреса
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-start gap-6">
            <div className="w-full lg:flex-1 min-w-0 flex flex-col gap-4">
              <div className="border border-border overflow-hidden"><PromoBanner /></div>
              <div className="border-t border-border pt-3">
                <ServerFilters />
              </div>
              <ServerList
                filters={{ ...filters, version }}
                game="java"
                sort={filters.sort || "rating"}
              />
            </div>
            <aside className="w-full lg:w-[268px] shrink-0 flex flex-col gap-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <div className="w-[3px] h-4 shrink-0"
                  style={{ background: 'linear-gradient(to bottom, #5aac44, #2a5e1a)' }} />
                <span className="font-mc-title text-[10px] text-muted uppercase tracking-wider">Активность</span>
              </div>
              <ForumPosts />
              <WeeklyLeaderboard />
              <YandexAds />
            </aside>
          </div>

          <Footer />

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
  );
}