'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  HiCheckCircle, 
  HiExclamationCircle,
  HiOutlineHashtag
} from 'react-icons/hi2';
import api from '@/lib/api';
import { PROJECT_TAGS } from '@/constants/projectTags';

export default function TagsSettingsPage() {
  const { slug } = useParams();
  
  const [project, setProject] = useState<any>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [initialTags, setInitialTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`/projects/${slug}`);
        const data = res.data;
        setProject(data);
        setSelectedTags(data.tags || []);
        setInitialTags(data.tags || []);
      } catch (err) {
        console.error("Ошибка загрузки:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  const gameKey = project?.gameType?.toLowerCase() || 'minecraft';
  const typeKey = project?.projectType?.toLowerCase() || 'mods';
  const availableTags = PROJECT_TAGS[gameKey]?.[typeKey] || [];

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(prev => prev.filter(t => t !== tagId));
    } else {
      if (selectedTags.length >= 3) {
        showToast('error', 'Можно выбрать максимум 3 тега!');
        return;
      }
      setSelectedTags(prev => [...prev, tagId]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.patch(`/projects/edit/${slug}`, { tags: selectedTags });
      if (res.status === 200 || res.status === 201) {
        setInitialTags(selectedTags);
        showToast('success', 'Теги успешно обновлены!');
      }
    } catch (err: any) {
      showToast('error', err.response?.data?.message || 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const hasChanges = JSON.stringify([...selectedTags].sort()) !== JSON.stringify([...initialTags].sort());

  if (loading) return (
    <div className="p-20 text-center animate-pulse text-[var(--muted)] text-xs font-bold uppercase tracking-widest">
      Загрузка тегов...
    </div>
  );

  return (
    <div className="space-y-8 pb-32 bg-transparent min-h-screen relative transition-colors duration-300">
      {/* Toast */}
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300 px-4 w-full max-w-max">
          <div className={`px-5 py-2.5 rounded-md shadow-2xl flex items-center gap-3 border backdrop-blur-md ${
            toast.type === 'success' ? 'bg-[var(--foreground)] border-[var(--border)] text-[var(--background)]' : 'bg-red-500 border-red-600 text-white'
          }`}>
            {toast.type === 'success' ? <HiCheckCircle className="text-[var(--accent)]" size={18} /> : <HiExclamationCircle size={18} />}
            <span className="text-[10px] font-black uppercase tracking-wider">{toast.msg}</span>
          </div>
        </div>
      )}

      {/* Шапка */}
      <header className="border-b border-[var(--border)] pb-5">
        <h2 className="text-xl font-black text-[var(--foreground-bright)] mb-1 uppercase tracking-tight">Теги проекта</h2>
        <p className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-widest mt-1">
          Игра: <span className="text-[var(--foreground)]">{gameKey}</span> | Категория: <span className="text-[var(--accent)]">{typeKey}</span>
        </p>
      </header>

      {/* Сетка тегов */}
      {availableTags.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {availableTags.map((tag) => {
            const isSelected = selectedTags.includes(tag.id);
            return (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className={`flex items-center justify-between p-3.5 rounded-md border transition-all duration-200 group ${
                  isSelected 
                  ? 'bg-[var(--foreground)] border-[var(--foreground)] shadow-sm' 
                  : 'bg-[var(--surface)] border-[var(--border)] hover:border-[var(--accent)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-md transition-colors ${isSelected ? 'bg-[var(--accent)] text-[var(--contrast-text)]' : 'bg-[var(--card)] text-[var(--muted)] group-hover:text-[var(--accent)]'}`}>
                    <HiOutlineHashtag size={14} />
                  </div>
                  <span className={`text-[11px] font-bold uppercase tracking-wide transition-colors ${isSelected ? 'text-[var(--background)]' : 'text-[var(--foreground)]'}`}>
                    {tag.label}
                  </span>
                </div>
                {isSelected && <HiCheckCircle className="text-[var(--accent)]" size={18} />}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="p-12 border border-dashed border-[var(--border)] rounded-lg text-center text-[var(--muted)] text-[10px] font-bold uppercase tracking-widest">
          Теги не найдены для этой категории
        </div>
      )}

      {/* Панель сохранения */}
      {hasChanges && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-[550px] z-50 px-4">
          <div className="bg-[var(--foreground)] border border-[var(--border)] p-2 pl-6 rounded-lg shadow-2xl flex justify-between items-center animate-in slide-in-from-bottom-6">
            <div className="flex flex-col text-left">
              <span className="text-[9px] font-black uppercase tracking-widest text-[var(--accent)]">Внимание!</span>
              <span className="text-[9px] font-bold text-[var(--background)] opacity-60 uppercase">Теги были изменены</span>
            </div>
            <button 
              onClick={handleSave}
              disabled={saving}
              className={`bg-[var(--accent)] hover:brightness-110 text-[var(--contrast-text)] px-8 py-3 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${saving ? 'opacity-50' : 'active:scale-95'}`}
            >
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}