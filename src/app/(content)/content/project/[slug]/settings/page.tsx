'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { HiOutlineCube, HiArrowUp, HiCheck, HiLockClosed, HiChevronDown } from 'react-icons/hi';
import api from '@/lib/api';
import { PROJECT_TYPES_BY_GAME } from '@/constants/projectTypes';

export default function SettingsPage() {
  const { slug } = useParams();
  
  // Данные проекта
  const [project, setProject] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [projectType, setProjectType] = useState("");
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // UI Состояния
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`/projects/${slug}`);
        const data = res.data;
        setProject(data);
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

  // Закрытие селекта при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsSelectOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      setProject(res.data.project);
      setSelectedFile(null);
      alert("Изменения сохранены!");
    } catch (err) {
      alert("Ошибка при сохранении");
    } finally {
      setSaving(false);
    }
  };

  const availableTypes = PROJECT_TYPES_BY_GAME[project?.gameType] || PROJECT_TYPES_BY_GAME['default'];

  if (loading) return <div className="p-8 text-orange-500 font-bold animate-pulse text-center">Загрузка...</div>;

  return (
    <div className="space-y-10 pb-32 bg-white min-h-screen">
      <header>
        <h2 className="text-2xl font-black text-gray-900 mb-1 uppercase tracking-tight">Project information</h2>
        <p className="text-sm text-gray-400 font-semibold tracking-wide uppercase">Core Identification</p>
      </header>

      {/* ICON SECTION */}
      <section className="flex items-center gap-8">
        <div className="relative w-28 h-28 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200 flex items-center justify-center group overflow-hidden transition-all hover:border-orange-300">
          {iconPreview ? (
            <img src={iconPreview} alt="Icon" className="w-full h-full object-cover" />
          ) : (
            <HiOutlineCube size={48} className="text-gray-300" />
          )}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 bg-orange-600/80 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer"
          >
            <HiArrowUp className="text-white" size={28} />
          </div>
        </div>
        
        <div className="space-y-3">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-gray-900 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all"
          >
            Upload New Icon
          </button>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Recommended: 256x256 PNG</p>
        </div>
      </section>

      {/* FORM FIELDS */}
      <div className="space-y-8 max-w-2xl">
        
        {/* Project Type - CUSTOM SELECT */}
        <div className="space-y-2" ref={selectRef}>
          <label className="text-[11px] font-black uppercase text-gray-400 ml-1 tracking-widest">Project Type</label>
          <div className="relative">
            <button
              onClick={() => setIsSelectOpen(!isSelectOpen)}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold flex justify-between items-center hover:border-orange-200 transition-all text-gray-700"
            >
              {availableTypes.find(t => t.value === projectType)?.label || "Выберите тип..."}
              <HiChevronDown className={`transition-transform duration-300 ${isSelectOpen ? 'rotate-180' : ''}`} size={20} />
            </button>

            {isSelectOpen && (
              <div className="absolute z-50 mt-2 w-full bg-white border-2 border-gray-100 rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {availableTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => {
                      setProjectType(type.value);
                      setIsSelectOpen(false);
                    }}
                    className={`w-full px-6 py-4 text-left text-sm font-bold transition-colors hover:bg-orange-50 ${projectType === type.value ? 'bg-orange-50 text-orange-600' : 'text-gray-600'}`}
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
          <label className="text-[11px] font-black uppercase text-gray-400 ml-1 tracking-widest">Project Name</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-orange-400 focus:bg-white outline-none transition-all text-gray-700" 
          />
        </div>

        {/* URL (Slug) - Locked */}
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase text-gray-400 ml-1 tracking-widest">Project URL</label>
          <div className="flex items-center bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 cursor-not-allowed">
             <span className="text-sm font-bold text-gray-300 mr-1 italic">/project/</span>
             <input type="text" className="bg-transparent text-sm font-bold text-gray-400 outline-none flex-1" value={slug} disabled />
             <HiLockClosed className="text-gray-200" size={18} />
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <label className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Summary</label>
            <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${summary.length < 30 ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
               {summary.length}/150
            </span>
          </div>
          <textarea 
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            maxLength={150}
            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:border-orange-400 focus:bg-white outline-none transition-all min-h-[120px] resize-none leading-relaxed text-gray-700"
          />
        </div>
      </div>

      {/* STICKY SAVE BAR */}
      {hasChanges && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-[550px] z-50 px-4">
          <div className="bg-gray-900 border border-white/10 p-2 pl-8 rounded-[2.5rem] shadow-2xl flex justify-between items-center animate-in slide-in-from-bottom-10">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">Careful!</span>
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">You have unsaved changes</span>
            </div>
            <button 
              onClick={handleSave}
              disabled={saving}
              className={`bg-orange-500 hover:bg-orange-400 text-white px-10 py-4 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-orange-500/30 ${saving ? 'opacity-50' : 'active:scale-95'}`}
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}