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

      {/* Робот увидит основной контент в теге main */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12">
        
        {/* Приветственный блок: Используем семантический header */}
        <header className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl md:text-[28px] font-black tracking-tighter uppercase mb-4 italic">
            Мониторинг серверов Майнкрафт <span className="text-orange-500">HardTimes</span>
          </h1>
          <p className="text-muted text-[10px] md:text-xs font-black uppercase tracking-[0.3em] max-w-2xl mx-auto opacity-60">
            Лучшие майнкрафт сервера и библиотека модов!
          </p>
        </header>

        {/* СЕТКА: Используем section и article для лучшего веса карточек */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-[1100px] animate-in fade-in zoom-in-95 duration-700">
          
          {/* КАРТОЧКА: СЕРВЕРА */}
          <article>
            <Link href="/monitoring" 
              title="Рейтинг серверов Майнкрафт"
              className="group relative overflow-hidden bg-card p-8 rounded-[2rem] border border-border hover:border-orange-500 transition-all duration-300 shadow-sm flex flex-col h-full"
            >
              <div className="w-12 h-12 bg-surface border border-border rounded-2xl flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                <HiOutlineFire className="w-6 h-6" aria-hidden="true" />
              </div>
              
              <h2 className="text-xl font-black uppercase mb-2 italic tracking-tight">Мониторинг Серверов</h2>
              <p className="text-muted text-[13px] mb-8 flex-1 leading-relaxed">
                Актуальный рейтинг лучших игровых серверов. Продвигай свой проект или найди сервер с живым онлайном и стабильной экономикой.
              </p>
              
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-orange-500 group-hover:gap-4 transition-all">
                Смотреть список <HiArrowRight />
              </div>
            </Link>
          </article>

          {/* КАРТОЧКА: ФОРУМ */}
          <article>
            <Link href="/forum" 
              title="Форум игроков HardTimes"
              className="group relative overflow-hidden bg-card p-8 rounded-[2rem] border border-border hover:border-emerald-500 transition-all duration-300 shadow-sm flex flex-col h-full"
            >
              <div className="w-12 h-12 bg-surface border border-border rounded-2xl flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                <HiOutlineChatBubbleLeftRight className="w-6 h-6" aria-hidden="true" />
              </div>
              
              <h2 className="text-xl font-black uppercase mb-2 italic tracking-tight">Игровой Форум</h2>
              <p className="text-muted text-[13px] mb-8 flex-1 leading-relaxed">
                Сообщество HardTimes: обсуждай новости, ищи команду (LFG) и делись гайдами по Minecraft и Hytale.
              </p>
              
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500 group-hover:gap-4 transition-all">
                К обсуждениям <HiArrowRight />
              </div>
            </Link>
          </article>

          {/* КАРТОЧКА: КОНТЕНТ */}
          <article>
            <Link href="/content" 
              title="Скачать моды и текстуры"
              className="group relative overflow-hidden bg-card p-8 rounded-[2rem] border border-border hover:border-purple-500 transition-all duration-300 shadow-sm flex flex-col h-full"
            >
              <div className="w-12 h-12 bg-surface border border-border rounded-2xl flex items-center justify-center text-purple-500 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                <HiOutlineCube className="w-6 h-6" aria-hidden="true" />
              </div>
              
              <h2 className="text-xl font-black uppercase mb-2 italic tracking-tight">База Контента</h2>
              <p className="text-muted text-[13px] mb-8 flex-1 leading-relaxed">
                Огромная библиотека: готовые сборки, уникальные моды, шейдеры и текстуры для твоего игрового клиента.
              </p>
              
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-purple-500 group-hover:gap-4 transition-all">
                В каталог модов <HiArrowRight />
              </div>
            </Link>
          </article>

        </section>

        {/* Скрытый блок для SEO (виден роботам, не мешает дизайну) */}
        <section className="sr-only">
          <h2>HardTimes — Лучший мониторинг серевров для игры Майнкрафт и Хайтел в России</h2>
          <p>Мы собираем IP адреса серверов Майнкрафт, помогаем игрокам найти сервера с модами или мини-играми и без лагов.</p>
        </section>

        {/* Декоративный футер: Используем footer */}
        <footer className="mt-16 flex flex-col items-center gap-3 opacity-30">
            <div className="h-[1px] w-12 bg-orange-500/50" />
            <p className="text-[9px] font-black text-muted uppercase tracking-[0.5em]">
              HardMonitoring © 2026 — Все права защищены
            </p>
        </footer>
      </main>
    </div>
  );
}