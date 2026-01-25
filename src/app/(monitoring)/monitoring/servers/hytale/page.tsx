import Sidebar from "@/app/components/dashboard/dashboard";
import ServerList from "../ServersList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Сервера Hytale 2026 | Топ мониторинг и рейтинг серверов Хайтейл",
  description: "Найди лучшие сервера Hytale в нашем мониторинге. Актуальный список игровых миров: выживание, креатив, мини-игры и RPG в мире Орбис. Рейтинг и онлайн 24/7.",
  keywords: ["сервера hytale","хайтейл сервера","мониторинг хайтейл", "мониторинг hytale", "хайтайл сервера", "hytale servers list", "топ серверов hytale"],
};

export default function HytaleServersPage() {
  return (
    <div className="flex pt-20 min-h-screen bg-[#0d0a16] text-white">
      <Sidebar />

      <main className="flex-1 w-full relative overflow-x-hidden">
        {/* Атмосферное фоновое свечение */}
        <div className="absolute top-0 right-0 w-[700px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-[20%] left-[-5%] w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="flex flex-col items-center w-full px-4 py-6 md:py-8 relative z-10">
          
          {/* ШИРОКАЯ ШАПКА — шире чем список серверов */}
          <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-[1250px] mb-12 gap-8 bg-[#161225]/40 backdrop-blur-2xl p-6 md:px-12 md:py-10 rounded-[2.5rem] border border-white/5 shadow-[0_25px_60px_rgba(0,0,0,0.5)] relative overflow-hidden">
            
            {/* Декоративный акцентный луч сверху */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>

            <div className="flex items-center gap-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-purple-500 blur-2xl opacity-10 group-hover:opacity-30 transition-opacity"></div>
                <img 
                  className="w-20 h-20 object-contain relative z-10 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-transform hover:scale-105 duration-500" 
                  src="/icons/Hytale_Logo.png" 
                  alt="Hytale" 
                />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-[1000] uppercase tracking-tighter italic leading-none">
                  Hytale<span className="text-purple-500 text-shadow-glow">SERVERS</span>
                </h1>
                <div className="flex items-center gap-3 mt-3">
                   <div className="h-[1px] w-8 bg-purple-500/50"></div>
                   <p className="text-[11px] text-gray-400 font-black uppercase tracking-[0.4em] opacity-60">Навигатор Вселенной</p>
                </div>
              </div>
            </div>

            {/* Описательный блок вместо тех-данных */}
            <div className="flex flex-col md:items-end max-w-sm text-center md:text-right space-y-3">
              <p className="text-gray-400 text-[13px] leading-relaxed italic opacity-80 font-medium">
                «Исследуйте бесконечные просторы Орбиса. Каждый сервер — это уникальный мир, созданный сообществом для великих первооткрывателей.»
              </p>
              <div className="flex items-center gap-3 self-center md:self-end">
                <div className="h-[1px] w-12 bg-white/10"></div>
                <span className="text-[10px] font-black text-purple-400/50 uppercase tracking-widest">Архивы Орбиса • 2026</span>
              </div>
            </div>
          </div>
          
          {/* КОНТЕЙНЕР СПИСКА — уже шапки для иерархии */}
          <div className="w-full max-w-[1100px]">
            {/* Разделитель с подписью */}
            <div className="flex items-center gap-6 mb-12 px-4">
               <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
               <div className="flex items-center gap-4">
                  <div className="w-1 h-1 bg-purple-500 rotate-45 shadow-[0_0_8px_#a855f7]"></div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.5em]">Доступные миры</span>
                  <div className="w-1 h-1 bg-purple-500 rotate-45 shadow-[0_0_8px_#a855f7]"></div>
               </div>
               <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
            </div>

            {/* Список серверов */}
            <div className="relative min-h-[600px]">
              <ServerList game="hytale" isDark={true} />
            </div>
          </div>

        </div>
        <section className="w-full max-w-[900px] mt-24 mb-20 px-6 opacity-60 hover:opacity-100 transition-opacity duration-700">
        <div className="border-l-2 border-purple-500/30 pl-8 space-y-6 text-gray-400">
          <h2 className="text-xl font-black uppercase tracking-widest text-white italic">
            Мониторинг серверов <span className="text-purple-500">Hytale</span> — Твой путь в Орбис
          </h2>
          <div className="text-sm leading-relaxed space-y-4 font-medium">
            <p>
              Добро пожаловать в самый актуальный <strong>мониторинг серверов Hytale</strong>. В 2026 году вселенная Орбис расширилась сотнями уникальных миров, и наша задача — помочь вам найти идеальное место для приключений. Будь то классическое выживание, хардкорные RPG-фракции или инновационные мини-игры, наш <strong>топ серверов Хайтайл</strong> предоставляет полную информацию в реальном времени.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mt-6">
              <div>
                <h3 className="text-white font-bold mb-2 uppercase text-xs tracking-wider">Почему выбирают нас?</h3>
                <ul className="list-none space-y-2 text-[13px]">
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-purple-500 rounded-full"></div> 
                    Ежеминутная проверка статуса серверов.
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-purple-500 rounded-full"></div> 
                    Честный рейтинг, основанный на голосах сообщества.
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-bold mb-2 uppercase text-xs tracking-wider">Типы игровых миров</h3>
                <p className="text-[13px]">
                  От масштабных социальных хабов до закрытых творческих мастерских. В нашем списке вы найдете сервера с поддержкой модификаций, уникальными скриптами и кастомными ассетами.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      </main>
      
    </div>
  );
}