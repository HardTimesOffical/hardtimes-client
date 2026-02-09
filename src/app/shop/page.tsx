"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Sidebar from '../components/dashboard/dashboard';
import { HiStar, HiLightningBolt, HiCursorClick } from 'react-icons/hi';

// Обновленные пакеты: 1 звезда = 1 рубль + бонусы
const PACKAGES = [
  { id: 1, amount: 100, stars: 100, bonus: 0, label: 'Старт' },
  { id: 2, amount: 500, stars: 550, bonus: 10, label: 'Продвинутый', popular: true },
  { id: 3, amount: 1000, stars: 1200, bonus: 20, label: 'Элита' },
  { id: 4, amount: 2500, stars: 3250, bonus: 30, label: 'Магнат' },
  { id: 5, amount: 5000, stars: 6750, bonus: 35, label: 'Легенда' }, // 5000 + 35% = 6750
];

export default function ShopPage() {
  const [loading, setLoading] = useState<number | string | null>(null);
  const [mounted, setMounted] = useState(false);
  
  // Состояние для кастомного ввода
  const [customAmount, setCustomAmount] = useState<string>("100");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePurchase = async (id: number | string, amount: number) => {
    if (amount < 1) return;
    setLoading(id);
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

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    const num = parseInt(val) || 0;
    if (num <= 10000) {
      setCustomAmount(val);
    }
  };

  if (!mounted) return <div className="min-h-screen bg-[#0a0a0a] w-full" />;

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <Sidebar />
      <main className="flex-1 w-full relative overflow-hidden flex flex-col items-center pb-20">
        
        {/* Фоновые свечения */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-5%] left-[10%] w-[30%] h-[30%] bg-yellow-500/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-[10%] right-[0%] w-[30%] h-[30%] bg-purple-600/5 rounded-full blur-[100px]" />
        </div>

        <div className="w-full max-w-[1100px] relative z-10 py-10 md:py-16 px-4">
          {/* Заголовок */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tighter italic uppercase text-white">
              Магазин <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Звезд</span>
            </h1>
            <p className="text-gray-500 text-xs md:text-sm font-bold uppercase tracking-[0.2em]">
              Покупайте звезды и поддерживайте любимые проекты!
            </p>
          </div>

          {/* Сетка пакетов */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {PACKAGES.map((pkg) => (
              <div 
                key={pkg.id}
                className={`relative group flex flex-col p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
                  pkg.popular 
                  ? 'bg-[#151515] border-yellow-500/50 shadow-[0_10px_40px_rgba(234,179,8,0.15)] scale-105 z-20' 
                  : 'bg-[#0f0f0f] border-white/5 hover:border-white/10'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-[8px] font-black px-3 py-0.5 rounded-full uppercase tracking-tighter shadow-lg">
                    Популярное
                  </div>
                )}

                <div className="text-center mb-6">
                  <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest mb-4">{pkg.label}</p>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1.5">
                      <span className="text-2xl font-black tracking-tight text-white">
                        {pkg.stars.toLocaleString()}
                      </span>
                      <HiStar className="text-yellow-500 w-5 h-5" />
                    </div>
                    {pkg.bonus > 0 && (
                      <span className="mt-2 text-[8px] font-black bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded border border-yellow-500/20">
                        +{pkg.bonus}% БОНУС
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="text-center mb-4">
                    <span className="text-xl font-black text-white">{pkg.amount}</span>
                    <span className="text-gray-500 font-bold text-xs ml-1">₽</span>
                  </div>
                  <button
                    disabled={loading !== null}
                    onClick={() => handlePurchase(pkg.id, pkg.amount)}
                    className={`w-full py-3 rounded-xl text-[10px] font-black transition-all active:scale-95 flex items-center justify-center ${
                      pkg.popular 
                      ? 'bg-yellow-500 text-black hover:bg-yellow-400 shadow-lg shadow-yellow-500/20' 
                      : 'bg-white/5 text-white hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    {loading === pkg.id ? (
                      <div className="w-4 h-4 border-2 border-current/20 border-t-current rounded-full animate-spin" />
                    ) : "КУПИТЬ"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Кастомная покупка */}
          <div className="w-full bg-[#111] border border-white/5 rounded-[2rem] p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                <HiLightningBolt className="w-32 h-32 text-white" />
             </div>

             <div className="flex-1 space-y-2 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 text-yellow-500 mb-2">
                   <HiCursorClick className="w-5 h-5" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Гибкий выбор</span>
                </div>
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Свое количество <span className="text-gray-600">звезд</span></h3>
                <p className="text-gray-500 text-xs font-medium">Введите необходимое количество. Максимум 10,000 за раз.</p>
             </div>

             <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                <div className="relative group w-full sm:w-48">
                  <input 
                    type="text"
                    value={customAmount}
                    onChange={handleCustomChange}
                    placeholder="0"
                    className="w-full bg-black/40 border-2 border-white/5 group-hover:border-yellow-500/30 focus:border-yellow-500/50 rounded-2xl py-4 px-6 text-xl font-black text-white outline-none transition-all text-center"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-yellow-500 font-bold">⭐</span>
                </div>

                <button 
                  disabled={loading !== null || parseInt(customAmount) < 1}
                  onClick={() => handlePurchase('custom', parseInt(customAmount))}
                  className="w-full sm:w-48 py-4.5 bg-white text-black hover:bg-yellow-500 rounded-2xl font-black text-xs uppercase transition-all active:scale-95 shadow-xl flex items-center justify-center gap-2"
                >
                  {loading === 'custom' ? (
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>ОПЛАТИТЬ {customAmount || 0} ₽</>
                  )}
                </button>
             </div>
          </div>

          {/* Преимущества */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {[
               { icon: HiLightningBolt, title: "Мгновенно", desc: "Автозачисление" },
               { icon: HiStar, title: "Премиум", desc: "Статус в списке" },
               { icon: HiCheckCircle, title: "Безопасно", desc: "Защита SSL" }
             ].map((item, i) => (
               <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <item.icon className="w-6 h-6 text-gray-600" />
                  <div>
                    <h4 className="text-[10px] font-black text-white uppercase tracking-wider">{item.title}</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">{item.desc}</p>
                  </div>
               </div>
             ))}
          </div>

        </div>
      </main>
    </div>
  );
}

// Вспомогательная иконка для футера
function HiCheckCircle(props: any) {
  return (
    <svg fill="currentColor" viewBox="0 0 20 20" {...props}>
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );
}