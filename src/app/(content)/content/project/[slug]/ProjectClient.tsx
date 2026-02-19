'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { 
  HiOutlineCube, HiOutlineGlobeAlt, 
  HiOutlineCalendar, HiOutlineArrowDownTray, 
  HiOutlineEye, HiOutlineCog6Tooth
} from 'react-icons/hi2';
import { FaDiscord, FaGithub, FaTelegramPlane } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import Sidebar from "@/app/components/dashboard/dashboard";
import Link from 'next/link';
import YandexAds from '@/app/components/yandex/YandexAds';

// Добавляем типизацию пропсов для принятия данных с сервера
interface ProjectClientProps {
  initialData?: any;
}

export default function ProjectClient({ initialData }: ProjectClientProps) {
  const { slug } = useParams();
  const { user } = useAuth();
  
  // Инициализируем стейт данными с сервера, если они есть
  const [project, setProject] = useState<any>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [activeTab, setActiveTab] = useState<'info' | 'updates' | 'versions'>('info');

  const viewed = useRef(false);

  useEffect(() => {
    const fetchProject = async () => {
      // Если данных нет (переход по ссылке внутри приложения), загружаем их
      if (!initialData) {
        try {
          const response = await api.get(`/projects/${slug}`);
          setProject(response.data);
        } catch (err) {
          console.error("Fetch error:", err);
        } finally {
          setLoading(false);
        }
      }

      // Логика учета просмотров (выполняется всегда на клиенте)
      if (slug && !viewed.current) {
        viewed.current = true;
        api.patch(`/projects/${slug}/view`).catch(() => {});
      }
    };

    fetchProject();
  }, [slug, initialData]);

  const handleDownload = async (versionId: string, fileName: string) => {
    try {
      const response = await api.get(`/projects/${slug}/download/${versionId}`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || `${project.title}.jar`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setProject((prev: any) => ({
        ...prev,
        analytics: { ...prev.analytics, downloads: (prev.analytics?.downloads || 0) + 1 }
      }));
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  const canEdit = project?.isOwner || (user && project?.owner?._id === user._id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-10 text-center font-bold text-muted-foreground uppercase text-[10px]">
        Проект не найден
      </div>
    );
  }

  return (
    <div className="flex pt-16 min-h-screen bg-background text-foreground transition-colors duration-200">
      <Sidebar />

      <main className="flex-1 w-full pb-10">
        <div className="max-w-6xl mx-auto px-4 md:px-6 space-y-4 mt-6">
          
          {/* БАННЕР ПРОЕКТА */}
          <div className="relative overflow-hidden border border-border rounded-lg bg-card shadow-sm">
            <div 
              className="h-24 md:h-32 w-full relative transition-colors duration-500"
              style={{ 
                backgroundColor: project.accentColor || '#f97316', 
                opacity: 0.12 
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card" />
            </div>
            
            <div className="p-5 -mt-14 relative flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
              <div className="flex items-end gap-5">
                <div className="w-24 h-24 bg-card rounded-2xl overflow-hidden border-4 border-card shadow-xl shrink-0 relative z-10">
                  {project.iconUrl ? (
                    <img src={project.iconUrl} alt={project.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-orange-500 bg-muted">
                      <HiOutlineCube size={48} />
                    </div>
                  )}
                </div>
                
                <div className="pb-1">
                  <h1 className="text-3xl font-black tracking-tighter uppercase leading-none">
                    {project.title}
                  </h1>
                  <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-[0.1em] mt-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)] animate-pulse" />
                    {project.projectType} • {project.gameType}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 z-10">
                {canEdit && (
                  <Link 
                    href={`/content/project/${slug}/settings`} 
                    className="p-3 bg-secondary text-secondary-foreground border border-border rounded-xl hover:bg-orange-500 hover:text-white transition-all group shadow-sm"
                  >
                    <HiOutlineCog6Tooth size={20} className="group-hover:rotate-90 transition-transform" />
                  </Link>
                )}
                <button 
                  onClick={() => setActiveTab('versions')}
                  className="p-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg shadow-orange-500/20 transition-all active:scale-95"
                >
                  <HiOutlineArrowDownTray size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* НАВИГАЦИЯ */}
          <div className="flex gap-1.5 p-1 bg-card border border-border rounded-xl w-fit shadow-sm">
            {[
              { id: 'info', label: 'Обзор' },
              { id: 'updates', label: 'Обновления' },
              { id: 'versions', label: 'Файлы' }
            ].map((tab) => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id as any)} 
                className={`px-6 py-2 rounded-lg text-[11px] font-black transition-all uppercase tracking-widest ${
                  activeTab === tab.id 
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/10' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ОСНОВНАЯ СЕТКА */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            <div className="lg:col-span-3 space-y-4">
              <div className="border border-border rounded-xl bg-card p-6 md:p-8 shadow-sm min-h-[400px]">
                {/* SEO-совет: Роботы лучше читают контент, который не скрыт полностью. 
                    Для идеальной индексации можно использовать CSS hidden вместо условного рендеринга */}
                <div className={activeTab === 'info' ? 'block' : 'hidden'}>
                  <article 
                    className="prose prose-sm dark:prose-invert max-w-none text-foreground prose-headings:uppercase prose-headings:tracking-tighter prose-headings:font-black" 
                    dangerouslySetInnerHTML={{ __html: project.description || '<p className="text-muted-foreground italic uppercase text-[10px]">Описание отсутствует</p>' }}
                  />
                </div>

                {activeTab === 'updates' && (
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-6">История изменений</h3>
                    {project.versions?.filter((v: any) => v.changelog).map((v: any) => (
                      <div key={v._id} className="p-5 border border-border rounded-xl bg-muted/5 hover:bg-muted/10 transition-colors">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-xs font-black uppercase text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full">v{v.versionNumber}</span>
                          <span className="text-[9px] text-muted-foreground font-bold tracking-widest">{new Date(v.createdAt).toLocaleDateString('ru-RU')}</span>
                        </div>
                        <div className="text-sm text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: v.changelog }} />
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'versions' && (
                  <div className="space-y-3">
                    <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">Доступные сборки</h3>
                    {project.versions?.map((v: any) => {
                      const type = v.releaseType?.toLowerCase() || 'release';
                      const statusStyles: any = {
                        release: "bg-green-500/10 text-green-600 border-green-500/20",
                        beta: "bg-blue-500/10 text-blue-600 border-blue-500/20",
                        alpha: "bg-red-500/10 text-red-600 border-red-500/20",
                      };
                      return (
                        <div key={v._id} className="flex items-center justify-between p-4 border border-border rounded-xl bg-card hover:border-orange-500/40 transition-all group">
                          <div className="flex items-center gap-4">
                            <div className={`px-2 py-1 rounded-md border text-[9px] font-black uppercase tracking-tighter ${statusStyles[type]}`}>
                              {type}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-black uppercase tracking-tight">v{v.versionNumber}</span>
                              <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">{new Date(v.createdAt).toLocaleDateString('ru-RU')}</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleDownload(v._id, v.fileName)}
                            className="p-3 bg-secondary hover:bg-orange-500 hover:text-white border border-border rounded-lg transition-all"
                          >
                            <HiOutlineArrowDownTray size={16} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <aside className="space-y-4">
              {/* БЛОК АВТОРА */}
              <YandexAds/>
              <div className="border border-border rounded-xl bg-card p-5 shadow-sm">
                <h3 className="text-[10px] font-black text-muted-foreground uppercase mb-4 tracking-widest">Автор проекта</h3>
                {project.owner ? (
                  <Link href={`/profile/${project.owner.username}`} className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-secondary border border-border overflow-hidden flex items-center justify-center shrink-0 group-hover:border-orange-500 transition-all shadow-inner">
                      {project.owner.avatar ? (
                        <img src={project.owner.avatar} alt={project.owner.username} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <span className="text-xs font-black text-orange-500 uppercase">{project.owner.username?.charAt(0)}</span>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-black uppercase truncate tracking-tight group-hover:text-orange-500 transition-colors">{project.owner.username}</span>
                    </div>
                  </Link>
                ) : (
                  <div className="text-[10px] text-muted-foreground italic uppercase">Загрузка автора...</div>
                )}
              </div>

              {/* СТАТИСТИКА */}
              <div className="border border-border rounded-xl bg-card p-5 shadow-sm">
                <h3 className="text-[10px] font-black text-muted-foreground uppercase mb-4 tracking-widest flex items-center gap-2">
                  <div className="w-1 h-3 bg-orange-500 rounded-full" /> Статистика
                </h3>
                <div className="space-y-3">
                  <SidebarStat icon={<HiOutlineEye />} label="Просмотры" value={project.analytics?.views || 0} />
                  <SidebarStat icon={<HiOutlineArrowDownTray />} label="Загрузки" value={project.analytics?.downloads || 0} />
                  <SidebarStat icon={<HiOutlineCalendar />} label="Обновлен" value={new Date(project.updatedAt).toLocaleDateString('ru-RU')} />
                </div>
              </div>

              {/* ССЫЛКИ */}
              <div className="border border-border rounded-xl bg-card p-5 shadow-sm">
                <h3 className="text-[10px] font-black text-muted-foreground uppercase mb-4 tracking-widest">Ресурсы</h3>
                <div className="grid grid-cols-2 gap-2">
                  <SocialIconButton icon={<FaDiscord />} url={project.links?.discord} />
                  <SocialIconButton icon={<FaGithub />} url={project.links?.github} />
                  <SocialIconButton icon={<FaTelegramPlane />} url={project.links?.telegram} />
                  <SocialIconButton icon={<HiOutlineGlobeAlt />} url={project.links?.wiki} />
                </div>
              </div>
            </aside>

          </div>
        </div>
      </main>
    </div>
  );
}

// Вспомогательные компоненты
function SidebarStat({ icon, label, value }: any) {
  return (
    <div className="flex justify-between items-center text-[10px] py-1 border-b border-border/50 last:border-0">
      <div className="flex items-center gap-2 text-muted-foreground font-bold uppercase">
        <span className="text-orange-500">{icon}</span>
        {label}
      </div>
      <span className="font-black text-foreground uppercase tracking-tighter">{value}</span>
    </div>
  );
}

function SocialIconButton({ icon, url }: any) {
  if (!url) return null;
  return (
    <a 
      href={url} target="_blank" rel="noopener noreferrer"
      className="flex items-center justify-center p-3 border border-border rounded-xl bg-muted/20 hover:bg-orange-500 hover:text-white transition-all text-muted-foreground"
    >
      {icon}
    </a>
  );
}