import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito } from "next/font/google";
import "./globals.css";
import Header from "./components/header/header";
import { AuthProvider } from "../context/AuthContext";
import Script from "next/script";
import { GoogleAnalytics } from '@next/third-parties/google';
import { LanguageProvider } from "@/context/LanguageContext";

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
  title: "ServerSwamp - Minecraft Server List",
  description: "Discover and promote the best Minecraft servers on ServerSwamp. Join our community to find your next adventure!",
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
          </LanguageProvider>
        </AuthProvider>
      </body>
      <GoogleAnalytics gaId="G-J39EH619BR" />
    </html>
  );
}