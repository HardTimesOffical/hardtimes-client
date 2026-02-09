'use client';
import { useState, useRef } from 'react';
import { HiX, HiArrowLeft, HiArrowRight, HiCloudUpload, HiCheck, HiSearch, HiDesktopComputer, HiServer } from 'react-icons/hi';
import { LOADERS_BY_GAME } from '@/constants/loaders';
import { GAME_VERSIONS } from '@/constants/gameVersions';
import api from '@/lib/api';

type Step = 'Files' | 'Loaders' | 'Environment' | 'Versions' | 'Details';

const GAME_NAME_MAP: Record<string, string> = {
  'minecraft': 'Minecraft Java',
  'hytale': 'Hytale'
};

export default function AddVersionModal({ project, onClose, onRefresh }: any) {
  const [step, setStep] = useState<Step>('Files');
  const [file, setFile] = useState<File | null>(null);
  const [selectedLoaders, setSelectedLoaders] = useState<string[]>([]);
  const [selectedGameVersions, setSelectedGameVersions] = useState<string[]>([]);
  const [environment, setEnvironment] = useState<'client' | 'server' | 'both'>('both');
  const [versionNumber, setVersionNumber] = useState('');
  const [releaseType, setReleaseType] = useState('release');
  const [changelog, setChangelog] = useState('');
  const [searchVer, setSearchVer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!project) return null;

  const gType = project.gameType?.toLowerCase();
  const pType = project.projectType?.toLowerCase();
  const availableLoaders = LOADERS_BY_GAME[gType]?.[pType] || [];
  const hasLoaders = availableLoaders.length > 0;
  const vKey = GAME_NAME_MAP[gType] || gType;
  const availableVersions = GAME_VERSIONS[vKey] || [];

  const steps: Step[] = ['Files'];
  if (hasLoaders) steps.push('Loaders');
  if (gType === 'minecraft') steps.push('Environment');
  steps.push('Versions', 'Details');

  const handleNext = () => {
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) setStep(steps[currentIndex + 1]);
  };

  const handleBack = () => {
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) setStep(steps[currentIndex - 1]);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!file) {
        setIsSubmitting(false);
        return alert("Выберите файл");
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('versionNumber', versionNumber || '');
    formData.append('releaseType', releaseType || 'release');
    formData.append('changelog', changelog || '');
    formData.append('environment', environment || 'both');
    formData.append('loaders', JSON.stringify(selectedLoaders || []));
    formData.append('gameVersions', JSON.stringify(selectedGameVersions || []));

    try {
      await api.post(`/projects/${project.slug}/versions`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      // Вызываем обновление и закрываем
      if (onRefresh) await onRefresh(); 
      onClose();
    } catch (err) {
      console.error(err);
      alert("Ошибка при сохранении версии");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredVersions = availableVersions.filter((v: string) => 
    v.toLowerCase().includes(searchVer.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[var(--card)] text-[var(--foreground)] w-full max-w-xl rounded-2xl shadow-2xl border border-[var(--border)] my-auto animate-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* HEADER */}
        <div className="p-6 border-b border-[var(--border)] bg-[var(--surface)]/30">
          <div className="flex justify-between items-center mb-6">
            <nav className="flex items-center gap-3 overflow-x-auto no-scrollbar">
              {steps.map((s, i) => (
                <div key={s} className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-[10px] font-black uppercase tracking-[0.15em] transition-colors ${step === s ? 'text-[var(--accent)]' : 'text-[var(--muted)]'}`}>
                    {s}
                  </span>
                  {i < steps.length - 1 && <div className="w-1 h-1 rounded-full bg-[var(--border)]" />}
                </div>
              ))}
            </nav>
            <button onClick={onClose} className="p-2 hover:bg-[var(--surface)] rounded-md text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
              <HiX size={20} />
            </button>
          </div>
          <div className="h-1 w-full bg-[var(--border)] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[var(--accent)] transition-all duration-500 ease-out" 
              style={{ width: `${((steps.indexOf(step) + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar bg-[var(--card)]">
          
          {step === 'Files' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`group border-2 border-dashed rounded-2xl py-14 transition-all cursor-pointer text-center
                  ${file ? 'border-[var(--accent)] bg-[var(--accent)]/5' : 'border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--surface)]'}
                `}
              >
                <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => {
                    const selectedFile = e.target.files?.[0];
                    if (selectedFile) {
                      setFile(selectedFile); 
                      setTimeout(handleNext, 400);
                    }
                }} />
                <div className={`w-16 h-16 mx-auto mb-5 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${file ? 'bg-[var(--accent)] text-[var(--contrast-text)] shadow-lg shadow-[var(--accent)]/20' : 'bg-[var(--surface)] text-[var(--muted)]'}`}>
                  <HiCloudUpload size={32} />
                </div>
                <h3 className="text-[11px] font-black uppercase tracking-widest text-[var(--foreground)]">Загрузить основной файл</h3>
                <p className="text-[10px] text-[var(--muted)] mt-2 font-bold px-10 leading-relaxed italic">{file ? file.name : 'Перетащите .jar, .zip или .mrpack файл сюда'}</p>
              </div>
            </div>
          )}

          {step === 'Loaders' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
              <h3 className="text-[10px] font-black uppercase text-[var(--muted)] tracking-widest mb-4">Доступные загрузчики</h3>
              <div className="grid grid-cols-2 gap-3">
                {availableLoaders.map((loader: any) => {
                  const active = selectedLoaders.includes(loader.id);
                  return (
                    <button key={loader.id} onClick={() => setSelectedLoaders(prev => active ? prev.filter(id => id !== loader.id) : [...prev, loader.id])}
                      className={`p-4 rounded-xl border transition-all flex items-center justify-between text-[11px] font-black uppercase tracking-tight
                        ${active ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]' : 'border-[var(--border)] bg-[var(--surface)]/50 text-[var(--muted)] hover:border-[var(--muted)]/50'}
                      `}>
                      {loader.label}
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${active ? 'bg-[var(--accent)] border-[var(--accent)]' : 'bg-[var(--card)] border-[var(--border)]'}`}>
                        {active && <HiCheck size={12} className="text-[var(--contrast-text)]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 'Environment' && (
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-300">
              <h3 className="text-[10px] font-black uppercase text-[var(--muted)] tracking-widest mb-4">Среда выполнения</h3>
              {[
                { id: 'client', label: 'Client', desc: 'Только на сторону игрока.', icon: <HiDesktopComputer size={20}/> },
                { id: 'server', label: 'Server', desc: 'Для серверных ядер и прокси.', icon: <HiServer size={20}/> },
                { id: 'both', label: 'Universal', desc: 'Подходит для всех сторон.', icon: <div className="flex gap-0.5"><HiDesktopComputer size={12}/><HiServer size={12}/></div> }
              ].map((opt) => (
                <button key={opt.id} onClick={() => setEnvironment(opt.id as any)}
                  className={`w-full p-4 rounded-xl border text-left transition-all flex gap-4 items-center
                    ${environment === opt.id ? 'border-[var(--accent)] bg-[var(--accent)]/5 shadow-sm' : 'border-[var(--border)] bg-[var(--surface)]/50 hover:bg-[var(--surface)]'}
                  `}>
                  <div className={`p-3 rounded-lg ${environment === opt.id ? 'bg-[var(--accent)] text-[var(--contrast-text)]' : 'bg-[var(--card)] text-[var(--muted)] border border-[var(--border)]'}`}>{opt.icon}</div>
                  <div>
                    <div className={`text-[11px] font-black uppercase tracking-tight ${environment === opt.id ? 'text-[var(--accent)]' : 'text-[var(--foreground)]'}`}>{opt.label}</div>
                    <div className="text-[9px] text-[var(--muted)] font-bold mt-0.5 uppercase tracking-wide opacity-70">{opt.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {step === 'Versions' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-[10px] font-black uppercase text-[var(--muted)] tracking-widest">Версии игры</h3>
                <div className="relative">
                  <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={14} />
                  <input type="text" placeholder="Поиск..." value={searchVer} onChange={e => setSearchVer(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[10px] font-black uppercase tracking-wider outline-none focus:border-[var(--accent)] w-36 transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredVersions.map((v: string) => {
                  const active = selectedGameVersions.includes(v);
                  return (
                    <button key={v} onClick={() => setSelectedGameVersions(prev => active ? prev.filter(id => id !== v) : [...prev, v])}
                      className={`py-3 rounded-lg border text-[9px] font-black transition-all
                        ${active ? 'bg-[var(--accent)] border-[var(--accent)] text-[var(--contrast-text)] shadow-md' : 'bg-[var(--surface)] border-[var(--border)] text-[var(--muted)] hover:border-[var(--muted)]/50'}
                      `}>
                      {v}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 'Details' && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-300">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[var(--muted)] uppercase ml-1 tracking-widest">Версия</label>
                  <input type="text" placeholder="1.0.0" value={versionNumber} onChange={e => setVersionNumber(e.target.value)}
                    className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3.5 text-[11px] font-black outline-none focus:border-[var(--accent)] focus:bg-[var(--card)] transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-[var(--muted)] uppercase ml-1 tracking-widest">Тип релиза</label>
                  <select value={releaseType} onChange={e => setReleaseType(e.target.value)}
                    className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3.5 text-[11px] font-black outline-none focus:border-[var(--accent)] focus:bg-[var(--card)] appearance-none cursor-pointer transition-all uppercase tracking-wider">
                    <option value="release">Release</option>
                    <option value="beta">Beta</option>
                    <option value="alpha">Alpha</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-[var(--muted)] uppercase ml-1 tracking-widest">Список изменений</label>
                <textarea placeholder="Опишите, что нового..." value={changelog} onChange={e => setChangelog(e.target.value)}
                  className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-4 text-[11px] font-medium outline-none focus:border-[var(--accent)] focus:bg-[var(--card)] h-32 resize-none transition-all custom-scrollbar" />
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-6 bg-[var(--surface)]/50 border-t border-[var(--border)] flex justify-between items-center">
          <button disabled={step === steps[0]} onClick={handleBack}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--muted)] hover:text-[var(--foreground)] disabled:opacity-0 transition-all">
            <HiArrowLeft size={16} /> Назад
          </button>
          <button 
            onClick={step === steps[steps.length - 1] ? handleSubmit : handleNext}
            disabled={(step === 'Files' && !file) || isSubmitting}
            className={`px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 active:scale-95
              ${(step === 'Files' && !file) || isSubmitting 
                ? 'bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)] opacity-50 cursor-not-allowed' 
                : 'bg-[var(--foreground)] text-[var(--background)] hover:bg-[var(--accent)] hover:text-[var(--contrast-text)] shadow-lg shadow-black/10'}
            `}
          >
            {isSubmitting ? 'Загрузка...' : step === steps[steps.length - 1] ? 'Опубликовать' : 'Далее'} <HiArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}