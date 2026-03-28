"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import LogoutButton from "@/app/profile/[username]/LogoutButton";
import ProfileTabs from "@/app/profile/[username]/profileTabs";
import api from "@/lib/api";

// ── Press Start 2P + VT323 ────────────────────────────────────────
// Add to your global CSS or layout.tsx:
// @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap');
// Then in tailwind.config.ts extend fontFamily:
// 'pixel': ['"Press Start 2P"', 'monospace'],
// 'vt':    ['"VT323"', 'monospace'],

// ── Types ─────────────────────────────────────────────────────────
interface ProfileUser {
  username: string;
  avatar?: string;
  level: number;
  xp: number;
  xpRequiredForNext: number;
  progressPercentage: number;
  bio?: string;
  role?: string;
  votesTotal: number;
  votesWeekly: number;
  balance: number;
}

// ── Pixel border utility (inline style helper) ────────────────────
const pxBorder = {
  border: "2px solid",
  borderColor: "#555 #222 #222 #555",
  boxShadow: "inset 2px 2px 0 rgba(255,255,255,0.10), inset -2px -2px 0 rgba(0,0,0,0.55)",
} as React.CSSProperties;

const pxBorderGreen = {
  border: "2px solid",
  borderColor: "#5d7a40 #3a4f28 #3a4f28 #5d7a40",
  boxShadow: "inset 2px 2px 0 rgba(255,255,255,0.08), inset -2px -2px 0 rgba(0,0,0,0.5)",
} as React.CSSProperties;

const pxShadow = { boxShadow: "4px 4px 0 #000" } as React.CSSProperties;
const pxShadowSm = { boxShadow: "3px 3px 0 #000" } as React.CSSProperties;
const slotInset = {
  border: "2px solid",
  borderColor: "#111 #555 #555 #111",
  boxShadow: "inset 2px 2px 0 rgba(0,0,0,0.8)",
} as React.CSSProperties;

// ── XP Bar ────────────────────────────────────────────────────────
function XPBar({ pct, level, xp, xpNext }: { pct: number; level: number; xp: number; xpNext: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 250);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div className="bg-[#0e0c09] p-3" style={{ ...pxBorder, ...pxShadowSm }}>
      <div className="flex justify-between items-baseline mb-2">
        <span
          className="text-[#c8a830] uppercase tracking-wider"
          style={{ fontFamily: '"Press Start 2P", monospace', fontSize: 7, textShadow: "1px 1px 0 #3d2800" }}
        >
          LVL {level}
        </span>
        <span className="text-[#a09880]" style={{ fontFamily: '"VT323", monospace', fontSize: 16 }}>
          {xp} XP
        </span>
      </div>

      {/* Track */}
      <div
        className="h-3 bg-black relative overflow-hidden"
        style={{ border: "2px solid", borderColor: "#111 #555 #555 #111" }}
      >
        {/* Fill */}
        <div
          className="h-full relative transition-all duration-1000 ease-out"
          style={{
            width: `${width}%`,
            background: "linear-gradient(to right, #4a5e3a, #7aa050)",
          }}
        >
          {/* Shine */}
          <div className="absolute top-0 left-0 right-0 h-[4px] bg-white/20" />
          {/* Pixel notches */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 7px, rgba(0,0,0,0.3) 7px, rgba(0,0,0,0.3) 8px)",
            }}
          />
        </div>
      </div>

      <div className="flex justify-end mt-1">
        <span className="text-[#706860]" style={{ fontFamily: '"VT323", monospace', fontSize: 13 }}>
          +{xpNext} до след. уровня
        </span>
      </div>
    </div>
  );
}

// ── Stat Slot (inventory-style) ───────────────────────────────────
function StatSlot({ icon, value, label }: { icon: string; value: number | string; label: string }) {
  return (
    <div className="bg-[#080705] p-2 flex flex-col gap-0.5" style={slotInset}>
      <span className="text-xl leading-none" style={{ filter: "drop-shadow(1px 1px 0 #000)" }}>{icon}</span>
      <span
        className="text-[#c8a830]"
        style={{ fontFamily: '"Press Start 2P", monospace', fontSize: 8, textShadow: "1px 1px 0 #3d2800" }}
      >
        {value}
      </span>
      <span className="text-[#706860] uppercase" style={{ fontFamily: '"VT323", monospace', fontSize: 13 }}>
        {label}
      </span>
    </div>
  );
}

