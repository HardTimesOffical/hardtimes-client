'use client';
import { useEffect } from 'react';

export default function YandexAds() {
  useEffect(() => {
    // Проверяем, загружен ли скрипт Яндекса и вызываем рендер
    if (window.yaContextCb) {
      window.yaContextCb.push(() => {
        if (window.Ya && window.Ya.Context && window.Ya.Context.AdvManager) {
          window.Ya.Context.AdvManager.render({
            blockId: "R-A-18769642-1",
            renderTo: "yandex_rtb_R-A-18769642-1"
          });
        }
      });
    }
  }, []);

  return (
    <div className="w-full my-6 flex flex-col items-center">
      {/* Метка "Реклама" в стиле Hard Monitoring */}
      <span className="text-[9px] uppercase font-black text-muted tracking-widest mb-2 opacity-50">
        Advertisement
      </span>
      
      {/* Контейнер для блока */}
      <div 
        id="yandex_rtb_R-A-18769642-1" 
        className="min-h-[200px] w-full bg-surface/50 border border-border/40 rounded-2xl overflow-hidden"
      >
        {/* Здесь появится реклама */}
      </div>
    </div>
  );
}

// Добавляем типы для TS, чтобы не ругался на window
declare global {
  interface Window {
    yaContextCb: any;
    Ya: any;
  }
}