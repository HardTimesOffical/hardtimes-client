import Sidebar from "../../../components/dashboard/dashboard";
import ServerList from "./ServersList";
import ServerFilters from "@/app/components/servercard/ServerFilters";
import PromoBanner from "@/app/components/blocks/PromoBanner";
import ForumPosts from "@/app/components/blocks/ForumPosts";
import HeroSection from "@/app/components/header/HeroSection";
import { Metadata } from "next";
import YandexAds from "@/app/components/yandex/YandexAds";
import { WeeklyLeaderboard } from "@/app/components/dashboard/WeeklyLeaderboard";

export const metadata: Metadata = {
  title: "Мониторинг серверов Minecraft, Hytale & VoxelCore | ТОП рейтинг 2026",
  description: "Единая платформа мониторинга воксельных игр. Найди лучшие сервера Minecraft, Hytale и VoxelCore с живым онлайном, модами и стабильной экономикой. Удобный поиск по версии, модам и странам.",
  keywords: [
    "мониторинг серверов майнкрафт", 
    "сервера hytale", 
    "voxelcore сервера", 
    "ip адреса серверов minecraft", 
    "топ серверов майнкрафт", 
    "сервера с модами"
  ],
  alternates: {
    canonical: 'https://hardmonitoring.ru/monitoring',
  },
  openGraph: {
    title: "HardTimes — Рейтинг лучших игровых миров",
    description: "Найди свой идеальный сервер в нашем мониторинге. Реальный онлайн и честные отзывы.",
    url: 'https://hardmonitoring.ru/monitoring',
    type: 'website',
  }
};

export default function ServersPage() {
  const containerWidth = "max-w-[1132px]";

  // Микроразметка Schema.org для страницы списка (ItemList)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Мониторинг игровых серверов",
    "description": "Рейтинг и поиск серверов Minecraft, Hytale и VoxelCore",
    "mainEntity": {
      "@type": "ItemList",
      "itemListOrder": "https://schema.org/ItemListOrderDescending",
      "numberOfItems": 50, // Примерное кол-во
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* JSON-LD для Google/Yandex */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <Sidebar />

      <main className="flex-1 w-full flex flex-col items-center relative overflow-x-hidden transition-all duration-300">
        
        {/* HERO SECTION — Обязательно должен содержать H1 (если его нет внутри HeroSection, добавь тут) */}
        <section className="w-full">
           <HeroSection />
        </section>

        {/* ОСНОВНОЙ КОНТЕНТ */}
        <div className="flex flex-col items-center w-full px-4 py-10 relative z-10">
          
          {/* БЛОК ФИЛЬТРОВ — Поисковики ценят доступную навигацию */}
          <nav className={`w-full ${containerWidth} flex flex-col gap-10 mb-10`} aria-label="Фильтры серверов">
            <div className="flex flex-col gap-6">
              <PromoBanner />
              <ServerFilters />
            </div>
          </nav>

          {/* СЕТКА (Сервера + Форум) */}
          <div className={`w-full ${containerWidth} flex flex-col lg:flex-row items-start gap-8`}>
            
            {/* СПИСОК СЕРВЕРОВ — Основной контент (article или section) */}
            <section className="flex-1 w-full min-w-0 order-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-4 bg-accent" aria-hidden="true" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted">
                  Список активных серверов
                </h2>
              </div>
              <ServerList game="all" />
            </section>

            {/* САЙДБАР: Форум — Дополнительный контент */}
            <aside className="w-full lg:w-[280px] shrink-0 order-2 lg:sticky lg:top-6">
               <div className="mb-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted mb-4">Обсуждения</h3>
                  <YandexAds/>
                  <ForumPosts />
                  <WeeklyLeaderboard/>
               </div>
            </aside>

          </div>
          
          {/* SEO-ТЕКСТ (Footer SEO) — Критически важно для Яндекса */}
          <section className={`w-full ${containerWidth} mt-20 opacity-40 hover:opacity-100 transition-opacity text-xs leading-relaxed`}>
            <h2 className="text-sm font-bold mb-4">Как выбрать лучший сервер Minecraft?</h2>
            <p>
              Наш мониторинг серверов <strong>Minecraft</strong> и <strong>Hytale</strong> предлагает продвинутую систему фильтрации. 
              Вы можете найти сервера по IP адресу, версии игры (от 1.8 до 1.21), наличию модов (Thaumcraft, Industrial Craft) 
              или режиму игры (Survival, SkyBlock, Anarchy). Мы проверяем онлайн в реальном времени, чтобы вы всегда имели 
              доступ к актуальным данным.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}