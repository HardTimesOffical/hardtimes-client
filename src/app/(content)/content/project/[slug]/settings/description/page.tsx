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
      <div className="w-12 h-12 bg-gray-800 rounded-2xl mx-auto mb-4" />
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Загрузка редактора...</p>
    </div>
  );

  return (
    <div className="max-w-none space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Кастомный Toast */}
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4">
          <div className={`px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border backdrop-blur-md ${
            toast.type === 'success' ? 'bg-gray-900 border-white/10 text-white' : 'bg-red-50 border-red-100 text-red-600'
          }`}>
            {toast.type === 'success' ? (
              <HiCheckCircle className="text-orange-500" size={20} />
            ) : (
              <HiExclamationCircle size={20} />
            )}
            <span className="text-[11px] font-black uppercase tracking-wider">{toast.msg}</span>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Описание проекта</h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
            Основная страница вашего контента
          </p>
        </div>
        
        {isSaving && (
          <div className="flex items-center gap-2 text-orange-500 animate-pulse">
            <div className="w-2 h-2 bg-orange-500 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-widest">Сохранение изменений...</span>
          </div>
        )}
      </div>

      {/* EDITOR FULL WIDTH */}
      <div className="w-full">
        <DescriptionEditor 
          initialContent={project?.description || ''} 
          onSave={handleSaveDescription} 
        />
      </div>

      {/* FOOTER INFO (Опционально) */}
      <div className="flex items-center gap-4 px-4 py-3 bg-gray-50 rounded-2xl border border-gray-100">
        <div className={`w-2 h-2 rounded-full ${project?.description?.length > 200 ? 'bg-green-500' : 'bg-orange-500'}`} />
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">
          {project?.description?.length > 200 
            ? 'Описание готово к публикации' 
            : `Рекомендуется добавить еще ${200 - (project?.description?.length || 0)} симв.`}
        </span>
      </div>

    </div>
  );
}