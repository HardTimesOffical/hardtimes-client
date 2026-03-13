"use client";
import React from "react";
import { FaTelegramPlane, FaEnvelope } from "react-icons/fa";
import Link from "next/link";

const MC_GREEN       = '#5aac44';
const MC_GREEN_DARK  = '#3c8527';
const MC_ACTIVE: React.CSSProperties = {
  background: '#3c8527',
  boxShadow: [
    'inset  1px  1px 0 #5aac44',
    'inset -1px -1px 0 #2a5e1a',
    '0  1px 0 #2a5e1a',
  ].join(', '),
};

const NAV_LINKS = [
  { label: 'Мониторинг',     href: '/monitoring' },
  { label: 'Контент',        href: '/content' },
  { label: 'Форум',          href: '/forum' },
  { label: 'Добавить сервер', href: '/monitoring/workbench' },
  { label: 'Магазин',        href: '/shop' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t-2 border-border bg-card mt-auto">

      {/* ── Пиксельный разделитель сверху ── */}
      <div className="h-[3px] w-full"
        style={{
          backgroundImage: `repeating-linear-gradient(90deg, #3c8527 0px, #3c8527 16px, #2a5e1a 16px, #2a5e1a 32px)`,
        }}
      />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">

        {/* ── Основная сетка ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">

          {/* Колонка 1: Бренд */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="inline-flex items-center gap-2 no-underline w-fit">
              <div className="w-7 h-7 flex items-center justify-center font-mc-title text-[12px]"
                style={MC_ACTIVE}>
                H
              </div>
              <span className="font-mc-title text-[13px] text-foreground-bright">
                Hard<span style={{ color: MC_GREEN }}>Times</span>
              </span>
            </Link>

            <p className="font-standard text-[12px] text-muted leading-relaxed max-w-[220px]">
              Мониторинг серверов, контент и сообщество для игроков Minecraft, Hytale и VoxelCore.
            </p>

            <p className="font-mc-pixel text-[9px] text-muted/50 uppercase tracking-widest mt-1">
              © {year} HardTimes
            </p>
          </div>

          {/* Колонка 2: Навигация */}
          <div className="flex flex-col gap-1">
            <p className="font-mc-title text-[10px] text-foreground-bright mb-2 uppercase">
              Навигация
            </p>
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="font-standard font-semibold text-[13px] text-muted
                  hover:text-foreground-bright transition-colors no-underline
                  flex items-center gap-2 group w-fit"
              >
                <span className="w-1 h-1 bg-border group-hover:bg-mc-green transition-colors shrink-0" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Колонка 3: Контакты */}
          <div className="flex flex-col gap-3">
            <p className="font-mc-title text-[10px] text-foreground-bright mb-1 uppercase">
              Контакты
            </p>

            {/* Telegram */}
            <a
              href="https://t.me/megashield_quazar"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 group no-underline"
            >
              <div
                className="w-8 h-8 flex items-center justify-center shrink-0
                  border border-border bg-surface text-muted
                  transition-all duration-150
                  group-hover:text-white group-hover:border-[#3c8527]"
                style={{ transition: 'all 0.15s' }}
                onMouseEnter={e => Object.assign((e.currentTarget as HTMLElement).style, MC_ACTIVE)}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = '';
                  el.style.boxShadow = '';
                }}
              >
                <FaTelegramPlane size={14} />
              </div>
              <div>
                <p className="font-mc-pixel text-[8px] text-muted uppercase tracking-wider">
                  Поддержка TG
                </p>
                <span className="font-standard text-[12px] font-bold text-foreground-bright
                  group-hover:underline transition-colors">
                  @megashield_quazar
                </span>
              </div>
            </a>

            {/* Email */}
            <a
              href="mailto:hardtimes.offical@gmail.com"
              className="flex items-center gap-3 group no-underline"
            >
              <div
                className="w-8 h-8 flex items-center justify-center shrink-0
                  border border-border bg-surface text-muted
                  transition-all duration-150"
                onMouseEnter={e => Object.assign((e.currentTarget as HTMLElement).style, MC_ACTIVE)}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = '';
                  el.style.boxShadow = '';
                }}
              >
                <FaEnvelope size={14} />
              </div>
              <div>
                <p className="font-mc-pixel text-[8px] text-muted uppercase tracking-wider">
                  Почта проекта
                </p>
                <span className="font-standard text-[12px] font-bold text-foreground-bright
                  group-hover:underline transition-colors">
                  hardtimes.offical@gmail.com
                </span>
              </div>
            </a>
          </div>
        </div>

        {/* ── Нижняя полоса ── */}
        <div className="mt-8 pt-4 border-t border-border flex flex-col md:flex-row
          items-center justify-between gap-2">
          <p className="font-mc-pixel text-[9px] text-muted/40 uppercase tracking-widest">
            NOT AN OFFICIAL MINECRAFT PRODUCT
          </p>
          <p className="font-mc-pixel text-[9px] text-muted/40 uppercase tracking-widest">
            Все права защищены · {year}
          </p>
        </div>
      </div>
    </footer>
  );
}