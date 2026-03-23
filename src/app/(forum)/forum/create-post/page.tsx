'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import DescriptionEditor from '@/app/components/project/DescriptionEditor';
import ProjectSearch from '@/app/components/forum/ProjectSearch';
import CategorySelect from '@/app/components/forum/CategorySelect';
import { HiPhoto, HiLink, HiArrowPath } from "react-icons/hi2";

const MC_BTN: React.CSSProperties = {
  background: '#3c8527',
  boxShadow: 'inset 1px 1px 0 #5aac44, inset -1px -1px 0 #2a5e1a, 0 2px 0 #2a5e1a',
  color: '#fff',
};

export default function CreateForumPostPage() {
  const { accessToken, user } = useAuth();
  const router = useRouter();

  const [title,             setTitle]             = useState('');
  const [category,          setCategory]          = useState('');
  const [bannerUrl,         setBannerUrl]         = useState('');
  const [relatedProjectId,  setRelatedProjectId]  = useState<string | null>(null);
  const [loading,           setLoading]           = useState(false);

  const handleSave = async (htmlContent: string) => {
    if (!title.trim() || !category || htmlContent.length < 20) {
      alert("Заполните заголовок, выберите категорию и напишите текст (минимум 20 символов).");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/forum/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ title, content: htmlContent, category, bannerUrl, relatedProject: relatedProjectId }),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/forum/${data.post.slug}`);
      } else {
        const err = await res.json();
        alert(err.message || "Ошибка при публикации");
      }
    } catch { alert("Не удалось связаться с сервером"); }
    finally { setLoading(false); }
  };

  if (!user) return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-2">
      <HiArrowPath className="animate-spin w-5 h-5 text-muted" />
      <span className="font-mc-pixel text-[9px] text-muted uppercase tracking-widest">Загрузка…</span>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 pt-20">

      {/* ── Заголовок страницы ── */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-[3px] h-7 shrink-0"
          style={{ background: 'linear-gradient(to bottom, #5aac44, #2a5e1a)' }} />
        <div>
          <h1 className="font-mc-title text-foreground-bright"
            style={{ fontSize: 'clamp(14px, 2vw, 18px)', textShadow: '2px 2px 0 rgba(0,0,0,0.3)' }}>
            Создание темы
          </h1>
          <p className="font-standard text-[11px] text-muted mt-0.5">
            Новое обсуждение
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">

        {/* ── Блок параметров ── */}
        <div className="bg-card border border-border flex flex-col gap-4 p-4">

          {/* Заголовок темы */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mc-pixel text-[8px] uppercase tracking-widest text-muted/60">
              Название темы
            </label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-surface border border-border px-3 py-2
                font-standard text-[13px] text-foreground outline-none
                placeholder:text-muted/40 focus:border-[#5aac44] transition-colors"
              placeholder="Введите краткий и понятный заголовок"
            />
          </div>

          {/* Раздел + Проект */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-mc-pixel text-[8px] uppercase tracking-widest text-muted/60">
                Раздел
              </label>
              <CategorySelect selected={category} onSelect={setCategory} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mc-pixel text-[8px] uppercase tracking-widest text-muted/60 flex items-center gap-1">
                <HiLink className="w-3 h-3" /> Проект (необязательно)
              </label>
              <ProjectSearch onSelect={setRelatedProjectId} />
            </div>
          </div>

          {/* Обложка */}
          <div className="flex flex-col gap-1.5 pt-3 border-t border-border">
            <label className="font-mc-pixel text-[8px] uppercase tracking-widest text-muted/60 flex items-center gap-1">
              <HiPhoto className="w-3 h-3" /> Обложка темы — URL
            </label>
            <div className="flex gap-2">
              <input
                value={bannerUrl}
                onChange={e => setBannerUrl(e.target.value)}
                className="flex-1 bg-surface border border-border px-3 py-2
                  font-standard text-[13px] text-foreground outline-none
                  placeholder:text-muted/40 focus:border-[#5aac44] transition-colors"
                placeholder="https://…"
              />
              {bannerUrl && (
                <div className="w-9 h-9 border border-border overflow-hidden shrink-0">
                  <img src={bannerUrl} className="w-full h-full object-cover" alt="Preview" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Редактор ── */}
        <div className="bg-card border border-border overflow-hidden">
          {/* Шапка редактора */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-surface">
            <div className="flex items-center gap-2">
              <div className="w-[3px] h-3 shrink-0"
                style={{ background: 'linear-gradient(to bottom, #5aac44, #2a5e1a)' }} />
              <span className="font-mc-pixel text-[8px] uppercase tracking-widest text-muted/60">
                Текст сообщения
              </span>
            </div>
            <div className="flex gap-3">
              {['Markdown', 'HTML'].map(l => (
                <span key={l} className="font-mc-pixel text-[7px] text-muted/30 uppercase">{l}</span>
              ))}
            </div>
          </div>
          <DescriptionEditor initialContent="" onSave={handleSave} />
        </div>

        {/* ── Подсказка ── */}
        <div className="flex items-center justify-between px-1">
          <p className="font-standard text-[11px] text-muted/50">
            Убедитесь, что тема соответствует выбранному разделу.
          </p>
          <span className="font-mc-pixel text-[7px] text-muted/20 uppercase">v2.0.4</span>
        </div>
      </div>

      {/* ── Оверлей загрузки ── */}
      {loading && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-card border-2 border-border p-6 flex flex-col items-center gap-3
            shadow-[4px_4px_0_rgba(0,0,0,0.6)]">
            <HiArrowPath className="animate-spin w-5 h-5" style={{ color: '#5aac44' }} />
            <span className="font-mc-pixel text-[9px] text-muted uppercase tracking-widest">
              Публикация…
            </span>
          </div>
        </div>
      )}
    </div>
  );
}