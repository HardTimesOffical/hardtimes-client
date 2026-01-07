import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito } from "next/font/google";
import "./globals.css";
import Header from "./components/header/header";
import { AuthProvider } from "../context/AuthContext";
import Script from "next/script";
import { GoogleAnalytics } from '@next/third-parties/google';
import { LanguageProvider } from "@/context/LanguageContext";
import Footer from "./components/footer/footer";
import GlobalChat from "./components/chat/GlobalChat";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://serverswamp.ru'), // Укажи свой домен
  title: {
    default: "ServerSwamp — Мониторинг серверов Майнкрафт",
    template: "%s | ServerSwamp" 
  },
  description: "ServerSwamp — лучший список серверов Minecraft. Найдите идеальный сервер для игры или продвигайте свой проект в нашем топе серверов Java и Bedrock.",
  keywords: ["сервера майнкрафт", "мониторинг серверов", "minecraft servers", "сервера 1.21", "бесплатный донат"],
  openGraph: {
    title: "ServerSwamp — Найди свой идеальный сервер Minecraft",
    description: "Рейтинг и мониторинг серверов Minecraft. Честный топ, отзывы и удобный поиск.",
    url: 'https://serverswamp.com',
    siteName: 'ServerSwamp',
    images: [
      {
        url: '#', // Положи картинку в /public (1200x630)
        width: 1200,
        height: 630,
      },
    ],
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ServerSwamp',
    description: 'Лучший мониторинг серверов Minecraft',
    images: ['#'],
  },
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${nunito.variable} antialiased`}
      >
        <Script 
          src="https://js.onclckmn.com/static/onclicka.js" 
          data-admpid="405773" 
          strategy="afterInteractive"
        />
        <AuthProvider>
          {/* Переносим LanguageProvider сюда, чтобы Header тоже имел к нему доступ */}
          <LanguageProvider>
            <Header />
            {children}
             <GlobalChat/>
            <Footer />
          </LanguageProvider>
        </AuthProvider>
      </body>
      <GoogleAnalytics gaId="G-J39EH619BR" />
    </html>
  );
}