import React from 'react';
import { 
  HiOutlineDownload, HiOutlineClock, HiOutlineUser, 
  HiOutlineCollection, HiOutlineEye 
} from 'react-icons/hi';

export default function ProjectCard({ project }: { project: any }) {
  // Форматирование даты из updatedAt
  const updatedDate = project.updatedAt 
    ? new Date(project.updatedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
    : 'Недавно';

  return (
    <div className="group bg-white border border-slate-200 rounded-xl p-4 transition-colors hover:bg-slate-50/50 cursor-pointer">
      <div className="flex gap-4">
        
        {/* Иконка проекта */}
        <div className="relative w-20 h-20 shrink-0 bg-slate-50 border border-slate-100 rounded-lg overflow-hidden">
          {project.iconUrl ? (
            <img 
              src={project.iconUrl} 
              alt={project.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-200">
              <HiOutlineCollection size={32} />
            </div>
          )}
        </div>

        {/* Контентная часть */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              {/* Мета: Тип и Автор */}
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
                  {project.projectType || 'Project'}
                </span>
                <span className="text-slate-300">•</span>
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors">
                  <HiOutlineUser size={12} className="shrink-0" />
                  <span className="truncate">{project.owner?.username || 'Автор'}</span>
                </div>
              </div>
              
              <h3 className="text-base font-bold text-slate-800 truncate mb-1">
                {project.title}
              </h3>
            </div>

            {/* Блок статистики (Просмотры и Загрузки) */}
            <div className="hidden sm:flex items-center gap-3 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg shrink-0">
              {/* Просмотры */}
              <div className="flex items-center gap-1">
                <HiOutlineEye size={14} className="text-slate-400" />
                <span className="text-xs font-black text-slate-600">
                  {project.analytics?.views || 0}
                </span>
              </div>
              <div className="w-[1px] h-3 bg-slate-200" />
              {/* Загрузки */}
              <div className="flex items-center gap-1">
                <HiOutlineDownload size={14} className="text-slate-400" />
                <span className="text-xs font-black text-slate-600">
                  {project.analytics?.downloads || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Описание (summary) */}
          <p className="text-sm text-slate-500 line-clamp-1 mb-3">
            {project.summary}
          </p>

          {/* Футер карточки */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-50">
            <div className="flex items-center gap-2">
               {/* Теги из массива tags (если есть) */}
               {project.tags?.slice(0, 2).map((tag: string) => (
                 <span key={tag} className="px-1.5 py-0.5 bg-slate-100 text-[9px] font-bold text-slate-500 uppercase rounded">
                   {tag}
                 </span>
               ))}
               {project.gameType === 'minecraft' && (
                 <span className="px-1.5 py-0.5 bg-green-50 text-green-600 border border-green-100 text-[9px] font-bold uppercase rounded">
                   Minecraft
                 </span>
               )}
            </div>

            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
              <HiOutlineClock size={12} />
              <span>Обновлено: {updatedDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}