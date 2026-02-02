"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Sidebar from '../components/dashboard/dashboard';

const PACKAGES = [
  { id: 1, amount: 100, stars: 1000, bonus: 0, label: 'Старт' },
  { id: 2, amount: 500, stars: 5500, bonus: 10, label: 'Продвинутый', popular: true },
  { id: 3, amount: 1000, stars: 12000, bonus: 20, label: 'Элита' },
  { id: 4, amount: 2500, stars: 32500, bonus: 30, label: 'Магнат' },
  { id: 5, amount: 5000, stars: 75000, bonus: 50, label: 'Легенда' },
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
      <Sidebar />
      <main className="flex-1 w-full relative overflow-hidden flex flex-col items-center">
        
        {/* Фоновые свечения */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-5%] left-[10%] w-[30%] h-[30%] bg-yellow-500/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-[10%] right-[0%] w-[30%] h-[30%] bg-yellow-600/5 rounded-full blur-[100px]" />
        </div>

        <div className="w-full max-w-[1200px] relative z-10 py-10 md:py-16 px-4">
          {/* Заголовок */}
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter italic uppercase text-white">
              Магазин <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Звезд</span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base font-medium max-w-xl mx-auto opacity-80">
              Премиум-голоса — кратчайший путь в ТОП списка.
            </p>
          </div>

          {/* Сетка пакетов */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-16">
            {PACKAGES.map((pkg) => (
              <div 
                key={pkg.id}
                className={`relative group flex flex-col p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-2 ${
                  pkg.popular 
                  ? 'bg-[#151515] border-yellow-500/50 shadow-[0_10px_30px_rgba(234,179,8,0.1)] scale-105 z-20' 
                  : 'bg-[#111111] border-white/5 hover:border-yellow-500/30 shadow-xl'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg">
                    HOT
                  </div>
                )}

                <div className="mb-6 text-white text-center">
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-3">{pkg.label}</p>
                  
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-1">
                      <span className="text-3xl font-black tracking-tighter text-white">
                        {pkg.stars.toLocaleString()}
                      </span>
                      <span className="text-xl">⭐</span>
                    </div>
                    
                    {pkg.bonus > 0 && (
                      <div className="mt-2">
                        <span className="text-[9px] font-bold bg-green-500/10 text-green-400 px-2 py-0.5 rounded uppercase">
                          +{pkg.bonus}% БОНУС
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-auto text-white">
                  <div className="flex justify-center items-baseline gap-1 mb-5">
                    <span className="text-2xl font-black">{pkg.amount}</span>
                    <span className="text-gray-500 font-bold text-sm">₽</span>
                  </div>

                  <button
                    disabled={loading !== null}
                    onClick={() => handlePurchase(pkg.id, pkg.amount)}
                    className={`w-full py-3 rounded-xl text-xs font-black transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 ${
                      pkg.popular 
                      ? 'bg-yellow-500 text-black hover:bg-yellow-400' 
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/5'
                    }`}
                  >
                    {loading === pkg.id ? (
                      <div className="w-4 h-4 border-2 border-current/20 border-t-current rounded-full animate-spin" />
                    ) : (
                      <span>КУПИТЬ</span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Инфо блок компактный */}
          <div className="w-full p-6 rounded-2xl bg-[#111] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-white">
            <div className="text-center md:text-left">
              <h3 className="text-lg font-bold mb-1 text-yellow-500 uppercase tracking-tight">Моментальная доставка</h3>
              <p className="text-gray-500 text-sm max-w-md">
                Звезды зачисляются автоматически сразу после подтверждения транзакции.
              </p>
            </div>
            <div className="flex gap-3">
               <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/5 flex flex-col items-center">
                  <span className="text-[9px] text-gray-500 font-bold uppercase">Защита</span>
                  <span className="text-xs font-bold">SSL</span>
               </div>
               <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/5 flex flex-col items-center">
                  <span className="text-[9px] text-gray-500 font-bold uppercase">Поддержка</span>
                  <span className="text-xs font-bold">24/7</span>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}