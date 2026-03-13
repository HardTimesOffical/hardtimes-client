'use client';
import { useState, useEffect } from 'react';

const CONSENT_KEY = 'cookie-consent';

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Проверяем сразу при монтировании — если уже принято, не показываем вообще
    try {
      if (localStorage.getItem(CONSENT_KEY)) return;
    } catch { return; }

    const t = setTimeout(() => setShow(true), 1500);
    return () => clearTimeout(t);
  }, []);

  const accept = () => {
    try { localStorage.setItem(CONSENT_KEY, 'accepted'); } catch { /* safari private */ }
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-5 left-0 w-full flex justify-center px-4 z-[9999]"
      role="dialog" aria-live="polite" aria-label="Уведомление об использовании cookies">
      <div
        className="w-full max-w-[560px] border border-border backdrop-blur-sm
          shadow-[0_8px_24px_rgba(0,0,0,0.5)]
          p-3 md:p-4
          animate-in fade-in slide-in-from-bottom-4 duration-300"
        style={{ background: 'rgba(18,18,18,0.96)' }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">

          {/* Текст */}
          <div className="flex items-start gap-3 min-w-0">
            {/* Пиксельный квадрат вместо эмодзи */}
            <div className="w-7 h-7 shrink-0 mt-0.5 flex items-center justify-center border border-border"
              style={{ background: '#1e1e1e' }}>
              <svg width="14" height="14" viewBox="0 0 8 8" style={{ imageRendering: 'pixelated' }} fill="none">
                <rect width="8" height="8" fill="#3c8527"/>
                <rect x="1" y="2" width="2" height="2" fill="#0a0a0a"/>
                <rect x="5" y="2" width="2" height="2" fill="#0a0a0a"/>
                <rect x="2" y="5" width="1" height="1" fill="#0a0a0a"/>
                <rect x="5" y="5" width="1" height="1" fill="#0a0a0a"/>
                <rect x="3" y="5" width="2" height="1" fill="#0a0a0a"/>
                <rect x="2" y="6" width="1" height="1" fill="#0a0a0a"/>
                <rect x="5" y="6" width="1" height="1" fill="#0a0a0a"/>
              </svg>
            </div>
            <div>
              <p className="font-mc-title text-[10px] text-foreground-bright mb-0.5">
                Cookies
              </p>
              <p className="font-standard text-[12px] text-muted leading-snug max-w-[340px]">
                Мы используем куки для улучшения работы сайта и сбора анонимной статистики.
              </p>
            </div>
          </div>

          {/* Кнопка */}
          <button
            onClick={accept}
            className="shrink-0 font-standard font-bold text-[12px] text-white
              px-5 py-2 transition-all duration-150 hover:brightness-110 active:scale-95 whitespace-nowrap"
            style={{
              background: '#3c8527',
              boxShadow: 'inset 1px 1px 0 #5aac44, inset -1px -1px 0 #2a5e1a, 0 2px 0 #2a5e1a',
            }}
          >
            Принять
          </button>
        </div>
      </div>
    </div>
  );
}