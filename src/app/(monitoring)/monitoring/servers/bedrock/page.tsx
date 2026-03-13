import ServerList from "../ServersList";
import ServerFilters from "@/app/components/servercard/ServerFilters";
import PromoBanner from "@/app/components/blocks/PromoBanner";
import ForumPosts from "@/app/components/blocks/ForumPosts";
import HeroSection from "@/app/components/header/HeroSection";
import { Metadata } from "next";
import { WeeklyLeaderboard } from "@/app/components/dashboard/WeeklyLeaderboard";
import YandexAds from "@/app/components/yandex/YandexAds";


export const metadata: Metadata = {
  title: "Сервера Майнкрафт Бедрок (PE) на телефон — ТОП мониторинг Bedrock Edition",
  description: "Рейтинг лучших серверов Minecraft Bedrock Edition (PE) для Android, iOS и Windows. Актуальные IP адреса, сервера с модами, выживанием и SkyBlock. Найди свой сервер для мобильного майнкрафта!",
  keywords: [
    "сервера майнкрафт бедрок", 
    "minecraft bedrock edition сервера", 
    "сервера майнкрафт пе", 
    "minecraft pe сервера на телефон", 
    "мониторинг серверов бедрок",
    "ip адреса майнкрафт пе"
  ],
  alternates: {
    canonical: 'https://hardmonitoring.ru/monitoring/bedrock',
  },
};

export default async function BedrockServersPage({ searchParams }: { searchParams: any }) {
  const filters = await searchParams;
  const containerWidth = "max-w-[1132px]";

  // JSON-LD: Breadcrumbs для красивого сниппета
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://hardmonitoring.ru" },
      { "@type": "ListItem", "position": 2, "name": "Мониторинг", "item": "https://hardmonitoring.ru/monitoring" },
      { "@type": "ListItem", "position": 3, "name": "Bedrock Edition", "item": "https://hardmonitoring.ru/monitoring/bedrock" }
    ]
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex-1 w-full relative overflow-x-hidden transition-all duration-300">
        <HeroSection />

        <div className="flex flex-col items-center w-full px-4 py-10 relative z-10">
          
          <div className={`w-full ${containerWidth} flex flex-col gap-10 mb-10`}>
            
            <header className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-surface border border-border rounded-xl shadow-sm">
                   <img 
                     className="w-5 h-5 md:w-6 md:h-6" 
                     src="/icons/bedrock.svg" 
                     alt="Логотип Minecraft Bedrock Edition (Pocket Edition)" 
                   />
                </div>
                {/* H1 с акцентом на PE и Бедрок */}
                <h1 className="text-xl md:text-2xl font-[1000] text-foreground-bright tracking-tighter uppercase leading-none italic">
                  Minecraft <span className="text-accent">Bedrock (PE)</span>
                </h1>
              </div>
              <p className="text-xs md:text-sm text-muted font-medium max-w-2xl leading-relaxed ml-1">
                Лучшие сервера для мобильных устройств (iOS/Android) и Windows 10/11. 
                Найдите <strong>IP адреса серверов Майнкрафт ПЕ</strong> с мини-играми, выживанием и активным сообществом.
              </p>
            </header>

            <nav className="flex flex-col gap-6" aria-label="Фильтры серверов Bedrock">
              <PromoBanner />
              <ServerFilters />
            </nav>
          </div>

          <div className={`w-full ${containerWidth} flex flex-col lg:flex-row items-start gap-8`}>
            
            <section className="flex-1 w-full min-w-0 order-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-4 bg-accent" aria-hidden="true" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted italic">
                  Pocket_Edition_Nodes
                </h2>
              </div>
              
              <div className="relative z-10">
                <ServerList filters={filters} game="bedrock" />
              </div>
            </section>

            <aside className="w-full flex flex-col gap-5 lg:w-[280px] shrink-0 order-2 lg:sticky lg:top-10">
                 <h3 className="sr-only">Активность сообщества</h3>
                 <ForumPosts />
                 <WeeklyLeaderboard/>
                 <YandexAds/>
            </aside>
          </div>

          {/* SEO-блок внизу: Объясняем разницу для поисковика */}
          <footer className="mt-20 w-full max-w-[1132px] border-t border-border/40 pt-10 opacity-50 text-[11px] leading-relaxed">
            <h2 className="text-sm font-black uppercase tracking-widest mb-4">Особенности серверов Bedrock Edition</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 italic">
              <p>
                Сервера <strong>Minecraft Bedrock (ранее Pocket Edition)</strong> позволяют игрокам на Android, iOS, Xbox и Windows играть в одном мире. В нашем мониторинге собраны проекты, поддерживающие кроссплатформенную игру, что обеспечивает стабильно высокий онлайн и разнообразие режимов.
              </p>
              <p>
                Для подключения к большинству серверов достаточно скопировать IP и порт в меню игры. Мы рекомендуем выбирать сервера с низким пингом и поддержкой вашей версии игры (например, 1.21), чтобы избежать вылетов и лагов на мобильном устройстве.
              </p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}