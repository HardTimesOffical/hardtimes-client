// app/page.tsx
import HomeClient from "./HomeClient"
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL('https://hardmonitoring.ru'),
  title: {
    default: "Актуальный Мониторинг серверов Майнкрафт | Список майнкрафт серверов",
    template: "%s" 
  },
  description: "Лучший мониторинг серверов Майнкрафт. Найди идеальное место для игры с друзьями. Рейтинг, статистика, отзывы и форум на нашем майнкрафт мониторинге.",
  keywords: [
    "мониторинг серверов майнкрафт", 
    "сервера minecraft", 
    "список серверов майнкрафт", 
    "мониторинг серверов", 
    "ip серверов майнкрафт", 
    "рейтинг серверов",
    "майнкрафт сервера с модами",
    "майнкрафт моды",
    "майнкрафт лаунчер",
    "лучший лаунчер"
  ],
  authors: [{ name: "HardTimes Team" }],
  creator: "HardTimes",

  // Настройки для соцсетей (OpenGraph) - как сайт будет выглядеть в Discord/Telegram/VK
  openGraph: {
    title: "Найди свой идеальный сервер среди множества игр!",
    description: "Рейтинг серверов Minecraft и Hytale с большим и активным онлайном и реальными отзывами.",
    url: 'https://hardmonitoring.ru',
    siteName: 'HardTimes Monitoring',
    images: [
      {
        url: '/og-image.png', // Создай картинку 1200x630 в public/
        width: 1200,
        height: 630,
        alt: 'Превью HardTimes',
      },
    ],
    locale: 'ru_RU',
    type: 'website',
  },

  // Настройки для Twitter (X)
  twitter: {
    card: 'summary_large_image',
    title: "HardTimes — Мониторинг серверов Майнкрафт",
    description: "Твой проводник в мире серверов Minecraft и Hytale.",
    images: ['/og-image.png'],
  },

  // Иконки (проверь наличие файлов в папке public)
  icons: {
    icon: '/favicon.ico',
  },

  // Инструкции для роботов
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Для мобильных устройств (цвет темы в браузере)
  themeColor: '#f97316', // Оранжевый цвет твоего бренда
};

export default function Page() {
  return (
    <>
      {/* Скрытый заголовок для поисковиков (H1 должен быть один на страницу) */}
      <h1 className="sr-only">
           Мониторинг серверов Майнкрафт со списком всех актульных серверов Minecraft
      </h1>
      
      <HomeClient />
      
      {/* SEO-блок внизу страницы, который виден роботам сразу */}
      <footer className="sr-only">
        <p>
          Добро пожаловать на Майнкрафт мониторинг. Мы предоставляем актуальный список серверов Minecraft . На нашем форуме вы найдете моды, плагины и текстуры.
        </p>
      </footer>
    </>
  );
}