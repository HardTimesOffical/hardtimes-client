'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import Checklist from '@/app/components/project/Checklist';
import Sidebar from '@/app/components/project/Sidebar';

export default function WorkbenchLayout({ children }: { children: React.ReactNode }) {
  const { slug } = useParams();
  const [project, setProject] = useState<any>(null);
  const [versions, setVersions] = useState<any[]>([]);
  const [isChecklistVisible, setChecklistVisible] = useState(true);

  useEffect(() => {
    api.get(`/projects/${slug}`).then(res => setProject(res.data));
    api.get(`/projects/${slug}/versions`).then(res => setVersions(res.data));
  }, [slug]);

  if (!project) return (
    <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center">
       <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    // Изменили фон на очень светлый серый
    <div className=" bg-[#f4f4f4] text-gray-900 p-4 md:p-8 font-sans transition-colors duration-500">
      <div className="pt-10 max-w-[1200px] mx-auto space-y-8 pt-20">
        
        {/* ВЕРХНИЙ ГРИД (ЧЕКЛИСТ) */}
        {project.status !== 'approved' && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-700">
            <Checklist 
              project={project} 
              versionsCount={versions.length} // Передаем количество
              isVisible={isChecklistVisible} 
              onToggle={() => setChecklistVisible(!isChecklistVisible)} 
            />
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* САЙДБАР (теперь на светлом фоне он будет выглядеть иначе) */}
          <div className="sticky top-8 w-full md:w-64">
             <Sidebar />
          </div>
          
          {/* КОНТЕНТ СТРАНИЦЫ */}
          <main className="flex-1 bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] min-h-[70vh]">
            <div className="animate-in fade-in duration-500">
              {children}
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}