'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import DescriptionEditor from '@/app/components/project/DescriptionEditor';
import ProjectSearch from '@/app/components/forum/ProjectSearch';
import CategorySelect from '@/app/components/forum/CategorySelect';

// Heroicons 2
import { 
  HiPhoto, 
  HiPencilSquare, 
  HiLink,
  HiArrowPath,
  HiDocumentPlus
} from "react-icons/hi2";

export default function CreateForumPostPage() {
  const { accessToken, user } = useAuth();
  const router = useRouter();
  
  // Состояния формы
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [relatedProjectId, setRelatedProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async (htmlContent: string) => {
    // Валидация
    if (!title.trim()) return alert("Введите заголовок темы");
    if (!category) return alert("Выберите раздел форума");
    if (htmlContent.length < 20) return alert("Содержание темы слишком короткое");

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

      const data = await res.json();

      if (res.ok) {
        router.push(`/forum/${data.post.slug}`);
      } else {
        alert(data.message || "Ошибка при публикации");
      }
    } catch (err) {
      console.error("Publish error:", err);
      alert("Не удалось связаться с сервером");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-[var(--muted)]">
        <HiArrowPath className="animate-spin mb-4 w-8 h-8 text-[var(--accent)]" />
        <p className="font-bold uppercase tracking-widest text-sm">Загрузка профиля...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-8 animate-in fade-in duration-500">
      
      {/* СЕКЦИЯ НАСТРОЕК */}
      <div className="bg-[var(--card)] p-6 md:p-8 rounded-3xl border border-[var(--border)] shadow-xl space-y-8 relative overflow-visible">
        {/* Декоративный элемент фона */}
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
          <HiDocumentPlus size={120} />
        </div>

        <div className="flex flex-col gap-1 relative z-10">
          <h1 className="text-3xl font-black text-[var(--foreground-bright)] uppercase tracking-tighter italic">
            Создание темы
          </h1>
          <p className="text-[var(--muted)] text-sm">Заполните детали публикации для форума</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-30"> {/* Увеличили z-index до 30 */}
           <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-[0.2em] text-[var(--muted)] flex items-center gap-2">
              <HiPencilSquare className="text-[var(--accent)] w-4 h-4" /> Заголовок
            </label>
            <input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[var(--surface)] border border-[var(--border)] p-4 rounded-2xl text-[var(--foreground)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all placeholder:text-[var(--muted)]/40"
              placeholder="Как назвать вашу тему?"
            />
          </div>

          {/* КАСТОМНЫЙ СЕЛЕКТ КАТЕГОРИЙ */}
          <div className="space-y-3 relative z-50"> {/* Контейнеру селекта даем z-50 */}
            <CategorySelect 
              selected={category} 
              onSelect={(val) => setCategory(val)} 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            {/* ССЫЛКА НА БАННЕР */}
            <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-[var(--muted)] flex items-center gap-2">
                    <HiPhoto className="text-[var(--accent)] w-4 h-4" /> Баннер (URL)
                </label>
                <input 
                    value={bannerUrl}
                    onChange={(e) => setBannerUrl(e.target.value)}
                    className="w-full bg-[var(--surface)] border border-[var(--border)] p-4 rounded-2xl text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-all placeholder:text-[var(--muted)]/40"
                    placeholder="https://imgur.com/your-image.png"
                />
            </div>

            {/* ПОИСК ПРОЕКТОВ ДЛЯ ПРИВЯЗКИ */}
            <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-[var(--muted)] flex items-center gap-2">
                    <HiLink className="text-[var(--accent)] w-4 h-4" /> Привязать проект
                </label>
                <ProjectSearch onSelect={(id) => setRelatedProjectId(id)} />
            </div>
        </div>

        {/* ПРЕДПРОСМОТР ОБЛОЖКИ */}
        {bannerUrl && (
          <div className="mt-4 rounded-2xl overflow-hidden h-48 w-full border border-[var(--border)] bg-[var(--surface)] shadow-inner relative group">
            <img 
              src={bannerUrl} 
              alt="Banner" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              onError={(e) => e.currentTarget.style.display='none'} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)]/80 to-transparent flex items-end p-6">
               <span className="text-[var(--foreground-bright)] text-[10px] font-black uppercase tracking-widest opacity-60">Предпросмотр обложки</span>
            </div>
          </div>
        )}
      </div>

      {/* РЕДАКТОР КОНТЕНТА */}
      <div className="bg-[var(--card)] rounded-3xl border border-[var(--border)] overflow-hidden shadow-xl">
        <div className="p-4 border-b border-[var(--border)] bg-[var(--surface)] flex items-center justify-between">
            <div className="flex items-center gap-2">
                <HiPencilSquare className="text-[var(--accent)] w-4 h-4" />
                <span className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">Содержание обсуждения</span>
            </div>
            <span className="text-[10px] text-[var(--muted)] uppercase font-bold tracking-wider">Markdown & HTML поддерживаются</span>
        </div>
        
        {/* Сюда передается функция handleSave которая срабатывает при нажатии кнопки в редакторе */}
        <DescriptionEditor initialContent="" onSave={handleSave} />
      </div>

      {/* ЭКРАН ЗАГРУЗКИ ПРИ ОТПРАВКЕ */}
      {loading && (
        <div className="fixed inset-0 bg-[var(--background)]/90 backdrop-blur-xl flex flex-col items-center justify-center z-[999] animate-in fade-in duration-300">
          <div className="relative">
            <HiArrowPath className="animate-spin text-[var(--accent)]" size={64} />
            <div className="absolute inset-0 blur-2xl bg-[var(--accent)]/20 rounded-full animate-pulse"></div>
          </div>
          <div className="mt-6 text-[var(--foreground-bright)] font-black uppercase tracking-[0.3em] text-sm animate-pulse">
            Публикация темы...
          </div>
        </div>
      )}
    </div>
  );
}