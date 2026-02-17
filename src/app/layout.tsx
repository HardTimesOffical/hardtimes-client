import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google';
import ClientLayout from "./ClientLayout"; // Импорт нашей обертки
import { ThemeProvider } from "@/context/ThemeContext";
import Script from "next/script";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://hardmonitoring.ru'),
  title: {
    default: "HardTimes — Мониторинг серверов Майнкрафт и Хайтейл",
    template: "%s | HardTimes" 
  },
  description: "Лучший мониторинг серверов Майнкрафт и Хайтел. Найди идеальное место для игры: от ванильного выживания до уникальных RPG сборок. Статистика, отзывы и честный рейтинг.",
  keywords: ["мониторинг серверов майнкрафт", "сервера minecraft", "hytale сервера", "рейтинг серверов", "майнкрафт сервера с модами", "ip серверов майнкрафт"],
  authors: [{ name: "HardTimes Team" }],
  
  // Настройки для соцсетей (OpenGraph)
  openGraph: {
    title: "HardTimes — Мониторинг серверов Майнкрафт и Хайтейл",
    description: "Найди свой идеальный сервер на нашем монитиоринге. Актуальный онлайн, проверенные майнкрафт сервера и хайтел.",
    url: 'https://hardmonitoring.ru',
    siteName: 'HardTimes',
    locale: 'ru_RU',
    type: 'website',
  },

  // Настройки для Twitter/X и Discord
  twitter: {
    card: 'summary_large_image',
    title: "HardTimes — Мониторинг серверов Майнкрафт",
    description: "Твой проводник в мире серверов Minecraft и Hytale.",
    images: ['/og-image.png'],
  },

  // Иконки (если лежат в public)
  icons: {
    icon: '/favicon.ico',
  },

  // Роботы
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${nunito.variable} antialiased`}>
        <ThemeProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </ThemeProvider>
        
        <GoogleAnalytics gaId="G-04ESSL6306" />

        {/* Yandex.Metrika counter */}
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

            ym(106883591, "init", {
              clickmap:true,
              trackLinks:true,
              accurateTrackBounce:true,
              webvisor:true,
              ecommerce:"dataLayer"
            });
          `}
        </Script>
        <noscript>
          <div>
            <img 
              src="https://mc.yandex.ru/watch/106883591" 
              style={{ position: 'absolute', left: '-9999px' }} 
              alt="" 
            />
          </div>
        </noscript>
      </body>
    </html>
  );
}