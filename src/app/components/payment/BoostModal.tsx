"use client";
import { useState } from 'react';
import api from '@/lib/api';
import { 
  HiLightningBolt, 
  HiStar, 
  HiCreditCard, 
  HiMinus, 
  HiPlus,
  HiCheckCircle,
  HiFire
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 bg-black/60 backdrop-blur-lg animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="bg-[#1a1625] border border-purple-500/30 w-full max-w-[380px] max-h-[95vh] overflow-y-auto rounded-[1.5rem] shadow-[0_0_40px_rgba(139,92,246,0.15)] scrollbar-hide" 
        onClick={e => e.stopPropagation()}
      >
        {/* Header - стал компактнее */}
        <div className="p-5 pb-2 text-center">
          <div className="inline-flex p-2 rounded-xl bg-purple-500/10 mb-2 ring-1 ring-purple-500/30">
            <HiFire className="w-6 h-6 text-purple-500 animate-pulse" />
          </div>
          <h2 className="text-xl font-black text-white italic uppercase leading-none">
            Boost <span className="text-purple-500">Up</span>
          </h2>
          <p className="text-zinc-400 text-[11px] mt-1 font-medium truncate px-4">
            Сервер: <span className="text-white font-bold">{serverName}</span>
          </p>
        </div>

        <div className="px-6 pb-6 space-y-4">
          
          {/* Селектор количества - уменьшены отступы */}
          <div className="bg-black/20 p-4 rounded-[1.2rem] border border-white/5 space-y-3">
            <div className="flex justify-between items-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              <span>Количество</span>
              <span className="text-purple-500">Max 1000</span>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setVotes(Math.max(1, votes - 1))}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800 hover:bg-purple-600 text-white transition-all active:scale-90"
              >
                <HiMinus className="w-4 h-4" />
              </button>
              
              <div className="flex-1">
                <input 
                  type="number"
                  value={votes}
                  onChange={(e) => setVotes(Math.min(1000, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="bg-transparent text-2xl font-black text-white w-full text-center outline-none"
                />
              </div>

              <button 
                onClick={() => setVotes(Math.min(1000, votes + 1))}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800 hover:bg-purple-600 text-white transition-all active:scale-90"
              >
                <HiPlus className="w-4 h-4" />
              </button>
            </div>

            <input 
              type="range" min="1" max="1000" value={votes}
              onChange={(e) => setVotes(parseInt(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          {/* Методы оплаты - компактные карточки */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'stars', label: 'Звезды', icon: HiStar, val: totalPrice + ' ⭐' },
              { id: 'rub', label: 'Рубли', icon: HiCreditCard, val: totalPrice + ' ₽' }
            ].map((m) => (
              <button 
                key={m.id}
                onClick={() => setMethod(m.id as any)}
                className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-0.5 ${
                  method === m.id 
                  ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_10px_rgba(168,85,247,0.1)]' 
                  : 'border-white/5 bg-white/5'
                }`}
              >
                <m.icon className={`w-5 h-5 ${method === m.id ? 'text-purple-500' : 'text-zinc-600'}`} />
                <span className="text-[9px] font-bold text-zinc-500 uppercase">{m.label}</span>
                <span className="text-xs font-black text-white">{m.val}</span>
              </button>
            ))}
          </div>

          {/* Кнопка действия */}
          <div className="space-y-2">
            <button 
              onClick={handleBoost}
              disabled={loading || (method === 'stars' && !canAffordStars)}
              className="group relative w-full overflow-hidden rounded-xl p-[1px] transition-all active:scale-95 disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-600 group-hover:animate-gradient-x"></div>
              <div className="relative flex items-center justify-center gap-2 bg-[#1a1625] hover:bg-transparent transition-all rounded-[11px] py-3 text-white font-black uppercase text-xs tracking-widest">
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <HiLightningBolt className="w-4 h-4 text-purple-400 group-hover:text-white" />
                    <span>{method === 'stars' && !canAffordStars ? 'Мало звезд' : 'Бустануть'}</span>
                  </>
                )}
              </div>
            </button>
            
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1 text-[9px] text-zinc-500 font-bold uppercase tracking-tighter">
                <HiCheckCircle className="text-green-500 w-3 h-3" />
                30 дней активации
              </div>
              {method === 'stars' && (
                <div className="text-[9px] text-zinc-400 font-bold">
                  {userBalance} ⭐
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 2s linear infinite;
        }
      `}</style>
    </div>
  );
};