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
  // Рассчитываем общее количество страниц на основе totalItems от сервера
  const totalPages = Math.ceil(totalItems / pageSize);

  // Если страница всего одна, пагинацию не показываем
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const delta = 1; // Сколько страниц показывать рядом с текущей

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
        // Добавляем троеточие, только если его еще нет в массиве
        if (pages[pages.length - 1] !== '...') {
          pages.push('...');
        }
      }
    }
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-center gap-2 select-none" translate="no">
      {/* Кнопка "Назад" */}
      <button 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-9 h-9 rounded-xl border border-border bg-surface text-muted transition-all hover:border-accent hover:text-accent disabled:opacity-30 disabled:hover:border-border disabled:hover:text-muted shadow-sm active:scale-90"
      >
        <HiChevronLeft className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-1.5">
        {visiblePages.map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="w-8 text-center text-muted/30 font-black tracking-widest text-[10px]">
                ...
              </span>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                className={`
                  min-w-[36px] h-9 px-2 rounded-xl text-[11px] font-black transition-all border uppercase
                  ${currentPage === page 
                    ? 'bg-accent border-accent text-contrast-text shadow-md shadow-accent/20' 
                    : 'bg-surface border-border text-muted hover:border-accent/50 hover:text-foreground shadow-sm'
                  }
                `}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Кнопка "Вперед" */}
      <button 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-9 h-9 rounded-xl border border-border bg-surface text-muted transition-all hover:border-accent hover:text-accent disabled:opacity-30 disabled:hover:border-border disabled:hover:text-muted shadow-sm active:scale-90"
      >
        <HiChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}