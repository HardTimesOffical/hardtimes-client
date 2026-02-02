"use client";

import { useState } from "react";
import { usePathname } from "next/navigation"; // Импортируем хук для проверки пути
import Sidebar from "./components/dashboard/dashboard";
import Header from "./components/header/header";
import GlobalChat from "./components/chat/GlobalChat";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import SnowEffect from "./components/snow/SnowEffect";
import Footer from "./components/footer/footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Проверяем, находится ли пользователь в админке
  const isAdminPage = pathname.startsWith('/hard-stuff');

  // Если это админка, возвращаем только детей, обернутых в провайдеры
  // (Без основного Сайдбара, Хедера и Чата)
  if (isAdminPage) {
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
        <SnowEffect />
        
        <div className="flex min-h-screen">
          <Sidebar isMobileOpen={isMobileMenuOpen} setIsMobileOpen={setIsMobileMenuOpen} />
          
          <div className="flex-1 flex flex-col min-w-0 md:pl-20 transition-all duration-300">
            <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
            <main className="flex-1">
              {children}
            </main>
            <Footer/>
          </div>
        </div>

        <GlobalChat />
      </LanguageProvider>
    </AuthProvider>
  );
}