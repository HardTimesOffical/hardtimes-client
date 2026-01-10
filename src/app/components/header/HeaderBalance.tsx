"use client"
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

export const HeaderBalance = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadBalance = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setIsAuthorized(false);
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get('/users/me');
      setBalance(data.balance);
      setIsAuthorized(true);
    } catch (err) {
      setIsAuthorized(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBalance();
    const interval = setInterval(() => {
      const token = localStorage.getItem('accessToken');
      if (token && !isAuthorized) loadBalance();
      else if (!token && isAuthorized) setIsAuthorized(false);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAuthorized]);

  if (loading && !isAuthorized) return null;
  if (!isAuthorized) return null;

  return (
    <Link href="/shop" className="group flex items-center">
      <div className="flex items-center gap-3 bg-zinc-900/40 border border-zinc-800 px-3 py-1.5 rounded-xl transition-all duration-200 group-hover:bg-zinc-800/60 group-hover:border-zinc-700">
        
        {/* Компактная SVG Звезда в приглушенном цвете */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-zinc-500 group-hover:text-blue-400 transition-colors">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
        </svg>

        {/* Баланс */}
        <div className="flex items-center gap-1.5">
          <span className="text-zinc-100 font-semibold text-sm tracking-tight">
            {balance?.toLocaleString() ?? 0}
          </span>
          <span className="text-[10px] font-bold text-zinc-500 tracking-tighter uppercase">HC</span>
        </div>

        {/* Маленький аккуратный плюс */}
        <div className="ml-1 flex items-center justify-center w-5 h-5 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-400 group-hover:text-white group-hover:bg-blue-600 group-hover:border-blue-500 transition-all">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </Link>
  );
};