'use client';

import React, { useCallback, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  HiOutlineSearch, HiOutlineCube, HiCheck,
  HiOutlineAdjustments, HiChevronDown
} from 'react-icons/hi';
import { PROJECT_TAGS } from '@/constants/projectTags';
import { GAME_VERSIONS } from '@/constants/gameVersions';
import axios from 'axios';
import ProjectCard from '@/app/components/project/ProjectCard';
import { getGameLabel } from '@/constants/project';
import { PROJECT_TYPES_BY_GAME } from '@/constants/projectTypes';

interface Project {
  _id: string;
  title: string;
  summary: string;
  slug: string;
  iconUrl?: string;
  gameType: string;
  projectType: string;
  analytics: {
    views: number;
    downloads: number;
  };
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
  
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);

  const currentType = params.slug?.[0] || 'all';
  const gameLabel = getGameLabel(game);

  // Получаем корректный лейбл типа (например, "Моды") из новой структуры
  const gameTypes = PROJECT_TYPES_BY_GAME[game as keyof typeof PROJECT_TYPES_BY_GAME] || [];
  const typeLabel = gameTypes.find(t => t.value === currentType)?.label || 'Контент';
  
  // Чтение параметров из URL
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
    // При любом фильтре сбрасываем страницу на первую
    if (!updates.page) params.set('page', '1'); 
    router.push(`?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  const toggleFilter = (key: string, currentArray: string[], id: string) => {
    const newArray = currentArray.includes(id) 
      ? currentArray.filter(t => t !== id) 
      : [...currentArray, id];
    updateUrl({ [key]: newArray.length ? newArray.join(',') : null });
  };

  const versionsList = game === 'minecraft' ? GAME_VERSIONS["Minecraft Java"] : (GAME_VERSIONS[game as string] || []);
  const tagsList = PROJECT_TAGS[currentType as keyof typeof PROJECT_TAGS] || [];

  const sortOptions = [
    { id: 'popular', label: 'По популярности' },
    { id: 'newest', label: 'Сначала новые' },
    { id: 'updated', label: 'Обновленные' },
    { id: 'downloads', label: 'Скачивания' },
  ];

  // Debounce поиск
  useEffect(() => {
    if (searchTerm === (searchParams.get('q') || '')) return;
    const handler = setTimeout(() => {
      updateUrl({ q: searchTerm || null });
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm, updateUrl, searchParams]);

  // Fetch данных при смене фильтров
  useEffect(() => {
    if (!game || !currentType) return;

    const fetchProjects = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/projects`, {
          params: {
            game,
            type: currentType,
            q: searchParams.get('q'),
            tags: searchParams.get('tags'),
            versions: searchParams.get('versions'),
            sort: searchParams.get('sort') || 'popular',
            page: searchParams.get('page') || 1,
          }
        });
        setProjects(data.projects || []);
        setTotal(data.pagination?.total || 0);
      } catch (error) {
        console.error("Ошибка загрузки:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [searchParams, game, currentType]);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="pt-10 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex flex-col shrink-0">
            {/* Хлебные крошки — важны для SEO навигации */}
            <nav className="flex items-center gap-2 text-[10px] font-bold uppercase text-slate-400 mb-1">
              <a href="/" className="hover:text-orange-500 transition-colors">Главная</a>
              <span>/</span>
              <a href={`/content/${game}`} className="hover:text-orange-500 transition-colors">{gameLabel}</a>
              {currentType !== 'all' && (
                <>
                  <span>/</span>
                  <span className="text-slate-900">{typeLabel}</span>
                </>
              )}
            </nav>
            {/* H1 Заголовок — основной ключ страницы */}
            <h1 className="text-2xl font-black uppercase italic tracking-tighter">
              {typeLabel} <span className="text-orange-500">на {gameLabel}</span>
            </h1>
          </div>

          <div className="relative w-full max-w-md md:ml-auto">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text"
              placeholder={`Поиск в категории ${typeLabel.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-transparent rounded-xl text-xs font-bold focus:bg-white focus:border-orange-500/30 outline-none transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row gap-12">
<aside className="w-full md:w-80 shrink-0 flex flex-col gap-5">
  {/* Визуальный блок (Абстракция) */}
  <div className="relative h-32 overflow-hidden bg-slate-900 rounded-2xl border-2 border-slate-800 shadow-xl group">
    {/* Световые пятна */}
    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,#f97316,transparent_70%)] opacity-20" />
    
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Центр: Большой куб */}
      <HiOutlineCube 
        className="text-white opacity-20 group-hover:opacity-40 transition-all duration-500 group-hover:scale-110 rotate-12" 
        size={80} 
      />
      {/* Детали по бокам */}
      <HiOutlineCube 
        className="absolute left-10 top-6 text-orange-500/40 -rotate-12 group-hover:translate-x-2 transition-transform" 
        size={24} 
      />
      <HiOutlineCube 
        className="absolute right-12 bottom-6 text-orange-500/20 rotate-45 group-hover:-translate-y-2 transition-transform" 
        size={32} 
      />
    </div>

    {/* Декоративная сетка */}
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
         style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', size: '20px 20px', backgroundSize: '15px 15px' }} 
    />
  </div>

  {/* Контейнер фильтров */}
  <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-[8px_8px_0px_0px_rgba(15,23,42,0.05)] overflow-hidden">
    <div className="p-4 flex flex-col">
      
      {/* Секция тегов */}
      {tagsList.length > 0 && (
        <CollapsibleSection title="Категории" icon={<HiOutlineAdjustments size={18} />}>
          <div className="flex flex-col gap-2 mt-2">
            {tagsList.map((tag) => (
              <button
                key={tag.id}
                onClick={() => toggleFilter('tags', activeTags, tag.id)}
                className={`group flex items-center justify-between px-5 py-4 rounded-xl text-[11px] font-black uppercase transition-all duration-200 border-2 ${
                  activeTags.includes(tag.id) 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-lg' 
                    : 'bg-slate-50 border-transparent text-slate-500 hover:border-slate-900 hover:bg-white hover:text-slate-900'
                }`}
              >
                <span className="truncate">{tag.label}</span>
                {activeTags.includes(tag.id) ? (
                  <HiCheck size={16} className="text-orange-500" />
                ) : (
                  <div className="w-2 h-2 bg-slate-300 group-hover:bg-orange-500 transition-colors" />
                )}
              </button>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* Секция версий */}
      <CollapsibleSection title="Версии" icon={<HiOutlineCube size={18} />}>
        <div className="mt-2 bg-slate-50 border-2 border-slate-100 rounded-xl p-2">
          <div className="flex flex-col gap-1 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
            {versionsList.map((v) => (
              <label 
                key={v} 
                className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-all border-2 ${
                  activeVersions.includes(v) 
                    ? 'bg-white border-orange-500 text-orange-600 shadow-sm' 
                    : 'border-transparent hover:bg-white text-slate-500'
                }`}
              >
                <span className="text-[11px] font-black">{v}</span>
                <input 
                  type="checkbox" 
                  className="hidden"
                  checked={activeVersions.includes(v)}
                  onChange={() => toggleFilter('versions', activeVersions, v)}
                />
                <div className={`w-5 h-5 rounded flex items-center justify-center transition-all border-2 ${
                  activeVersions.includes(v) ? 'bg-orange-500 border-orange-500' : 'border-slate-200 bg-white'
                }`}>
                  {activeVersions.includes(v) && <HiCheck size={12} className="text-white" />}
                </div>
              </label>
            ))}
          </div>
        </div>
      </CollapsibleSection>
    </div>
  </div>
