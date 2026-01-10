"use client"
import { useState } from 'react';
import api from '@/lib/api';
import DashboardLayout from '../components/dashboard/dashboard';

const PACKAGES = [
  { id: 1, amount: 100, stars: 1000, bonus: 0, label: 'Старт', color: 'blue' },
  { id: 2, amount: 500, stars: 5500, bonus: 10, label: 'Продвинутый', popular: true, color: 'yellow' },
  { id: 3, amount: 1000, stars: 12000, bonus: 20, label: 'Элита', color: 'purple' },
  { id: 4, amount: 2500, stars: 32500, bonus: 30, label: 'Магнат', color: 'emerald' },
  { id: 5, amount: 5000, stars: 75000, bonus: 50, label: 'Легенда', color: 'red' },
];

export default function ShopPage() {
  const [loading, setLoading] = useState<number | null>(null);

  const handlePurchase = async (pkgId: number, amount: number) => {
    setLoading(pkgId);
    try {
      const { data } = await api.post('/payments/create', { amount });
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      alert("Ошибка при создании платежа. Проверьте консоль бэкенда.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <DashboardLayout>
    <div className="min-h-screen  text-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
            ПОПОЛНЕНИЕ <span className="text-yellow-500">ЗВЕЗД</span>
          </h1>
          <p className="text-gray-400 text-lg">Выберите пакет валюты для вашего аккаунта</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {PACKAGES.map((pkg) => (
            <div 
              key={pkg.id}
              className={`relative group flex flex-col p-6 rounded-3xl border transition-all duration-300 ${
                pkg.popular 
                ? 'bg-yellow-500/10 border-yellow-500 scale-105 z-10' 
                : 'bg-white/5 border-white/10 hover:border-white/30'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase">
                  Популярный
                </div>
              )}

              <div className="mb-6">
                <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">{pkg.label}</p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-black">{pkg.stars.toLocaleString()}</span>
                </div>
                {pkg.bonus > 0 && (
                  <span className="text-xs font-bold text-green-400">+{pkg.bonus}% БОНУС ВКЛЮЧЕН</span>
                )}
              </div>

              <div className="mt-auto">
                <div className="text-2xl font-bold mb-4">{pkg.amount} ₽</div>
                <button
                  disabled={loading !== null}
                  onClick={() => handlePurchase(pkg.id, pkg.amount)}
                  className={`w-full py-3 rounded-xl font-black transition-all active:scale-95 flex items-center justify-center gap-2 ${
                    pkg.popular 
                    ? 'bg-yellow-500 text-black hover:bg-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.3)]' 
                    : 'bg-white text-black hover:bg-gray-200'
                  }`}
                >
                  {loading === pkg.id ? (
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      КУПИТЬ
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
}