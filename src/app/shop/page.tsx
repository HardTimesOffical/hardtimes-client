"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Sidebar from '../components/dashboard/dashboard'; // Исправленный импорт

const PACKAGES = [
  { id: 1, amount: 100, stars: 1000, bonus: 0, label: 'Старт', color: 'from-blue-600/20', accent: 'text-blue-400', shadow: 'shadow-blue-500/10' },
  { id: 2, amount: 500, stars: 5500, bonus: 10, label: 'Продвинутый', popular: true, color: 'from-yellow-600/20', accent: 'text-yellow-400', shadow: 'shadow-yellow-500/20' },
  { id: 3, amount: 1000, stars: 12000, bonus: 20, label: 'Элита', color: 'from-purple-600/20', accent: 'text-purple-400', shadow: 'shadow-purple-500/10' },
  { id: 4, amount: 2500, stars: 32500, bonus: 30, label: 'Магнат', color: 'from-emerald-600/20', accent: 'text-emerald-400', shadow: 'shadow-emerald-500/10' },
  { id: 5, amount: 5000, stars: 75000, bonus: 50, label: 'Легенда', color: 'from-red-600/20', accent: 'text-red-400', shadow: 'shadow-red-500/10' },
];

export default function ShopPage() {
  const [loading, setLoading] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePurchase = async (pkgId: number, amount: number) => {
    setLoading(pkgId);
    try {
      const { data } = await api.post('/payments/create', { amount });
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      console.error("Purchase error:", err);
      alert(err.response?.data?.error || "Ошибка при создании платежа.");
    } finally {
      setLoading(null);
    }
  };

  if (!mounted) return <div className="min-h-screen bg-[#0a0a0a] w-full" />;

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      {/* Левая часть: Новый Сайдбар */}

      {/* Правая часть: Контент магазина */}
      <main className="flex-1 w-full relative overflow-hidden flex flex-col items-center">
        
        {/* Декоративные фоновые свечения */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-yellow-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="w-full max-w-[1440px] relative z-10 py-12 md:py-20 px-4">
          {/* Заголовок */}
          <div className="text-center mb-16 md:mb-24">
            <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter italic uppercase text-white">
              Магазин <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600">Звезд</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">
              Покупайте звезды для продвижения своего проекта. 
              Премиум-голоса — кратчайший путь в ТОП списка.
            </p>
          </div>

          {/* Сетка пакетов */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-20">
            {PACKAGES.map((pkg) => (
              <div 
                key={pkg.id}
                className={`relative group flex flex-col p-8 rounded-[2.5rem] border transition-all duration-500 hover:-translate-y-3 ${
                  pkg.popular 
                  ? 'bg-gradient-to-b from-yellow-500/15 to-transparent border-yellow-500 shadow-[0_20px_50px_rgba(234,179,8,0.15)] scale-105 z-20' 
                  : `bg-white/5 border-white/10 hover:border-white/20 bg-gradient-to-b ${pkg.color} to-transparent ${pkg.shadow}`
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-600 to-yellow-400 text-black text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                    Лучший выбор
                  </div>
                )}

                <div className="mb-10 text-white">
                  <p className="text-gray-500 text-xs font-black uppercase tracking-[0.2em] mb-4">{pkg.label}</p>
                  
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-5xl font-black tracking-tighter ${pkg.popular ? 'text-yellow-500' : 'text-white'}`}>
                        {pkg.stars.toLocaleString()}
                      </span>
                      <span className="text-2xl">⭐</span>
                    </div>
                    
                    {pkg.bonus > 0 && (
                      <div className="mt-2 text-left">
                        <span className="text-[11px] font-black bg-green-500/20 text-green-400 px-2.5 py-1 rounded-lg uppercase tracking-tight">
                          +{pkg.bonus}% БОНУС ВКЛЮЧЕН
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-auto text-white">
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-3xl font-black">{pkg.amount}</span>
                    <span className="text-gray-500 font-bold text-lg">₽</span>
                  </div>

                  <button
                    disabled={loading !== null}
                    onClick={() => handlePurchase(pkg.id, pkg.amount)}
                    className={`w-full py-4 rounded-2xl font-black transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 group/btn ${
                      pkg.popular 
                      ? 'bg-yellow-500 text-black hover:bg-yellow-400 shadow-[0_10px_20px_rgba(234,179,8,0.2)]' 
                      : 'bg-white text-black hover:bg-gray-200'
                    }`}
                  >
                    {loading === pkg.id ? (
                      <div className="w-6 h-6 border-3 border-black/20 border-t-black rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>ПОПОЛНИТЬ</span>
                        <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Инфо блок */}
          <div className="w-full p-8 md:p-12 rounded-[3rem] bg-gradient-to-br from-white/5 to-transparent border border-white/10 flex flex-col md:flex-row items-center justify-between gap-10 text-white">
            <div className="max-w-2xl text-center md:text-left">
              <h3 className="text-2xl font-bold mb-4 text-yellow-500 uppercase italic tracking-tight">Моментальное зачисление</h3>
              <p className="text-gray-400 leading-relaxed text-lg">
                Звезды появятся на вашем балансе сразу после оплаты. Используйте их для покупки премиум-голосов, 
                выделения сервера цветом или поднятия в списке.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
               <div className="px-8 py-5 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center justify-center">
                  <span className="text-[10px] text-gray-500 font-bold uppercase mb-1 tracking-widest">Безопасно</span>
                  <span className="text-sm font-black">SSL PROTECT</span>
               </div>
               <div className="px-8 py-5 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center justify-center">
                  <span className="text-[10px] text-gray-500 font-bold uppercase mb-1 tracking-widest">Поддержка</span>
                  <span className="text-sm font-black">24/7 ONLINE</span>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}