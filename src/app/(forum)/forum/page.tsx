'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ForumPostCard from '@/app/components/forum/ForumPostCard';
import { ThemeToggle } from "@/app/components/header/ThemeBtn";
import { 
  HiPlus, HiMagnifyingGlass, HiOutlineUserGroup, 
  HiOutlineChatBubbleBottomCenterText, HiOutlineClock, 
  HiOutlineSparkles, HiOutlineMegaphone, HiOutlineChartBar,
  HiOutlineHeart, HiOutlineEye, HiUserCircle
} from "react-icons/hi2";
import Link from 'next/link';
import CategorySelect from '@/app/components/forum/CategorySelect';
import YandexAds from '@/app/components/yandex/YandexAds';

export default function ForumPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');
  const [posts, setPosts] = useState<any[]>([]);
  const [popularPosts, setPopularPosts] = useState<any[]>([]);
  const [activeAuthors, setActiveAuthors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const currentCategory = searchParams.get('category') || 'Все разделы';
  const currentQuery = searchParams.get('q') || '';
  const currentSort = searchParams.get('sort') || 'new';

  // Вспомогательная функция для цветов категорий в популярных карточках
  const getCatColor = (cat: string) => {
    const map: Record<string, string> = {
      "Ищу напарника": "text-blue-500 bg-blue-50 border-blue-100 dark:bg-blue-500/10 dark:border-blue-500/20",
      "Обсуждение игр": "text-purple-500 bg-purple-50 border-purple-100 dark:bg-purple-500/10 dark:border-purple-500/20",
      "Гайды": "text-emerald-500 bg-emerald-50 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20",
      "Технические проблемы": "text-rose-500 bg-rose-50 border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20",
    };
    return map[cat] || "text-slate-500 bg-slate-50 border-slate-100 dark:bg-slate-500/10 dark:border-slate-500/20";
  };

  const updateFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === 'Все разделы' || !value) params.delete(key);
      else params.set(key, value);
    });
    router.push(`/forum?${params.toString()}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (currentCategory !== 'Все разделы') query.set('category', currentCategory);
        if (currentQuery) query.set('q', currentQuery);
        query.set('sort', currentSort);

        const [resAll, resPop, resAuth] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/forum/posts?${query.toString()}`),
          fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/forum/posts?sort=popular&limit=4`),
          fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/forum/posts?limit=100`)
        ]);

        const dataAll = await resAll.json();
        const dataPop = await resPop.json();
        const dataAuth = await resAuth.json();

        setPosts(dataAll.posts || []);
        setPopularPosts((dataPop.posts || []).slice(0, 4));

        const authorsMap: any = {};
        (dataAuth.posts || []).forEach((p: any) => {
          const name = p.author?.username || p.authorName;
          if (name) {
            authorsMap[name] = {
              username: name,
              avatar: p.author?.avatar || p.authorAvatar,
              count: (authorsMap[name]?.count || 0) + 1
            };
          }
        });
        setActiveAuthors(Object.values(authorsMap).sort((a: any, b: any) => b.count - a.count).slice(0, 8));
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchData();
  }, [currentCategory, currentQuery, currentSort]);

  return (
    <div className="bg-[var(--background)] min-h-screen text-[var(--text-main)] pb-10">
      
      {/* ШАПКА: СТАНДАРТНАЯ, НЕ ТЕМНАЯ */}
      <header className="border-b border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <Link href="/forum" className="flex items-center gap-2 shrink-0">
              <HiOutlineChatBubbleBottomCenterText className="w-8 h-8 text-blue-600" />
              <h1 className="hidden sm:block text-xl font-black tracking-tighter uppercase italic text-[var(--foreground-bright)]">Forum</h1>
            </Link>
            <div className="max-w-md w-full relative">
              <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
              <input 
                type="text" 
                placeholder="Поиск..." 
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-all"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && updateFilters({ q: searchInput })}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <ThemeToggle />
            <Link href="/forum/create-post" className="bg-blue-600 text-white px-3 sm:px-5 py-2 rounded-xl text-[10px] sm:text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all">
              <span className="hidden sm:inline"><HiPlus className="inline mr-1 w-4 h-4" /> Создать тему</span>
              <HiPlus className="sm:hidden w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-[1300px] mx-auto px-4 sm:px-6 py-6 flex flex-col lg:flex-row gap-6">
        
       <div className="flex-1 min-w-0 space-y-8">
          
          {/* БЛОК ПОПУЛЯРНЫХ (В ТРЕНДЕ) */}
          <section>
            <div className="flex items-center gap-2 mb-4">
               <HiOutlineSparkles className="text-blue-600 w-5 h-5" />
               <h3 className="text-[11px] font-black text-[var(--muted)] uppercase tracking-[0.2em]">Популярное</h3>
            </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {popularPosts.map((post: any) => (
                  <Link 
                    href={`/forum/${post.slug}`} 
                    key={post._id} 
                    className="group bg-[var(--card)] border border-[var(--border)] p-5 rounded-2xl hover:border-blue-500 transition-all flex flex-col justify-between h-[185px] shadow-sm hover:shadow-md dark:hover:shadow-none light:bg-slate-50/80 relative overflow-hidden"
                  >
                    <div className="space-y-3">
                      {/* ВЕРХНЯЯ ПАНЕЛЬ: КАТЕГОРИЯ + СТАТИСТИКА */}
                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase border ${getCatColor(post.category)}`}>
                          {post.category || 'Общее'}
                        </span>
                        <div className="flex items-center gap-3 text-[10px] font-bold text-[var(--muted)]">
                          <span className="flex items-center gap-1">
                            <HiOutlineHeart className="text-rose-500 w-3.5 h-3.5" /> {post.likes?.length || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            {/* ЗАМЕНЕНО: Иконка глаза вместо графика */}
                            <HiOutlineEye className="text-blue-500 w-3.5 h-3.5" /> {post.views || 0}
                          </span>
                        </div>
                      </div>

                      {/* ЗАГОЛОВОК И ПРЕВЬЮ ТЕКСТА */}
                      <div className="relative">
                        <h4 className="font-black text-[16px] text-[var(--foreground-bright)] line-clamp-1 leading-tight group-hover:text-blue-600 transition-colors mb-1.5">
                          {post.title}
                        </h4>
                        
                        {/* Контент с плавным скрытием (Fade-out) */}
                        <div className="relative h-[40px] overflow-hidden">
                          <div 
                            className="text-[12px] leading-[1.4] text-[var(--muted)] opacity-70"
                            dangerouslySetInnerHTML={{ __html: post.content || '' }}
                          />
                          {/* Градиентный маскирующий слой для плавного скрытия */}
                          <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-[var(--card)] light:from-slate-50 to-transparent pointer-events-none" />
                        </div>
                      </div>
                    </div>
                    
                    {/* ФУТЕР: АВТОР И КНОПКА ЧИТАТЬ */}
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-[var(--border)]/40">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden shrink-0 shadow-sm">
                          {post.author?.avatar ? (
                            <img src={post.author.avatar} className="w-full h-full object-cover" alt="" />
                          ) : (
                            <HiUserCircle className="w-full h-full text-[var(--muted)]" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-black text-[var(--foreground-bright)] truncate max-w-[80px]">
                            {post.author?.username}
                          </span>
                          <span className="text-[9px] text-[var(--muted)] font-bold mt-1 opacity-60">Топикстартер</span>
                        </div>
                      </div>
                      
                      {/* Кнопка "Читать", появляющаяся при наведении */}
                      <div className="bg-blue-600/10 border border-blue-500/20 px-4 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        <p className="text-[10px] font-black uppercase tracking-wider text-blue-600">Читать</p>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </section>

          {/* ОСНОВНОЙ ФИД (КАРТОЧКИ ТУТ НЕ ТРОГАЕМ) */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
               <h2 className="text-2xl font-black tracking-tighter text-[var(--foreground-bright)]">{currentCategory}</h2>
               <div className="flex bg-[var(--surface)] p-1 rounded-xl border border-[var(--border)]">
                  <button onClick={() => updateFilters({ sort: 'new' })} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${currentSort !== 'popular' ? 'bg-[var(--card)] text-blue-600 shadow-sm' : 'text-[var(--muted)]'}`}>Новое</button>
                  <button onClick={() => updateFilters({ sort: 'popular' })} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${currentSort === 'popular' ? 'bg-[var(--card)] text-blue-600 shadow-sm' : 'text-[var(--muted)]'}`}>Топ</button>
               </div>
            </div>

            <div className="space-y-4">
              {loading ? (
                [1,2,3].map(i => <div key={i} className="h-32 bg-[var(--card)] animate-pulse rounded-2xl border border-[var(--border)]" />)
              ) : (
                posts.map((post: any) => <ForumPostCard key={post._id} post={post} />)
              )}
            </div>
          </section>
        </div>

       {/* ПРАВАЯ ЧАСТЬ */}
{/* Добавили pt-[44px], чтобы выровнять начало колонки по верхнему краю популярных карточек */}
<aside className="w-full lg:w-72 shrink-0 space-y-6 lg:pt-[40px]">
   <Link href="https://t.me/SamuraiMFG" className="block group">
  {/* Заменил text-white на адаптивный или принудительно светлый текст внутри темного блока */}
  <div className="bg-[#1c1c1e] border border-blue-500/20 rounded-[2rem] p-6 text-white relative overflow-hidden shadow-2xl transition-all hover:border-blue-500/50 hover:translate-y-[-4px]">
    
    {/* ФОНОВЫЕ ЭЛЕМЕНТЫ */}
    <div className="absolute inset-0 opacity-10 pointer-events-none" 
         style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)', backgroundSize: '24px 24px' }} />
    <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-600/20 rounded-full blur-[80px]" />

    <div className="relative z-10 flex flex-col h-full">
      {/* ИКОНКА */}
      <div className="mb-5">
        <div className="bg-blue-600 w-10 h-10 flex items-center justify-center rounded-xl shadow-lg shadow-blue-600/20">
          <HiOutlineMegaphone className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* ТЕКСТОВЫЙ БЛОК — теперь точно белый на темном фоне */}
      <div className="space-y-2 flex-1">
        <p className="text-[11px] font-black uppercase text-blue-400 tracking-[0.1em]">Продвижение</p>
        <h3 className="text-xl font-extrabold leading-[1.2] tracking-tight text-white">
          Место для вашей <br /> 
          <span className="text-blue-500">рекламы</span>
        </h3>
      </div>

      {/* КНОПКА */}
      <div className="mt-8 pt-5 border-t border-white/10">
        <div className="inline-block bg-white text-black px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all group-hover:bg-blue-600 group-hover:text-white">
          Узнать больше
        </div>
      </div>
    </div>
  </div>
</Link>
  {/* КАТЕГОРИИ */}
  <div className="bg-[var(--card)] border border-[var(--border)] p-4 rounded-3xl shadow-sm light:bg-slate-50/50 transition-colors">
    <CategorySelect 
      selected={currentCategory} 
      onSelect={(cat) => updateFilters({ category: cat })} 
    />
  </div>
  <YandexAds/>
  {/* СПИСОК АВТОРОВ */}
  <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl overflow-hidden shadow-sm light:bg-slate-50/50">
    <div className="p-4 border-b border-[var(--border)] bg-[var(--surface)]/50 text-[var(--foreground-bright)]">
      <h4 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
        <HiOutlineUserGroup className="text-blue-600" /> Топ по публикациям
      </h4>
    </div>
    <div className="p-2 space-y-1">
      {activeAuthors.map((author: any) => (
        <Link 
          href={`/profile/${author.username}`} 
          key={author.username} 
          className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-[var(--surface)] transition-all"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden shrink-0">
              {author.avatar ? (
                <img src={author.avatar} className="w-full h-full object-cover" alt="" />
              ) : (
                <HiUserCircle className="w-full h-full text-[var(--muted)]" />
              )}
            </div>
            <span className="text-xs font-bold truncate text-[var(--foreground-bright)]">
              {author.username}
            </span>
          </div>
          <span className="text-[10px] font-black text-blue-600 bg-blue-500/10 px-2 py-1 rounded-lg">
            {author.count}
          </span>
        </Link>
      ))}
    </div>
  </div>
</aside>
      </main>
    </div>
  );
}