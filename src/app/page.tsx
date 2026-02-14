'use client';
import Sidebar from "./components/dashboard/dashboard";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { HiOutlineFire, HiOutlineCube, HiArrowRight, HiOutlineChatBubbleLeftRight } from "react-icons/hi2";

export default function Home() {
  const { isDark } = useTheme();

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      <Sidebar />

      <main className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12">
        
        {/* Приветственный блок */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4 italic">
            Добро пожаловать в <span className="text-orange-500">HardTimes</span>
          </h1>
          <p className="text-muted text-[10px] md:text-xs font-black uppercase tracking-[0.3em] max-w-2xl mx-auto opacity-60">
            Центральный узел экосистемы для игроков и создателей
          </p>
        </div>

        {/* СЕТКА (3 колонки) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-[1100px] animate-in fade-in zoom-in-95 duration-700">
          
          {/* КАРТОЧКА: СЕРВЕРА */}
          <Link href="/monitoring" 
            className="group relative overflow-hidden bg-card p-8 rounded-[2rem] border border-border hover:border-orange-500 transition-all duration-300 shadow-sm flex flex-col h-full"
          >
            <div className="w-12 h-12 bg-surface border border-border rounded-2xl flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
              <HiOutlineFire className="w-6 h-6" />
            </div>
            
            <h2 className="text-xl font-black uppercase mb-2 italic tracking-tight">Сервера</h2>
            <p className="text-muted text-[13px] mb-8 flex-1 leading-relaxed">
              Рейтинг лучших игровых серверов. Продвигай или найди свой идеальный сервер с живым онлайном.
            </p>
            
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-orange-500 group-hover:gap-4 transition-all">
              ИГРАТЬ СЕЙЧАС <HiArrowRight />
            </div>
          </Link>

          {/* КАРТОЧКА: ФОРУМ */}
          <Link href="/forum" 
            className="group relative overflow-hidden bg-card p-8 rounded-[2rem] border border-border hover:border-emerald-500 transition-all duration-300 shadow-sm flex flex-col h-full"
          >
            <div className="w-12 h-12 bg-surface border border-border rounded-2xl flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
              <HiOutlineChatBubbleLeftRight className="w-6 h-6" />
            </div>
            
            <h2 className="text-xl font-black uppercase mb-2 italic tracking-tight">Форум</h2>
            <p className="text-muted text-[13px] mb-8 flex-1 leading-relaxed">
              Обсуждай новости, ищи команду и делись своим опытом с другими игроками.
            </p>
            
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500 group-hover:gap-4 transition-all">
              К ОБСУЖДЕНИЯМ <HiArrowRight />
            </div>
          </Link>

          {/* КАРТОЧКА: КОНТЕНТ */}
          <Link href="/content" 
            className="group relative overflow-hidden bg-card p-8 rounded-[2rem] border border-border hover:border-purple-500 transition-all duration-300 shadow-sm flex flex-col h-full"
          >
            <div className="w-12 h-12 bg-surface border border-border rounded-2xl flex items-center justify-center text-purple-500 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
              <HiOutlineCube className="w-6 h-6" />
            </div>
            
            <h2 className="text-xl font-black uppercase mb-2 italic tracking-tight">Контент</h2>
            <p className="text-muted text-[13px] mb-8 flex-1 leading-relaxed">
              Сборки, моды и текстуры. Библиотека контента для множества игр!
            </p>
            
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-purple-500 group-hover:gap-4 transition-all">
              В КАТАЛОГ <HiArrowRight />
            </div>
          </Link>

        </div>

        {/* Декоративный футер */}
        <div className="mt-16 flex flex-col items-center gap-3 opacity-30">
            <div className="h-[1px] w-12 bg-orange-500/50" />
            <p className="text-[9px] font-black text-muted uppercase tracking-[0.5em]">
              HardMonitoring 2026
            </p>
        </div>
      </main>
    </div>
  );
}