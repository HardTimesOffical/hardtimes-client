'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { 
  HiOutlineCube, 
  HiArrowUp, 
  HiCheck, 
  HiLockClosed, 
  HiChevronDown,
  HiCheckCircle,
  HiExclamationCircle 
} from 'react-icons/hi';
import api from '@/lib/api';
import { PROJECT_TYPES_BY_GAME } from '@/constants/projectTypes';
import { useRouter } from 'next/navigation';
import { useProject } from './ProjectContext';

export default function SettingsPage() {
  const { slug } = useParams();
  
  // Данные проекта
  const { project, updateProject } = useProject();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [projectType, setProjectType] = useState("");
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();

  // UI Состояния
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`/projects/${slug}`);
        const data = res.data;
        updateProject(data);
        setTitle(data.title);
        setSummary(data.summary || "");
        setProjectType(data.projectType || "");
        setIconPreview(data.iconUrl || null);
      } catch (err) {
        console.error("Ошибка загрузки:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  useEffect(() => {
    if (!project) return;
    const isChanged = 
      title !== project.title || 
      summary !== (project.summary || "") || 
      projectType !== project.projectType ||
      selectedFile !== null;
    setHasChanges(isChanged);
  }, [title, summary, projectType, selectedFile, project]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsSelectOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setIconPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('summary', summary);
    formData.append('projectType', projectType);
    if (selectedFile) formData.append('icon', selectedFile);

    try {
      const res = await api.patch(`/projects/edit/${slug}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      updateProject(res.data.project);
      setSelectedFile(null);
      showToast('success', 'Изменения успешно сохранены!');
      router.refresh(); 

    } catch (err) {
      showToast('error', 'Ошибка при сохранении изменений');
    } finally {
      setSaving(false);
    }
  };

  const availableTypes = PROJECT_TYPES_BY_GAME[project?.gameType] || PROJECT_TYPES_BY_GAME['default'];

  if (loading) return (
    <div className="p-8 text-[var(--accent)] font-bold animate-pulse text-center uppercase tracking-widest text-xs">
      Загрузка...
    </div>
  );

  return (
    <div className="space-y-10 pb-32 bg-transparent transition-colors duration-300 relative">
      
      {/* Toast Notification */}
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

      <header className="border-b border-[var(--border)] pb-5">
        <h2 className="text-xl font-black text-[var(--foreground-bright)] mb-1 uppercase tracking-tight">
          Информация о проекте
        </h2>
        <p className="text-[10px] text-[var(--muted)] font-bold tracking-widest uppercase">
          Основная идентификация и брендинг
        </p>
      </header>

      {/* ICON SECTION */}
      <section className="flex flex-col sm:flex-row items-center gap-8">
        <div className="relative w-28 h-28 bg-[var(--surface)] rounded-2xl border border-[var(--border)] flex items-center justify-center group overflow-hidden transition-all hover:border-[var(--accent)]">
          {iconPreview ? (
            <img src={iconPreview} alt="Иконка" className="w-full h-full object-cover" />
          ) : (
            <HiOutlineCube size={40} className="text-[var(--muted)] opacity-50" />
          )}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 bg-[var(--accent)]/90 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer"
          >
            <HiArrowUp className="text-[var(--contrast-text)]" size={24} />
          </div>
        </div>
        
        <div className="space-y-3 text-center sm:text-left">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-[var(--foreground)] hover:bg-[var(--accent)] text-[var(--background)] px-5 py-2.5 rounded-md text-[11px] font-black uppercase tracking-widest transition-all active:scale-95"
          >
            Загрузить иконку
          </button>
          <p className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-widest">
            Рекомендуется: 256x256 PNG
          </p>
        </div>
      </section>

      {/* FORM FIELDS */}
      <div className="space-y-6 max-w-2xl">
        
        {/* Project Type */}
        <div className="space-y-2" ref={selectRef}>
          <label className="text-[10px] font-black uppercase text-[var(--muted)] ml-1 tracking-widest">
            Тип проекта
          </label>
          <div className="relative">
            <button
              onClick={() => setIsSelectOpen(!isSelectOpen)}
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-md px-4 py-3 text-sm font-bold flex justify-between items-center hover:border-[var(--accent)] transition-all text-[var(--foreground)]"
            >
              {availableTypes.find(t => t.value === projectType)?.label || "Выберите тип..."}
              <HiChevronDown className={`transition-transform duration-300 ${isSelectOpen ? 'rotate-180' : ''}`} size={18} />
            </button>

            {isSelectOpen && (
              <div className="absolute z-50 mt-1 w-full bg-[var(--card)] border border-[var(--border)] rounded-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {availableTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => {
                      setProjectType(type.value);
                      setIsSelectOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left text-xs font-bold transition-colors hover:bg-[var(--surface)] ${projectType === type.value ? 'text-[var(--accent)] bg-[var(--surface)]' : 'text-[var(--foreground)]'}`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Name */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-[var(--muted)] ml-1 tracking-widest">
            Название проекта
          </label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-md px-4 py-3 text-sm font-bold focus:border-[var(--accent)] outline-none transition-all text-[var(--foreground)]" 
          />
        </div>

        {/* URL (Slug) */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-[var(--muted)] ml-1 tracking-widest">
            URL Проекта
          </label>
          <div className="flex items-center bg-[var(--surface)] border border-[var(--border)] rounded-md px-4 py-3 cursor-not-allowed opacity-60">
              <span className="text-sm font-bold text-[var(--muted)] mr-1 italic">/project/</span>
              <input type="text" className="bg-transparent text-sm font-bold text-[var(--foreground)] outline-none flex-1" value={slug} disabled />
              <HiLockClosed className="text-[var(--muted)]" size={16} />
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <label className="text-[10px] font-black uppercase text-[var(--muted)] tracking-widest">
              Краткое описание
            </label>
            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${summary.length < 30 ? 'bg-[var(--accent)]/10 text-[var(--accent)]' : 'bg-green-500/10 text-green-500'}`}>
               {summary.length}/150
            </span>
          </div>
          <textarea 
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            maxLength={150}
            className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-md px-4 py-3 text-sm font-bold focus:border-[var(--accent)] outline-none transition-all min-h-[100px] resize-none leading-relaxed text-[var(--foreground)]"
          />
        </div>
      </div>

      {/* STICKY SAVE BAR */}
      {hasChanges && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-[600px] z-50 px-4">
          <div className="bg-[var(--foreground)] border border-[var(--border)] p-1.5 pl-6 rounded-lg shadow-2xl flex justify-between items-center animate-in slide-in-from-bottom-6">
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--accent)]">
                Внимание!
              </span>
              <span className="text-[10px] font-bold text-[var(--background)] opacity-70 uppercase tracking-widest">
                У вас есть несохраненные изменения
              </span>
            </div>
            <button 
              onClick={handleSave}
              disabled={saving}
              className={`bg-[var(--accent)] hover:brightness-110 text-[var(--contrast-text)] px-8 py-3 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${saving ? 'opacity-50' : 'active:scale-95'}`}
            >
              {saving ? 'Сохранение...' : 'Сохранить изменения'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}