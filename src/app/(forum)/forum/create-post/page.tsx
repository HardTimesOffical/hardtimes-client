'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import DescriptionEditor from '@/app/components/project/DescriptionEditor';
import ProjectSearch from '@/app/components/forum/ProjectSearch';
import CategorySelect from '@/app/components/forum/CategorySelect';
import { HiPhoto, HiLink, HiArrowPath, HiChatBubbleLeftRight } from "react-icons/hi2";

export default function CreateForumPostPage() {
  const { accessToken, user } = useAuth();
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [relatedProjectId, setRelatedProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async (htmlContent: string) => {
    if (!title.trim() || !category || htmlContent.length < 20) {
      alert("Заполните заголовок, выберите категорию и напишите текст (минимум 20 символов).");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/forum/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ 
          title, 
          content: htmlContent, 
          category, 
          bannerUrl, 
          relatedProject: relatedProjectId 
        })
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/forum/${data.post.slug}`);
      } else {
        const errData = await res.json();
        alert(errData.message || "Ошибка при публикации");
      }
    } catch (err) {
      alert("Не удалось связаться с сервером");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] opacity-50">
      <HiArrowPath className="animate-spin w-6 h-6 mb-2" />
      <span className="text-[10px] font-bold uppercase tracking-widest">Загрузка...</span>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 antialiased">
      
      {/* МИНИМАЛИСТИЧНЫЙ ЗАГОЛОВОК */}
      <div className="mb-6 flex items-center gap-3">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <HiChatBubbleLeftRight className="w-5 h-5 text-blue-500" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-[var(--foreground-bright)] leading-tight">Создание темы</h1>
          <p className="text-[var(--muted)] text-xs">Новое обсуждение на форуме</p>
        </div>
      </div>

      <div className="space-y-4">
        
        {/* БЛОК ПАРАМЕТРОВ */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-5 space-y-4 shadow-sm">
          
          {/* Заголовок */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase text-[var(--muted)] tracking-wider">Название темы</label>
            <input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[var(--surface)] border border-[var(--border)] px-3 py-2 rounded-lg text-sm outline-none focus:border-blue-500 transition-all"
              placeholder="Введите краткий и понятный заголовок"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Категория */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-[var(--muted)] tracking-wider">Раздел</label>
              <CategorySelect selected={category} onSelect={setCategory} />
            </div>

            {/* Проект */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-[var(--muted)] tracking-wider flex items-center gap-1.5">
                <HiLink className="w-3 h-3" /> Проект (ID)
              </label>
              <ProjectSearch onSelect={setRelatedProjectId} />
            </div>
          </div>

          {/* Баннер */}
          <div className="pt-2 border-t border-[var(--border)]/50 space-y-1.5">
            <label className="text-[10px] font-bold uppercase text-[var(--muted)] tracking-wider flex items-center gap-1.5">
              <HiPhoto className="w-3 h-3" /> Обложка темы (URL)
            </label>
            <div className="flex gap-2">
              <input 
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                className="flex-1 bg-[var(--surface)] border border-[var(--border)] px-3 py-2 rounded-lg text-sm outline-none focus:border-blue-500"
                placeholder="https://..."
              />
              {bannerUrl && (
                <div className="w-9 h-9 rounded-md border border-[var(--border)] overflow-hidden shrink-0">
                  <img src={bannerUrl} className="w-full h-full object-cover" alt="Preview" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* РЕДАКТОР */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden shadow-sm">
          <div className="bg-[var(--surface)]/50 px-4 py-2 border-b border-[var(--border)] flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase text-[var(--muted)] tracking-widest">Текст сообщения</span>
            <div className="flex gap-3 text-[9px] text-[var(--muted)] font-medium opacity-60 uppercase">
              <span>Markdown</span>
              <span>HTML</span>
            </div>
          </div>
          <DescriptionEditor initialContent="" onSave={handleSave} />
        </div>

        {/* ПРАВИЛА / ИНФО */}
        <div className="flex justify-between items-center px-1 text-[10px] text-[var(--muted)] font-medium">
          <p>Перед публикацией убедитесь, что тема соответствует разделу.</p>
          <p>v.2.0.4</p>
        </div>
      </div>

      {/* ОВЕРЛЕЙ ЗАГРУЗКИ */}
      {loading && (
        <div className="fixed inset-0 bg-[var(--background)]/60 backdrop-blur-md flex items-center justify-center z-[1000]">
          <div className="bg-[var(--card)] border border-[var(--border)] p-5 rounded-2xl shadow-2xl flex flex-col items-center gap-3">
            <HiArrowPath className="animate-spin text-blue-500 w-6 h-6" />
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--foreground-bright)]">Сохранение...</span>
          </div>
        </div>
      )}
    </div>
  );
}