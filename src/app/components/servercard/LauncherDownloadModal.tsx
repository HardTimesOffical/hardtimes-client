'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const SNOW = '#e8f4f8';
const ICE  = '#a8d4e8';
const BLUE = '#4a9ebb';

const DOWNLOAD_URL =
  'https://github.com/HardTimesOffical/HardLauncher/releases/download/v1.0.12/HardLauncher-Setup-1.0.12.exe';

const BG_IMAGE =
  '/banner/download-banner.png';

interface LauncherDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverName?: string;
}

function ModalContent({ onClose, serverName }: Omit<LauncherDownloadModalProps, 'isOpen'>) {
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleDownload = () => {
    window.open(DOWNLOAD_URL, '_blank');
    setDownloaded(true);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl overflow-hidden border"
        style={{ borderColor: `${BLUE}30` }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Фоновая картинка ── */}
        <div className="relative h-70 overflow-hidden">
          <img
            src={BG_IMAGE}
            alt=""
            className="w-full h-full object-cover"
            style={{ filter: 'saturate(0.6) brightness(0.4)' }}
          />
          {/* Градиент перехода в тело */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(8,14,20,0.2) 0%, rgba(8,14,20,0.0) 35%, rgba(8,14,20,0.98) 100%)',
            }}
          />

          {/* Пиксельные снежинки — декор */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[
              { top: '15%', left: '7%',  s: 3, o: 0.55 },
              { top: '30%', left: '20%', s: 2, o: 0.35 },
              { top: '10%', left: '52%', s: 4, o: 0.45 },
              { top: '42%', left: '70%', s: 2, o: 0.65 },
              { top: '22%', left: '86%', s: 3, o: 0.4  },
              { top: '52%', left: '38%', s: 2, o: 0.25 },
              { top: '8%',  left: '33%', s: 2, o: 0.5  },
              { top: '35%', left: '91%', s: 3, o: 0.55 },
              { top: '18%', left: '63%', s: 2, o: 0.3  },
            ].map((s, i) => (
              <div
                key={i}
                className="absolute"
                style={{ top: s.top, left: s.left, width: s.s, height: s.s, background: '#fff', opacity: s.o }}
              />
            ))}
          </div>

          {/* Бейдж */}
          <div
            className="absolute top-3 right-4 font-mc-pixel text-[7px] uppercase tracking-widest px-2 py-1 border"
            style={{ color: ICE, borderColor: `${BLUE}40`, background: 'rgba(8,14,20,0.75)' }}
          >
            v1.0.10 · Windows
          </div>

          {/* Кнопка закрытия */}
          <button
            onClick={onClose}
            className="absolute top-3 left-4 font-mc-pixel text-[8px] uppercase tracking-widest transition-colors"
            style={{ color: `${SNOW}50`, background: 'none', border: 'none', cursor: 'pointer' }}
            onMouseEnter={e => (e.currentTarget.style.color = SNOW)}
            onMouseLeave={e => (e.currentTarget.style.color = `${SNOW}50`)}
          >
            ✕ Закрыть
          </button>

          {/* Заголовок — поверх картинки в нижней части */}
          <div className="absolute bottom-5 left-6 right-6">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-1 h-3 flex-shrink-0" style={{ background: ICE }} />
              <span className="font-mc-pixel text-[8px] uppercase tracking-widest" style={{ color: ICE }}>
                HardLauncher
              </span>
            </div>
            <h2 className="font-mc-pixel text-2xl uppercase tracking-tight leading-none" style={{ color: SNOW }}>
              Скачай и играй
            </h2>
            {serverName && (
              <p className="font-mc-pixel text-[8px] uppercase tracking-widest mt-1.5" style={{ color: `${ICE}80` }}>
                Для подключения к{' '}
                <span style={{ color: ICE }}>{serverName}</span>
              </p>
            )}
          </div>
        </div>

        {/* ── Тело ── */}
        <div className="px-6 pb-6 pt-4 space-y-4" style={{ background: '#080e14' }}>

          {/* Плюшки 2×2 */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: '🛡', label: 'Без вирусов',       hint: 'Открытый исходный код' },
              { icon: '🚫', label: 'Без рекламы',       hint: 'Никаких всплывающих окон' },
              { icon: '⚡', label: 'Быстрый запуск',    hint: 'Работает на 4 ГБ RAM' },
              { icon: '🎮', label: 'Серверы HardTimes', hint: 'Встроенный мониторинг' },
            ].map(item => (
              <div
                key={item.label}
                className="flex items-start gap-2.5 p-3 border"
                style={{ borderColor: `${BLUE}18`, background: `${BLUE}07` }}
              >
                <span className="text-sm flex-shrink-0 mt-0.5">{item.icon}</span>
                <div>
                  <p className="font-mc-pixel text-[9px] uppercase tracking-widest" style={{ color: SNOW }}>
                    {item.label}
                  </p>
                  <p className="font-mc-pixel text-[7px] uppercase tracking-widest mt-0.5" style={{ color: `${ICE}60` }}>
                    {item.hint}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Кнопка скачать */}
          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-between px-5 py-4 font-mc-pixel text-[10px] uppercase tracking-widest border transition-all"
            style={{
              background: downloaded ? `${BLUE}18` : BLUE,
              color: downloaded ? ICE : '#080e14',
              borderColor: BLUE,
              cursor: 'pointer',
            }}
            onMouseEnter={e => { if (!downloaded) (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
          >
            <span className="flex items-center gap-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
              </svg>
              {downloaded ? 'Скачивание началось...' : 'Скачать для Windows · Бесплатно'}
            </span>
            {!downloaded && (
              <span style={{ opacity: 0.45, fontSize: 8 }}>↓ .exe</span>
            )}
          </button>

          {/* Подсказка после скачивания */}
          {downloaded && (
            <div
              className="text-center font-mc-pixel text-[8px] uppercase tracking-widest py-2.5 border"
              style={{ color: ICE, borderColor: `${BLUE}28`, background: `${BLUE}0d` }}
            >
              ✓ Запусти установщик → выбери сервер → играй
            </div>
          )}

          {/* Нижняя строка */}
          <div
            className="flex items-center justify-between pt-2 border-t"
            style={{ borderColor: 'rgba(255,255,255,0.04)' }}
          >
            <span className="font-mc-pixel text-[7px] uppercase tracking-widest" style={{ color: '#2a3a44' }}>
              Windows 10 / 11 · Java включена
            </span>
            <a
              href="/ru/launcher"
              className="font-mc-pixel text-[7px] uppercase tracking-widest no-underline transition-colors"
              style={{ color: `${ICE}50` }}
              onMouseEnter={e => (e.currentTarget.style.color = ICE)}
              onMouseLeave={e => (e.currentTarget.style.color = `${ICE}50`)}
            >
              Подробнее о лаунчере →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LauncherDownloadModal({ isOpen, onClose, serverName }: LauncherDownloadModalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!isOpen || !mounted) return null;
  return createPortal(
    <ModalContent onClose={onClose} serverName={serverName} />,
    document.body
  );
}