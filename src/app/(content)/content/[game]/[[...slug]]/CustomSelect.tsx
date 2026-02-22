'use client';

import React, { useState, useRef, useEffect } from 'react';
import { HiChevronDown } from 'react-icons/hi';

interface Option {
  id: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: Option[];
  label?: string;
}

export default function CustomSelect({ value, onChange, options, label }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.id === value);

  return (
    <div className="space-y-2" ref={containerRef}>
      {label && (
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted px-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full flex items-center justify-between 
            bg-surface border rounded px-4 py-2.5 
            text-xs font-semibold transition-all outline-none
            ${isOpen ? 'border-accent ring-2 ring-accent/5' : 'border-border hover:border-muted'}
          `}
        >
          <span className="text-foreground-bright">
            {selectedOption ? selectedOption.label : 'Выберите...'}
          </span>
          <HiChevronDown 
            className={`text-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
            size={16} 
          />
        </button>

        {isOpen && (
          <div className="
            absolute top-full left-0 w-full mt-1.5 
            bg-card border border-border rounded-md shadow-xl 
            z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200
          ">
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {options.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    onChange(opt.id);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full text-left px-4 py-2.5 text-xs font-medium transition-colors
                    ${value === opt.id 
                      ? 'bg-accent text-contrast-text' 
                      : 'text-muted hover:bg-surface hover:text-foreground-bright'}
                  `}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}