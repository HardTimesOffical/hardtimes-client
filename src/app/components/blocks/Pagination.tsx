'use client'
import React from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ 
  currentPage, 
  totalItems, 
  pageSize, 
  onPageChange 
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize);

  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const delta = 1; 

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || 
        i === totalPages || 
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } 
      else if (
        i === currentPage - delta - 1 || 
        i === currentPage + delta + 1
      ) {
        if (pages[pages.length - 1] !== '...') {
          pages.push('...');
        }
      }
    }
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-center gap-2 select-none py-4" translate="no">
      {/* Кнопка "Назад" - исправлено центрирование */}
      <button 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-10 h-10 bg-[#242424] border border-white/5 text-zinc-500 transition-all hover:border-[#5a6e60]/50 hover:text-white disabled:opacity-20 disabled:pointer-events-none active:scale-90"
      >
        {/* МЕСТО ДЛЯ ПИКСЕЛЬНОЙ СТРЕЛКИ ВЛЕВО */}
        <HiChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-2">
        {visiblePages.map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="w-8 text-center text-zinc-700 font-bold tracking-[0.2em] text-[10px]">
                ...
              </span>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                className={`
                  min-w-[40px] h-10 px-3 text-[11px] font-bold transition-all border uppercase flex items-center justify-center
                  ${currentPage === page 
                    ? 'bg-white border-white text-[#1a1a1a] shadow-lg' 
                    : 'bg-[#242424] border-white/5 text-zinc-400 hover:border-zinc-600 hover:text-white'
                  }
                `}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Кнопка "Вперед" - исправлено центрирование */}
      <button 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-10 h-10 bg-[#242424] border border-white/5 text-zinc-500 transition-all hover:border-[#5a6e60]/50 hover:text-white disabled:opacity-20 disabled:pointer-events-none active:scale-90"
      >
        {/* МЕСТО ДЛЯ ПИКСЕЛЬНОЙ СТРЕЛКИ ВПРАВО */}
        <HiChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}