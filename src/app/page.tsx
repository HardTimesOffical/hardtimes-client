import { Metadata } from "next";
import Sidebar from "./components/dashboard/dashboard";
import Link from "next/link";
import { HiOutlineFire, HiOutlineCube, HiArrowRight } from "react-icons/hi";

export const metadata: Metadata = {
  title: "HardTimes — Мониторинг Серверов Minecraft и Библиотека Модов",
  description: "Единая платформа для игроков: найди лучший сервер или скачай качественные моды и текстуры.",
};

export default async function Home() {
  return (
    <div className="flex min-h-screen bg-[#f8f9fa] main-layout-root">
      <Sidebar />

      <main className="flex-1 flex flex-col items-center justify-center min-w-0 p-6">
        
        {/* Приветственный блок */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase italic mb-4">
            Добро пожаловать в <span className="text-orange-500">HardTimes</span>
          </h1>
          <p className="text-gray-500 text-lg font-medium max-w-xl mx-auto">
            Выберите направление, чтобы начать путешествие в мире Minecraft
          </p>
        </div>

        {/* СЕТКА ВЫБОРА РАЗДЕЛА */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-[900px]">
          
          {/* КАРТОЧКА: МОНИТОРИНГ */}
          <Link href="/monitoring" className="group relative overflow-hidden bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-orange-100 transition-all duration-500">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
               <HiOutlineFire className="w-32 h-32 text-orange-500 translate-x-8 -translate-y-8" />
            </div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform">
                <HiOutlineFire className="w-8 h-8" />
              </div>
              
              <h2 className="text-2xl font-black text-gray-900 uppercase italic mb-2">Мониторинг</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-1">
                Рейтинг лучших серверов Java, Bedrock и Hytale. Версии, онлайн и лучшие сообщества.
              </p>
              
              <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-orange-500 group-hover:gap-4 transition-all">
                Перейти к серверам <HiArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* КАРТОЧКА: КОНТЕНТ */}
          <Link href="/content/mods" className="group relative overflow-hidden bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-purple-100 transition-all duration-500">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
               <HiOutlineCube className="w-32 h-32 text-purple-500 translate-x-8 -translate-y-8" />
            </div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-500 mb-6 group-hover:scale-110 transition-transform">
                <HiOutlineCube className="w-8 h-8" />
              </div>
              
              <h2 className="text-2xl font-black text-gray-900 uppercase italic mb-2">Контент Хаб</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-1">
                Огромный каталог модификаций, ресурспаков и датапаков для улучшения твоей игры.
              </p>
              
              <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-purple-500 group-hover:gap-4 transition-all">
                Исследовать контент <HiArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}