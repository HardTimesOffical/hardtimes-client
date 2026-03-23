'use client';
import { useState, useEffect } from 'react';
import { HiMagnifyingGlass, HiXMark, HiCheck } from "react-icons/hi2";

interface ProjectSearchProps {
  onSelect: (id: string | null) => void;
}

export default function ProjectSearch({ onSelect }: ProjectSearchProps) {
  const [query,           setQuery]           = useState('');
  const [results,         setResults]         = useState<any[]>([]);
  const [selected,        setSelected]        = useState<any>(null);
  const [isSearching,     setIsSearching]     = useState(false);
  const [hasSearched,     setHasSearched]     = useState(false);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (query.trim().length < 2) { setResults([]); setHasSearched(false); return; }
      setIsSearching(true);
      setHasSearched(true);
      try {
        const res  = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/projects?search=${encodeURIComponent(query)}&limit=10`);
        const data = await res.json();
        setResults(data.projects || []);
      } catch { setResults([]); }
      finally { setIsSearching(false); }
    }, 500);
    return () => clearTimeout(t);
  }, [query]);

  // ── Выбранный проект ─────────────────────────────────────────
  if (selected) {
    return (
      <div className="flex items-center justify-between border border-border bg-surface p-2.5 gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 border border-border bg-card overflow-hidden shrink-0">
            <img src={selected.iconUrl || '/placeholder-icon.png'}
              className="w-full h-full object-cover" alt="" />
          </div>
          <div className="min-w-0">
            <p className="font-standard font-bold text-[12px] text-foreground-bright truncate">
              {selected.title}
            </p>
            <p className="font-mc-pixel text-[7px] text-muted/50 uppercase tracking-wider mt-0.5">
              Проект привязан
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => { setSelected(null); onSelect(null); setQuery(''); }}
          className="w-6 h-6 flex items-center justify-center border border-border
            text-muted hover:text-foreground-bright hover:border-foreground/30
            transition-colors shrink-0"
        >
          <HiXMark className="w-3 h-3" />
        </button>
      </div>
    );
  }

  // ── Поиск ────────────────────────────────────────────────────
  return (
    <div className="relative w-full">
      <div className="relative">
        <HiMagnifyingGlass
          className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none transition-colors"
          style={{ color: isSearching ? '#5aac44' : 'var(--muted)' }}
        />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Название проекта…"
          className="w-full bg-surface border border-border pl-9 pr-3 py-2
            font-standard text-[13px] text-foreground outline-none
            placeholder:text-muted/40 focus:border-[#5aac44] transition-colors"
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-3 h-3 border border-[#5aac44] border-t-transparent animate-spin" />
          </div>
        )}
      </div>

      {/* Дропдаун результатов */}
      {hasSearched && query.length >= 2 && (
        <div className="absolute z-[100] w-full mt-[2px] bg-card border-2 border-border
          shadow-[4px_4px_0_rgba(0,0,0,0.5)] overflow-hidden">

          {results.length > 0 ? (
            <>
              {/* Шапка */}
              <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-surface">
                <div className="w-1 h-1 bg-border shrink-0" />
                <span className="font-mc-pixel text-[8px] text-muted/50 uppercase tracking-widest">
                  Найдено: {results.length}
                </span>
              </div>

              {/* Список */}
              <div className="max-h-[260px] overflow-y-auto"
                style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--border) transparent' }}>
                {results.map(p => (
                  <button
                    key={p._id}
                    type="button"
                    onClick={() => { setSelected(p); onSelect(p._id); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left
                      border-b border-border/40 last:border-0 group transition-colors"
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--surface)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ''}
                  >
                    <div className="w-8 h-8 border border-border bg-surface overflow-hidden shrink-0">
                      <img src={p.iconUrl || '/placeholder-icon.png'}
                        className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-standard font-bold text-[12px] text-foreground truncate
                        group-hover:text-[#5aac44] transition-colors">
                        {p.title}
                      </p>
                      <p className="font-mc-pixel text-[7px] text-muted/50 uppercase tracking-wider mt-0.5">
                        {p.projectType || 'Project'}
                      </p>
                    </div>
                    <HiCheck className="w-3.5 h-3.5 text-muted/0 group-hover:text-muted/40
                      transition-colors shrink-0" />
                  </button>
                ))}
              </div>
            </>
          ) : !isSearching && (
            <div className="py-8 flex flex-col items-center gap-2">
              <span className="font-mc-pixel text-[9px] text-muted/40 uppercase tracking-widest">
                «{query}» не найден
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}