"use client";

import React, { useState, useEffect } from 'react';
import { HiOutlineClock } from 'react-icons/hi'; // Используем иконку для консистентности

const WeeklyTimer = () => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, "");

  useEffect(() => {
    const fetchTimer = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/votes/votes-info`);
        const data = await response.json();
        setTimeLeft(data.msLeft);
      } catch (error) {
        console.error("Ошибка загрузки таймера:", error);
      }
    };

    fetchTimer();

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev !== null && prev > 0 ? prev - 1000 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [SERVER_URL]);

  const formatTime = (ms: number) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));

    return {
      days,
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
    };
  };

  if (timeLeft === null) return (
    <div className="animate-pulse flex gap-2 items-center bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
      <div className="w-4 h-4 bg-gray-200 rounded-full" />
      <div className="w-20 h-3 bg-gray-200 rounded" />
    </div>
  );

  const t = formatTime(timeLeft);

  return (
    /* Контейнер таймера: светлый фон, тонкая рамка */
    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50/50 border border-gray-100 rounded-xl select-none">
      <div className="flex items-center justify-center w-6 h-6 bg-orange-100 rounded-lg text-orange-500">
        <HiOutlineClock className="w-4 h-4" />
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
        <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider leading-none">
          Сброс голосов
        </span>
        
        <div className="flex items-center gap-1 font-mono text-sm font-bold text-gray-900 leading-none">
          {t.days > 0 && (
            <span className="flex items-center">
              {t.days}<span className="text-[10px] text-gray-400 ml-0.5">д</span>
            </span>
          )}
          <span className="bg-white px-1 py-0.5 rounded shadow-sm border border-gray-100">{t.hours}</span>
          <span className="text-gray-300">:</span>
          <span className="bg-white px-1 py-0.5 rounded shadow-sm border border-gray-100">{t.minutes}</span>
          <span className="text-gray-300">:</span>
          <span className="bg-white px-1 py-0.5 rounded shadow-sm border border-gray-100 text-orange-600">{t.seconds}</span>
        </div>
      </div>
    </div>
  );
};

export default WeeklyTimer;