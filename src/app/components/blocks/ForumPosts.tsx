'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { HiOutlineChatBubbleLeftRight, HiOutlineEye, HiOutlineHeart, HiPlus } from 'react-icons/hi2';

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
    <div className="w-full bg-card border border-border overflow-hidden">

      {/* ── Шапка ── */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border bg-surface">
        <div className="flex items-center gap-2">
          <HiOutlineChatBubbleLeftRight className="w-3.5 h-3.5 text-muted shrink-0" />
          <span className="font-mc-pixel text-[8px] uppercase tracking-widest text-muted">
            Форум
          </span>
        </div>
        <Link href="/forum"
          className="font-mc-pixel text-[7px] uppercase tracking-widest text-muted/40
            hover:text-muted transition-colors">
          Все темы
        </Link>
      </div>

      {/* ── Список постов ── */}
      <div className="flex flex-col">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="px-3 py-3 border-b border-border animate-pulse">
              <div className="h-2 w-10 bg-border mb-2" />
              <div className="h-3 w-full bg-border mb-1.5" />
              <div className="h-2 w-3/4 bg-border/60" />
            </div>
          ))
        ) : posts.map((post, i) => (
          <Link
            key={post._id}
            href={`/forum/${post.slug}`}
            className="group px-3 py-3 border-b border-border last:border-0
              hover:bg-surface transition-colors duration-100"
          >
            {/* Категория */}
            <div className="flex items-center gap-1.5 mb-1.5">
              {/* Номер */}
              <span className="font-mc-pixel text-[7px] text-muted/30">{i + 1}</span>
              <span className="font-mc-pixel text-[7px] uppercase tracking-widest text-muted/50">
                {post.category || 'Обсуждение'}
              </span>
            </div>

            {/* Заголовок */}
            <h3 className="font-standard font-bold text-[12px] text-foreground-bright
              leading-snug line-clamp-2 group-hover:text-[#5aac44] transition-colors duration-100">
              {post.title}
            </h3>

            {/* Мета */}
            <div className="flex items-center justify-between mt-2">
              {/* Автор */}
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="w-4 h-4 bg-surface border border-border overflow-hidden shrink-0">
                  {post.author?.avatar
                    ? <img src={post.author.avatar} alt="" className="w-full h-full object-cover" />
                    : <div className="w-full h-full bg-border" />}
                </div>
                <span className="font-standard text-[10px] text-muted/60 truncate max-w-[70px]">
                  {post.author?.username}
                </span>
              </div>

              {/* Статы */}
              <div className="flex items-center gap-2.5 shrink-0">
                <span className="flex items-center gap-0.5 font-standard text-[10px] text-muted/50">
                  <HiOutlineEye className="w-3 h-3" />
                  {post.views || 0}
                </span>
                <span className="flex items-center gap-0.5 font-standard text-[10px] text-muted/50">
                  <HiOutlineHeart className="w-3 h-3" />
                  {post.likesCount || post.likes?.length || 0}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Футер ── */}
      <div className="p-2 border-t border-border bg-surface">
        <Link
          href="/forum/create-post"
          className="flex items-center justify-center gap-1.5 w-full py-1.5
            font-standard font-bold text-[11px] text-muted border border-border
            hover:text-foreground-bright hover:border-foreground/20
            transition-colors duration-100 bg-card"
        >
          <HiPlus className="w-3 h-3" />
          Создать тему
        </Link>
      </div>
    </div>
  );
}