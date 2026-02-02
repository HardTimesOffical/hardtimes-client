'use client';

import React, { useCallback, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { 
  HiOutlineSearch, HiOutlineCube, HiCheck,
  HiOutlineDownload, HiOutlineEye, HiOutlineAdjustments,
  HiChevronDown
} from 'react-icons/hi';
import { PROJECT_TAGS } from '@/constants/projectTags';
import { GAME_VERSIONS } from '@/constants/gameVersions';
import { useEffect } from 'react';
import axios from 'axios';
import ProjectCard from '@/app/components/project/ProjectCard';

interface Project {
  _id: string;
  title: string;
  summary: string;
  slug: string;
  iconUrl?: string;
  gameType: string;    // Добавлено
  projectType: string; // Добавлено
  analytics: {
    views: number;
    downloads: number;
  };
  tags: string[];
  versions: string[];
}

export default function GameContentPage() {
  const { game, slug } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSortOpen, setIsSortOpen] = useState(false);
  
const currentType = (Array.isArray(slug) ? slug[0] : slug) || 'all';

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  
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
    router.push(`?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  const toggleFilter = (key: string, currentArray: string[], id: string) => {
    const newArray = currentArray.includes(id) 
      ? currentArray.filter(t => t !== id) 
      : [...currentArray, id];
    updateUrl({ [key]: newArray.length ? newArray.join(',') : null });
  };

  const versions = game === 'minecraft' ? GAME_VERSIONS["Minecraft Java"] : (GAME_VERSIONS[game as string] || []);
  const tags = PROJECT_TAGS[currentType as keyof typeof PROJECT_TAGS] || [];

  const sortOptions = [
    { id: 'popular', label: 'По популярности' },
    { id: 'newest', label: 'Сначала новые' },
    { id: 'updated', label: 'Обновленные' },
    { id: 'downloads', label: 'Скачивания' },
  ];

  useEffect(() => {
  // Если текст в инпуте совпадает с тем, что уже в URL — ничего не делаем
  if (searchTerm === (searchParams.get('q') || '')) return;

  const handler = setTimeout(() => {
    updateUrl({ q: searchTerm || null, page: '1' }); // При поиске сбрасываем на 1 страницу
  }, 500); // Задержка в полсекунды

  return () => clearTimeout(handler);
}, [searchTerm, updateUrl, searchParams]);

  

useEffect(() => {
  // Если game или type еще не подтянулись из URL — выходим
  if (!game || !currentType) return;

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const rawParams = {
        game: game,
        type: currentType, // Здесь теперь точно не будет undefined
        q: searchParams.get('q'),
        tags: searchParams.get('tags'),
        versions: searchParams.get('versions'),
        sort: searchParams.get('sort') || 'popular',
        page: searchParams.get('page') || 1,
      };

      const filteredParams = Object.fromEntries(
        Object.entries(rawParams).filter(([_, v]) => v != null && v !== '')
      );

    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/projects`, {
    params: filteredParams
    });

      // Важно: если бэкенд вернул не массив, а объект с полем projects
      setProjects(data.projects || []);
      setTotal(data.pagination?.total || 0);
    } catch (error) {
      console.error("Ошибка при загрузке проектов:", error);
      setProjects([]); // Очищаем список при ошибке
    } finally {
      setLoading(false);
    }
  };

  fetchProjects();
}, [searchParams, game, currentType]); // Используем currentType в зависимостях

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* HEADER: Поиск переехал влево */}
      <div className=" pt-10 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex items-center gap-6 shrink-0">
            <h1 className="text-xl font-black uppercase italic tracking-tighter shrink-0">
              {game} <span className="text-orange-500">/ {currentType}s</span>
            </h1>
            <div className="h-6 w-[1px] bg-slate-200" />
          </div>

          {/* Поиск теперь здесь (левее) */}
          <div className="relative w-full max-w-md">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
           <input 
            type="text"
            placeholder={`Поиск в ${currentType}s...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Теперь ввод будет мгновенным
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-transparent rounded-lg text-xs font-bold focus:bg-white focus:border-orange-500/30 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row gap-12">
        
        {/* SIDEBAR: Фильтры в колонну */}
        <aside className="w-full md:w-64 shrink-0 flex flex-col gap-10">
          
          {/* Теги */}
          <section>
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-5 flex items-center justify-between">
              Категории <HiOutlineAdjustments />
            </h3>
            <div className="flex flex-col gap-1">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => toggleFilter('tags', activeTags, tag.id)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-[11px] font-bold uppercase transition-all ${
                    activeTags.includes(tag.id) 
                      ? 'bg-orange-500 text-white' 
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {tag.label}
                  {activeTags.includes(tag.id) && <HiCheck size={12} />}
                </button>
              ))}
            </div>
          </section>

          {/* Версии (Множественный выбор) */}
          <section>
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-5">Версии</h3>
            <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {versions.map((v) => (
                <label 
                  key={v} 
                  className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all ${
                    activeVersions.includes(v) ? 'bg-orange-50 text-orange-600' : 'hover:bg-slate-50 text-slate-500'
                  }`}
                >
                  <span className="text-[10px] font-black uppercase">{v}</span>
                  <input 
                    type="checkbox" 
                    className="hidden"
                    checked={activeVersions.includes(v)}
                    onChange={() => toggleFilter('versions', activeVersions, v)}
                  />
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                    activeVersions.includes(v) ? 'bg-orange-500 border-orange-500' : 'border-slate-300'
                  }`}>
                    {activeVersions.includes(v) && <HiCheck size={10} className="text-white" />}
                  </div>
                </label>
              ))}
            </div>
          </section>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1">
          {/* Кастомный селект и инфо */}
          <div className="flex items-center justify-between mb-8 border-b border-slate-50 pb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Найдено проектов: <span className="text-slate-900">{total}</span>
            </span>

            {/* CUSTOM SELECT */}
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

          {/* Список проектов */}
         <div className="grid grid-cols-1 gap-4">
            {loading ? (
                // Показываем 5 скелетонов, пока loading === true
                Array.from({ length: 5 }).map((_, i) => <ProjectSkeleton key={i} />)
            ) : projects.length > 0 ? (
                projects.map((project: Project) => (
                <ProjectCard key={project._id} project={project} />
                ))
            ) : (
                <div className="py-20 text-center">
                <div className="text-slate-300 mb-2">
                    <HiOutlineCube size={48} className="mx-auto" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Ничего не найдено
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