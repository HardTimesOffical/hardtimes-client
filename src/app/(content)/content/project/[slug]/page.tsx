'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { 
  HiOutlineCube, HiOutlineGlobeAlt, 
  HiOutlineCalendar, HiOutlineArrowDownTray, HiOutlinePencilSquare,
  HiOutlineRocketLaunch, HiOutlineEye, HiOutlineHeart,
} from 'react-icons/hi2';
import { FaDiscord, FaGithub, FaTelegramPlane } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function ProjectPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { user, accessToken } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'description' | 'updates' | 'versions'>('description');

  const viewed = useRef(false);

useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await api.get(`/projects/${slug}`);
        setProject(response.data);
        
        if (!viewed.current) {
          viewed.current = true;
          api.patch(`/projects/${slug}/view`).catch(() => {});
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProject();
  }, [slug]);

const canEdit = project?.isOwner || (user && project?.owner === user._id) || (user && project?.owner?._id === user._id);

 const handleDownload = async (versionId: string, fileName: string) => {
    try {
      // Инициируем скачивание (бэкенд увеличит счетчик в БД)
      const response = await api.get(`/projects/${slug}/download/${versionId}`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName || 'update.jar');
      document.body.appendChild(link);
      link.click();
      link.remove();

      // СРАЗУ обновляем UI, чтобы пользователь увидел результат
      setProject((prev: any) => ({
        ...prev,
        analytics: {
          ...prev.analytics,
          downloads: (prev.analytics?.downloads || 0) + 1
        },
        versions: prev.versions?.map((v: any) => 
          v._id === versionId 
            ? { ...v, downloads: (v.downloads || 0) + 1 } // Поле из схемы Version
            : v
        )
      }));
    } catch (error) {
      alert("Ошибка при скачивании файла");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!project) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] text-red-500 font-bold uppercase tracking-widest">
      Проект не найден
    </div>
  );

  const isOwner = project.isOwner; 

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 pb-20 selection:bg-orange-100 selection:text-orange-600">
      <div className="max-w-[1200px] mx-auto px-4 pt-24 space-y-6">
        
        {/* HEADER SECTION */}
        <header className="bg-white border border-gray-200 rounded-[2.5rem] p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
              <div className="w-28 h-28 bg-gray-50 rounded-[2rem] overflow-hidden border border-gray-100 shadow-inner shrink-0 group">
                {project.iconUrl ? (
                  <img src={project.iconUrl} alt={project.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-orange-500 bg-orange-50"><HiOutlineCube size={48} /></div>
                )}
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight italic uppercase leading-none">{project.title}</h1>
                <p className="text-gray-500 text-sm font-medium max-w-xl leading-relaxed">{project.summary}</p>
                
                <div className="flex flex-wrap gap-5 pt-1">
                    <StatItem 
                        icon={<HiOutlineEye />} 
                        value={project.analytics?.views || 0} // ПРАВИЛЬНО
                        label="Просмотров" 
                    />
                    <StatItem 
                        icon={<HiOutlineArrowDownTray />} 
                        value={project.analytics?.downloads || 0} // ПРАВИЛЬНО
                        label="Загрузок" 
                    />
                    <StatItem 
                        icon={<HiOutlineCalendar />} 
                        value={new Date(project.updatedAt).toLocaleDateString()} 
                        label="Обновлен" 
                    />
                    </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full md:w-auto">
                {canEdit && (
                <button 
                  onClick={() => router.push(`/content/project/${slug}/settings`)}
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 hover:bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md group"
                >
                  Настройки проекта
                </button>
                )}
              <button 
                onClick={() => setActiveTab('versions')}
                className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg shadow-orange-500/20"
              >
                <HiOutlineArrowDownTray size={20} /> Скачать
              </button>
            </div>
          </div>
        </header>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-9 space-y-6">
            <nav className="flex gap-2 p-1.5 bg-gray-200/50 w-fit rounded-2xl border border-gray-200">
              <TabBtn active={activeTab === 'description'} onClick={() => setActiveTab('description')}>Описание</TabBtn>
              <TabBtn active={activeTab === 'updates'} onClick={() => setActiveTab('updates')}>Обновления</TabBtn>
              <TabBtn active={activeTab === 'versions'} onClick={() => setActiveTab('versions')}>Версии</TabBtn>
            </nav>

            <div className="bg-white border border-gray-200 rounded-[1rem] p-5 shadow-sm overflow-hidden min-h-[300px]">
              {activeTab === 'description' && (
                <article 
                className="prose prose-slate max-w-none text-gray-800 prose-headings:font-black prose-img:rounded-3xl break-words" 
                // Добавили break-words выше ^
                dangerouslySetInnerHTML={{ __html: project.description || '<i>Описание отсутствует</i>' }}
                />
            )}

                {activeTab === 'updates' && (
                <div className="space-y-8 py-2 relative">
                    {/* Основная фоновая линия (светлая) */}
                    <div className="absolute inset-0 ml-4 w-[1px] bg-gray-100" />

                    {project.versions?.filter((v: any) => v.changelog).length > 0 ? (
                    project.versions.filter((v: any) => v.changelog).map((v: any) => {
                        // Логика определения цвета
                        const releaseType = (v.releaseType?.toLowerCase() || 'release') as keyof typeof colorMap;

                        // 2. Описываем карту цветов с четкой типизацией
                        const colorMap = {
                        release: { line: 'bg-green-500', bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-600' },
                        beta: { line: 'bg-blue-500', bg: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-600' },
                        alpha: { line: 'bg-red-500', bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-600' },
                        default: { line: 'bg-orange-500', bg: 'bg-orange-50', border: 'border-orange-500', text: 'text-orange-600' }
                        };

                        const colors = colorMap[releaseType] || colorMap.default;

                        return (
                        <div key={v._id} className="relative pl-10">
                            {/* Отрезок линии конкретного цвета (соединитель) */}
                            <div className={`absolute left-0 top-10 bottom-0 ml-4 w-[1px] ${colors.line} opacity-20`} />
                            
                            {/* Индикатор на линии */}
                            <div className={`absolute left-0 top-2 w-8 h-8 bg-white border-2 ${colors.border} rounded-full flex items-center justify-center -translate-x-1/2 z-10 shadow-sm transition-colors`}>
                            <div className={`w-1.5 h-1.5 ${colors.line} rounded-full animate-pulse`} />
                            </div>

                            {/* Карточка обновления */}
                            <div className="bg-gray-50 rounded-[1.5rem] p-5 border border-gray-100 transition-all hover:border-gray-200 hover:bg-white hover:shadow-xl hover:shadow-gray-200/40">
                            <div className="flex flex-wrap justify-between items-center gap-3 mb-3">
                                <div className="flex items-center gap-3">
                                <h4 className="font-black text-gray-900 uppercase text-sm tracking-tight">
                                    Версия {v.versionNumber || v.number}
                                </h4>
                                {/* Бейдж статуса */}
                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${colors.bg} ${colors.text} ${colors.border} border-opacity-30`}>
                                    {releaseType}
                                </span>
                                </div>
                                <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest bg-white px-2 py-1 rounded-md border border-gray-100">
                                {new Date(v.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            {/* Текст чейнджлога с переносом */}
                            <div 
                                className="prose prose-sm text-gray-600 max-w-none break-words whitespace-pre-wrap leading-relaxed prose-p:my-1" 
                                dangerouslySetInnerHTML={{ __html: v.changelog }} 
                            />
                            </div>
                        </div>
                        );
                    })
                    ) : (
                    <div className="text-center py-10 text-gray-400 text-[10px] font-black uppercase tracking-widest italic">
                        Нет доступных логов обновлений
                    </div>
                    )}
                </div>
                )}

{activeTab === 'versions' && (
    <div className="w-full">
      {/* Шапка таблицы */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-4 bg-gray-50/50 border-b border-gray-100 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
        <div className="col-span-1">Status</div>
        <div className="col-span-4">Name</div>
        <div className="col-span-2 text-center">Game Version</div>
        <div className="col-span-2 text-center">Loaders</div>
        <div className="col-span-1 text-center">Date</div>
        <div className="col-span-1 text-center">Stats</div>
        <div className="col-span-1 text-right">Action</div>
      </div>

      <div className="divide-y divide-gray-50">
        {project.versions?.length > 0 ? (
  [...project.versions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((v: any) => {
    
    const gv = v.gameVersions || (v.gameVersion ? [v.gameVersion] : []);
    const displayGv = gv.length > 1 ? `${gv[gv.length - 1]} — ${gv[0]}` : gv[0] || '1.21';

    const type = v.releaseType?.toLowerCase() || 'release';
    
    // Мягкая цветовая палитра в стиле Modrinth
    const statusStyles: any = {
      release: { bg: 'bg-[#2ecc71]', text: 'text-white', label: 'R' },
      beta: { bg: 'bg-[#3498db]', text: 'text-white', label: 'B' },
      alpha: { bg: 'bg-[#e74c3c]', text: 'text-white', label: 'A' }
    };

    const currentStatus = statusStyles[type] || statusStyles.release;

    return (
      <div key={v._id} className="grid grid-cols-4 md:grid-cols-12 gap-4 px-8 py-3.5 items-center hover:bg-slate-50/50 transition-colors group border-b border-gray-50 last:border-0">
        
        {/* Status - Мягкий круг с небольшим блюром или тенью */}
        <div className="col-span-1">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] shadow-sm transition-transform group-hover:scale-105 ${currentStatus.bg} ${currentStatus.text}`}>
            {currentStatus.label}
          </div>
        </div>

        {/* Name - Чистый и без лишнего жира */}
        <div className="col-span-3 md:col-span-4 min-w-0">
          <div className="font-bold text-[13px] text-slate-800 leading-tight truncate uppercase tracking-tight">
            {v.versionNumber || v.number}
          </div>
          <div className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
            {v.name || 'Stable Build'}
          </div>
        </div>

        {/* Game Version - Мягкий фон */}
        <div className="hidden md:flex col-span-2 justify-center">
          <span className="bg-slate-100/50 px-3 py-1 rounded-lg text-[10px] font-bold text-slate-500 border border-slate-200/50">
            {displayGv}
          </span>
        </div>

        {/* Loaders - Приятный темный, но не черный фон */}
        <div className="hidden md:flex col-span-2 justify-center gap-1.5 flex-wrap">
            {v.loaders && v.loaders.length > 0 ? (
                <>
                {v.loaders.slice(0, 3).map((loader: string) => (
                    <span 
                    key={loader} 
                    className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5 border border-slate-200/60"
                    >
                    <div className="w-1 h-1 bg-slate-400 rounded-full" />
                    {loader}
                    </span>
                ))}
                {v.loaders.length > 3 && (
                    <span className="text-[9px] font-black text-slate-300 self-center ml-0.5">
                    +{v.loaders.length - 3}
                    </span>
                )}
                </>
            ) : (
                <span className="text-slate-200">—</span>
            )}
        </div>

        {/* Published Date */}
        <div className="hidden md:block col-span-1 text-center">
          <div className="text-[10px] font-medium text-slate-400 uppercase">
            {new Date(v.createdAt).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })}
          </div>
        </div>

        {/* Downloads */}
        <div className="hidden md:block col-span-1 text-center">
          <div className="text-[11px] font-bold text-slate-700">
            {v.downloads || 0}
          </div>
          <div className="text-[7px] font-black text-slate-300 uppercase tracking-widest">DLS</div>
        </div>

        {/* Action Button - Легкая и аккуратная */}
        <div className="col-span-4 md:col-span-1 text-right">
          <button 
            onClick={() => handleDownload(v._id, v.fileName)}
            className="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all active:scale-90"
          >
            <HiOutlineArrowDownTray size={18}/>
          </button>
        </div>
      </div>
    );
  })
) : null}
      </div>
    </div>
  )}
            </div>
          </div>

          <aside className="lg:col-span-3 space-y-6">
            <SidebarCard title="Автор проекта">
  <div className="flex items-center gap-4 p-1">
    {/* Ссылка на профиль вокруг аватара */}
    <Link 
      href={`/profile/${project.owner?.username || project.owner?._id || '#'}`}
      className="relative w-12 h-12 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-sm shrink-0 group/avatar transition-all active:scale-95"
    >
      {/* Проверяем поле avatar, которое есть в вашем объекте */}
      {project.owner?.avatar ? (
        <img 
          src={project.owner.avatar} 
          className="w-full h-full object-cover transition-transform group-hover/avatar:scale-110 relative z-10" 
          alt="avatar"
          onError={(e) => {
            (e.target as HTMLImageElement).style.opacity = '0';
          }}
        />
      ) : null}
      
      {/* Буква-заглушка: всегда на заднем плане (z-0) */}
      <div className="absolute inset-0 z-0 flex items-center justify-center bg-orange-500 text-white text-base font-black italic">
        {project.owner?.username?.charAt(0).toUpperCase()}
      </div>
      
      {/* Легкий оверлей при наведении */}
      <div className="absolute inset-0 z-20 bg-black/0 group-hover/avatar:bg-black/5 transition-colors" />
    </Link>

        <div className="min-w-0">
        <Link 
            href={`/profile/${project.owner?.username || project.owner?._id || '#'}`}
            className=" hover:!text-orange-500 transition-colors truncate no-underline bg-transparent border-none p-0"
        >
            {project.owner?.username || 'Unknown'}
        </Link>
        <div className="text-[9px] text-orange-500 font-black uppercase tracking-[0.15em] mt-1.5 leading-none">
            Project Lead
        </div>
        </div>
  </div>
</SidebarCard>

            <SidebarCard title="Характеристики">
              <div className="space-y-4">
                <InfoRow label="Игра" value={project.gameType} />
                <InfoRow label="Категория" value={project.projectType} />
                <InfoRow label="Среда" value={project.environment || 'Universal'} />
              </div>
            </SidebarCard>

<SidebarCard title="Ссылки">
  <div className="flex flex-col gap-2">
    <SocialLink 
      icon={<FaDiscord />} 
      label="Discord" 
      url={project.links?.discord} 
    />
    <SocialLink 
      icon={<FaGithub />} 
      label="Source Code" 
      url={project.links?.sourceCode || project.links?.github} 
    />
    <SocialLink 
      icon={<HiOutlineGlobeAlt />} 
      label="Wiki / Docs" 
      url={project.links?.wiki} 
    />
    <SocialLink 
      icon={<FaTelegramPlane />} 
      label="Telegram" 
      url={project.links?.telegram} 
    />
    <SocialLink 
      icon={<HiOutlineHeart />} 
      label="Donation" 
      url={project.links?.donation} 
    />
  </div>
</SidebarCard>
          </aside>
        </div>
      </div>
    </div>
  );
}

