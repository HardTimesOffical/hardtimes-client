'use client';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ForumPostCard from '@/app/components/forum/ForumPostCard';
import { 
  HiFire, HiClock, HiPlus, HiChevronDown, HiCheck, HiMagnifyingGlass, HiXMark 
} from "react-icons/hi2";
import Link from 'next/link';

const FORUM_STRUCTURE = [
  { group: "Все разделы", items: ["Все разделы"] },
  { group: "Поиск и команды", items: ["Ищу напарника", "Ищу друга", "Набираю команду", "Поиск персонала"] },
  { group: "Игровой мир", items: ["Обсуждение игр", "Технические проблемы", "Гайды и туториалы", "Новости индустрии"] },
  { group: "Разработка и творчество", items: ["Моддинг", "Дизайн и графика", "Скрипты и код", "Ресурспаки и ассеты"] },
  { group: "Продвижение", items: ["Пиар серверов", "Реклама каналов", "Обзоры проектов"] },
  { group: "Общение", items: [ "Форумные игры", "Вопросы и предложения"] }
];

export default function ForumPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');
  const catRef = useRef<HTMLDivElement>(null);
  
  const currentCategory = searchParams.get('category') || 'Все разделы';
  const currentSort = searchParams.get('sort') || 'new';
  const currentPeriod = searchParams.get('period') || 'all';
  const currentQuery = searchParams.get('q') || '';

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Debounce для поиска
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchInput !== currentQuery) {
        updateFilters({ q: searchInput });
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (currentCategory !== 'Все разделы') query.set('category', currentCategory);
        query.set('sort', currentSort);
        if (currentSort === 'popular') query.set('period', currentPeriod);
        if (currentQuery) query.set('q', currentQuery);

        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/forum/posts?${query.toString()}`, {
          cache: 'no-store'
        });
        const data = await res.json();
        setPosts(data.posts || []);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchPosts();
  }, [currentCategory, currentSort, currentPeriod, currentQuery]);

  const updateFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === 'Все разделы' || value === 'all' || value === '' || !value) params.delete(key);
      else params.set(key, value);
    });
    if (updates.sort === 'new') params.delete('period');
    router.push(`/forum?${params.toString()}`);
  };

  return (
    <div className="bg-[var(--background)] min-h-screen pb-20">
      {/* STICKY HEADER AREA */}
      <div className="border-b border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            
            {/* CATEGORY SELECT */}
            <div className="relative shrink-0" ref={catRef}>
              <button 
                onClick={() => setIsCatOpen(!isCatOpen)}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-[var(--surface)] rounded-md border border-[var(--border)] bg-[var(--card)] shadow-sm transition-all"
              >
                <div className="w-5 h-5 rounded bg-[var(--accent)] flex items-center justify-center text-[10px] text-white font-bold uppercase">
                  {currentCategory[0]}
                </div>
                <span className="text-sm font-semibold max-w-[120px] truncate">{currentCategory}</span>
                <HiChevronDown className={`w-4 h-4 text-[var(--muted)] transition-transform ${isCatOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCatOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150 z-50">
                  <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {FORUM_STRUCTURE.map((group) => (
                      <div key={group.group} className="border-b last:border-0 border-[var(--border)]">
                        <div className="px-4 py-2 text-[10px] font-black text-[var(--muted)] uppercase tracking-widest bg-[var(--surface)]/30">
                          {group.group}
                        </div>
                        <div className="p-1">
                          {group.items.map(item => (
                            <button
                              key={item}
                              onClick={() => {
                                updateFilters({ category: item });
                                setIsCatOpen(false);
                              }}
                              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm hover:bg-[var(--surface)] transition-colors"
                            >
                              <span className={currentCategory === item ? "text-[var(--accent)] font-bold" : "text-[var(--foreground)]"}>
                                {item}
                              </span>
                              {currentCategory === item && <HiCheck className="w-4 h-4 text-[var(--accent)]" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* SEARCH INPUT (GIT STYLE) */}
            <div className="flex-1 relative">
              <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
              <input 
                type="text"
                placeholder="Поиск по обсуждениям..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-md py-1.5 pl-9 pr-9 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all"
              />
              {searchInput && (
                <button onClick={() => setSearchInput('')} className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-[var(--foreground)] text-[var(--muted)]">
                  <HiXMark className="w-4 h-4" />
                </button>
              )}
            </div>

            <Link 
            href="/forum/create-post" 
            className="
                relative inline-flex items-center justify-center gap-2
                px-2 py-1.5 
                bg-[var(--accent)] text-white 
                rounded-xl text-[8px] font-black uppercase tracking-wider
                transition-all duration-300
                hover:bg-[var(--accent)]/90 
                hover:-translate-y-0.5 
                active:translate-y-0 active:scale-95
                shadow-[0_8px_20px_-6px_var(--accent)]
                hover:shadow-[0_12px_25px_-4px_var(--accent)]
                border border-white/10
                overflow-hidden group
                shrink-0
            "
            >
            {/* Эффект легкого блеска при наведении */}
            <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-25deg] -translate-x-full group-hover:animate-[shimmer_0.6s_ease-out]" />
            
            <HiPlus className="w-4 h-4 transition-transform group-hover:rotate-90" />
            <span>Новая тема</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-8">
        {/* TAB NAVIGATION */}
        <div className="flex items-center justify-between border-b border-[var(--border)] mb-6">
          <div className="flex gap-8">
            <button onClick={() => updateFilters({ sort: 'new' })} className={`pb-3 text-sm font-bold border-b-2 transition-all ${currentSort === 'new' ? 'border-[var(--accent)] text-[var(--foreground)]' : 'border-transparent text-[var(--muted)] hover:text-[var(--foreground)]'}`}>
              <HiClock className="inline mr-1.5 w-4 h-4" /> Новые
            </button>
            <button onClick={() => updateFilters({ sort: 'popular' })} className={`pb-3 text-sm font-bold border-b-2 transition-all ${currentSort === 'popular' ? 'border-orange-500 text-orange-500' : 'border-transparent text-[var(--muted)] hover:text-[var(--foreground)]'}`}>
              <HiFire className="inline mr-1.5 w-4 h-4" /> Популярные
            </button>
          </div>
        </div>

        {/* FEED */}
        <div className="space-y-4">
          {loading ? (
             <div className="space-y-4"> {[1,2,3].map(i => <div key={i} className="h-24 bg-[var(--card)] rounded-lg animate-pulse" />)} </div>
          ) : posts.length > 0 ? (
            posts.map((post: any) => <ForumPostCard key={post._id} post={post} />)
          ) : (
            <div className="text-center py-20 opacity-50">Темы не найдены</div>
          )}
        </div>
      </div>
    </div>
  );
}