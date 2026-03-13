"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Header from "@/app/components/header/header";
import GlobalChat from "./components/chat/GlobalChat";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import Footer from "./components/footer/footer";
import MobileNav from "./components/dashboard/MobileNav";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // 1. Проверка на админку
  const isAdminPage = pathname.includes('/hard-stuff');
  
  // 2. Проверка на страницу лаунчера (скрываем всё лишнее)
  // Используем .includes, так как путь может быть /ru/launcher или /en/launcher
  const isLauncherPage = pathname.includes('/launcher');

  // Если это админка ИЛИ страница лаунчера — рендерим только контент без обвязки мониторинга
  if (isAdminPage || isLauncherPage) {
    return (
      <AuthProvider>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </AuthProvider>
    );
  }

  // В противном случае — рендерим стандартный лейаут сайта
  return (
    <AuthProvider>
      <LanguageProvider>
        <div className="flex min-h-screen">

          
          <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
            <Header/>
            <main className="flex-1">
              {children}
            </main>
            <Footer/>
          </div>

          <MobileNav onMenuClick={() => setIsMobileMenuOpen(true)} />
        </div>

        <GlobalChat />
      </LanguageProvider>
    </AuthProvider>
  );
}