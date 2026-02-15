import { Metadata } from "next";
import Sidebar from "@/app/components/dashboard/dashboard"; 
import ServerList from "./servers/ServersList";
import ServerFilters from "@/app/components/servercard/ServerFilters";
import HeroSection from "@/app/components/header/HeroSection";
import PromoBanner from "@/app/components/blocks/PromoBanner";
import ForumPosts from "@/app/components/blocks/ForumPosts";
import { WeeklyLeaderboard } from "@/app/components/dashboard/WeeklyLeaderboard";

export const metadata: Metadata = {
  title: "Мониторинг серверов Майнкрафт — Топ список Java и Bedrock",
  description: "Актуальный список серверов Minecraft. Рейтинг, онлайн, версии и описание лучших проектов.",
};

export default async function Home({ searchParams }: { searchParams: any }) {
  const filters = await searchParams;
  const containerWidth = "max-w-[1132px]";

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-200 main-layout-root">
      
      <Sidebar />

      {/* Убрали md:pl-16 отсюда! Теперь обертка занимает всё место от края до края */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        
        {/* HERO SECTION — Фон теперь на всю ширину, а отступ для текста мы добавим внутри компонента или через обертку ниже */}
        <div className="w-full">
           <HeroSection />
        </div>

        {/* ГЛАВНЫЙ КОНТЕНТ — Отступ md:pl-16 добавляем только здесь, чтобы контент не залез под сайдбар */}
        <main className="w-full flex flex-col items-center">
          <div className={`w-full ${containerWidth} px-4 sm:px-6 lg:px-8 pt-6 md:pt-10 pb-20 mx-auto`}>
            
            {/* ВЕРХНИЙ БЛОК */}
            <div className="flex flex-col gap-6 md:gap-8 mb-8 md:mb-10">
              <header className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-6 md:h-8 bg-accent rounded-full" />
                  <h1 className="text-lg md:text-xl font-[1000] text-foreground-bright tracking-tighter uppercase leading-none">
                    Топ <span className="text-accent">Серверов</span>
                  </h1>
                </div>
                <p className="text-muted text-xs md:text-sm font-medium ml-4 max-w-md">
                  Лучшие игровые площадки сообщества HardMonitoring
                </p>
              </header>

              <div className="relative z-30 flex flex-col gap-4 md:gap-6">
                <div className="w-full overflow-hidden">
                  <PromoBanner />
                </div>
                <ServerFilters />
              </div>
            </div>

            {/* НИЖНИЙ БЛОК */}
            <div className="flex flex-col lg:flex-row items-start gap-6 md:gap-8">
              <div className="w-full lg:flex-1 min-w-0 order-1">
                <div className="relative z-10">
                  <ServerList filters={filters} game="all" />
                </div>
              </div>

              <aside className="w-full flex flex-col gap-5 lg:w-[280px] shrink-0 order-2">
                 <ForumPosts />
                 <WeeklyLeaderboard/>
              </aside>
            </div>
            
          </div>
        </main>
      </div>
    </div>
  );
}