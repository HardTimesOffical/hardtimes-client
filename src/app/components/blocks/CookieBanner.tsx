'use client';
import { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setShowBanner(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'true');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    // Центрирование по горизонтали и фиксация снизу
    <div className="fixed bottom-6 left-0 w-full flex justify-center px-4 z-[9999]">
      <div className="
        w-full max-w-[600px] 
        bg-card/90 backdrop-blur-md 
        border border-border/50 
        rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]
        p-4 md:p-5
        animate-in fade-in slide-in-from-bottom-8 duration-500
      ">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Левая часть: Иконка + Текст */}
          <div className="flex items-center gap-4">
            <span className="text-2xl drop-shadow-sm">🍪</span>
            <div className="flex flex-col">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-foreground-bright italic leading-none mb-1">
                Cookie Policy
              </h4>
              <p className="text-[10px] md:text-[11px] text-muted leading-tight font-medium max-w-[300px]">
                Мы используем куки для улучшения работы мониторинга и сбора статистики.
              </p>
            </div>
          </div>

          {/* Правая часть: Кнопка */}
          <button 
            onClick={acceptCookies}
            className="
              whitespace-nowrap
              bg-accent/10 hover:bg-accent text-accent hover:text-white 
              border border-accent/20 hover:border-accent
              text-[10px] font-black uppercase tracking-tighter 
              px-6 py-2.5 rounded-xl 
              transition-all duration-300 active:scale-95
            "
          >
            Принять
          </button>
          
        </div>
      </div>
    </div>
  );
}