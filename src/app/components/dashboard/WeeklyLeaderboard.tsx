'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

// ── Константа бренда ─────────────────────────────────────────
const BRAND = "#84a98c";

interface Leader {
  _id: string;
  username: string;
  avatar?: string;
  votesWeekly: number;
}

// ── Цвет и стиль места ───────────────────────────────────────
function getRankStyle(index: number): {
  numColor: string;
  avatarBorder: string;
  glow: string;
  nameColor: string;
  bg: string;
  votesColor: string;
  label: string | null;
} {
  if (index === 0) return {
    numColor: "#f2c94c",
    avatarBorder: "rgba(242,201,76,0.5)",
    glow: "0 0 10px rgba(242,201,76,0.25)",
    nameColor: "#f2c94c",
    bg: "rgba(242,201,76,0.04)",
    votesColor: "#f2c94c",
    label: "I",
  };
  if (index === 1) return {
    numColor: "#bdbdbd",
    avatarBorder: "rgba(189,189,189,0.4)",
    glow: "0 0 8px rgba(189,189,189,0.15)",
    nameColor: "#e0e0e0",
    bg: "rgba(189,189,189,0.03)",
    votesColor: "#bdbdbd",
    label: "II",
  };
  if (index === 2) return {
    numColor: "#c07b3a",
    avatarBorder: "rgba(192,123,58,0.4)",
    glow: "0 0 8px rgba(192,123,58,0.15)",
    nameColor: "#d49050",
    bg: "rgba(192,123,58,0.03)",
    votesColor: "#c07b3a",
    label: "III",
  };
  return {
    numColor: "#7d8581",
    avatarBorder: "rgba(255,255,255,0.08)",
    glow: "none",
    nameColor: "#f2f2f2",
    bg: "transparent",
    votesColor: "#7d8581",
    label: null,
  };
}

export const WeeklyLeaderboard = () => {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/leaderboard/weekly`);
        setLeaders(data);
      } catch (error) {
        console.error("Failed to fetch leaders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaders();
  }, []);

  if (!loading && leaders.length === 0) return null;

  return (
    <aside className="w-full">

      {/* ── Шапка ── */}
      <div
        className="flex items-center justify-between px-2 py-2 border-b"
        style={{ borderColor: "rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center gap-1.5">
          <div className="w-1 h-3 flex-shrink-0" style={{ background: "#f2c94c" }} />
          <span
            className="font-mc-pixel text-[8px] uppercase tracking-widest"
            style={{ color: "#f2c94c" }}
          >
            Топ недели
          </span>
        </div>
        <span className="font-mc-pixel text-[7px] uppercase tracking-widest" style={{ color: "#7d8581" }}>
          Голоса
        </span>
      </div>

      {/* ── Список ── */}
      <div className="flex flex-col">
        {loading ? (
          [1, 2, 3].map(i => (
            <div
              key={i}
              className="px-2 py-3 border-b animate-pulse"
              style={{ borderColor: "rgba(255,255,255,0.04)" }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-4 h-3" style={{ background: "rgba(255,255,255,0.05)" }} />
                <div className="w-8 h-8 flex-shrink-0" style={{ background: "rgba(255,255,255,0.07)" }} />
                <div className="flex-1 h-2" style={{ background: "rgba(255,255,255,0.05)" }} />
              </div>
            </div>
          ))
        ) : (
          leaders.map((user, index) => {
            const rank = getRankStyle(index);

            return (
              <Link
                key={user._id}
                href={`/profile/${user.username}`}
                className="flex items-center justify-between px-2 py-2.5 border-b last:border-0 transition-colors duration-100"
                style={{
                  borderColor: "rgba(255,255,255,0.04)",
                  background: rank.bg,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background =
                    index < 3 ? rank.bg.replace("0.0", "0.07") : "rgba(255,255,255,0.02)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = rank.bg;
                }}
              >
                <div className="flex items-center gap-2.5">

                  {/* Место */}
                  <div className="w-5 flex-shrink-0 text-right">
                    {rank.label ? (
                      <span
                        className="font-mc-pixel text-[8px]"
                        style={{ color: rank.numColor }}
                      >
                        {rank.label}
                      </span>
                    ) : (
                      <span
                        className="font-mc-pixel text-[8px]"
                        style={{ color: "#7d8581" }}
                      >
                        {index + 1}
                      </span>
                    )}
                  </div>

                  {/* Аватар */}
                  <div
                    className="w-8 h-8 flex-shrink-0 overflow-hidden"
                    style={{
                      border: `1px solid ${rank.avatarBorder}`,
                      boxShadow: rank.glow,
                    }}
                  >
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center font-mc-pixel text-[9px]"
                        style={{ background: "rgba(0,0,0,0.3)", color: rank.numColor }}
                      >
                        {user.username[0].toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Имя */}
                  <span
                    className="font-mc-pixel text-[9px] truncate max-w-[90px]"
                    style={{ color: rank.nameColor }}
                  >
                    {user.username}
                  </span>
                </div>

                {/* Голоса */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <span
                    className="font-mc-pixel text-[8px] uppercase tracking-widest opacity-40"
                    style={{ color: rank.votesColor }}
                  >
                    ×
                  </span>
                  <span
                    className="font-mc-pixel text-[10px]"
                    style={{ color: rank.votesColor }}
                  >
                    {user.votesWeekly}
                  </span>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </aside>
  );
};