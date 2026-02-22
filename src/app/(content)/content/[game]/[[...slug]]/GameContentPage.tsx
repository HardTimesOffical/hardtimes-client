'use client';

import React, { useCallback, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { 
  HiOutlineSearch, HiOutlineCube, 
  HiChevronRight, HiOutlineViewGrid
} from 'react-icons/hi';

// --- ИМПОРТЫ ---
import { PROJECT_TAGS } from '@/constants/projectTags';
import { GAME_VERSIONS } from '@/constants/gameVersions';
import ProjectCard from '@/app/components/project/ProjectCard';
import { getGameLabel } from '@/constants/project';
import { PROJECT_TYPES_BY_GAME } from '@/constants/projectTypes';
import YandexAds from '@/app/components/yandex/YandexAds';

// Компоненты
import CustomSelect from './CustomSelect';
import MultiSelect from '@/app/components/ui/MultiSelect';

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
  const searchParams = useSearchParams();
  
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);

  const currentType = params.slug?.[0] || 'all';
  const gameLabel = getGameLabel(game);
  const gameTypes = PROJECT_TYPES_BY_GAME[game as keyof typeof PROJECT_TYPES_BY_GAME] || [];
  
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
    return gameKey ? GAME_VERSIONS[gameKey as keyof typeof GAME_VERSIONS] : [];
  })();

  const gameKey = Object.keys(PROJECT_TAGS).find(k => k.toLowerCase() === game.toLowerCase()) as keyof typeof PROJECT_TAGS;

  const tagsList = (() => {
    if (!gameKey || currentType === 'all') return [];
    return PROJECT_TAGS[gameKey]?.[currentType.toLowerCase()] || [];
  })();

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
    <div className="relative min-h-screen bg-background text-foreground font-sans antialiased">
      
      {/* HEADER */}
      <header className="relative z-20 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="max-w-[1300px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-xs font-black uppercase tracking-widest text-foreground-bright">
              HARD<span className="text-accent">MONITORING</span>
            </span>
            <nav className="hidden md:flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-muted">
              <Link href="/" className="hover:text-accent transition-colors">Главная</Link>
              <HiChevronRight size={10} className="opacity-30" />
              <span className="text-foreground">{gameLabel}</span>
            </nav>
          </div>
          <button className="text-[10px] font-bold uppercase tracking-widest px-5 py-2 bg-accent text-contrast-text rounded-sm hover:opacity-90 transition-all">
            Добавить проект
          </button>
        </div>
      </header>

      <div className="relative z-10 max-w-[1300px] mx-auto px-6 py-12 flex flex-col lg:flex-row gap-8">
        
        {/* ЛЕВАЯ КОЛОНКА (ФИЛЬТРЫ) - РАЗДЕЛЕНЫ ВИЗУАЛЬНО */}
        <aside className="w-full lg:w-72 shrink-0 space-y-4 order-1 lg:order-1">
          
          {/* Блок: Тип контента */}
          <div className="bg-card border border-border rounded-md p-5 shadow-sm">
            <CustomSelect 
              label="Тип контента"
              value={currentType} 
              onChange={(val) => router.push(`/content/${game}/${val}`)}
              // Мапим твои данные: превращаем value в id для компонента
              options={[
                { id: 'all', label: 'Весь контент' },
                ...gameTypes.map(t => ({ id: t.value, label: t.label }))
              ]}
            />
          </div>

          {/* Блок: Категории */}
          {tagsList.length > 0 && (
            <div className="bg-card border border-border rounded-md p-5 shadow-sm">
              <MultiSelect 
                label="Категории"
                values={activeTags}
                onChange={(id) => toggleFilter('tags', activeTags, id)}
                options={tagsList.map(t => ({ id: t.id, label: t.label }))}
              />
            </div>
          )}

          {/* Блок: Версии */}
          {versionsList.length > 0 && (
            <div className="bg-card border border-border rounded-md p-5 shadow-sm">
              <MultiSelect 
                label="Версии игры"
                values={activeVersions}
                onChange={(id) => toggleFilter('versions', activeVersions, id)}
                options={versionsList.map(v => ({ id: String(v), label: String(v) }))}
              />
            </div>
          )}

          <YandexAds />
        </aside>

        {/* ПРАВАЯ КОЛОНКА (КОНТЕНТ) */}
        <main className="flex-1 min-w-0 order-2 lg:order-2">
          
          {/* ПАНЕЛЬ ПОИСКА И СОРТИРОВКИ */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <input 
                type="text"
                placeholder="Поиск модов, плагинов..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-surface border border-border rounded-md text-sm outline-none focus:border-accent/50 transition-all text-foreground-bright"
              />
            </div>
            
            {/* СОРТИРОВКА НАД СПИСКОМ */}
            <div className="w-full md:w-64">
              <CustomSelect 
                value={sortBy} 
                onChange={(val) => updateUrl({ sort: val })} 
                options={[
                  { id: 'popular', label: 'По популярности' },
                  { id: 'newest', label: 'Сначала новые' },
                  { id: 'downloads', label: 'По скачиваниям' }
                ]} 
              />
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6 px-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted whitespace-nowrap">
              Найдено результатов: {total || 0}
            </span>
            <div className="h-[1px] flex-1 bg-border/50" />
          </div>

          <div className="space-y-3">
            {loading ? (
              [1, 2, 3, 4].map(i => <ProjectSkeleton key={i} />)
            ) : projects?.length > 0 ? (
              projects.map((p) => <ProjectCard key={p._id} project={p} />)
            ) : (
              <div className="py-20 flex flex-col items-center justify-center border border-border border-dashed rounded-lg bg-surface/50">
                <HiOutlineCube size={32} className="text-muted/20 mb-3" />
                <span className="text-xs font-semibold text-muted tracking-tight">Ничего не найдено</span>
              </div>
            )}
          </div>
        </main>

      </div>
    </div>
  );
}

const ProjectSkeleton = () => (
  <div className="w-full h-28 bg-card border border-border rounded-md overflow-hidden relative p-5 flex gap-5">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/[0.03] to-transparent animate-[shimmer_2s_infinite]" />
    <div className="w-16 h-16 bg-surface rounded-md shrink-0" />
    <div className="flex-1 space-y-3 pt-1">
      <div className="h-4 bg-surface rounded w-1/3" />
      <div className="h-3 bg-surface rounded w-full" />
    </div>
  </div>
);