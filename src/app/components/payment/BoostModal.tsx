"use client";
import { useState } from 'react';
import Link from 'next/link';

interface BoostOption {
  id: number;
  votes: number;
  days: number;
  price: number;
  label: string;
}

const BOOST_OPTIONS: BoostOption[] = [
  { id: 1, votes: 1, days: 7, price: 1000, label: 'Легкий старт' },
  { id: 2, votes: 5, days: 14, price: 4500, label: 'Популярный' },
  { id: 3, votes: 10, days: 21, price: 8000, label: 'Мощный буст' },
  { id: 4, votes: 20, days: 30, price: 15000, label: 'Лидер топа' },
];

interface BoostModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverName: string;
  userBalance: number;
  onPurchase: (option: BoostOption) => Promise<void>;
  loading: boolean;
}

export const BoostModal = ({ isOpen, onClose, serverName, userBalance, onPurchase, loading }: BoostModalProps) => {
  const [selected, setSelected] = useState<BoostOption>(BOOST_OPTIONS[0]);

  if (!isOpen) return null;

  const canAfford = userBalance >= selected.price;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}>
      <div 
        className="relative bg-[#0f172a] border border-blue-500/20 w-full max-w-sm rounded-[2rem] p-6 shadow-2xl shadow-blue-500/10"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-5 right-5 text-white/20 hover:text-white transition-colors">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>

        <div className="text-center mb-6">
          <h2 className="text-xl font-black text-white italic uppercase tracking-tight" translate="no">Буст сервера</h2>
          <p className="text-blue-400/60 text-[11px] mt-1 truncate px-2" translate="no">{serverName}</p>
          
          <div className="mt-3 inline-flex items-center gap-2 bg-blue-500/5 border border-blue-500/10 px-3 py-1 rounded-full">
             <span className="text-[9px] text-zinc-500 uppercase font-bold" translate="no">Баланс:</span>
             <span className="text-blue-400 font-black text-xs">{userBalance.toLocaleString()} HC</span>
          </div>
        </div>

        <div className="space-y-2">
          {BOOST_OPTIONS.map((opt) => (
            <div 
              key={opt.id}
              onClick={() => setSelected(opt)}
              className={`group relative p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                selected.id === opt.id 
                ? 'border-blue-500 bg-blue-500/10' 
                : 'border-white/5 bg-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-lg text-white" translate="no">+{opt.votes}</span>
                    <span className="text-[9px] font-bold bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-md uppercase">Голосов</span>
                  </div>
                  <p className="text-[10px] text-white/40 mt-0.5">{opt.days} дней</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-xl font-black ${selected.id === opt.id ? 'text-blue-400' : 'text-white/60'}`}>
                    {opt.price.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-bold text-blue-500">HC</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          <button 
            onClick={() => onPurchase(selected)}
            disabled={loading || !canAfford}
            className={`w-full py-4 font-black rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 uppercase text-xs tracking-wider ${
                canAfford 
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20' 
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : !canAfford ? (
              "Недостаточно HC"
            ) : (
              "Купить Буст"
            )}
          </button>
          
          <div className="text-center">
            <Link href="/shop" className="text-blue-400 text-[10px] font-bold uppercase tracking-widest underline decoration-blue-500/30 underline-offset-4 hover:text-blue-300 transition-colors">
              Пополнить баланс в магазине
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};