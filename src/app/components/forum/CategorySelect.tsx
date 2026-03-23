'use client';
import { useState, useRef, useEffect } from 'react';
import { HiChevronDown, HiCheck, HiMagnifyingGlass } from "react-icons/hi2";

const FORUM_STRUCTURE = [
  {
    group: "Поиск и команды",
    items: ["Ищу напарника", "Ищу друга", "Набираю команду", "Поиск персонала"]
  },
  {
    group: "Игровой мир",
    items: ["Обсуждение игр", "Технические проблемы", "Гайды и туториалы", "Новости индустрии"]
  },
  {
    group: "Разработка и творчество",
    items: ["Моддинг", "Дизайн и графика", "Скрипты и код", "Ресурспаки и ассеты"]
  },
  {
    group: "Продвижение",
    items: ["Пиар серверов", "Реклама каналов", "Обзоры проектов"]
  },
  {
    group: "Общение",
    items: ["Флудильня", "Беседка", "Форумные игры", "Вопросы и предложения"]
  }
];

interface CategorySelectProps {
  selected: string;
  onSelect: (category: string) => void;
}

export default function CategorySelect({ selected, onSelect }: CategorySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const filtered = FORUM_STRUCTURE.map(g => ({
    ...g,
    items: g.items.filter(i => i.toLowerCase().includes(search.toLowerCase()))
  })).filter(g => g.items.length > 0);

  return (
    <div className="relative w-full" ref={ref}>

      {/* ── Кнопка ── */}
      <button
        type="button"
        onClick={() => setIsOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-2 border-2 transition-colors duration-100"
        style={{
          background: 'var(--surface)',
          borderColor: isOpen ? '#5aac44' : 'var(--border)',
          outline: 'none',
        }}
      >
        <span className="font-standard text-[13px]"
          style={{ color: selected ? 'var(--foreground-bright)' : 'var(--muted)' }}>
          {selected || "Выберите раздел…"}
        </span>
        <HiChevronDown
          className="w-3.5 h-3.5 text-muted transition-transform duration-150 shrink-0"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {/* ── Выпадающее меню ── */}
      {isOpen && (
        <div className="absolute z-[110] w-full mt-[2px] bg-card border-2 border-border shadow-[4px_4px_0_rgba(0,0,0,0.5)] overflow-hidden">

          {/* Поиск */}
          <div className="p-2 border-b border-border">
            <div className="relative">
              <HiMagnifyingGlass className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted pointer-events-none" />
              <input
                autoFocus
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Поиск раздела…"
                className="w-full bg-surface border border-border pl-8 pr-3 py-1.5
                  font-standard text-[13px] text-foreground outline-none
                  placeholder:text-muted/40 transition-colors duration-100
                  focus:border-[#5aac44]"
              />
            </div>
          </div>

          {/* Список */}
          <div className="max-h-[280px] overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--border) transparent' }}>
            {filtered.length > 0 ? filtered.map(group => (
              <div key={group.group}>

                {/* Заголовок группы */}
                <div className="flex items-center gap-2 px-3 py-2 border-b border-border/40 select-none">
                  {/* Пиксельный маркер */}
                  <div className="w-1 h-1 bg-border shrink-0" />
                  <span className="font-mc-pixel text-[8px] uppercase tracking-widest text-muted/50">
                    {group.group}
                  </span>
                </div>

                {/* Пункты */}
                {group.items.map(item => {
                  const active = selected === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => { onSelect(item); setIsOpen(false); setSearch(''); }}
                      className="w-full flex items-center justify-between px-4 py-2 text-left
                        transition-colors duration-100 border-b border-border/20 last:border-0"
                      style={active ? {
                        background: '#3c8527',
                        color: '#fff',
                      } : undefined}
                      onMouseEnter={e => {
                        if (!active) (e.currentTarget as HTMLElement).style.background = 'var(--surface)';
                      }}
                      onMouseLeave={e => {
                        if (!active) (e.currentTarget as HTMLElement).style.background = '';
                      }}
                    >
                      <span className="font-standard text-[13px]"
                        style={{ color: active ? '#fff' : 'var(--foreground)' }}>
                        {item}
                      </span>
                      {active && <HiCheck className="w-3 h-3 shrink-0" style={{ color: '#fff' }} />}
                    </button>
                  );
                })}
              </div>
            )) : (
              <div className="py-8 flex flex-col items-center gap-2">
                <span className="font-mc-pixel text-[9px] text-muted/40 uppercase tracking-widest">
                  Ничего не найдено
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}