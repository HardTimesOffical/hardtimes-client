"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import LogoutButton from "@/app/profile/[username]/LogoutButton";
import ProfileTabs from "@/app/profile/[username]/profileTabs";
import api from "@/lib/api";

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

// ── XP Bar ────────────────────────────────────────────────────────
function XPBar({ pct, level, xp, xpNext }: {
  pct: number; level: number; xp: number; xpNext: number;
}) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 200);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-[11px] font-bold text-white/50 uppercase tracking-[0.15em]">
          Уровень {level}
        </span>
        <span className="text-[11px] font-bold text-[#8da081] tracking-wide">
          {xp} / {xp + xpNext} XP
        </span>
      </div>
      <div className="h-1.5 w-full bg-white/[0.06] overflow-hidden">
        <div
          className="h-full transition-all duration-1000 ease-out"
          style={{
            width: `${width}%`,
            background: "linear-gradient(to right, #5a6e60, #8da081)",
          }}
        />
      </div>
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────
function StatCard({ icon, value, label }: { icon: string; value: number | string; label: string }) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.06] p-4 flex flex-col gap-1 hover:bg-white/[0.05] transition-colors">
      <span className="text-xl">{icon}</span>
      <span className="text-xl font-bold text-white leading-none">{value}</span>
      <span className="text-[11px] text-white/40 uppercase tracking-[0.15em] font-medium">{label}</span>
    </div>
  );
}

