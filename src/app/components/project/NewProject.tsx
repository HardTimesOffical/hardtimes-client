import React, { useState, useEffect } from 'react';
import { HiX, HiChevronDown, HiCheck, HiLink, HiSparkles, HiExclamationCircle } from 'react-icons/hi';
import slugify from 'slugify';
import { GAME_PLATFORMS } from '../../../constants/project';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';


export const NewProject: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [gameType, setGameType] = useState('minecraft');
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (title && !slug) {
      setSlug(slugify(title, { lower: true, strict: true, locale: 'ru' }));
    }
  }, [title]);

  if (!isOpen) return null;

  const minLen = 10;
  const isSummaryValid = summary.length >= minLen;
  const canCreate = title.length >= 3 && slug.length >= 3 && isSummaryValid && !isLoading;

 const handleCreate = async () => {
    if (!canCreate) return;
    setIsLoading(true);
    setError(null);

    try {
      // Отправляем данные в том формате, который ждет Mongoose
        const response = await api.post('/projects', {
        title,
        summary,
        gameType, // Бэкенд ждет именно это название
        slug      // Передаем кастомный слаг
        });

      if (response.status === 201) {
        onClose();
        router.push(`/content/project/${response.data.slug}/settings`);
      }
    } catch (err: any) {
      // Выводим более подробную ошибку валидации, если она пришла
      const serverMsg = err.response?.data?.errors 
        ? Object.values(err.response.data.errors).map((e: any) => e.message).join(', ')
        : (err.response?.data?.message || 'Ошибка валидации');
      
      setError(serverMsg);
      console.error("Validation Error Details:", err.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedGame = GAME_PLATFORMS.find(g => g.id === gameType);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 font-sans">
      <div className="bg-white border border-gray-200 w-full max-w-[320px] rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
              <HiSparkles size={16} />
            </div>
            <h2 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Новый проект</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors">
            <HiX size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-2xl animate-pulse">
              <HiExclamationCircle className="text-red-600 shrink-0" size={16} />
              <p className="text-[10px] font-bold text-red-700 uppercase leading-tight">{error}</p>
            </div>
          )}

          {/* Название */}
          <div className="space-y-1">
            <label className="text-[9px] uppercase font-black text-gray-500 ml-1">Название</label>
            <input
              type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Напр: Hard Mod"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] font-bold text-gray-900 focus:border-orange-500 focus:bg-white outline-none transition-all"
            />
          </div>

          {/* Slug */}
          <div className="space-y-1">
            <label className="text-[9px] uppercase font-black text-gray-500 ml-1">URL адрес</label>
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-orange-500 focus-within:bg-white transition-all">
              <span className="text-[12px] text-gray-400 font-bold select-none mr-1 italic">p/</span>
              <input
                type="text" value={slug} 
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))} 
                placeholder="url-name" 
                className="w-full bg-transparent text-[13px] font-bold text-orange-600 outline-none"
              />
              <HiLink size={14} className="text-gray-300" />
            </div>
          </div>

          {/* Платформа */}
          <div className="space-y-1 relative">
            <label className="text-[9px] uppercase font-black text-gray-500 ml-1">Платформа</label>
            <button 
              onClick={() => setIsSelectOpen(!isSelectOpen)}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-[13px] font-bold text-gray-900 flex items-center justify-between hover:border-orange-200 transition-all"
            >
              <div className="flex items-center gap-2">
                <span>{selectedGame?.icon}</span>
                <span className="text-gray-900">{selectedGame?.label}</span>
              </div>
              <HiChevronDown size={16} className="text-gray-400" />
            </button>
            {isSelectOpen && (
              <div className="absolute z-[210] w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl p-1 max-h-[160px] overflow-y-auto">
                {GAME_PLATFORMS.map((game) => (
                  <button 
                    key={game.id} 
                    onClick={() => { setGameType(game.id); setIsSelectOpen(false); }}
                    className="w-full px-3 py-2 text-[12px] font-bold text-left flex items-center justify-between hover:bg-orange-50 rounded-lg transition-colors"
                  >
                    <span className={gameType === game.id ? 'text-orange-600' : 'text-gray-700'}>{game.label}</span>
                    {gameType === game.id && <HiCheck className="text-orange-600" size={14} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Описание + Счетчик */}
          <div className="space-y-1">
            <div className="flex justify-between items-center px-1">
              <label className="text-[9px] uppercase font-black text-gray-500">Сводка</label>
              <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${isSummaryValid ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                {isSummaryValid ? 'OK' : `ЕЩЕ ${minLen - summary.length}`}
              </span>
            </div>
            <textarea
              value={summary} onChange={(e) => setSummary(e.target.value)} rows={2} maxLength={150}
              placeholder="Коротко о проекте..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] font-medium text-gray-900 focus:border-orange-500 focus:bg-white outline-none transition-all resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50/50 border-t border-gray-100">
          <button
            disabled={!canCreate} onClick={handleCreate}
            className={`w-full py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex justify-center items-center shadow-lg ${
              canCreate ? 'bg-gray-900 text-white hover:bg-orange-600 active:scale-95 shadow-orange-100' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'СОЗДАТЬ'}
          </button>
        </div>
      </div>
    </div>
  );
};