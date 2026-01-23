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
        pages.push('...');
      }
    }
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-center gap-2 mt-10 select-none" translate="no">
      {/* Кнопка "Назад" */}
      <button 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-100 bg-white text-gray-500 transition-all hover:border-orange-200 hover:text-orange-500 disabled:opacity-30 disabled:hover:border-gray-100 disabled:hover:text-gray-500 shadow-sm"
      >
        <HiChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-1.5">
        {visiblePages.map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="w-10 text-center text-gray-300 font-bold tracking-widest">
                ...
              </span>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                className={`
                  min-w-[40px] h-10 px-2 rounded-xl text-xs font-black transition-all
                  ${currentPage === page 
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' 
                    : 'bg-white border border-gray-100 text-gray-500 hover:border-orange-200 hover:text-orange-500 shadow-sm'
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
        className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-100 bg-white text-gray-500 transition-all hover:border-orange-200 hover:text-orange-500 disabled:opacity-30 disabled:hover:border-gray-100 disabled:hover:text-gray-500 shadow-sm"
      >
        <HiChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}