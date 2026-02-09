'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import DescriptionEditor from '@/app/components/project/DescriptionEditor';
import { HiCheckCircle, HiExclamationCircle } from 'react-icons/hi2';

export default function ProjectDescriptionPage() {
  const { slug } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  useEffect(() => {
    api.get(`/projects/${slug}`).then(res => {
      setProject(res.data);
      setLoading(false);
    }).catch(err => {
      console.error("Ошибка загрузки:", err);
      setLoading(false);
    });
  }, [slug]);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveDescription = async (htmlContent: string) => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('description', htmlContent);
      const response = await api.patch(`/projects/edit/${slug}`, formData);

      if (response.status === 200 || response.status === 201) {
        showToast('success', 'Описание успешно сохранено!');
        setProject((prev: any) => ({ ...prev, description: htmlContent }));
      }
    } catch (error: any) {
      console.error("Save error:", error);
      const errorMsg = error.response?.data?.message || 'Ошибка при сохранении';
      showToast('error', errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return (
    <div className="p-20 text-center animate-pulse">
      <div className="w-12 h-12 bg-[var(--surface)] border border-[var(--border)] rounded-md mx-auto mb-4" />
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)]">Загрузка редактора...</p>
    </div>
  );

  return (
    // Увеличен gap между блоками до 10 для "воздуха"
    <div className="max-w-none flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300 px-4 w-full max-w-max">
          <div className={`px-5 py-2.5 rounded-md shadow-2xl flex items-center gap-3 border backdrop-blur-md ${
            toast.type === 'success' ? 'bg-[var(--foreground)] border-[var(--border)] text-[var(--background)]' : 'bg-red-500 border-red-600 text-white'
          }`}>
            {toast.type === 'success' ? (
              <HiCheckCircle className="text-[var(--accent)]" size={18} />
            ) : (
              <HiExclamationCircle size={18} />
            )}
            <span className="text-[10px] font-black uppercase tracking-wider">{toast.msg}</span>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div>
          <h2 className="text-xl font-black text-[var(--foreground-bright)] uppercase tracking-tight">Описание проекта</h2>
          <p className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-widest mt-1">
            Основная страница вашего контента
          </p>
        </div>
        
        {isSaving && (
          <div className="flex items-center gap-2 text-[var(--accent)] animate-pulse bg-[var(--accent)]/5 px-3 py-1.5 rounded-md border border-[var(--accent)]/10">
            <div className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full" />
            <span className="text-[9px] font-black uppercase tracking-widest">Синхронизация...</span>
          </div>
        )}
      </div>

      {/* EDITOR CONTAINER */}
      <div className="w-full rounded-md overflow-hidden border border-[var(--border)] bg-[var(--surface)] shadow-sm">
      <DescriptionEditor 
        initialContent={project?.description || ''} 
        onSave={handleSaveDescription} 
      />
    </div>

      {/* FOOTER INFO - Теперь с четким отступом от редактора */}
      <div className="mt-12 flex items-center gap-4 px-6 py-5 bg-[var(--surface)] rounded-md border border-[var(--border)] transition-all">
        <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${project?.description?.length > 200 ? 'bg-green-500' : 'bg-[var(--accent)]'}`} />
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black text-[var(--foreground)] uppercase tracking-tight">
            Статус наполнения
          </span>
          <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-tight opacity-70">
            {project?.description?.length > 200 
              ? 'Контент соответствует рекомендациям' 
              : `Необходимо еще минимум ${Math.max(0, 200 - (project?.description?.length || 0))} симв.`}
          </span>
        </div>
      </div>
    </div>
  );
}