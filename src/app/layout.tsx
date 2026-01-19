import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google';
import ClientLayout from "./ClientLayout"; // Импорт нашей обертки

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

// Все ваши метаданные остаются здесь (как были в вашем коде)
export const metadata: Metadata = {
  metadataBase: new URL('https://hardmonitoring.ru'),
  title: {
    default: "HardTimes — Мониторинг серверов Майнкрафт",
    template: "%s | ServerSwamp" 
  },
  // ... остальные метаданные из вашего прошлого сообщения ...
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${geistSans.variable} ${geistMono.variable} ${nunito.variable} antialiased`}>
        {/* Оборачиваем всё в клиентскую логику */}
        <ClientLayout>
          {children}
        </ClientLayout>
        
        <GoogleAnalytics gaId="G-04ESSL6306" />
      </body>
    </html>
  );
}