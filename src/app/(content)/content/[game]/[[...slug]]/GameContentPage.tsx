'use client';

import React, { useCallback, useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  HiOutlineSearch, HiOutlineCube, HiCheck,
  HiOutlineAdjustments, HiChevronDown, HiOutlineFilter,
  HiOutlineSortAscending, HiOutlineClock, HiOutlineDownload, HiOutlineFire,
  HiOutlineCollection, HiX
} from 'react-icons/hi';
import { PROJECT_TAGS } from '@/constants/projectTags';
import { GAME_VERSIONS } from '@/constants/gameVersions';
import axios from 'axios';
import ProjectCard from '@/app/components/project/ProjectCard';
import { getGameLabel } from '@/constants/project';
import { PROJECT_TYPES_BY_GAME } from '@/constants/projectTypes';
import YandexAds from '@/app/components/yandex/YandexAds';

interface Project {
  _id: string;
  title: string;
  summary: string;
  slug: string;
  iconUrl?: string;
  gameType: string;
  projectType: string;
  analytics: { views: number; downloads: number; };
  tags: string[];
  versions: string[];
}

interface PageProps {
  initialProjects: Project[];
  initialTotal: number;
  params: { game: string; slug?: string[] };
}

export default function GameContentPage({ initialProjects, initialTotal, params }: PageProps) {
  const { game } = params;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isTypeSelectOpen, setIsTypeSelectOpen] = useState(false);
  
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);

  const currentType = params.slug?.[0] || 'all';
  const gameLabel = getGameLabel(game);
  const gameTypes = PROJECT_TYPES_BY_GAME[game as keyof typeof PROJECT_TYPES_BY_GAME] || [];
  const typeLabel = gameTypes.find(t => t.value === currentType)?.label || 'Весь контент';
  
  const activeTags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
  const activeVersions = searchParams.get('versions')?.split(',').filter(Boolean) || [];
  const query = searchParams.get('q') || '';
  const sortBy = searchParams.get('sort') || 'popular';
  const [searchTerm, setSearchTerm] = useState(query);

  const updateUrl = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    if (!updates.page) params.set('page', '1'); 
    router.push(`?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  const toggleFilter = (key: string, currentArray: string[], id: string) => {
    const newArray = currentArray.includes(id) 
      ? currentArray.filter(t => t !== id) 
      : [...currentArray, id];
    updateUrl({ [key]: newArray.length ? newArray.join(',') : null });
  };

  const versionsList = (() => {
    const gameKey = Object.keys(GAME_VERSIONS).find(k => k.toLowerCase() === game.toLowerCase());
    if (!gameKey && game === 'minecraft') return GAME_VERSIONS["Minecraft Java"];
    return gameKey ? GAME_VERSIONS[gameKey] : [];
  })();

    const gameKey = Object.keys(PROJECT_TAGS).find(
        k => k.toLowerCase() === game.toLowerCase()
        ) as keyof typeof PROJECT_TAGS;

        // 2. Получаем список тегов
        const tagsList = (() => {
        if (!gameKey || currentType === 'all') return [];
        
        // Берем теги для конкретного типа (например, 'mods')
        const tags = PROJECT_TAGS[gameKey]?.[currentType.toLowerCase()];
        
        // Если не нашли (например, в URL 'mod', а в константе 'mods'), пробуем найти похожий ключ
        if (!tags) {
            const similarKey = Object.keys(PROJECT_TAGS[gameKey]).find(
            k => k.startsWith(currentType.toLowerCase()) || currentType.toLowerCase().startsWith(k)
            );
            return similarKey ? PROJECT_TAGS[gameKey][similarKey] : [];
        }
        
        return tags || [];
    })();
    
  const sortOptions = [
    { id: 'popular', label: 'Популярные', icon: <HiOutlineFire /> },
    { id: 'newest', label: 'Новые', icon: <HiOutlineClock /> },
    { id: 'downloads', label: 'Скачивания', icon: <HiOutlineDownload /> },
  ];

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm !== (searchParams.get('q') || '')) {
        updateUrl({ q: searchTerm || null });
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm, updateUrl, searchParams]);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/projects`, {
          params: {
            game, type: currentType,
            q: searchParams.get('q'),
            tags: searchParams.get('tags'),
            versions: searchParams.get('versions'),
            sort: searchParams.get('sort') || 'popular',
            page: searchParams.get('page') || 1,
          }
        });
        setProjects(data.projects || []);
        setTotal(data.pagination?.total || 0);
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchProjects();
  }, [searchParams, game, currentType]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 1. MINIMAL HEADER */}
      <div className="bg-card border-b border-border">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-10">
          <nav className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-4">
            <Link href="/" className="hover:text-primary transition-colors">Главная</Link>
            <span className="opacity-30">/</span>
            <span className="text-foreground font-semibold">{gameLabel}</span>
          </nav>
          <h1 className="text-xl font-extrabold tracking-tight">
            Каталог <span className="text-primary">{gameLabel}</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">Список проектов</p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* 2. SIDEBAR (Filters Only) */}
        <aside className="w-full md:w-60 shrink-0 space-y-6">
          <YandexAds/>
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground opacity-70 px-1">
            <HiOutlineFilter /> Фильтры
          </div>
          
          <div className="space-y-1">
            {tagsList.length > 0 && (
              <CollapsibleSection title="Категории" defaultOpen={true}>
                <div className="flex flex-col gap-1 mt-2">
                  {tagsList.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => toggleFilter('tags', activeTags, tag.id)}
                      className={`flex items-center justify-between px-3 py-1.5 rounded text-sm transition-all ${
                        activeTags.includes(tag.id) 
                          ? 'bg-primary/10 text-primary font-bold' 
                          : 'text-muted-foreground hover:bg-surface hover:text-foreground'
                      }`}
                    >
                      <span>{tag.label}</span>
                      {activeTags.includes(tag.id) && <HiCheck size={14} />}
                    </button>
                  ))}
                </div>
              </CollapsibleSection>
            )}

            <CollapsibleSection title="Версия" defaultOpen={versionsList.length > 0}>
              <div className="mt-2 flex flex-col gap-1 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {versionsList.map((v) => (
                  <label key={v} className="flex items-center gap-2.5 px-3 py-1.5 rounded cursor-pointer text-sm text-muted-foreground hover:text-foreground hover:bg-surface transition-colors">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-border bg-surface text-primary focus:ring-primary"
                      checked={activeVersions.includes(v)}
                      onChange={() => toggleFilter('versions', activeVersions, v)}
                    />
                    {v}
                  </label>
                ))}
              </div>
            </CollapsibleSection>
          </div>
        </aside>

        {/* 3. MAIN CONTENT */}
        <main className="flex-1 min-w-0">
          {/* TOOLBAR: TYPE + SEARCH + SORT */}
          <div className="flex flex-wrap items-center gap-2 mb-6 p-2 bg-card border border-border rounded-lg shadow-sm">
            
            {/* TYPE SELECT */}
            <div className="relative">
              <button 
                onClick={() => setIsTypeSelectOpen(!isTypeSelectOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded text-sm font-semibold hover:border-primary transition-all min-w-[140px]"
              >
                <HiOutlineCollection className="text-primary" />
                <span className="truncate">{typeLabel}</span>
                <HiChevronDown className={`ml-auto transition-transform ${isTypeSelectOpen ? 'rotate-180' : ''}`} />
              </button>
              {isTypeSelectOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsTypeSelectOpen(false)} />
                  <div className="absolute left-0 mt-1.5 w-56 bg-card border border-border rounded shadow-xl z-40 py-1">
                    <Link href={`/content/${game}`} className="block px-4 py-2 text-sm hover:bg-surface" onClick={() => setIsTypeSelectOpen(false)}>Все проекты</Link>
                    <div className="h-px bg-border my-1" />
                    {gameTypes.map(t => (
                      <Link key={t.value} href={`/content/${game}/${t.value}`} className={`block px-4 py-2 text-sm hover:bg-surface ${currentType === t.value ? 'text-primary font-bold' : ''}`} onClick={() => setIsTypeSelectOpen(false)}>
                        {t.label}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* SEARCH INPUT */}
            <div className="relative flex-1 min-w-[200px]">
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input 
                type="text"
                placeholder="Поиск по названию..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-1.5 bg-surface border border-border rounded text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <HiX size={14} />
                </button>
              )}
            </div>

            {/* SORT SELECT */}
            <div className="relative">
              <button 
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded text-sm font-semibold hover:border-primary transition-all"
              >
                <HiOutlineSortAscending size={16}/>
                <span className="hidden sm:inline">{sortOptions.find(o => o.id === sortBy)?.label}</span>
                <HiChevronDown className={`transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
              </button>
              {isSortOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)} />
                  <div className="absolute right-0 mt-1.5 w-48 bg-card border border-border rounded shadow-xl z-20 py-1">
                    {sortOptions.map(option => (
                      <button
                        key={option.id}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-surface ${sortBy === option.id ? 'text-primary font-bold bg-primary/5' : ''}`}
                        onClick={() => { updateUrl({ sort: option.id }); setIsSortOpen(false); }}
                      >
                        {option.icon} {option.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* RESULTS INFO */}
          <div className="flex items-center justify-between mb-4 px-1 text-xs text-muted-foreground font-medium uppercase tracking-wider">
            <span>Найдено результатов: {total}</span>
            {loading && <span className="animate-pulse text-primary">Обновление...</span>}
          </div>

          {/* PROJECT LIST */}
          <div className="space-y-3">
            {loading && projects.length === 0 ? (
              Array.from({ length: 5 }).map((_, i) => <ProjectSkeleton key={i} />)
            ) : projects.length > 0 ? (
              projects.map((p) => <ProjectCard key={p._id} project={p} />)
            ) : (
              <div className="py-20 text-center border-2 border-dashed border-border rounded-xl">
                <HiOutlineCube size={48} className="mx-auto text-muted-foreground/20 mb-4" />
                <h3 className="font-bold text-foreground">Ничего не найдено</h3>
                <p className="text-sm text-muted-foreground mt-1">Попробуйте изменить параметры поиска или фильтры.</p>
                <button onClick={() => router.push(pathname)} className="mt-4 text-primary text-xs font-bold hover:underline">Сбросить всё</button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// Вспомогательные компоненты (Skeleton, Collapsible) аналогичны предыдущим, но со скруглениями rounded (не rounded-xl)
const ProjectSkeleton = () => (
  <div className="w-full h-24 bg-card border border-border rounded animate-pulse p-4 flex gap-4">
    <div className="w-16 h-16 bg-surface rounded" />
    <div className="flex-1 space-y-3 pt-1">
      <div className="h-4 bg-surface rounded w-1/4" />
      <div className="h-3 bg-surface rounded w-full" />
    </div>
  </div>
);

const CollapsibleSection = ({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border/60 pb-2 mb-2 last:border-0">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between w-full py-2 group">
        <h3 className="text-[12px] font-bold text-foreground/70 group-hover:text-primary transition-colors uppercase tracking-tight">{title}</h3>
        <HiChevronDown size={14} className={`text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && <div>{children}</div>}
    </div>
  );
};