</aside>

        <main className="flex-1">
          <div className="flex items-center justify-between mb-8 border-b border-slate-50 pb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Найдено: <span className="text-slate-900">{total}</span> проектов
            </span>

            <div className="relative">
              <button 
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-900 bg-slate-50 px-4 py-2 rounded-lg hover:bg-slate-100 transition-all"
              >
                {sortOptions.find(o => o.id === sortBy)?.label}
                <HiChevronDown className={`transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isSortOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-20 py-2 overflow-hidden">
                    {sortOptions.map(option => (
                      <button
                        key={option.id}
                        className="w-full text-left px-4 py-2 text-[10px] font-black uppercase hover:bg-orange-50 hover:text-orange-500 transition-all"
                        onClick={() => {
                          updateUrl({ sort: option.id });
                          setIsSortOpen(false);
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <ProjectSkeleton key={i} />)
            ) : projects.length > 0 ? (
              projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))
            ) : (
              <div className="py-20 text-center">
                <HiOutlineCube size={48} className="mx-auto text-slate-200 mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  По вашему запросу ничего не найдено
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

const ProjectSkeleton = () => (
  <div className="w-full h-[120px] bg-white border border-slate-100 rounded-2xl flex gap-4 p-4 animate-pulse">
    <div className="w-24 h-24 bg-slate-100 rounded-xl shrink-0" />
    <div className="flex-1 py-2">
      <div className="h-4 bg-slate-100 rounded w-1/4 mb-4" />
      <div className="h-3 bg-slate-100 rounded w-full mb-2" />
      <div className="h-3 bg-slate-100 rounded w-2/3" />
    </div>
  </div>
);

const CollapsibleSection = ({ 
  title, 
  children, 
  icon, 
}: { 
  title: string; 
  children: React.ReactNode; 
  icon?: React.ReactNode; 
}) => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (window.innerWidth < 768) setIsOpen(false);
  }, []);

  return (
    <div className="flex flex-col  last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between py-4 px-2 group"
      >
        <div className="flex items-center gap-3">
          {icon && <div className="text-slate-900 group-hover:text-orange-500 transition-colors">{icon}</div>}
          <h3 className="text-[12px] font-black uppercase tracking-wider text-slate-900">
            {title}
          </h3>
        </div>
        <HiChevronDown 
          size={18} 
          className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[1200px] opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
        {children}
      </div>
    </div>
  );
};