// ── Tab Button ────────────────────────────────────────────────────
function TabBtn({ active, onClick, children }: {
  active: boolean; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-3 text-[11px] font-bold uppercase tracking-[0.15em] transition-all border-b-2
        ${active
          ? "text-white border-[#8da081]"
          : "text-white/30 border-transparent hover:text-white/60 hover:border-white/20"
        }
      `}
    >
      {children}
    </button>
  );
}

// ── Role Badge ────────────────────────────────────────────────────
function RoleBadge({ role }: { role: string }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 bg-[#5a6e60]/15 border border-[#5a6e60]/30 text-[#8da081] text-[10px] font-bold uppercase tracking-[0.2em]">
      {role}
    </span>
  );
}

// ── Avatar ────────────────────────────────────────────────────────
function Avatar({ src, username }: { src?: string; username: string }) {
  const [err, setErr] = useState(false);
  const imgSrc = src && !err ? src : "/default-steve.png";
  return (
    <div className="relative w-24 h-24 bg-[#1a1a1a] border border-white/10 overflow-hidden flex-shrink-0">
      <img
        src={imgSrc}
        alt={username}
        onError={() => setErr(true)}
        className="w-full h-full object-cover"
        style={{ imageRendering: "pixelated" }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[#8da081]/50" />
    </div>
  );
}

// ── Profile content ───────────────────────────────────────────────
function ProfileContent({ user }: { user: ProfileUser }) {
  return (
    <div className="space-y-8" style={{ animation: "fadeIn 0.2s ease" }}>
      <div>
        <p className="text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] mb-3">О себе</p>
        <p className={`text-[15px] leading-relaxed ${user.bio ? "text-white/75" : "text-white/20 italic"}`}>
          {user.bio || "Описание не добавлено."}
        </p>
      </div>

      <div className="h-px bg-white/[0.06]" />

      <div>
        <p className="text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] mb-3">Статистика</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <StatCard icon="⚔️" value={user.votesTotal}  label="Голоса всего" />
          <StatCard icon="📅" value={user.votesWeekly} label="Эта неделя"   />
          <StatCard icon="💰" value={user.balance}      label="Баланс"       />
          <StatCard icon="⭐" value={user.xp}           label="Опыт"         />
        </div>
      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="min-h-screen bg-[#161616] pt-20 px-4 pb-16 animate-pulse">
      <div className="max-w-[960px] mx-auto space-y-0">
        <div className="h-36 bg-white/[0.04] border border-white/[0.06] border-b-0" />
        <div className="h-32 bg-white/[0.03] border border-white/[0.06] border-b-0" />
        <div className="h-96 bg-white/[0.02] border border-white/[0.06]" />
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────
export default function ProfilePage({ params }: { params: { username: string } }) {
  const { username } = React.use(params as any) as any;
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"profile" | "servers" | "settings">("profile");

  const isOwner = currentUser?.username === username;

  useEffect(() => {
    api.get(`/users/${username}`)
      .then(({ data }) => setProfileUser(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) return <Skeleton />;

  if (!profileUser) return (
    <div className="min-h-screen bg-[#161616] flex items-center justify-center">
      <p className="text-white/20 text-sm font-bold uppercase tracking-widest">USER_NOT_FOUND</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#161616] pt-20 pb-16 px-4">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="max-w-[960px] mx-auto">

        {/* ── Banner ────────────────────────────────────────── */}
        <div className="relative h-36 bg-[#1e1e1e] border border-white/[0.06] border-b-0 overflow-hidden">
          {/* MC grid pattern */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                repeating-linear-gradient(0deg,  transparent, transparent 31px, rgba(255,255,255,0.025) 32px),
                repeating-linear-gradient(90deg, transparent, transparent 31px, rgba(255,255,255,0.025) 32px)
              `,
              backgroundSize: "32px 32px",
            }}
          />
          {/* Olive vignette */}
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse at 20% 50%, rgba(90,110,96,0.12) 0%, transparent 60%)" }}
          />
        </div>

        {/* ── Profile strip ─────────────────────────────────── */}
        <div className="bg-[#1a1a1a] border border-white/[0.06] border-t-0 border-b-0 px-8">
          <div className="flex flex-col sm:flex-row sm:items-end gap-5 -translate-y-10 mb-0">
            {/* Avatar over banner */}
            <div className="border-[3px] border-[#1a1a1a] flex-shrink-0 w-fit">
              <Avatar src={profileUser.avatar} username={profileUser.username} />
            </div>

            {/* Name block */}
            <div className="flex-1 min-w-0 pb-4 sm:pb-3">
              <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <h1 className="text-[22px] font-bold text-white uppercase tracking-tight leading-none">
                  {profileUser.username}
                </h1>
                <RoleBadge role={profileUser.role || "Игрок"} />
              </div>
              <XPBar
                pct={profileUser.progressPercentage}
                level={profileUser.level}
                xp={profileUser.xp}
                xpNext={profileUser.xpRequiredForNext}
              />
            </div>

            {/* Actions */}
            {isOwner && (
              <div className="pb-3 flex-shrink-0">
                <LogoutButton />
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-0 border-t border-white/[0.06] -mx-8 px-6 -mb-px">
            <TabBtn active={tab === "profile"}  onClick={() => setTab("profile")}>Профиль</TabBtn>
            <TabBtn active={tab === "servers"}  onClick={() => setTab("servers")}>Серверы</TabBtn>
            {isOwner && (
              <TabBtn active={tab === "settings"} onClick={() => setTab("settings")}>Настройки</TabBtn>
            )}
          </div>
        </div>

        {/* ── Content area ──────────────────────────────────── */}
        <div className="bg-[#181818] border border-white/[0.06] p-8 min-h-[360px]">
          {tab === "profile" && <ProfileContent user={profileUser} />}

          {tab === "servers" && (
            <div style={{ animation: "fadeIn 0.2s ease" }}>
              <ProfileTabs user={profileUser} isOwner={isOwner} />
            </div>
          )}

          {tab === "settings" && isOwner && (
            <div
              className="flex flex-col items-center justify-center h-48 gap-3"
              style={{ animation: "fadeIn 0.2s ease" }}
            >
              <span className="text-4xl opacity-20">🔧</span>
              <p className="text-[11px] font-bold text-white/20 uppercase tracking-[0.2em]">
                Раздел в разработке
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}