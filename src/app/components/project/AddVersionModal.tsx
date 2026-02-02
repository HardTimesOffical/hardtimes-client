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

    if (!file) return alert("Выберите файл");

   const formData = new FormData();
    formData.append('file', file); // Имя должно быть 'file'
    formData.append('versionNumber', versionNumber || '');
    formData.append('releaseType', releaseType || 'release');
    formData.append('changelog', changelog || '');
    formData.append('environment', environment || 'both');

    // Массивы ОБЯЗАТЕЛЬНО как JSON-строки
    formData.append('loaders', JSON.stringify(selectedLoaders || []));
    formData.append('gameVersions', JSON.stringify(selectedGameVersions || []));

    try {
      await api.post(`/projects/${project.slug}/versions`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },});
      onRefresh();
      onClose();
    } catch (err) {
      alert("Ошибка при сохранении версии");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredVersions = availableVersions.filter((v: string) => 
    v.toLowerCase().includes(searchVer.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white text-gray-900 w-full max-w-xl rounded-[2.5rem] shadow-2xl border border-gray-100 my-auto animate-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* HEADER */}
        <div className="p-6 border-b border-gray-50">
          <div className="flex justify-between items-center mb-6">
            <nav className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {steps.map((s, i) => (
                <div key={s} className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${step === s ? 'text-orange-500' : 'text-gray-300'}`}>
                    {s}
                  </span>
                  {i < steps.length - 1 && <div className="w-1 h-1 rounded-full bg-gray-200" />}
                </div>
              ))}
            </nav>
            <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full text-gray-400 transition-colors">
              <HiX size={20} />
            </button>
          </div>
          {/* Progress Bar */}
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-orange-500 transition-all duration-500 ease-out" 
              style={{ width: `${((steps.indexOf(step) + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
          
          {step === 'Files' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-[2rem] py-12 transition-all cursor-pointer text-center
                  ${file ? 'border-orange-500 bg-orange-50/30' : 'border-gray-100 hover:border-orange-300 hover:bg-gray-50/50'}
                `}
              >
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={(e) => {
                        const selectedFile = e.target.files?.[0];
                        if (selectedFile) {
                        console.log("Файл выбран:", selectedFile.name, selectedFile.size); // Проверь лог здесь
                        setFile(selectedFile); 
                        setTimeout(handleNext, 400);
                        }
                    }} 
                    />
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${file ? 'bg-orange-500 text-white' : 'bg-gray-50 text-gray-400'}`}>
                  <HiCloudUpload size={32} />
                </div>
                <h3 className="text-sm font-black uppercase tracking-tight text-gray-800">Загрузить основной файл</h3>
                <p className="text-xs text-gray-400 mt-2 font-medium px-6">{file ? file.name : 'Перетащите .jar, .zip или .mrpack файл сюда'}</p>
              </div>
            </div>
          )}

          {step === 'Loaders' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-[11px] font-black uppercase text-gray-400 tracking-widest mb-4">Доступные загрузчики</h3>
              <div className="grid grid-cols-2 gap-3">
                {availableLoaders.map((loader: any) => {
                  const active = selectedLoaders.includes(loader.id);
                  return (
                    <button key={loader.id} onClick={() => setSelectedLoaders(prev => active ? prev.filter(id => id !== loader.id) : [...prev, loader.id])}
                      className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between text-xs font-bold
                        ${active ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-50 bg-gray-50/50 text-gray-500 hover:border-gray-200'}
                      `}>
                      {loader.label}
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${active ? 'bg-orange-500 border-orange-500' : 'bg-white border-gray-200'}`}>
                        {active && <HiCheck size={12} className="text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 'Environment' && (
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-[11px] font-black uppercase text-gray-400 tracking-widest mb-4">Среда выполнения</h3>
              {[
                { id: 'client', label: 'Client', desc: 'Для установки только на сторону игрока.', icon: <HiDesktopComputer size={20}/> },
                { id: 'server', label: 'Server', desc: 'Для серверных ядер и прокси.', icon: <HiServer size={20}/> },
                { id: 'both', label: 'Universal', desc: 'Подходит для обеих сторон.', icon: <div className="flex gap-0.5"><HiDesktopComputer size={12}/><HiServer size={12}/></div> }
              ].map((opt) => (
                <button key={opt.id} onClick={() => setEnvironment(opt.id as any)}
                  className={`w-full p-5 rounded-2xl border-2 text-left transition-all flex gap-4 items-center
                    ${environment === opt.id ? 'border-orange-500 bg-orange-50 shadow-sm' : 'border-gray-50 bg-gray-50/50 hover:bg-gray-100/50'}
                  `}>
                  <div className={`p-3 rounded-xl ${environment === opt.id ? 'bg-orange-500 text-white' : 'bg-white text-gray-400'}`}>{opt.icon}</div>
                  <div>
                    <div className={`text-xs font-black uppercase tracking-tight ${environment === opt.id ? 'text-orange-600' : 'text-gray-700'}`}>{opt.label}</div>
                    <div className="text-[10px] text-gray-400 font-bold mt-0.5">{opt.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {step === 'Versions' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Версии игры</h3>
                <div className="relative">
                  <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                  <input type="text" placeholder="Поиск..." value={searchVer} onChange={e => setSearchVer(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[11px] font-bold outline-none focus:border-orange-300 w-36 transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredVersions.map((v: string) => {
                  const active = selectedGameVersions.includes(v);
                  return (
                    <button key={v} onClick={() => setSelectedGameVersions(prev => active ? prev.filter(id => id !== v) : [...prev, v])}
                      className={`py-3 rounded-xl border-2 text-[10px] font-black transition-all
                        ${active ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-gray-50 border-gray-50 text-gray-400 hover:border-gray-200'}
                      `}>
                      {v}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 'Details' && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Версия</label>
                  <input type="text" placeholder="1.0.0" value={versionNumber} onChange={e => setVersionNumber(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-xs font-bold outline-none focus:border-orange-500 focus:bg-white transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Тип релиза</label>
                  <select value={releaseType} onChange={e => setReleaseType(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-xs font-bold outline-none focus:border-orange-500 focus:bg-white appearance-none cursor-pointer transition-all">
                    <option value="release">Release</option>
                    <option value="beta">Beta</option>
                    <option value="alpha">Alpha</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Список изменений</label>
                <textarea placeholder="Опишите, что нового в этом обновлении..." value={changelog} onChange={e => setChangelog(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-4 text-xs font-medium outline-none focus:border-orange-500 focus:bg-white h-32 resize-none transition-all" />
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-6 bg-gray-50/50 border-t border-gray-50 flex justify-between items-center">
          <button disabled={step === steps[0]} onClick={handleBack}
            className="flex items-center gap-2 text-[11px] font-black uppercase text-gray-400 hover:text-gray-900 disabled:opacity-0 transition-all">
            <HiArrowLeft size={16} /> Назад
          </button>
          <button 
            onClick={step === steps[steps.length - 1] ? handleSubmit : handleNext}
            disabled={(step === 'Files' && !file) || isSubmitting}
            className={`px-10 py-4 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2
              ${(step === 'Files' && !file) || isSubmitting 
                ? 'bg-gray-200 text-gray-400' 
                : 'bg-gray-900 text-white hover:bg-orange-500 shadow-xl shadow-gray-200 hover:shadow-orange-500/20'}
            `}
          >
            {isSubmitting ? 'Загрузка...' : step === steps[steps.length - 1] ? 'Опубликовать' : 'Далее'} <HiArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}