import Sidebar from "@/app/components/dashboard/dashboard";
import ServerList from "../ServersList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Сервера Hytale | Мониторинг и Топ 2026",
  description: "Список лучших игровых миров Hytale в одном месте. Актуальный онлайн и рейтинги.",
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
      </main>
    </div>
  );
}