'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  HiOutlineBookOpen, 
  HiOutlineHeart,
  HiOutlineCodeBracket,
  HiCheckCircle,
  HiExclamationCircle
} from 'react-icons/hi2';
import { FaDiscord, FaTelegramPlane } from 'react-icons/fa';
import api from '@/lib/api';

export default function LinksSettingsPage() {
  const { slug } = useParams();
  
  const [project, setProject] = useState<any>(null);
  const [links, setLinks] = useState({
    sourceCode: '',
    wiki: '',
    discord: '',
    telegram: '',
    donation: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Состояние для тоаста
  const [toast, setToast] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`/projects/${slug}`);
        const data = res.data;
        setProject(data);
        setLinks({
          sourceCode: data.links?.sourceCode || '',
          wiki: data.links?.wiki || '',
          discord: data.links?.discord || '',
          telegram: data.links?.telegram || '',
          donation: data.links?.donation || ''
        });
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
      links.sourceCode !== (project.links?.sourceCode || '') ||
      links.wiki !== (project.links?.wiki || '') ||
      links.discord !== (project.links?.discord || '') ||
      links.telegram !== (project.links?.telegram || '') ||
      links.donation !== (project.links?.donation || '');
    setHasChanges(isChanged);
  }, [links, project]);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const handleInputChange = (field: string, value: string) => {
    setLinks(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.patch(`/projects/edit/${slug}`, { links });
      if (res.status === 200 || res.status === 201) {
        setProject(res.data.project);
        showToast('success', 'Ссылки успешно обновлены!');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Ошибка при сохранении';
      showToast('error', errorMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="p-20 text-center animate-pulse">
      <div className="w-12 h-12 bg-gray-100 rounded-2xl mx-auto mb-4" />
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Загрузка данных...</p>
    </div>
  );

  return (
    <div className="space-y-10 pb-32 bg-white min-h-screen relative">
      
      {/* Кастомный Toast */}
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
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

      <header>
        <h2 className="text-2xl font-black text-gray-900 mb-1 uppercase tracking-tight italic">External Connections</h2>
        <p className="text-sm text-gray-400 font-semibold tracking-wide uppercase">Social & Documentation Links</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        <LinkInput 
          label="Source Code"
          placeholder="https://github.com/..."
          icon={<HiOutlineCodeBracket size={20} />}
          value={links.sourceCode}
          onChange={(val: string) => handleInputChange('sourceCode', val)} // Фикс any
        />

        <LinkInput 
          label="Wiki / Docs"
          placeholder="https://docs.example.com"
          icon={<HiOutlineBookOpen size={20} />}
          value={links.wiki}
          onChange={(val: string) => handleInputChange('wiki', val)} // Фикс any
        />

        <LinkInput 
          label="Discord Server"
          placeholder="https://discord.gg/..."
          icon={<FaDiscord size={20} />}
          value={links.discord}
          onChange={(val: string) => handleInputChange('discord', val)} // Фикс any
        />

        <LinkInput 
          label="Telegram"
          placeholder="https://t.me/..."
          icon={<FaTelegramPlane size={20} />}
          value={links.telegram}
          onChange={(val: string) => handleInputChange('telegram', val)} // Фикс any
        />

        <LinkInput 
          label="Donation"
          placeholder="https://donationalerts.com/..."
          icon={<HiOutlineHeart size={20} />}
          value={links.donation}
          onChange={(val: string) => handleInputChange('donation', val)} // Фикс any
        />
      </div>

      {/* STICKY SAVE BAR */}
      {hasChanges && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-[550px] z-50 px-4">
          <div className="bg-gray-900 border border-white/10 p-2 pl-8 rounded-[2.5rem] shadow-2xl flex justify-between items-center animate-in slide-in-from-bottom-10 duration-500">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">Unsaved Links</span>
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Update project presence</span>
            </div>
            <button 
              onClick={handleSave}
              disabled={saving}
              className={`bg-orange-500 hover:bg-orange-400 text-white px-10 py-4 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-orange-500/30 ${saving ? 'opacity-50' : 'active:scale-95'}`}
            >
              {saving ? 'Updating...' : 'Save links'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Вспомогательный компонент с исправленным типом onChange
function LinkInput({ label, placeholder, icon, value, onChange }: { 
  label: string, 
  placeholder: string, 
  icon: React.ReactNode, 
  value: string, 
  onChange: (val: string) => void 
}) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase text-gray-400 ml-1 tracking-widest">{label}</label>
      <div className="relative group">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors">
          {icon}
        </div>
        <input 
          type="text" 
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold focus:border-orange-400 focus:bg-white outline-none transition-all text-gray-700 placeholder:text-gray-300"
        />
      </div>
    </div>
  );
}