'use client';

import React from 'react';
import Link from 'next/link';
import { 
  HiOutlineDownload, 
  HiOutlineEye, 
  HiOutlineCube,
  HiOutlineTerminal 
} from 'react-icons/hi';

interface ProjectCardProps {
  project: {
    _id: string;
    title: string;
    summary: string;
    slug: string;
    iconUrl?: string;
    gameType: string;
    projectType: string;
    tags: string[];
    versions: string[];
    analytics: {
      views: number;
      downloads: number;
    };
  };
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Link href={`/content/project/${project.slug}`}>
      <div className="group bg-white border border-slate-100 p-5 rounded-[1.5rem] flex flex-col sm:flex-row gap-6 hover:border-orange-500/30 hover:shadow-xl hover:shadow-orange-500/5 transition-all cursor-pointer">
        
        {/* ИКОНКА ПРОЕКТА */}
        <div className="w-20 h-20 bg-slate-50 rounded-2xl shrink-0 flex items-center justify-center border border-slate-100 group-hover:bg-white transition-colors overflow-hidden">
          {project.iconUrl ? (
            <img 
              src={project.iconUrl} 
              alt={project.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <HiOutlineCube size={32} className="text-slate-200 group-hover:text-orange-500 transition-colors" />
          )}
        </div>

        {/* КОНТЕНТ */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-lg font-black uppercase italic text-slate-900 group-hover:text-orange-600 transition-colors tracking-tighter truncate pr-4">
                {project.title}
              </h3>
              
              {/* ПОСЛЕДНЯЯ ВЕРСИЯ */}
              {project.versions?.length > 0 && (
                <div className="flex items-center gap-1 text-[9px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded uppercase shrink-0">
                  <HiOutlineTerminal size={10} />
                  {project.versions[0]}
                </div>
              )}
            </div>

            <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed mb-3">
              {project.summary}
            </p>
          </div>

          {/* НИЖНЯЯ ПАНЕЛЬ С ТЕГАМИ И СТАТИСТИКОЙ */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            
            {/* ТЕГИ (первые 3) */}
            <div className="flex flex-wrap gap-1.5">
              {project.tags?.slice(0, 3).map((tag) => (
                <span 
                  key={tag} 
                  className="text-[8px] font-black uppercase tracking-widest text-orange-500/70 border border-orange-500/10 px-2 py-0.5 rounded-md bg-orange-50/30"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* СТАТИСТИКА */}
            <div className="flex items-center gap-5 shrink-0 border-l border-slate-50 pl-4">
              <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <HiOutlineDownload className="text-orange-500" /> 
                {formatNumber(project.analytics?.downloads || 0)}
              </div>
              <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <HiOutlineEye className="text-orange-500" /> 
                {formatNumber(project.analytics?.views || 0)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Хелпер для красивых чисел (1.2K, 1.5M)
function formatNumber(num: number) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

export default ProjectCard;