// ── MC Button ─────────────────────────────────────────────────────
function MCButton({
  children,
  onClick,
  variant = "stone",
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "stone" | "red" | "green";
  className?: string;
}) {
  const variants = {
    stone: {
      background: "linear-gradient(to bottom, #6b6b6b, #4a4a4a)",
      borderColor: "#888 #222 #222 #888",
    },
    red: {
      background: "linear-gradient(to bottom, #c0392b, #7b241c)",
      borderColor: "#e74c3c #4a1010 #4a1010 #e74c3c",
    },
    green: {
      background: "linear-gradient(to bottom, #5d7a40, #3a4f28)",
      borderColor: "#7aa050 #1e2e14 #1e2e14 #7aa050",
    },
  };

  return (
    <button
      onClick={onClick}
      className={`w-full text-white uppercase tracking-wider cursor-pointer transition-all duration-75 active:translate-x-0.5 active:translate-y-0.5 ${className}`}
      style={{
        fontFamily: '"Press Start 2P", monospace',
        fontSize: 7,
        padding: "9px 12px",
        border: "2px solid",
        borderColor: variants[variant].borderColor,
        background: variants[variant].background,
        boxShadow: "3px 3px 0 #000, inset 0 1px 0 rgba(255,255,255,0.12)",
      }}
    >
      {children}
    </button>
  );
}

// ── Tab Button ────────────────────────────────────────────────────
function TabButton({
  active,
  onClick,
  children,
  dot,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  dot?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="relative uppercase tracking-wider cursor-pointer transition-all"
      style={{
        fontFamily: '"Press Start 2P", monospace',
        fontSize: 6,
        padding: "7px 10px",
        border: "2px solid",
        borderBottom: "none",
        borderColor: active ? "#5d7a40 #111 transparent #5d7a40" : "#555 #111 #111 #555",
        background: active ? "#0e0c09" : "#1a1510",
        color: active ? "#7aa050" : "#706860",
        top: 2,
        zIndex: active ? 1 : 0,
      }}
    >
      {children}
      {dot && (
        <span
          className="inline-block w-1.5 h-1.5 bg-[#7aa050] ml-1"
          style={{ animation: "blink 1s step-start infinite" }}
        />
      )}
    </button>
  );
}

// ── Section Heading ───────────────────────────────────────────────
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span
        className="text-[#7aa050] uppercase tracking-widest whitespace-nowrap"
        style={{ fontFamily: '"Press Start 2P", monospace', fontSize: 7 }}
      >
        {children}
      </span>
      <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, #3a4f28, transparent)" }} />
    </div>
  );
}

// ── Profile Tab Content ───────────────────────────────────────────
function ProfileTabContent({ user }: { user: ProfileUser }) {
  return (
    <div style={{ animation: "fadeInUp 0.25s ease forwards" }}>
      {/* Bio */}
      <div
        className="mt-3 mb-5 p-3"
        style={{ background: "rgba(0,0,0,0.4)", border: "2px solid", borderColor: "#111 #444 #444 #111" }}
      >
        <div
          className="text-[#706860] uppercase tracking-widest mb-2"
          style={{ fontFamily: '"Press Start 2P", monospace', fontSize: 6 }}
        >
          // О себе
        </div>
        <p
          className={user.bio ? "text-[#e8e0c8]" : "text-[#4a4540] italic"}
          style={{ fontFamily: '"VT323", monospace', fontSize: 20, lineHeight: 1.4 }}
        >
          {user.bio || "Описание не добавлено..."}
        </p>
      </div>

      <SectionHeading>Статистика</SectionHeading>
      <div className="grid grid-cols-2 gap-1">
        <StatSlot icon="⚔️" value={user.votesTotal}  label="Голоса всего" />
        <StatSlot icon="🗓️" value={user.votesWeekly} label="Эта неделя"   />
        <StatSlot icon="💰" value={user.balance}      label="Баланс"       />
        <StatSlot icon="⭐" value={user.xp}           label="Опыт"         />
      </div>
    </div>
  );
}

