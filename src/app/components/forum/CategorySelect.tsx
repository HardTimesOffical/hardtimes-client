'use client';
import { useState, useRef, useEffect } from 'react';
import { 
  HiSquares2X2, 
  HiChevronDown, 
  HiCheck, 
  HiMagnifyingGlass, 
  HiFolder 
} from "react-icons/hi2";

// Универсальная структура категорий (без привязки к конкретной игре)
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
  const containerRef = useRef<HTMLDivElement>(null);

  // Закрытие при клике вне области компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Фильтрация структуры по поисковому запросу
  const filteredStructure = FORUM_STRUCTURE.map(group => ({
    ...group,
    items: group.items.filter(item => 
      item.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(group => group.items.length > 0);

  return (
    <div className="relative w-full" ref={containerRef}>
      <label className="text-xs font-black uppercase tracking-widest text-[var(--muted)] flex items-center gap-2 mb-3">
        <HiSquares2X2 className="text-[var(--accent)] w-4 h-4" /> Раздел форума
      </label>

      {/* Основная кнопка выпадающего списка */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-[var(--surface)] border ${
          isOpen ? 'border-[var(--accent)] shadow-[0_0_0_1px_var(--accent)]' : 'border-[var(--border)]'
        } p-4 rounded-xl text-[var(--foreground)] transition-all outline-none`}
      >
        <span className={selected ? 'text-[var(--foreground-bright)] font-semibold' : 'text-[var(--muted)]/50'}>
          {selected || "Выберите раздел..."}
        </span>
        <HiChevronDown className={`w-5 h-5 text-[var(--muted)] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Выпадающее меню */}
      {isOpen && (
        <div className="absolute z-[110] w-full mt-2 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Поле поиска внутри списка */}
          <div className="p-3 border-b border-[var(--border)] bg-[var(--surface)]/50">
            <div className="relative">
              <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)] w-4 h-4" />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск раздела..."
                className="w-full bg-[var(--card)] border border-[var(--border)] p-2.5 pl-9 rounded-lg text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-all"
              />
            </div>
          </div>

          {/* Контент с иерархией */}
          <div className="max-h-[350px] overflow-y-auto custom-scrollbar p-1">
            {filteredStructure.map((group) => (
              <div key={group.group} className="mb-2 last:mb-0">
                {/* Заголовок группы (Иерархия) */}
                <div className="px-3 py-2 text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.15em] flex items-center gap-2 select-none">
                  <HiFolder className="w-3 h-3 text-[var(--muted)]/50" /> {group.group}
                </div>
                
                {/* Подпункты */}
                <div className="space-y-0.5">
                  {group.items.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        onSelect(item);
                        setIsOpen(false);
                        setSearch('');
                      }}
                      className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-[var(--accent)]/10 rounded-lg text-left transition-colors group"
                    >
                      <span className={`text-sm ${selected === item ? 'text-[var(--accent)] font-bold' : 'text-[var(--foreground)]'}`}>
                        {item}
                      </span>
                      {selected === item && <HiCheck className="text-[var(--accent)] w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Состояние "Ничего не найдено" */}
            {filteredStructure.length === 0 && (
              <div className="p-8 text-center text-xs text-[var(--muted)] uppercase tracking-widest font-bold">
                Разделы не найдены
              </div>
            )}
          </div>
        </div>
      )}

      {/* Локальные стили для аккуратного скроллбара */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
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