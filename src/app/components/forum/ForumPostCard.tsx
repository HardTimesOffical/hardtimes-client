'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { HiChatBubbleLeft, HiOutlineEye, HiUserCircle, HiLink, HiHeart } from "react-icons/hi2";
import { useAuth } from '@/context/AuthContext';

export default function ForumPostCard({ post }: any) {
  const { user, accessToken } = useAuth();

  const [isLiked,    setIsLiked]    = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState<number>(post.likes?.length || 0);
  const [imgError,   setImgError]   = useState(false);

  useEffect(() => {
    setIsLiked(post.isLiked);
    setLikesCount(post.likes?.length || 0);
  }, [post.isLiked, post.likes]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return alert("Войдите, чтобы поставить лайк");
    try {
      const res  = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/forum/posts/${post._id}/like`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        setIsLiked(data.isLiked);
        setLikesCount(data.likesCount);
      }
    } catch { /* silent */ }
  };

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ru });

  return (
    <div className="group bg-card border border-border overflow-hidden
      transition-colors duration-150 hover:border-foreground/20">
      <Link href={`/forum/${post.slug}`} className="flex flex-col p-4 gap-3">

        {/* ── Верх: автор + категория ── */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 bg-surface border border-border overflow-hidden shrink-0">
              {post.author?.avatar && !imgError ? (
                <img src={post.author.avatar} onError={() => setImgError(true)}
                  className="w-full h-full object-cover" alt="" />
              ) : (
                <HiUserCircle className="w-full h-full text-muted" />
              )}
            </div>
            <div className="flex flex-col leading-none min-w-0">
              <span className="font-standard font-bold text-[12px] text-foreground-bright truncate">
                {post.author?.username}
              </span>
              <span className="font-standard text-[10px] text-muted/50 mt-0.5">
                {timeAgo}
              </span>
            </div>
          </div>

          {/* Категория — пиксельный тег */}
          {post.category && (
            <span className="shrink-0 font-mc-pixel text-[8px] uppercase tracking-widest
              px-2 py-0.5 bg-surface border border-border text-muted/60">
              {post.category}
            </span>
          )}
        </div>

        {/* ── Середина: контент + баннер ── */}
        <div className="flex gap-4 items-start">
          <div className="flex-1 min-w-0 flex flex-col gap-1.5">
            {/* Акцент-полоска */}
            <div className="w-5 h-[2px]" style={{ background: '#3c8527' }} />

            <h2 className="font-mc-title leading-snug line-clamp-2
              transition-colors duration-150 group-hover:text-[#5aac44]"
              style={{ fontSize: 'clamp(12px, 1.5vw, 15px)', textShadow: '1px 1px 0 rgba(0,0,0,0.3)' }}>
              {post.title}
            </h2>

            <div
              className="font-standard text-[12px] text-muted leading-relaxed line-clamp-2"
              dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />
          </div>

          {/* Баннер поста */}
          {post.bannerUrl && (
            <div className="w-28 h-20 sm:w-36 sm:h-24 border border-border overflow-hidden
              bg-surface shrink-0 relative">
              <img src={post.bannerUrl}
                className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm" alt="" />
              <img src={post.bannerUrl}
                className="relative w-full h-full object-contain" alt="Banner" />
            </div>
          )}
        </div>

        {/* ── Низ: статистика + лайк ── */}
        <div className="flex items-center justify-between pt-3 border-t border-border/40">
          <div className="flex items-center gap-4">
            {/* Комментарии */}
            <div className="flex items-center gap-1.5">
              <HiChatBubbleLeft className="w-3.5 h-3.5 text-muted shrink-0" />
              <span className="font-standard font-bold text-[11px] text-muted">
                {post.repliesCount || 0}
              </span>
            </div>
            {/* Просмотры */}
            <div className="flex items-center gap-1.5">
              <HiOutlineEye className="w-3.5 h-3.5 text-muted shrink-0" />
              <span className="font-standard font-bold text-[11px] text-muted">
                {post.views || 0}
              </span>
            </div>
            {/* Связанный проект */}
            {post.relatedProject && (
              <div className="hidden lg:flex items-center gap-1 px-2 py-0.5
                border border-border bg-surface">
                <HiLink className="w-3 h-3 text-muted shrink-0" />
                <span className="font-standard text-[10px] text-muted truncate max-w-[100px]">
                  {post.relatedProject.title}
                </span>
              </div>
            )}
          </div>

          {/* Кнопка лайка */}
          <button
            onClick={handleLike}
            className="flex items-center gap-1.5 px-3 py-1.5 border
              font-standard font-bold text-[11px] transition-all duration-150 active:scale-95"
            style={isLiked ? {
              background: '#3c1515',
              borderColor: '#7f1d1d',
              color: '#fca5a5',
            } : {
              background: 'var(--surface)',
              borderColor: 'var(--border)',
              color: 'var(--muted)',
            }}
            onMouseEnter={e => {
              if (!isLiked) {
                (e.currentTarget as HTMLElement).style.borderColor = '#7f1d1d';
                (e.currentTarget as HTMLElement).style.color = '#fca5a5';
              }
            }}
            onMouseLeave={e => {
              if (!isLiked) {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                (e.currentTarget as HTMLElement).style.color = 'var(--muted)';
              }
            }}
          >
            <HiHeart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{likesCount}</span>
          </button>
        </div>

      </Link>
    </div>
  );
}