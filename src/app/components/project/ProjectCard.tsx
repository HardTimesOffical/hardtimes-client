import React from 'react';
import { 
  HiOutlineDownload, HiOutlineClock, HiOutlineUser, 
  HiOutlineCollection, HiOutlineEye, HiOutlineCheckCircle
} from 'react-icons/hi';
import { PROJECT_TYPES_BY_GAME } from '@/constants/projectTypes';

export default function ProjectCard({ project }: { project: any }) {
  const updatedDate = project.updatedAt 
    ? new Date(project.updatedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
    : 'Недавно';

  const getProjectTypeName = (game: string, type: string) => {
    const types = PROJECT_TYPES_BY_GAME[game as keyof typeof PROJECT_TYPES_BY_GAME] || [];
    const found = types.find(t => t.value === type);
    return found ? found.label : type;
  };

  const typeLabel = getProjectTypeName(project.gameType, project.projectType);
  const isPaid = project.monetization?.isPaid;
  const price = project.monetization?.price;

  return (
    <div className="group bg-card border border-border rounded-md p-4 transition-all hover:bg-secondary/10 cursor-pointer">
      <div className="flex gap-4">
        
        {/* Иконка */}
        <div className="relative w-16 h-16 shrink-0 bg-secondary/30 border border-border rounded overflow-hidden">
          {project.iconUrl ? (
            <img 
              src={project.iconUrl} 
              alt={project.title} 
              className="w-full h-full object-cover transition-opacity group-hover:opacity-100 opacity-90" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground/20">
              <HiOutlineCollection size={28} />
            </div>
          )}
        </div>

        {/* Контент */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              {/* Бейдж типа и Автор */}
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-1.5 py-0.5 rounded-sm bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wide border border-primary/10">
                  {typeLabel}
                </span>
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <HiOutlineUser size={12} />
                  <span className="truncate">{project.owner?.username || 'Автор'}</span>
                </div>
              </div>

              <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors truncate">
                {project.title}
              </h3>
            </div>

            {/* Статистика */}
            <div className="flex items-center gap-3 text-muted-foreground/50 shrink-0 mt-1">
              <div className="flex items-center gap-1 text-[11px]">
                <HiOutlineEye size={13} />
                <span>{project.analytics?.views || 0}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px]">
                <HiOutlineDownload size={13} />
                <span>{project.analytics?.downloads || 0}</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-1 mt-1 font-normal opacity-80">
            {project.summary}
          </p>

          {/* Нижняя панель (Теги + Статус и Дата) */}
          <div className="flex items-center justify-between mt-auto pt-3">
            <div className="flex items-center gap-3">
              {project.tags?.slice(0, 3).map((tag: string) => (
                <span key={tag} className="text-[11px] text-muted-foreground/50">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 text-[10px] font-bold tracking-tighter uppercase text-muted-foreground/40">
              {/* СТАТУС ОПЛАТЫ */}
              <span className={isPaid ? "text-amber-600/50" : "text-muted-foreground/40"}>
                {isPaid ? `PAID: ${price}$` : 'FREE'}
              </span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <div className="flex items-center gap-1">
                <HiOutlineClock size={11} />
                <span>{updatedDate}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}