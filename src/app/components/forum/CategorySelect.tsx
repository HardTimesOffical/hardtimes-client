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
  {/* Основная кнопка выпадающего списка */}
  <button
    type="button"
    onClick={() => setIsOpen(!isOpen)}
    className={`w-full flex items-center justify-between bg-[var(--surface)] border ${
      isOpen ? 'border-blue-500 ring-1 ring-blue-500/20' : 'border-[var(--border)]'
    } px-3 py-2 rounded-lg text-[var(--foreground)] transition-all outline-none`}
  >
    <span className={`text-sm ${selected ? 'text-[var(--foreground-bright)] font-medium' : 'text-[var(--muted)]/60'}`}>
      {selected || "Выберите раздел..."}
    </span>
    <HiChevronDown className={`w-4 h-4 text-[var(--muted)] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
  </button>

  {/* Выпадающее меню */}
  {isOpen && (
    <div className="absolute z-[110] w-full mt-1.5 bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
      
      {/* Поле поиска внутри списка */}
      <div className="p-2 border-b border-[var(--border)] bg-[var(--surface)]/30">
        <div className="relative">
          <HiMagnifyingGlass className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--muted)] w-3.5 h-3.5" />
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск раздела..."
            className="w-full bg-[var(--card)] border border-[var(--border)] py-1.5 pl-8 pr-3 rounded-md text-[13px] text-[var(--foreground)] outline-none focus:border-blue-500 transition-all placeholder:opacity-50"
          />
        </div>
      </div>

      {/* Контент с иерархией */}
      <div className="max-h-[280px] overflow-y-auto custom-scrollbar p-1">
        {filteredStructure.map((group) => (
          <div key={group.group} className="mb-1 last:mb-0">
            {/* Заголовок группы */}
            <div className="px-2 py-1.5 text-[9px] font-bold text-[var(--muted)] uppercase tracking-wider flex items-center gap-2 select-none opacity-70">
              <HiFolder className="w-3 h-3" /> {group.group}
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
                  className="w-full flex items-center justify-between px-3 py-2 hover:bg-blue-500/10 rounded-md text-left transition-colors group"
                >
                  <span className={`text-[13px] ${selected === item ? 'text-blue-500 font-semibold' : 'text-[var(--foreground)]'}`}>
                    {item}
                  </span>
                  {selected === item && <HiCheck className="text-blue-500 w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Пустое состояние */}
        {filteredStructure.length === 0 && (
          <div className="py-6 text-center text-[10px] text-[var(--muted)] uppercase tracking-widest font-bold">
            Ничего не найдено
          </div>
        )}
      </div>
    </div>
  )}

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