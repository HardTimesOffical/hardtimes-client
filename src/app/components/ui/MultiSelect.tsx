'use client';

import React, { useState } from 'react';
import { HiCheck, HiChevronDown } from 'react-icons/hi';

interface MultiSelectProps {
  label: string;
  values: string[];
  options: { id: string; label: string }[];
  onChange: (id: string) => void;
  placeholder?: string; // Теперь опционально, так как список открыт
}

export default function MultiSelect({ label, values, options, onChange }: MultiSelectProps) {
  // По умолчанию открыт (развернут)
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="space-y-3">
      {/* Заголовок-кнопка для сворачивания/разворачивания всего блока */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between group outline-none"
      >
        <div className="flex items-center gap-2">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground-bright border-l-2 border-accent pl-2 transition-colors group-hover:text-accent">
            {label}
          </h3>
          {/* Счетчик выбранных, если блок свернут */}
          {!isExpanded && values.length > 0 && (
            <span className="text-[9px] bg-green-500/20 text-green-500 px-1.5 py-0.5 rounded-full font-bold">
              {values.length}
            </span>
          )}
        </div>
        <HiChevronDown 
          className={`text-muted transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
          size={14} 
        />
      </button>
      
      {/* Список опций (отображается, если развернуто) */}
      {isExpanded && (
        <div className="flex flex-col gap-1 overflow-y-auto max-h-64 custom-scrollbar pr-1 animate-in slide-in-from-top-1 duration-200">
          {options.map((opt) => {
            const isActive = values.includes(opt.id);
            return (
              <button
                key={opt.id}
                onClick={() => onChange(opt.id)}
                className={`
                  flex items-center justify-between px-3 py-2 text-[11px] font-semibold rounded transition-all
                  ${isActive 
                    ? 'bg-green-500/10 text-green-500' 
                    : 'text-muted hover:bg-surface hover:text-foreground-bright'}
                `}
              >
                <span className="truncate mr-2">{opt.label}</span>
                {isActive && (
                  <HiCheck size={14} className="shrink-0 animate-in zoom-in duration-200" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}