// ── Avatar ────────────────────────────────────────────────────────
function PixelAvatar({ src, username }: { src?: string; username: string }) {
  const [err, setErr] = useState(false);
  const imgSrc = src && !err ? src : "/default-steve.png";

  return (
    <div
      className="relative bg-[#0d0b08] p-1.5 w-32 md:w-36"
      style={{
        border: "2px solid",
        borderColor: "#666 #111 #111 #666",
        boxShadow: "5px 5px 0 #000, inset 2px 2px 0 rgba(255,255,255,0.08), inset -2px -2px 0 rgba(0,0,0,0.6)",
      }}
    >
      {/* Grass top */}
      <div
        className="absolute -top-1.5 -left-0.5 -right-0.5 h-1.5"
        style={{ background: "linear-gradient(to bottom, #7aa050, #5d7a40)", borderTop: "2px solid #7aa050" }}
      />
      <img
        src={imgSrc}
        alt={username}
        onError={() => setErr(true)}
        className="w-full block"
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────
export default function ProfilePage({ params }: { params: { username: string } }) {
  const { username } = React.use(params as any) as any;
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading]         = useState(true);
  const [tab, setTab]                 = useState<"profile" | "servers" | "settings">("profile");

  const isOwner = currentUser?.username === username;

  useEffect(() => {
    api.get(`/users/${username}`)
      .then(({ data }) => setProfileUser(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [username]);

  // ── Skeleton ──────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-[#0d0b08] pt-24 px-4">
      <style>{keyframes}</style>
      <div className="max-w-[960px] mx-auto flex flex-col md:flex-row gap-8">
        <div className="w-36 h-36 bg-[#1a1510] animate-pulse" style={pxShadow} />
        <div className="flex-1 flex flex-col gap-3">
          {[180, 72, 120].map((h, i) => (
            <div key={i} className="bg-[#1a1510] animate-pulse" style={{ height: h, ...pxShadowSm }} />
          ))}
        </div>
      </div>
    </div>
  );

  if (!profileUser) return (
    <div className="min-h-screen bg-[#0d0b08] pt-24 flex items-center justify-center">
      <span className="text-[#4a4540]" style={{ fontFamily: '"Press Start 2P", monospace', fontSize: 10 }}>
        USER_NOT_FOUND
      </span>
    </div>
  );

  return (
    <div
      className="min-h-screen pt-24 pb-16 px-4"
      style={{
        background: "#0d0b08",
        backgroundImage: `
          repeating-linear-gradient(0deg,  transparent, transparent 31px, rgba(255,255,255,0.012) 32px),
          repeating-linear-gradient(90deg, transparent, transparent 31px, rgba(255,255,255,0.012) 32px)
        `,
        backgroundSize: "32px 32px",
      }}
    >
      <style>{keyframes}</style>

      {/* Scanlines */}
      <div
        className="pointer-events-none fixed inset-0 z-50"
        style={{
          background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.06) 0px, rgba(0,0,0,0.06) 1px, transparent 1px, transparent 3px)",
        }}
      />

      <div className="max-w-[960px] mx-auto flex flex-col md:flex-row gap-8 items-start">

        {/* ── Sidebar ────────────────────────────────────────── */}
        <aside className="w-full md:w-48 shrink-0 flex flex-col gap-3">
          <PixelAvatar src={profileUser.avatar} username={profileUser.username} />

          {/* Name plate */}
          <div className="bg-[#0e0c09] px-3 py-2" style={{ ...pxBorder, ...pxShadowSm }}>
            <div
              className="text-[#e8e0c8] uppercase leading-snug break-all"
              style={{ fontFamily: '"Press Start 2P", monospace', fontSize: 8 }}
            >
              {profileUser.username}
            </div>
            <span
              className="inline-block mt-1.5 px-1.5 py-0.5 bg-[#3a4f28] text-[#7aa050] uppercase tracking-widest"
              style={{ fontFamily: '"VT323", monospace', fontSize: 14, border: "1px solid #5d7a40" }}
            >
              {profileUser.role || "Игрок"}
            </span>
          </div>

          <XPBar
            pct={profileUser.progressPercentage}
            level={profileUser.level}
            xp={profileUser.xp}
            xpNext={profileUser.xpRequiredForNext}
          />

          {isOwner && (
            <div className="pt-1">
              <LogoutButton />
            </div>
          )}
        </aside>

        {/* ── Main ───────────────────────────────────────────── */}
        <main className="flex-1 min-w-0 flex flex-col">
          {/* Tab bar */}
          <div className="flex gap-0.5">
            <TabButton active={tab === "profile"} onClick={() => setTab("profile")}>
              Профиль
            </TabButton>
            <TabButton active={tab === "servers"} onClick={() => setTab("servers")} dot>
              Серверы
            </TabButton>
            {isOwner && (
              <TabButton active={tab === "settings"} onClick={() => setTab("settings")}>
                Настройки
              </TabButton>
            )}
          </div>

          {/* Content panel */}
          <div
            className="flex-1 min-h-[400px] p-5 relative overflow-hidden"
            style={{
              background: "#0e0c09",
              border: "2px solid",
              borderColor: "#5d7a40 #111 #111 #5d7a40",
              boxShadow: "5px 5px 0 #000",
            }}
          >
            {/* Green pixel stripe top */}
            <div
              className="absolute top-0 left-0 right-0 h-0.5 opacity-60"
              style={{
                backgroundImage: "repeating-linear-gradient(90deg, #7aa050 0px, #7aa050 8px, #5d7a40 8px, #5d7a40 16px, #3a4f28 16px, #3a4f28 24px)",
              }}
            />

            {tab === "profile" && <ProfileTabContent user={profileUser} />}

            {tab === "servers" && (
              <div style={{ animation: "fadeInUp 0.25s ease forwards" }}>
                <div className="mt-3">
                  <ProfileTabs user={profileUser} isOwner={isOwner} />
                </div>
              </div>
            )}

            {tab === "settings" && isOwner && (
              <div className="flex flex-col items-center justify-center h-48 gap-4" style={{ animation: "fadeInUp 0.25s ease forwards" }}>
                <span className="text-4xl" style={{ filter: "grayscale(1)" }}>🔧</span>
                <p
                  className="text-[#3a3830] uppercase"
                  style={{ fontFamily: '"Press Start 2P", monospace', fontSize: 7, lineHeight: 2 }}
                >
                  Раздел в разработке
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// ── Keyframes (injected once) ─────────────────────────────────────
const keyframes = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(5px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes blink {
    50% { opacity: 0; }
  }
`;