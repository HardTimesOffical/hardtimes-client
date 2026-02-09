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
        showToast('success', 'Ссылки успешно обновлены');
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
      <div className="w-12 h-12 bg-[var(--surface)] rounded-xl mx-auto mb-4 border border-[var(--border)]" />
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)]">Синхронизация...</p>
    </div>
  );

  return (
    <div className="space-y-10 pb-40 min-h-screen relative animate-in fade-in duration-500">
      
      {/* Унифицированный Toast */}
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

      <header className="border-b border-[var(--border)] pb-8">
        <h2 className="text-2xl font-black text-[var(--foreground-bright)] mb-1 uppercase tracking-tight">Внешние ссылки</h2>
        <p className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-widest">Социальные сети и документация</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 max-w-4xl">
        <LinkInput 
          label="Исходный код"
          placeholder="https://github.com/..."
          icon={<HiOutlineCodeBracket size={20} />}
          value={links.sourceCode}
          onChange={(val: string) => handleInputChange('sourceCode', val)}
        />

        <LinkInput 
          label="Wiki / Документация"
          placeholder="https://docs.example.com"
          icon={<HiOutlineBookOpen size={20} />}
          value={links.wiki}
          onChange={(val: string) => handleInputChange('wiki', val)}
        />

        <LinkInput 
          label="Discord Server"
          placeholder="https://discord.gg/..."
          icon={<FaDiscord size={20} />}
          value={links.discord}
          onChange={(val: string) => handleInputChange('discord', val)}
        />

        <LinkInput 
          label="Telegram"
          placeholder="https://t.me/..."
          icon={<FaTelegramPlane size={20} />}
          value={links.telegram}
          onChange={(val: string) => handleInputChange('telegram', val)}
        />

        <div className="md:col-span-2">
            <LinkInput 
              label="Поддержка / Донаты"
              placeholder="https://donationalerts.com/..."
              icon={<HiOutlineHeart size={20} />}
              value={links.donation}
              onChange={(val: string) => handleInputChange('donation', val)}
            />
        </div>
      </div>

      {/* STICKY SAVE BAR */}
      {hasChanges && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-[600px] z-50 px-4">
          <div className="bg-[var(--foreground)] border border-[var(--border)] p-2 pl-8 rounded-xl shadow-2xl flex justify-between items-center animate-in slide-in-from-bottom-10 duration-500">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent)]">Есть изменения</span>
              <span className="text-[9px] font-bold text-[var(--background)] opacity-50 uppercase tracking-widest">Не забудьте обновить профиль</span>
            </div>
            <button 
              onClick={handleSave}
              disabled={saving}
              className={`
                bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--contrast-text)] 
                px-10 py-4 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-sm
                ${saving ? 'opacity-50 cursor-not-allowed' : 'active:scale-95 hover:-translate-y-0.5'}
              `}
            >
              {saving ? 'Сохранение...' : 'Сохранить ссылки'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function LinkInput({ label, placeholder, icon, value, onChange }: { 
  label: string, 
  placeholder: string, 
  icon: React.ReactNode, 
  value: string, 
  onChange: (val: string) => void 
}) {
  return (
    <div className="space-y-2 group">
      <label className="text-[9px] font-black uppercase text-[var(--muted)] ml-1 tracking-[0.15em] transition-colors group-focus-within:text-[var(--accent)]">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--muted)] group-focus-within:text-[var(--accent)] transition-all duration-300">
          {icon}
        </div>
        <input 
          type="text" 
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="
            w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl pl-14 pr-6 py-4 
            text-[13px] font-bold outline-none transition-all
            focus:border-[var(--accent)] focus:bg-[var(--card)] focus:shadow-[0_0_20px_rgba(0,0,0,0.02)]
            text-[var(--foreground)] placeholder:text-[var(--muted)] placeholder:opacity-30
          "
        />
      </div>
    </div>
  );
}