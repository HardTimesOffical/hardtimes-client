'use client';
import { useState, useEffect } from 'react';
import { LuSearch, LuX, LuCheck } from "react-icons/lu";

interface ProjectSearchProps {
  onSelect: (id: string | null) => void;
}

export default function ProjectSearch({ onSelect }: ProjectSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const search = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        setHasSearched(false);
        return;
      }

      setIsSearching(true);
      setHasSearched(true);

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/projects?search=${encodeURIComponent(query)}&limit=10`);
        const data = await res.json();
        const projectsArray = data.projects || [];
        setResults(projectsArray);
      } catch (err) {
        console.error("Project search error:", err);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(search, 500);
    return () => clearTimeout(timer);
  }, [query]);

  if (selectedProject) {
    return (
      <div className="flex items-center justify-between bg-accent/10 border border-accent/30 p-3 rounded-xl transition-all animate-in fade-in zoom-in duration-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-surface rounded-lg overflow-hidden border border-border flex-shrink-0">
            <img 
              src={selectedProject.iconUrl || '/placeholder-icon.png'} 
              className="w-full h-full object-cover" 
              alt="" 
            />
          </div>
          <div>
            <p className="text-foreground-bright font-bold text-sm leading-tight">{selectedProject.title}</p>
            <p className="text-[10px] text-accent uppercase tracking-widest font-black">Проект привязан</p>
          </div>
        </div>
        <button 
          type="button"
          onClick={() => { setSelectedProject(null); onSelect(null); setQuery(''); }} 
          className="p-2 hover:bg-foreground/10 rounded-full text-muted hover:text-accent transition"
        >
          <LuX size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div className="relative">
        <LuSearch className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isSearching ? 'text-accent' : 'text-muted'}`} />
        <input 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Введите название проекта..."
          className="w-full bg-surface border border-border p-3.5 pl-12 rounded-xl text-foreground outline-none focus:border-accent transition-all placeholder:text-muted"
        />
        {isSearching && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <LuCheck className="animate-spin text-accent" size={18} />
          </div>
        )}
      </div>

      {hasSearched && query.length >= 2 && (
        <div className="absolute z-[100] w-full mt-2 bg-card border border-border rounded-xl overflow-hidden shadow-2xl animate-in slide-in-from-top-2 duration-200">
          {results.length > 0 ? (
            <div className="flex flex-col">
              <div className="px-4 py-2 text-[10px] font-black text-muted uppercase tracking-widest bg-surface border-b border-border">
                Найдено совпадений: {results.length}
              </div>
              
              <div className="max-h-[280px] overflow-y-auto custom-scrollbar">
                {results.map((p) => (
                  <button
                    key={p._id}
                    type="button"
                    onClick={() => { setSelectedProject(p); onSelect(p._id); }}
                    className="w-full flex items-center gap-3 p-3 hover:bg-accent/10 text-left transition border-b border-border last:border-none group"
                  >
                    <img 
                      src={p.iconUrl || '/placeholder-icon.png'} 
                      className="w-9 h-9 rounded-lg bg-surface object-cover border border-border" 
                      alt="" 
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground text-sm font-bold truncate group-hover:text-accent transition-colors">
                        {p.title}
                      </p>
                      <p className="text-[10px] text-muted uppercase">{p.projectType || 'Project'}</p>
                    </div>
                    <LuCheck size={16} className="text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          ) : !isSearching && (
            <div className="p-8 text-center bg-card">
              <p className="text-muted text-sm">Проект с названием «{query}» не найден</p>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--muted);
        }
      `}</style>
    </div>
  );
}