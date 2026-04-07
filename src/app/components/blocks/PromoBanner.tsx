"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SiDiscord, SiTelegram } from 'react-icons/si';

export default function PromoBanner() {
  return (
    <div className="w-full mb-4 select-none" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&family=Unbounded:wght@700;900&display=swap');

        .rl-banner {
          position: relative;
          width: 100%;
          height: 140px;
          background: #070d0a;
          overflow: hidden;
          border: 1px solid #0e2016;
          box-sizing: border-box;
        }

        .rl-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(0,220,130,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,220,130,0.035) 1px, transparent 1px);
          background-size: 26px 26px;
        }

        .rl-glow-l {
          position: absolute; left: -40px; top: 50%;
          transform: translateY(-50%);
          width: 280px; height: 200px;
          background: radial-gradient(ellipse, rgba(0,200,100,0.07) 0%, transparent 70%);
          pointer-events: none;
        }

        .rl-glow-r {
          position: absolute; right: -20px; top: 50%;
          transform: translateY(-50%);
          width: 200px; height: 180px;
          background: radial-gradient(ellipse, rgba(0,180,220,0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        .rl-scan {
          position: absolute; left: 0; right: 0;
          height: 1px;
          background: rgba(0,220,130,0.10);
          animation: rl-scan 5s linear infinite;
        }
        @keyframes rl-scan { 0% { top: -2px; } 100% { top: 142px; } }

        .rl-strip-l {
          position: absolute; left: 0; top: 0; bottom: 0; width: 2px;
          background: linear-gradient(180deg, transparent, #00dc82, transparent);
          animation: rl-pulse 3s ease-in-out infinite;
        }
        .rl-strip-r {
          position: absolute; right: 0; top: 0; bottom: 0; width: 2px;
          background: linear-gradient(180deg, transparent, #00b4d8, transparent);
          animation: rl-pulse 3s ease-in-out infinite reverse;
        }
        @keyframes rl-pulse { 0%,100%{opacity:.35} 50%{opacity:.9} }

        .rl-corner {
          position: absolute; width: 14px; height: 14px;
          border-color: #00dc82; border-style: solid; opacity: .45;
        }
        .rl-tl { top:8px; left:8px; border-width:2px 0 0 2px; }
        .rl-tr { top:8px; right:8px; border-width:2px 2px 0 0; }
        .rl-bl { bottom:8px; left:8px; border-width:0 0 2px 2px; }
        .rl-br { bottom:8px; right:8px; border-width:0 2px 2px 0; }

        .rl-bline {
          position: absolute; bottom:0; left:0; right:0; height:1px;
          background: linear-gradient(90deg, transparent, #00dc82 35%, #00b4d8 65%, transparent);
          opacity: .3;
        }
        .rl-tline {
          position: absolute; top:0; left:0; right:0; height:1px;
          background: linear-gradient(90deg, transparent, #00dc82 35%, #00b4d8 65%, transparent);
          opacity: .15;
        }

        .rl-logo {
          filter: drop-shadow(0 0 12px rgba(0,220,100,0.35)) drop-shadow(0 0 4px rgba(0,180,220,0.2));
          animation: rl-float 4s ease-in-out infinite;
        }
        @keyframes rl-float {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }

        .rl-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #00dc82;
          box-shadow: 0 0 6px #00dc82;
          animation: rl-blink 1.8s ease-in-out infinite;
        }
        @keyframes rl-blink { 0%,100%{opacity:1} 50%{opacity:.15} }

        .rl-btn {
          display: flex; align-items: center; gap: 9px;
          padding: 9px 13px;
          text-decoration: none;
          position: relative; overflow: hidden;
          transition: filter .15s, transform .1s;
          border: none;
        }
        .rl-btn:hover { filter: brightness(1.18); }
        .rl-btn:active { filter: brightness(.9); transform: translateY(1px); }

        .rl-discord { background: #3d4bc4; border-left: 2px solid #6272f5; }
        .rl-telegram { background: #0e7aad; border-left: 2px solid #00b4d8; }

        .rl-btn::after {
          content: '';
          position: absolute; top: 0; left: -80%; width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.1), transparent);
          animation: rl-shim 3.5s ease-in-out infinite;
        }
        .rl-telegram::after { animation-delay: 1.75s; }
        @keyframes rl-shim { 0%{left:-60%} 60%,100%{left:160%} }
      `}</style>

      <div className="rl-banner">
        <div className="rl-grid" />
        <div className="rl-glow-l" />
        <div className="rl-glow-r" />
        <div className="rl-scan" />
        <div className="rl-strip-l" />
        <div className="rl-strip-r" />
        <div className="rl-corner rl-tl" />
        <div className="rl-corner rl-tr" />
        <div className="rl-corner rl-bl" />
        <div className="rl-corner rl-br" />
        <div className="rl-tline" />
        <div className="rl-bline" />

        {/* Inner layout */}
        <div
          className="relative z-10 flex h-full items-center"
          style={{ padding: '0 18px', gap: '16px', boxSizing: 'border-box' }}
        >

          {/* ── LOGO ── */}
          <div className="rl-logo flex-shrink-0" style={{ width: 96, height: 96, position: 'relative' }}>
            <Image
              src="/ad.png"
              alt="RontynLab"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* ── CENTER ── */}
          <div className="flex-1 flex flex-col items-center text-center" style={{ gap: 5 }}>
            {/* Tag */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 20, height: 1, background: '#00dc82', opacity: .5, display: 'block' }} />
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.38em', textTransform: 'uppercase', color: '#00dc82' }}>
                RontynLab
              </span>
              <span style={{ width: 20, height: 1, background: '#00dc82', opacity: .5, display: 'block' }} />
            </div>

            {/* Title */}
            <h2
              style={{
                fontFamily: "'Unbounded', sans-serif",
                fontSize: 18, fontWeight: 900,
                color: '#e8f5ee',
                lineHeight: 1.15, letterSpacing: '-.01em',
                margin: 0,
              }}
            >
              Приватный{' '}
              <span style={{ color: '#00dc82' }}>полу</span>
              <span style={{ color: '#00b4d8' }}>ваниль</span>ный
            </h2>

            {/* Subtitle */}
            <p style={{ fontSize: 10, color: 'rgba(200,240,220,.3)', fontStyle: 'italic', lineHeight: 1.5, maxWidth: 300, margin: 0 }}>
              «Доверие, творчество и живое общение»
            </p>

            {/* Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 1 }}>
              <div className="rl-dot" />
              <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '.22em', textTransform: 'uppercase', color: '#00dc82', opacity: .7 }}>
                Сервер онлайн · Присоединяйся
              </span>
            </div>
          </div>

          {/* ── BUTTONS ── */}
          <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 7, minWidth: 128 }}>
            <Link href="https://discord.com/invite/XC5FakGxPh" target="_blank" className="rl-btn rl-discord">
              <SiDiscord style={{ width: 14, height: 14, color: 'white', flexShrink: 0 }} />
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: '#fff', flex: 1 }}>
                Discord
              </span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,.5)' }}>›</span>
            </Link>

            <Link href="https://t.me/+zrOVNfNNG5k4Yzgy" target="_blank" className="rl-btn rl-telegram">
              <SiTelegram style={{ width: 14, height: 14, color: 'white', flexShrink: 0 }} />
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: '#fff', flex: 1 }}>
                Telegram
              </span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,.5)' }}>›</span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}