'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ForumPostCard from '@/app/components/forum/ForumPostCard';
import {
  HiPlus, HiMagnifyingGlass, HiOutlineUserGroup,
  HiOutlineChatBubbleBottomCenterText, HiOutlineSparkles,
  HiOutlineHeart, HiOutlineEye, HiUserCircle, HiArrowRight
} from "react-icons/hi2";
import Link from 'next/link';
import CategorySelect from '@/app/components/forum/CategorySelect';
import YandexAds from '@/app/components/yandex/YandexAds';

const MC_BTN: React.CSSProperties = {
  background: '#3c8527',
  boxShadow: 'inset 1px 1px 0 #5aac44, inset -1px -1px 0 #2a5e1a, 0 2px 0 #2a5e1a',
  color: '#fff',
};

export default function ForumClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');
  const [posts, setPosts] = useState<any[]>([]);
  const [popularPosts, setPopularPosts] = useState<any[]>([]);
  const [activeAuthors, setActiveAuthors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const currentCategory = searchParams.get('category') || 'Все разделы';
  const currentQuery    = searchParams.get('q') || '';
  const currentSort     = searchParams.get('sort') || 'new';

  const updateFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v === 'Все разделы' || !v) params.delete(k); else params.set(k, v);
    });
    router.push(`/forum?${params.toString()}`);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const q = new URLSearchParams();
        if (currentCategory !== 'Все разделы') q.set('category', currentCategory);
        if (currentQuery) q.set('q', currentQuery);
        q.set('sort', currentSort);

        const [rAll, rPop, rAuth] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/forum/posts?${q}`),
          fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/forum/posts?sort=popular&limit=4`),
          fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/forum/posts?limit=100`),
        ]);
        const dAll  = await rAll.json();
        const dPop  = await rPop.json();
        const dAuth = await rAuth.json();

        setPosts(dAll.posts || []);
        setPopularPosts((dPop.posts || []).slice(0, 4));

        const map: any = {};
        (dAuth.posts || []).forEach((p: any) => {
          const name = p.author?.username || p.authorName;
          if (name) map[name] = { username: name, avatar: p.author?.avatar || p.authorAvatar, count: (map[name]?.count || 0) + 1 };
        });
        setActiveAuthors(Object.values(map).sort((a: any, b: any) => b.count - a.count).slice(0, 8));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [currentCategory, currentQuery, currentSort]);

  return (
    <div className="min-h-screen text-foreground pb-16 pt-14 relative">

      {/* Фиксированный фон */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ backgroundImage: "url('https://i.pinimg.com/736x/f3/62/b5/f362b5a96413cda6ea9b804acb117646.jpg')", backgroundSize: "cover", backgroundPosition: "center top", filter: "saturate(0.7) brightness(0.23)" }} />
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent 10%, var(--background) 59%)" }} />

      <div className="relative z-10">
      <main className="max-w-[1300px] mx-auto px-4 sm:px-6 py-6 flex flex-col lg:flex-row gap-6">

        {/* ══════════════════════════════════════════
            МОБИЛЬНЫЙ СЕЛЕКТ — только на мобилках, сверху
        ══════════════════════════════════════════ */}
        <div className="lg:hidden flex flex-col gap-3">
          <CategorySelect
            selected={currentCategory}
            onSelect={cat => updateFilters({ category: cat })}
          />
          <Link
            href="/forum/create-post"
            className="flex items-center justify-center gap-2 py-2.5 font-standard font-bold text-[13px] transition-all hover:brightness-110 active:scale-95"
            style={MC_BTN}
          >
            <HiPlus className="w-4 h-4" />
            Создать тему
          </Link>
        </div>

        {/* ══════════════════════════════════════════
            ЛЕВАЯ КОЛОНКА
        ══════════════════════════════════════════ */}
        <div className="flex-1 min-w-0 flex flex-col gap-8">

          {/* ── Шапка раздела ── */}
          <div className="flex flex-col gap-4">
            {/* Заголовок + поиск */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-[3px] h-6 shrink-0"
                  style={{ background: 'linear-gradient(to bottom, #5aac44, #2a5e1a)' }} />
                <h1 className="font-mc-title"
                  style={{ fontSize: 'clamp(14px, 2vw, 20px)', textShadow: '2px 2px 0 rgba(0,0,0,0.3)' }}>
                  {currentCategory}
                </h1>
              </div>

              {/* Поиск */}
              <div className="relative flex-1 sm:max-w-[280px]">
                <HiMagnifyingGlass className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted pointer-events-none" />
                <input
                  type="text"
                  placeholder="Поиск по форуму…"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && updateFilters({ q: searchInput })}
                  className="w-full bg-surface border border-border pl-8 pr-3 py-2
                    font-standard text-[13px] text-foreground outline-none
                    placeholder:text-muted/40 focus:border-[#5aac44] transition-colors"
                />
              </div>
            </div>

            {/* Сортировка */}
            <div className="flex items-center gap-0 border border-border w-fit">
              {(['new', 'popular'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => updateFilters({ sort: s })}
                  className="px-4 py-1.5 font-standard font-bold text-[11px] transition-all duration-100"
                  style={currentSort === s ? MC_BTN : {
                    background: 'var(--surface)',
                    color: 'var(--muted)',
                  }}
                >
                  {s === 'new' ? 'Новое' : 'Популярное'}
                </button>
              ))}
            </div>
          </div>

          {/* ── Популярные темы ── */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <HiOutlineSparkles className="w-4 h-4 text-muted" />
              <span className="font-mc-pixel text-[9px] text-muted uppercase tracking-widest">В тренде</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {popularPosts.map(post => (
                <Link
                  href={`/forum/${post.slug}`}
                  key={post._id}
                  className="group bg-card border border-border p-4 flex flex-col justify-between
                    transition-colors duration-150 hover:border-foreground/20 overflow-hidden"
                  style={{ minHeight: '160px' }}
                >
                  <div className="flex flex-col gap-2">
                    {/* Категория + статы */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mc-pixel text-[8px] uppercase tracking-widest px-2 py-0.5 bg-surface border border-border text-muted">
                        {post.category || 'Общее'}
                      </span>
                      <div className="flex items-center gap-3 font-standard text-[10px] text-muted">
                        <span className="flex items-center gap-1">
                          <HiOutlineHeart className="w-3 h-3" /> {post.likes?.length || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <HiOutlineEye className="w-3 h-3" /> {post.views || 0}
                        </span>
                      </div>
                    </div>

                    {/* Заголовок */}
                    <h4 className="font-mc-title leading-snug line-clamp-2 transition-colors duration-150 group-hover:text-[#5aac44]"
                      style={{ fontSize: 'clamp(11px, 1.3vw, 14px)', textShadow: '1px 1px 0 rgba(0,0,0,0.3)' }}>
                      {post.title}
                    </h4>

                    {/* Превью */}
                    <div className="relative h-9 overflow-hidden">
                      <div className="font-standard text-[11px] text-muted leading-relaxed line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: post.content || '' }} />
                      <div className="absolute bottom-0 left-0 right-0 h-5"
                        style={{ background: 'linear-gradient(to top, var(--card), transparent)' }} />
                    </div>
                  </div>

                  {/* Футер */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/40">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 bg-surface border border-border overflow-hidden shrink-0">
                        {post.author?.avatar
                          ? <img src={post.author.avatar} className="w-full h-full object-cover" alt="" />
                          : <HiUserCircle className="w-full h-full text-muted" />}
                      </div>
                      <span className="font-standard font-bold text-[11px] text-foreground-bright truncate">
                        {post.author?.username}
                      </span>
                    </div>
                    <span className="font-standard font-bold text-[10px] text-muted opacity-0 group-hover:opacity-100
                      transition-opacity flex items-center gap-1" style={{ color: '#5aac44' }}>
                      Читать <HiArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* ── Основной фид ── */}
          <section className="flex flex-col gap-4">
            <div className="border-b border-border pb-3 flex items-center gap-3">
              <HiOutlineChatBubbleBottomCenterText className="w-4 h-4 text-muted" />
              <span className="font-mc-pixel text-[9px] text-muted uppercase tracking-widest">
                Все темы
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {loading
                ? [1, 2, 3].map(i => (
                    <div key={i} className="h-28 bg-card border border-border animate-pulse" />
                  ))
                : posts.map(post => <ForumPostCard key={post._id} post={post} />)
              }
            </div>
          </section>
        </div>

        {/* ══════════════════════════════════════════
            ПРАВАЯ КОЛОНКА (desktop)
        ══════════════════════════════════════════ */}
        <aside className="hidden lg:flex w-64 xl:w-72 shrink-0 flex-col gap-4">

          {/* Кнопка создать тему */}
          <Link
            href="/forum/create-post"
            className="flex items-center justify-center gap-2 py-2.5
              font-standard font-bold text-[13px] text-white
              transition-all hover:brightness-110 active:scale-95"
            style={MC_BTN}
          >
            <HiPlus className="w-4 h-4" />
            Создать тему
          </Link>

          {/* Выбор раздела */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-[3px] h-3" style={{ background: 'linear-gradient(to bottom, #5aac44, #2a5e1a)' }} />
              <span className="font-mc-pixel text-[8px] text-muted uppercase tracking-widest">Раздел</span>
            </div>
            <CategorySelect
              selected={currentCategory}
              onSelect={cat => updateFilters({ category: cat })}
            />
          </div>

          {/* HardLauncher баннер */}
          <Link href="/ru/launcher" className="group block">
            <div className="bg-[#0d0d0d] border border-border overflow-hidden relative p-4 flex flex-col gap-3
              transition-colors duration-150 group-hover:border-[#3c8527]">
              {/* Пиксельная сетка */}
              <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px)', backgroundSize: '20px 20px' }} />
              {/* Акцент слева */}
              <div className="absolute left-0 top-0 bottom-0 w-[3px]"
                style={{ background: 'linear-gradient(to bottom, #5aac44, #2a5e1a)' }} />

              <div className="relative pl-2 flex flex-col gap-2">
                <span className="font-mc-pixel text-[8px] uppercase tracking-widest"
                  style={{ color: '#5aac44' }}>
                  Официально
                </span>
                <h3 className="font-mc-title text-white"
                  style={{ fontSize: '16px', textShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>
                  HardLauncher
                </h3>
                <p className="font-standard text-[11px] leading-relaxed"
                  style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Запускай Minecraft в один клик. Авто-обновления и поддержка модов.
                </p>
                <div className="flex items-center gap-1.5 font-standard font-bold text-[11px] mt-1
                  transition-all group-hover:gap-2.5"
                  style={{ color: '#5aac44' }}>
                  Скачать бесплатно <HiArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </Link>

          <YandexAds />

          {/* Топ авторов */}
          <div className="bg-card border border-border overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border bg-surface">
              <HiOutlineUserGroup className="w-3.5 h-3.5 text-muted" />
              <span className="font-mc-pixel text-[8px] uppercase tracking-widest text-muted">
                Топ авторов
              </span>
            </div>
            <div className="flex flex-col">
              {activeAuthors.map((author: any, i) => (
                <Link
                  href={`/profile/${author.username}`}
                  key={author.username}
                  className="flex items-center justify-between px-3 py-2 border-b border-border/40 last:border-0
                    hover:bg-surface transition-colors duration-100"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Номер */}
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
                  <span className="font-standard font-black text-[11px] text-muted shrink-0">
                    {author.count}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </aside>

      </main>
    </div>
    </div>
  );
}