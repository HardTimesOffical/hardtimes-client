"use client";

import { useState } from "react";
import Sidebar from "./components/dashboard/dashboard";
import Header from "./components/header/header";
import GlobalChat from "./components/chat/GlobalChat";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import SnowEffect from "./components/snow/SnowEffect";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <AuthProvider>
      <LanguageProvider>
        <SnowEffect />
        
       <div className="flex min-h-screen">
  <Sidebar isMobileOpen={isMobileMenuOpen} setIsMobileOpen={setIsMobileMenuOpen} />
  
  {/* Добавляем md:pl-20. Это создаст место ровно под свернутый сайдбар */}
  <div className="flex-1 flex flex-col min-w-0 md:pl-20 transition-all duration-300">
    <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
    <main className="flex-1">
      {children}
    </main>
  </div>
</div>

        <GlobalChat />
      </LanguageProvider>
    </AuthProvider>
  );
}