'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { HiCheckBadge } from 'react-icons/hi2';
import api from '@/lib/api';
import Checklist from '@/app/components/project/Checklist';
import Sidebar from '@/app/components/project/Sidebar';
import { ProjectProvider, useProject } from './ProjectContext';

function WorkbenchContent({ children }: { children: React.ReactNode }) {
  // Забираем данные из контекста (теперь они "живые")
  const { project, versionsCount, setVersionsCount } = useProject(); 
  const [isChecklistVisible, setChecklistVisible] = useState(true);
  const { slug } = useParams();

  // Добавим useEffect внутрь контента, чтобы он мог обновлять количество версий
  // если вдруг контекст пустой (например, при первой загрузке)
  useEffect(() => {
    if (versionsCount === 0) {
       api.get(`/projects/${slug}/versions`).then(res => {
         setVersionsCount(res.data.length);
       });
    }
  }, [slug]);

  if (!project) return null;

  const isApproved = project.status === 'approved';

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-4 md:p-8 font-sans transition-colors duration-300">
      <div className="pt-10 max-w-[1200px] mx-auto space-y-8 md:pt-16">
        
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border)] pb-8 animate-in fade-in slide-in-from-left-4 duration-500">
          <div>
            <h1 className="text-xl font-black text-[var(--foreground-bright)] uppercase tracking-tighter">
              Настройки проекта
            </h1>
            <p className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-[0.2em] mt-1">
              Управление контентом и конфигурация • {project.title}
            </p>
          </div>

          {isApproved && (
            <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 px-5 py-2.5 rounded-xl self-start md:self-center animate-in zoom-in-95 duration-500">
              <HiCheckBadge className="text-green-500" size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest text-green-500">
                Проект одобрен
              </span>
            </div>
          )}
        </header>

        {!isApproved && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-700">
            <Checklist 
              project={project} 
              versionsCount={versionsCount} // Используем значение из контекста!
              isVisible={isChecklistVisible} 
              onToggle={() => setChecklistVisible(!isChecklistVisible)} 
            />
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="md:sticky md:top-8 w-full md:w-64 z-10">
             <Sidebar />
          </div>
          
          <main className="flex-1 w-full bg-[var(--card)] rounded-2xl p-6 md:p-10 border border-[var(--border)] shadow-sm min-h-[70vh] transition-colors duration-300">
            <div className="animate-in fade-in duration-500 text-[var(--foreground)]">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function WorkbenchLayout({ children }: { children: React.ReactNode }) {
  const { slug } = useParams();
  const [initialData, setInitialData] = useState<any>(null);
  const [initialVersionsCount, setInitialVersionsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [projRes, versRes] = await Promise.all([
          api.get(`/projects/${slug}`),
          api.get(`/projects/${slug}/versions`)
        ]);
        setInitialData(projRes.data);
        setInitialVersionsCount(versRes.data.length);
      } catch (err) {
        console.error("Ошибка загрузки лайаута:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [slug]);

  if (loading || !initialData) return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
       <div className="w-10 h-10 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    // Передаем начальное количество в провайдер
    <ProjectProvider initialProject={initialData} initialVersionsCount={initialVersionsCount}>
       <WorkbenchContent>
          {children}
       </WorkbenchContent>
    </ProjectProvider>
  );
}