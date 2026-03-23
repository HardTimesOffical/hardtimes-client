import { Metadata } from "next";
import { Suspense } from "react";
import ForumClient from "./ForumClient";
import Footer from "@/app/components/footer/footer";

// ── SEO ──────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Форум Майнкрафт — мониторинг серверов, гайды, поиск напарника 2026",
  description: "Форум мониторинга серверов Майнкрафт. Обсуждай сервера Minecraft, ищи напарника, читай гайды по модам и серверам. Актуальные темы сообщества майнкрафт.",
  keywords: [
    "форум майнкрафт",
    "форум мониторинг серверов майнкрафт",
    "форум minecraft серверов",
    "сообщество майнкрафт серверов",
    "форум игроков майнкрафт серверов",
    "гайды по серверам майнкрафт",
    "поиск напарника майнкрафт",
    "обсуждение серверов minecraft java",
    "обсуждение серверов minecraft bedrock",
    "форум мониторинга серверов",
    "технические проблемы серверов майнкрафт",
    "моды для серверов майнкрафт обсуждение",
    "пиар сервера майнкрафт форум",
    "реклама сервера майнкрафт бесплатно",
    "майнкрафт форум 2026",
    "ищу напарника на сервер майнкрафт",
  ],
  alternates: {
    canonical: "https://hardmonitoring.ru/forum",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    title: "Форум мониторинга серверов Майнкрафт",
    description: "Форум сообщества серверов Minecraft. Обсуждения, гайды по серверам, поиск напарника и бесплатная реклама серверов Майнкрафт.",
    url: "https://hardmonitoring.ru/forum",
    siteName: "Мониторинг серверов Майнкрафт",
    locale: "ru_RU",
    type: "website",
    images: [
      {
        url: "https://hardmonitoring.ru/og-forum.jpg",
        width: 1200,
        height: 630,
        alt: "Форум мониторинга серверов Майнкрафт",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Форум мониторинга серверов Майнкрафт",
    description: "Обсуждения серверов Minecraft, гайды, поиск напарника. Форум мониторинга майнкрафт серверов.",
  },
};

// ── JSON-LD — DiscussionForum + BreadcrumbList для Яндекса ───────
const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "DiscussionForumPosting",
    "name": "Форум мониторинга серверов Майнкрафт",
    "description": "Форум сообщества мониторинга серверов Minecraft. Гайды по серверам майнкрафт, поиск напарника на сервер, обсуждение модов и бесплатная реклама серверов.",
    "url": "https://hardmonitoring.ru/forum",
    "inLanguage": "ru",
    "about": {
      "@type": "Thing",
      "name": "Мониторинг серверов Майнкрафт",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Мониторинг серверов Майнкрафт",
        "item": "https://hardmonitoring.ru",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Форум Майнкрафт",
        "item": "https://hardmonitoring.ru/forum",
      },
    ],
  },
];

// ── Page ─────────────────────────────────────────────────────────
export default function ForumPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />


      <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <span className="font-mc-pixel text-[10px] text-muted uppercase tracking-widest animate-pulse">
              Загрузка…
            </span>
          </div>
        }>
          <ForumClient />
        </Suspense>
      <Footer />

      {/* SEO-текст для Яндекса */}
      <section className="sr-only" aria-hidden="true">
        <h2>Форум мониторинга серверов Майнкрафт</h2>
        <p>
          Форум мониторинга серверов Майнкрафт — место где игроки Minecraft обсуждают сервера,
          делятся гайдами по серверам и модам, ищут напарников для совместной игры
          на серверах Java и Bedrock Edition.
        </p>
        <h3>Обсуждение серверов Майнкрафт на форуме</h3>
        <p>
          Обсуждай лучшие сервера из мониторинга Майнкрафт, оставляй отзывы и помогай
          другим игрокам выбрать сервер по версии, модам и игровому режиму.
        </p>
        <h3>Бесплатная реклама серверов Майнкрафт</h3>
        <p>
          Владелец сервера Майнкрафт? Раздел «Пиар серверов» на форуме мониторинга
          позволяет бесплатно рассказать о своём сервере тысячам игроков.
          Добавь сервер в мониторинг и продвигай его на форуме.
        </p>
        <h3>Поиск напарника на сервер Майнкрафт</h3>
        <p>
          Ищи напарника для совместной игры на серверах Майнкрафт.
          Выживание, анархия, мини-игры — найди игрока для любого режима
          из мониторинга серверов.
        </p>
        <h3>Гайды по серверам и модам Майнкрафт</h3>
        <p>
          Читай гайды по настройке серверов Minecraft Java и Bedrock, установке модов
          Forge и Fabric, созданию ресурспаков и администрированию игровых серверов
          из мониторинга.
        </p>
        <h3>Технические проблемы серверов Minecraft</h3>
        <p>
          Проблемы с подключением к серверу Майнкрафт? Задай вопрос на форуме мониторинга —
          опытные игроки помогут решить любую техническую проблему с серверами
          Minecraft Java Edition и Bedrock Edition.
        </p>
      </section>
    </>
  );
}