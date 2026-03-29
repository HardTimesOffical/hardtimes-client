'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { HiOutlineChatBubbleLeftRight, HiOutlineEye, HiOutlineHeart, HiPlus } from 'react-icons/hi2';
import { getPlayerStats } from '@/lib/xp';

// ── Константа бренда ─────────────────────────────────────────
const BRAND = "#84a98c";

// ── Цвет уровня ──────────────────────────────────────────────
function getLevelColor(level: number): string {
  if (level >= 50) return "#f2994a";   // легенда — оранжевый
  if (level >= 30) return "#bb6bd9";   // ветеран — фиолетовый
  if (level >= 15) return "#29a8eb";   // опытный — голубой
  if (level >= 5)  return BRAND;       // новичок — зелёный
  return "#7d8581";                    // совсем новый — серый
}

export default function ForumPosts() {
  const [posts,   setPosts]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/forum/posts?limit=5&sort=new`);
        const data = await res.json();
        setPosts(data.posts || []);
      } catch { /* silent */ }
      finally { setLoading(false); }
    })();
  }, []);

  if (!loading && posts.length === 0) return null;

  return (
    <div className="w-full">

      {/* ── Шапка ── */}
      <div
        className="flex items-center justify-between px-2 py-2 border-b"
        style={{ borderColor: "rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center gap-1.5">
          <div className="w-1 h-3 flex-shrink-0" style={{ background: BRAND }} />
          <span
            className="font-mc-pixel text-[8px] uppercase tracking-widest"
            style={{ color: BRAND }}
          >
            Форум
          </span>
        </div>
        <Link
          href="/forum"
          className="font-mc-pixel text-[7px] uppercase tracking-widest transition-colors"
          style={{ color: "#7d8581" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#f2f2f2")}
          onMouseLeave={e => (e.currentTarget.style.color = "#7d8581")}
        >
          Все темы →
        </Link>
      </div>

      {/* ── Список постов ── */}
      <div className="flex flex-col">
        {loading ? (
          [1, 2, 3].map(i => (
            <div
              key={i}
              className="px-2 py-3 border-b animate-pulse"
              style={{ borderColor: "rgba(255,255,255,0.04)" }}
            >
              <div className="flex gap-2.5">
                {/* Аватар-скелетон */}
                <div className="w-9 h-9 flex-shrink-0" style={{ background: "rgba(255,255,255,0.05)" }} />
                <div className="flex-1 space-y-2 pt-0.5">
                  <div className="h-2 w-12" style={{ background: "rgba(255,255,255,0.05)" }} />
                  <div className="h-3 w-full" style={{ background: "rgba(255,255,255,0.07)" }} />
                  <div className="h-2 w-2/3" style={{ background: "rgba(255,255,255,0.04)" }} />
                </div>
              </div>
            </div>
          ))
        ) : posts.map((post, i) => {
          const stats = post.author?.xp !== undefined
            ? getPlayerStats(post.author.xp)
            : null;
          const level = stats?.level ?? 0;
          const levelColor = getLevelColor(level);

          return (
            <Link
              key={post._id}
              href={`/forum/${post.slug}`}
              className="group px-2 py-3 border-b last:border-0 transition-colors duration-100"
              style={{ borderColor: "rgba(255,255,255,0.04)" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
            >
              <div className="flex gap-2.5">

                {/* ── Аватар + уровень ── */}
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div
                    className="w-9 h-9 overflow-hidden relative"
                    style={{ border: `1px solid ${levelColor}40` }}
                  >
                    {post.author?.avatar
                      ? <img src={post.author.avatar} alt="" className="w-full h-full object-cover" />
                      : (
                        <div
                          className="w-full h-full flex items-center justify-center font-mc-pixel text-[9px]"
                          style={{ background: "rgba(0,0,0,0.3)", color: levelColor }}
                        >
                          {post.author?.username?.[0]?.toUpperCase() || "?"}
                        </div>
                      )
                    }
                  </div>
                  {/* Бейдж уровня */}
                  <span
                    className="font-mc-pixel text-[7px] uppercase px-1 leading-none py-0.5"
                    style={{
                      color: levelColor,
                      background: `${levelColor}15`,
                      border: `1px solid ${levelColor}30`,
                    }}
                  >
                    {level}
                  </span>
                </div>

                {/* ── Контент ── */}
                <div className="flex-1 min-w-0">

                  {/* Категория + номер */}
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className="font-mc-pixel text-[7px] uppercase tracking-widest"
                      style={{ color: "#7d8581" }}
                    >
                      #{i + 1}
                    </span>
                    <span
                      className="font-mc-pixel text-[7px] uppercase tracking-widest px-1 py-0.5"
                      style={{
                        color: BRAND,
                        background: `${BRAND}10`,
                        border: `1px solid ${BRAND}20`,
                      }}
                    >
                      {post.category || 'Обсуждение'}
                    </span>
                  </div>

                  {/* Заголовок */}
                  <h3
                    className="font-mc-pixel text-[12px] leading-snug py-3 line-clamp-2 transition-colors duration-100"
                    style={{ color: "#f2f2f2" }}
                    onMouseEnter={e => (e.currentTarget.style.color = BRAND)}
                    onMouseLeave={e => (e.currentTarget.style.color = "#f2f2f2")}
                  >
                    {post.title}
                  </h3>

                  {/* Мета: автор + статы */}
                  <div className="flex items-center justify-between mt-1.5">
                    <span
                      className="font-mc-pixel text-[8px] truncate max-w-[80px]"
                      style={{ color: "#7d8581" }}
                    >
                      {post.author?.username || "Аноним"}
                    </span>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className="flex items-center gap-0.5 font-mc-pixel text-[7px]"
                        style={{ color: "#7d8581" }}
                      >
                        <HiOutlineEye className="w-2.5 h-2.5" />
                        {post.views || 0}
                      </span>
                      <span
                        className="flex items-center gap-0.5 font-mc-pixel text-[7px]"
                        style={{ color: "#7d8581" }}
                      >
                        <HiOutlineHeart className="w-2.5 h-2.5" />
                        {post.likesCount || post.likes?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── Футер ── */}
      <div
        className="p-2 border-t"
        style={{ borderColor: "rgba(255,255,255,0.05)" }}
      >
        <Link
          href="/forum/create-post"
          className="flex items-center justify-center gap-1.5 w-full py-2 font-mc-pixel text-[8px] uppercase tracking-widest border transition-all"
          style={{ color: "#7d8581", borderColor: "rgba(255,255,255,0.05)", background: "transparent" }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.color = BRAND;
            el.style.borderColor = `${BRAND}40`;
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.color = "#7d8581";
            el.style.borderColor = "rgba(255,255,255,0.05)";
          }}
        >
          <HiPlus className="w-3 h-3" />
          Создать тему
        </Link>
      </div>
    </div>
  );
}