// SUPPORT COMPONENTS
function StatItem({ icon, value, label }: any) {
  return (
    <div className="flex items-center gap-2 text-gray-400">
      <span className="text-orange-500">{icon}</span>
      <div className="flex flex-col">
        <span className="text-xs font-black text-gray-900 leading-none">{value}</span>
        <span className="text-[9px] font-bold uppercase text-gray-400 tracking-tighter">{label}</span>
      </div>
    </div>
  );
}

function TabBtn({ children, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
      active ? 'bg-white text-orange-600 shadow-md' : 'text-gray-400 hover:text-gray-600'
    }`}>
      {children}
    </button>
  );
}

function SidebarCard({ title, children }: any) {
  return (
    <div className="bg-white border border-gray-200 rounded-[2rem] p-7 shadow-sm">
      <h3 className="text-[10px] font-black uppercase text-gray-300 tracking-[0.3em] mb-5 flex items-center gap-3">
        <span className="w-6 h-[2px] bg-orange-100 rounded-full" /> {title}
      </h3>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: any) {
  return (
    <div className="flex justify-between items-center text-[10px] py-1 border-b border-gray-50 last:border-0">
      <span className="font-bold text-gray-400 uppercase">{label}</span>
      <span className="font-black text-gray-900 uppercase">{value}</span>
    </div>
  );
}

function SocialLink({ icon, url, label }: { icon: React.ReactNode, url?: string, label: string }) {
  if (!url) return null;
  
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="flex items-center gap-3 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl transition-all hover:bg-white hover:border-orange-200 hover:shadow-sm group"
    >
      <span className="text-lg text-gray-400 group-hover:text-orange-500 transition-colors shrink-0">
        {icon}
      </span>
      <span className="text-[9px] font-black uppercase tracking-[0.1em] text-gray-500 group-hover:text-gray-900 transition-colors truncate">
        {label}
      </span>
    </a>
  );
}