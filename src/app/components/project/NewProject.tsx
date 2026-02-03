import React, { useState, useEffect } from 'react';
import { HiX, HiChevronDown, HiCheck, HiLink, HiExclamationCircle, HiPlus } from 'react-icons/hi';
import slugify from 'slugify';
import { GAME_PLATFORMS } from '@/constants/project';
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
    if (title) {
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
      const response = await api.post('/projects', { title, summary, gameType, slug });
      if (response.status === 201) {
        onClose();
        router.push(`/content/project/${response.data.slug}/settings`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка валидации');
    } finally {
      setIsLoading(false);
    }
  };

  const platforms = GAME_PLATFORMS || [];
  const selectedGame = platforms.find(g => g.id === gameType) || platforms[0];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Overlay: Deep Blue/Slate */}
      <div className="absolute inset-0 bg-slate-950/60 dark:bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-card border border-border w-full max-w-[400px] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Accent Bar: Blue Gradient (GitHub Style) */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-500/10 rounded-lg text-blue-500">
              <HiPlus size={18} />
            </div>
            <h2 className="text-[15px] font-bold text-foreground">Новый проект</h2>
          </div>
          <button onClick={onClose} className="p-1 text-muted hover:text-foreground transition-colors cursor-pointer">
            <HiX size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
              <HiExclamationCircle size={18} className="shrink-0" />
              <p className="text-xs font-semibold uppercase">{error}</p>
            </div>
          )}

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted uppercase tracking-wider ml-1">Название репозитория</label>
            <input
              type="text" value={title} onChange={(e) => setTitle(e.target.value)} 
              placeholder="Напр: My Awesome Mod"
              className="w-full bg-surface border border-border rounded-lg px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-foreground"
            />
          </div>

          {/* Slug */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted uppercase tracking-wider ml-1">URL-путь</label>
            <div className="flex items-center bg-surface border border-border rounded-lg px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
              <span className="text-sm text-muted font-mono mr-1">p/</span>
              <input
                type="text" value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))} 
                className="w-full bg-transparent text-sm font-mono text-blue-500 outline-none font-bold"
              />
              <HiLink size={16} className="text-muted/40" />
            </div>
          </div>

          {/* Platform */}
          <div className="space-y-1.5 relative">
            <label className="text-xs font-bold text-muted uppercase tracking-wider ml-1">Платформа</label>
            <button 
              type="button" onClick={() => setIsSelectOpen(!isSelectOpen)}
              className="w-full bg-surface border border-border rounded-lg px-3.5 py-2.5 text-sm font-bold flex items-center justify-between hover:bg-border/30 transition-all text-foreground cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{selectedGame?.icon}</span>
                <span>{selectedGame?.label}</span>
              </div>
              <HiChevronDown size={18} className={`text-muted transition-transform ${isSelectOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isSelectOpen && (
              <>
                <div className="fixed inset-0 z-[210]" onClick={() => setIsSelectOpen(false)} />
                <div className="absolute left-0 right-0 z-[220] mt-1 bg-card border border-border rounded-lg shadow-xl py-1 max-h-48 overflow-y-auto">
                  {platforms.map((game) => (
                    <button 
                      key={game.id} type="button"
                      onClick={() => { setGameType(game.id); setIsSelectOpen(false); }}
                      className="w-full px-4 py-2.5 text-sm font-semibold flex items-center justify-between hover:bg-blue-500/10 text-muted hover:text-blue-500 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{game.icon}</span>
                        <span>{game.label}</span>
                      </div>
                      {gameType === game.id && <HiCheck className="text-blue-500" size={16} />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Summary */}
          <div className="space-y-1.5">
            <div className="flex justify-between ml-1">
              <label className="text-xs font-bold text-muted uppercase tracking-wider">Краткая сводка</label>
              <span className={`text-[10px] font-bold ${isSummaryValid ? 'text-blue-500' : 'text-muted'}`}>
                {summary.length}/150
              </span>
            </div>
            <textarea
              value={summary} onChange={(e) => setSummary(e.target.value)} rows={2}
              placeholder="Коротко опишите суть вашего проекта..."
              className="w-full bg-surface border border-border rounded-lg px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-foreground resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 bg-surface border-t border-border flex justify-end">
          <button
            disabled={!canCreate} onClick={handleCreate}
            className={`flex items-center justify-center gap-2 px-8 py-2.5 rounded-lg font-bold text-sm transition-all cursor-pointer ${
              canCreate 
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 active:scale-95' 
                : 'bg-border text-muted cursor-not-allowed opacity-50'
            }`}
          >
            {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Создать проект'}
          </button>
        </div>
      </div>
    </div>
  );
};