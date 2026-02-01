'use client';
import Link from 'next/link';
import { HiArrowLeft, HiHome } from 'react-icons/hi';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 overflow-hidden relative">
      
      {/* Декоративные пятна света на фоне для "яркости" */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-100/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full text-center relative z-10">
        
        {/* Анимированный блок 404 */}
        <div className="relative mb-2">
          <h1 className="text-[160px] font-black leading-none select-none tracking-tighter text-gray-60">
            404
          </h1>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Иконка с анимацией левитации */}
            <div className="w-24 h-24 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2.5rem] flex items-center justify-center animate-[bounce_3s_infinite] border border-gray-50">
              <span className="text-4xl">💀</span>
            </div>
          </div>
        </div>

        {/* Заголовок с градиентом */}
        <h2 className="text-2xl font-black bg-gradient-to-r from-gray-900 to-gray-500 bg-clip-text text-transparent mb-12 uppercase tracking-[0.2em]">
          Путь не найден
        </h2>

        {/* Кнопки с эффектами */}
        <div className="flex flex-col gap-4 items-center">
          <Link 
            href="/"
            className="group relative w-full max-w-[280px] py-5 bg-gray-900 text-white rounded-[2.2rem] font-black text-[11px] uppercase tracking-[0.2em] transition-all hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] active:scale-95 overflow-hidden"
          >
            {/* Эффект блика при наведении */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            <span className="relative z-10 flex items-center justify-center gap-2">
              <HiHome size={18} /> На главную
            </span>
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="w-full max-w-[280px] py-5 bg-white border border-gray-100 text-gray-400 rounded-[2.2rem] font-black text-[11px] uppercase tracking-[0.2em] transition-all hover:text-gray-900 hover:border-gray-300 active:scale-95 flex items-center justify-center gap-2"
          >
            <HiArrowLeft size={18} /> Вернуться назад
          </button>
        </div>

      </div>

      {/* Маленький декоративный элемент снизу */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-1 h-12 bg-gradient-to-b from-gray-100 to-transparent rounded-full" />
      </div>
    </div>
  );
}