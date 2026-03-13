import { Metadata } from "next";
import ServerList from "./servers/ServersList";
import ServerFilters from "@/app/components/servercard/ServerFilters";
import HeroSection from "@/app/components/header/HeroSection";
import PromoBanner from "@/app/components/blocks/PromoBanner";
import ForumPosts from "@/app/components/blocks/ForumPosts";
import { WeeklyLeaderboard } from "@/app/components/dashboard/WeeklyLeaderboard";
import YandexAds from "@/app/components/yandex/YandexAds";
import Footer from "@/app/components/footer/footer";

export const metadata: Metadata = {
  // Title: главный запрос + бренд. До 60 символов — Яндекс не обрезает.
  title: "Мониторинг серверов Майнкрафт 2026 — HardTimes",

  // Description: 150–160 символов, глагол + ключи + призыв. Яндекс показывает первые ~160 симв.
  description: "Топ серверов Майнкрафт Java и Bedrock с живым онлайном. Выбери сервер по версии, режиму или модам — актуальный рейтинг, IP-адреса и честные отзывы на HardTimes.",

  // Keywords: Яндекс до сих пор учитывает тег keywords (в отличие от Google).
  // Порядок важен — самые частотные запросы первыми.
  keywords: [
    // Высокочастотные
    "сервера майнкрафт",
    "мониторинг серверов майнкрафт",
    "сервера minecraft",
    "топ серверов майнкрафт",
    // Среднечастотные с хвостами
    "сервера майнкрафт java edition",
    "сервера майнкрафт bedrock",
    "сервера майнкрафт с модами",
    "сервера майнкрафт 2026",
    "лучшие сервера майнкрафт",
    "рейтинг серверов майнкрафт",
    // Низкочастотные / длинный хвост
    "ip адрес сервера майнкрафт",
    "найти сервер майнкрафт онлайн",
    "сервера майнкрафт выживание",
    "сервера майнкрафт мини игры",
    "сервера майнкрафт анархия",
    // Смежные игры
    "сервера hytale",
    "мониторинг серверов hytale",
    "voxelcore сервера",
  ],

  // Canonical — обязателен, Яндекс строго следит за дублями
  alternates: {
    canonical: 'https://hardmonitoring.ru',
  },

  // Robots — явно разрешаем индексацию
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },

  // OpenGraph — для шаринга ВКонтакте и Telegram (основные соцсети РФ)
  openGraph: {
    title: "Мониторинг серверов Майнкрафт — HardTimes",
    description: "Топ серверов Minecraft Java и Bedrock с живым онлайном. Актуальный рейтинг, IP-адреса, моды и режимы.",
    url: 'https://hardmonitoring.ru',
    siteName: 'HardTimes — Мониторинг серверов Майнкрафт',
    locale: 'ru_RU',
    type: 'website',
    images: [
      {
        url: 'https://hardmonitoring.ru/og-image.jpg', // заменить на реальный путь
        width: 1200,
        height: 630,
        alt: 'HardTimes — Мониторинг серверов Майнкрафт',
      },
    ],
  },

  // Twitter/X Card — для превью в мессенджерах
  twitter: {
    card: 'summary_large_image',
    title: "Мониторинг серверов Майнкрафт — HardTimes",
    description: "Топ серверов Minecraft Java и Bedrock с живым онлайном и честными отзывами.",
    images: ['https://hardmonitoring.ru/og-image.jpg'],
  },
};

export default async function Home({ searchParams }: { searchParams: any }) {
  const filters = await searchParams;
  const containerWidth = "max-w-[1132px]";
  

  return (
    <div className="flex min-h-screen text-foreground transition-colors duration-200 relative">
      {/* Fixed BG */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ backgroundImage: "url('https://i.pinimg.com/736x/18/d8/2a/18d82a8a38f02b7d401283a3ac0650d9.jpg')", backgroundSize: "cover", backgroundPosition: "center top", filter: "saturate(0.35) brightness(0.15)" }} />
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent 10%, var(--background) 100%)" }} />

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
            <Footer/>
            {/* ── SEO-текст для Яндекса (виден роботам, скрыт визуально) ── */}
            {/*
              sr-only скрывает от пользователей, но Яндекс индексирует.
              Важно: текст должен быть релевантным, не спамом.
              Яндекс ценит естественный текст с вхождениями ключевых слов.
            */}
            <section className="sr-only" aria-hidden="true">
              <h2>Мониторинг серверов Майнкрафт — рейтинг лучших серверов 2026</h2>
              <p>
                HardTimes — это актуальный мониторинг серверов Майнкрафт для Java и Bedrock Edition.
                Мы собираем IP-адреса серверов Minecraft, отслеживаем живой онлайн и публикуем честные отзывы игроков.
                В нашем рейтинге вы найдёте сервера с выживанием, анархией, мини-играми, модами и уникальными режимами.
              </p>
              <h3>Как найти хороший сервер Майнкрафт?</h3>
              <p>
                Используйте фильтры по версии игры — Java Edition или Bedrock, по типу сервера и установленным модам.
                Каждый сервер в нашем мониторинге проходит проверку на доступность и стабильность онлайна.
                Подключайтесь к серверам с наибольшим количеством активных игроков прямо сейчас.
              </p>
              <h3>Топ серверов Minecraft Java Edition</h3>
              <p>
                Java Edition — классика Майнкрафт для ПК. Найдите сервера с Forge, Fabric или NeoForge модами,
                кастомными плагинами и активным сообществом игроков.
              </p>
              <h3>Сервера Minecraft Bedrock Edition</h3>
              <p>
                Bedrock Edition поддерживается на Windows, Android, iOS, Xbox и PlayStation.
                Найдите кроссплатформенные сервера для игры с друзьями на любом устройстве.
              </p>
              <h3>Добавить сервер в мониторинг</h3>
              <p>
                Владелец сервера Майнкрафт? Добавьте свой сервер в мониторинг HardTimes бесплатно.
                Получите трафик от тысяч игроков, ищущих новые сервера каждый день.
              </p>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}