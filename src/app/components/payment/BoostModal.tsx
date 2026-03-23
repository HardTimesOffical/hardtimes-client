"use client";
import { useState } from 'react';
import api from '@/lib/api';
import { 
  HiStar, 
  HiCreditCard, 
  HiMinus, 
  HiPlus,
  HiFire,
  HiCheckCircle,
  HiServer,
  HiLightningBolt
} from 'react-icons/hi';

export const BoostModal = ({ isOpen, onClose, serverId, serverName, userBalance }: any) => {
  const [votes, setVotes] = useState(1);
  const [method, setMethod] = useState<'stars' | 'rub'>('stars');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const PRICE_PER_VOTE = 20;
  const totalPrice = votes * PRICE_PER_VOTE;
  const canAffordStars = userBalance >= totalPrice;

  const handleBoost = async () => {
    setLoading(true);
    try {
      if (method === 'rub') {
        const { data } = await api.post('/payments/create-boost', { 
            amount: totalPrice, 
            serverId: serverId, 
            votesCount: votes 
        });
        if (data.url) window.location.href = data.url;
      } else {
        await api.post('/boost/boost', { 
            serverId: serverId, 
            votes: votes, 
            price: totalPrice 
        });
        alert("🚀 Буст активирован!");
        onClose();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Ошибка при покупке");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 bg-black/70 animate-in fade-in duration-300" 
      onClick={onClose}
    >
      <div 
        className="mc-slide-up w-full max-w-[360px] max-h-[90vh] overflow-y-auto scrollbar-hide bg-[#1a1a1a] shadow-[0_15px_60px_rgba(0,0,0,0.8)] border border-white/5 rounded-none" 
        onClick={e => e.stopPropagation()}
      >
        {/* Header - Инспирирован плашкой "Синегарск" */}
        <div className="bg-[#242424] p-5 border-b border-white/5 relative">
          <div className="flex items-center gap-4">
            <div className="bg-[#5a6e60]/20 p-2 border border-[#5a6e60]/40 rounded-none flex items-center justify-center">
                {/* МЕСТО ДЛЯ ПИКСЕЛЬНОЙ ИКОНКИ (например, огонь или лого) */}
                <HiFire className="w-8 h-8 text-[#5a6e60]" />
                {/* ---------------------------------------------------- */}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white uppercase tracking-wider leading-none">
                Буст <span className="text-[#5a6e60]">Сервера</span>
              </h2>
              <div className="flex items-center gap-1.5 mt-1.5 text-zinc-500">
                <HiServer className="w-3 h-3" />
                <span className="font-mc-pixel text-[10px] uppercase tracking-tighter">
                  На цель: <span className="text-white">{serverName}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Селектор количества - Исправлено центрирование +/- */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <label className="font-mc-pixel text-zinc-600 uppercase text-[10px]">Количество голосов</label>
              <span className="font-bold text-white text-xs">{votes}</span>
            </div>
            
            <div className="flex items-center gap-2.5">
              <button 
                onClick={() => setVotes(Math.max(1, votes - 1))}
                className="w-10 h-10 flex-shrink-0 bg-[#242424] hover:bg-zinc-800 transition border border-white/5 text-zinc-400 active:scale-95 flex items-center justify-center rounded-none"
              >
                <HiMinus className="w-4 h-4" />
              </button>
              
              <div className="flex-1">
                 <input 
                  type="range" min="1" max="1000" value={votes}
                  onChange={(e) => setVotes(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-zinc-800 rounded-none appearance-none cursor-pointer accent-[#5a6e60]"
                />
              </div>

              <button 
                onClick={() => setVotes(Math.min(1000, votes + 1))}
                className="w-10 h-10 flex-shrink-0 bg-[#242424] hover:bg-zinc-800 transition border border-white/5 text-zinc-400 active:scale-95 flex items-center justify-center rounded-none"
              >
                <HiPlus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Методы оплаты - Как кнопки меню на фото */}
          <div className="space-y-3">
            {[
              { id: 'stars', label: 'Звезды', icon: HiStar, val: totalPrice, unit: '⭐' },
              { id: 'rub', label: 'Рубли', icon: HiCreditCard, val: totalPrice, unit: '₽' }
            ].map((m) => (
              <button 
                key={m.id}
                onClick={() => setMethod(m.id as any)}
                className={`group w-full flex items-center justify-between p-4 border rounded-none transition-all duration-200 ${
                  method === m.id 
                  ? 'border-[#5a6e60] bg-[#5a6e60]/10' 
                  : 'border-white/5 bg-[#242424] hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-3">
                    {/* МЕСТО ДЛЯ ПИКСЕЛЬНОЙ ИКОНКИ МЕТОДА ОПЛАТЫ */}
                    <m.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${method === m.id ? 'text-[#5a6e60]' : 'text-zinc-600'}`} />
                    {/* -------------------------------------------------- */}
                    <div className="text-left">
                        <div className="font-bold text-xs text-white uppercase">{m.label}</div>
                        <div className="font-mc-pixel text-[10px] text-zinc-600 mt-0.5 uppercase tracking-tighter">Оплата в {m.label}</div>
                    </div>
                </div>
                <div className="font-bold text-sm text-white">
                    {m.val} <span className="text-[#5a6e60] text-xs font-normal">{m.unit}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Действие - Исправлен лоадер и кнопка */}
          <div className="space-y-4 pt-2">
            <button 
              onClick={handleBoost}
              disabled={loading || (method === 'stars' && !canAffordStars)}
              className={`w-full py-3.5 text-sm font-bold uppercase transition active:scale-95 flex items-center justify-center gap-2 rounded-none relative ${
                method === 'stars' && !canAffordStars ? 'bg-zinc-800 text-zinc-600 grayscale opacity-60' : 'bg-white hover:bg-zinc-200 text-[#1a1a1a]'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-4 border-zinc-200/50 border-t-[#1a1a1a] rounded-full animate-spin flex-shrink-0" />
                  <span>Обработка...</span>
                </div>
              ) : (
                <>
                  {/* МЕСТО ДЛЯ ПИКСЕЛЬНОЙ ИКОНКИ ДЕЙСТВИЯ (напр. молния) */}
                  <HiLightningBolt className="w-5 h-5" />
                  {/* ---------------------------------------------------- */}
                  {method === 'stars' && !canAffordStars ? 'Недостаточно звезд' : 'Подтвердить буст'}
                </>
              )}
            </button>
            
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 font-mc-pixel text-[10px] text-zinc-600 uppercase bg-black/10 px-4 py-1.5 border border-white/5 rounded-none">
                <HiCheckCircle className="w-3.5 h-3.5" />
                Срок действия: 30 дней
              </div>
              {method === 'stars' && (
                <div className="font-mc-pixel text-[10px] text-zinc-700">
                  Баланс: <span className="text-white">{userBalance} ⭐</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};