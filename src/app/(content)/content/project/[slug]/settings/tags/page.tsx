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

  // --- ИСПРАВЛЕННАЯ ЛОГИКА ТУТ ---
  const gameKey = project?.gameType?.toLowerCase() || 'minecraft';
  const typeKey = project?.projectType?.toLowerCase() || 'mods';
  
  // Достаем теги из иерархии: Игра -> Тип
  const availableTags = PROJECT_TAGS[gameKey]?.[typeKey] || [];
  // -------------------------------

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

  if (loading) return <div className="p-20 text-center animate-pulse text-gray-400">Загрузка...</div>;

  return (
    <div className="space-y-8 pb-32 bg-white min-h-screen relative px-4">
      {/* Toast */}
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`px-5 py-2.5 rounded-xl shadow-2xl flex items-center gap-3 border backdrop-blur-md ${
            toast.type === 'success' ? 'bg-gray-900 border-white/10 text-white' : 'bg-red-50 border-red-100 text-red-600'
          }`}>
            {toast.type === 'success' ? <HiCheckCircle className="text-orange-500" size={18} /> : <HiExclamationCircle size={18} />}
            <span className="text-[10px] font-black uppercase tracking-wider">{toast.msg}</span>
          </div>
        </div>
      )}

      {/* Шапка */}
      <header>
        <h2 className="text-xl font-black text-gray-900 mb-1 uppercase tracking-tight">Теги проекта</h2>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
          Игра: <span className="text-gray-900">{gameKey}</span> | Тип: <span className="text-orange-500">{typeKey}</span>
        </p>
      </header>

      {/* Сетка */}
      {availableTags.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {availableTags.map((tag) => {
            const isSelected = selectedTags.includes(tag.id);
            return (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-300 group ${
                  isSelected 
                  ? 'bg-gray-900 border-gray-900 shadow-md' 
                  : 'bg-gray-50 border-gray-100 hover:border-orange-300 hover:bg-white shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-orange-500 text-white' : 'bg-white text-gray-400 group-hover:text-orange-500 shadow-sm'}`}>
                    <HiOutlineHashtag size={14} />
                  </div>
                  <span className={`text-[11px] font-bold uppercase tracking-wide ${isSelected ? 'text-white' : 'text-gray-500 group-hover:text-gray-900'}`}>
                    {tag.label}
                  </span>
                </div>
                {isSelected && <HiCheckCircle className="text-orange-500" size={18} />}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="p-10 border-2 border-dashed border-gray-100 rounded-3xl text-center text-gray-400 text-xs font-bold uppercase">
          Теги не найдены для этой категории
        </div>
      )}

      {/* Кнопка сохранения (без изменений) */}
      {hasChanges && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 px-4">
          <div className="bg-gray-900 border border-white/10 p-1.5 pl-6 rounded-2xl shadow-2xl flex justify-between items-center">
            <div className="flex flex-col text-left">
              <span className="text-[9px] font-black uppercase text-orange-500">Несохраненные данные</span>
              <span className="text-[9px] font-bold text-white/40 uppercase">Теги были изменены</span>
            </div>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="bg-orange-500 hover:bg-orange-400 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
            >
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}