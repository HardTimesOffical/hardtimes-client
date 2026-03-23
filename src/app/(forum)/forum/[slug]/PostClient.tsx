'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  HiHeart, HiEye, HiUserCircle, HiArrowLeft,
  HiOutlineUserGroup, HiOutlineCalendarDays,
  HiOutlineChatBubbleLeftEllipsis, HiArrowRight
} from "react-icons/hi2";
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import Link from 'next/link';
import CategorySelect from '@/app/components/forum/CategorySelect';
import PostComments from '@/app/components/forum/PostComments';
import YandexAds from '@/app/components/yandex/YandexAds';

export default function PostClient() {
  const { slug } = useParams();
  const router = useRouter();
  const { user, accessToken } = useAuth();

  const [post, setPost] = useState<any>(null);
  const [activeAuthors, setActiveAuthors] = useState<any[]>([]);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const hasIncremented = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/forum/posts/${slug}`);
        const data = await res.json();
        setPost(data);
        setLikesCount(data.likes?.length || 0);
        if (user && data.likes?.includes(user.id)) setLiked(true);

        const resAuth  = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/forum/posts?limit=100`);
        const dataAuth = await resAuth.json();
        const map: any = {};
        (dataAuth.posts || []).forEach((p: any) => {
          const name = p.author?.username || p.authorName;
          if (name) map[name] = { username: name, avatar: p.author?.avatar || p.authorAvatar, count: (map[name]?.count || 0) + 1 };
        });
        setActiveAuthors(Object.values(map).sort((a: any, b: any) => b.count - a.count).slice(0, 5));
      } catch (e) { console.error(e); }
    })();
  }, [slug, user]);

  useEffect(() => {
    if (post?._id && !hasIncremented.current) {
      hasIncremented.current = true;
      fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/forum/posts/${post._id}/view`, { method: 'PATCH' });
    }
  }, [post?._id]);

  const handleLike = async () => {
    if (!user) return alert("Войдите, чтобы поставить лайк");
    const res  = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/forum/posts/${post._id}/like`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await res.json();
    setLiked(data.isLiked);
    setLikesCount(data.likesCount);
  };

  if (!post) return (
    <div className="min-h-screen flex items-center justify-center">
      <span className="font-mc-pixel text-[10px] text-muted uppercase tracking-widest animate-pulse">
        Загрузка…
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 pt-14">

      {/* ── Навигация ── */}
      <div className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="max-w-[1300px] mx-auto px-4 h-10 flex items-center">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 font-standard font-bold text-[12px] text-muted
              hover:text-foreground-bright transition-colors"
          >
            <HiArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            Назад к форуму
          </button>
        </div>
      </div>

      <div className="max-w-[1300px] mx-auto px-4 mt-6">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ══════════════════════════════════════════
              ОСНОВНОЙ КОНТЕНТ
          ══════════════════════════════════════════ */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">

            {/* Категория */}
            {post.category && (
              <div className="flex items-center gap-2">
                <div className="w-[3px] h-3 shrink-0"
                  style={{ background: 'linear-gradient(to bottom, #5aac44, #2a5e1a)' }} />
                <span className="font-mc-pixel text-[8px] uppercase tracking-widest text-muted/60">
                  {post.category}
                </span>
              </div>
            )}

            {/* Заголовок */}
            <h1 className="font-mc-title text-foreground-bright leading-snug break-words"
              style={{ fontSize: 'clamp(18px, 3vw, 30px)', textShadow: '2px 2px 0 rgba(0,0,0,0.3)' }}>
              {post.title}
            </h1>

            {/* Мета-строка */}
            <div className="flex flex-wrap items-center gap-4 pb-4 border-b border-border">
              {/* Автор */}
              <button
                onClick={() => router.push(`/profile/${post.author?.username}`)}
                className="flex items-center gap-2.5 group"
              >
                <div className="w-8 h-8 bg-surface border border-border overflow-hidden shrink-0">
                  {post.author?.avatar ? (
                    <img
                      src={post.author.avatar.startsWith('http')
                        ? post.author.avatar
                        : `${process.env.NEXT_PUBLIC_SERVER_URL}${post.author.avatar}`}
                      className="w-full h-full object-cover"
                      alt={post.author?.username}
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-surface">
                      <span className="font-mc-title text-[10px] text-muted">
                        {post.author?.username?.[0]?.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-left">
                  <p className="font-standard font-bold text-[12px] text-foreground-bright group-hover:text-[#5aac44] transition-colors">
                    {post.author?.username}
                  </p>
                  <p className="font-mc-pixel text-[7px] text-muted uppercase tracking-wider">Автор</p>
                </div>
              </button>

              {/* Дата */}
              <div className="flex items-center gap-1.5 border-l border-border pl-4">
                <HiOutlineCalendarDays className="w-3.5 h-3.5 text-muted shrink-0" />
                <span className="font-standard text-[11px] text-muted">
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ru })}
                </span>
              </div>

              {/* Просмотры */}
              <div className="flex items-center gap-1.5">
                <HiEye className="w-3.5 h-3.5 text-muted shrink-0" />
                <span className="font-standard text-[11px] text-muted">{post.views || 0}</span>
              </div>
            </div>

            {/* Контент поста */}
            <div className="bg-card border border-border p-5 md:p-8">
              <article
                className="prose prose-slate dark:prose-invert max-w-none break-words
                  prose-p:font-[family-name:var(--font-standard)] prose-p:text-[14px] prose-p:leading-[1.8] prose-p:text-foreground
                  prose-headings:font-[family-name:var(--font-mc-title)] prose-headings:text-foreground-bright
                  prose-img:border prose-img:border-border prose-img:rounded-none
                  prose-a:text-[#5aac44] prose-a:no-underline hover:prose-a:underline
                  prose-code:bg-surface prose-code:border prose-code:border-border prose-code:px-1
                  prose-blockquote:border-l-4 prose-blockquote:border-[#3c8527] prose-blockquote:bg-surface prose-blockquote:not-italic"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Кнопка лайка */}
              <div className="flex items-center gap-3 mt-8 pt-6 border-t border-border">
                <button
                  onClick={handleLike}
                  className="flex items-center gap-2.5 px-5 py-2 font-standard font-bold text-[12px]
                    border transition-all duration-150 active:scale-95"
                  style={liked ? {
                    background: '#3c1515',
                    borderColor: '#7f1d1d',
                    color: '#fca5a5',
                  } : {
                    background: 'var(--surface)',
                    borderColor: 'var(--border)',
                    color: 'var(--muted)',
                  }}
                  onMouseEnter={e => {
                    if (!liked) {
                      (e.currentTarget as HTMLElement).style.borderColor = '#7f1d1d';
                      (e.currentTarget as HTMLElement).style.color = '#fca5a5';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!liked) {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                      (e.currentTarget as HTMLElement).style.color = 'var(--muted)';
                    }
                  }}
                >
                  <HiHeart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                  {liked ? 'Понравилось' : 'Оценить'}
                  <span className="font-mc-pixel text-[8px]">{likesCount}</span>
                </button>
              </div>
            </div>

            <YandexAds />
            <PostComments postId={post._id} user={user} accessToken={accessToken} />
          </div>

          {/* ══════════════════════════════════════════
              ПРАВЫЙ САЙДБАР
          ══════════════════════════════════════════ */}
          <aside className="w-full lg:w-64 xl:w-72 shrink-0 flex flex-col gap-4">

            {/* HardLauncher баннер */}
            <Link href="/ru/launcher" className="group block">
              <div className="bg-[#0d0d0d] border border-border overflow-hidden relative p-4 flex flex-col gap-3
                transition-colors duration-150 group-hover:border-[#3c8527]">
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                  style={{ backgroundImage: 'linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px)', backgroundSize: '20px 20px' }} />
                <div className="absolute left-0 top-0 bottom-0 w-[3px]"
                  style={{ background: 'linear-gradient(to bottom, #5aac44, #2a5e1a)' }} />
                <div className="relative pl-2 flex flex-col gap-2">
                  <span className="font-mc-pixel text-[8px] uppercase tracking-widest" style={{ color: '#5aac44' }}>
                    Официально
                  </span>
                  <h3 className="font-mc-title text-white" style={{ fontSize: '15px', textShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>
                    HardLauncher
                  </h3>
                  <p className="font-standard text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Запускай Minecraft в один клик. Авто-обновления и поддержка модов.
                  </p>
                  <div className="flex items-center gap-1.5 font-standard font-bold text-[11px] mt-1
                    transition-all group-hover:gap-2.5" style={{ color: '#5aac44' }}>
                    Скачать бесплатно <HiArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Категории + кнопка все темы */}
            <div className="bg-card border border-border flex flex-col gap-3 p-3">
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <div className="w-[3px] h-3" style={{ background: 'linear-gradient(to bottom, #5aac44, #2a5e1a)' }} />
                <span className="font-mc-pixel text-[8px] text-muted uppercase tracking-widest">Раздел</span>
              </div>
              <CategorySelect
                selected={post.category}
                onSelect={cat => router.push(`/forum?category=${cat}`)}
              />
              <button
                onClick={() => router.push('/forum')}
                className="flex items-center justify-center gap-2 w-full py-2 border border-border
                  font-standard font-bold text-[11px] text-muted
                  hover:text-foreground-bright hover:border-foreground/20 transition-colors"
              >
                <HiOutlineChatBubbleLeftEllipsis className="w-3.5 h-3.5" />
                Все темы форума
              </button>
            </div>

            <YandexAds />

            {/* Топ авторов */}
            <div className="bg-card border border-border overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border bg-surface">
                <HiOutlineUserGroup className="w-3.5 h-3.5 text-muted" />
                <span className="font-mc-pixel text-[8px] uppercase tracking-widest text-muted">Топ авторов</span>
              </div>
              <div className="flex flex-col">
                {activeAuthors.map((author: any, i) => (
                  <Link
                    href={`/profile/${author.username}`}
                    key={author.username}
                    className="flex items-center justify-between px-3 py-2 border-b border-border/40 last:border-0
                      hover:bg-surface transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-mc-pixel text-[8px] text-muted/40 w-3 shrink-0">{i + 1}</span>
                      <div className="w-7 h-7 bg-surface border border-border overflow-hidden shrink-0">
                        {author.avatar
                          ? <img src={author.avatar} className="w-full h-full object-cover" alt="" />
                          : <HiUserCircle className="w-full h-full text-muted" />}
                      </div>
                      <span className="font-standard font-bold text-[12px] text-foreground-bright truncate">
                        {author.username}
                      </span>
                    </div>
                    <span className="font-standard font-black text-[11px] text-muted shrink-0">{author.count}</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}