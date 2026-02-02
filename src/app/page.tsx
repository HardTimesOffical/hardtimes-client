"use client";
import Sidebar from "./components/dashboard/dashboard";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { HiOutlineFire, HiOutlineCube, HiArrowRight } from "react-icons/hi";

export default function Home() {
  // Хук нужен, чтобы React перерисовывал страницу при смене темы
  const { isDark } = useTheme();

  return (
    // bg-background и text-foreground — это наши переменные из globals.css
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      <Sidebar />

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        
        {/* Приветственный блок */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase mb-4">
            Добро пожаловать в <span className="text-accent">HardTimes</span>
          </h1>
          <p className="text-muted text-lg font-medium max-w-xl mx-auto">
            Выберите направление, чтобы начать путешествие в мире Minecraft
          </p>
        </div>

        {/* СЕТКА */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-[900px]">
          
          {/* КАРТОЧКА: МОНИТОРИНГ */}
          <Link href="/monitoring" 
            className="group relative overflow-hidden bg-card p-8 rounded-2xl border border-border hover:border-accent transition-all duration-300 shadow-sm"
          >
            <div className="relative z-10 flex flex-col h-full">
              {/* Иконка с динамическим фоном поверхности */}
              <div className="w-12 h-12 bg-surface border border-border rounded-xl flex items-center justify-center text-accent mb-6">
                <HiOutlineFire className="w-6 h-6" />
              </div>
              
              <h2 className="text-xl font-black uppercase mb-2">Мониторинг</h2>
              <p className="text-muted text-sm mb-8 flex-1 leading-relaxed">
                Рейтинг лучших серверов Java, Bedrock и Hytale. Только живой онлайн и проверенные проекты.
              </p>
              
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent group-hover:gap-4 transition-all">
                СМОТРЕТЬ СЕРВЕРА <HiArrowRight />
              </div>
            </div>
          </Link>

          {/* КАРТОЧКА: КОНТЕНТ */}
          <Link href="/content/mods" 
            className="group relative overflow-hidden bg-card p-8 rounded-2xl border border-border hover:border-purple-500 transition-all duration-300 shadow-sm"
          >
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-12 h-12 bg-surface border border-border rounded-xl flex items-center justify-center text-purple-500 mb-6">
                <HiOutlineCube className="w-6 h-6" />
              </div>
              
              <h2 className="text-xl font-black uppercase mb-2">Контент Хаб</h2>
              <p className="text-muted text-sm mb-8 flex-1 leading-relaxed">
                Моды, шейдеры и текстуры. Всё, что нужно для создания своей идеальной сборки.
              </p>
              
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-purple-500 group-hover:gap-4 transition-all">
                ИССЛЕДОВАТЬ ХАБ <HiArrowRight />
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}