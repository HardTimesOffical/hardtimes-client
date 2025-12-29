'use client'
import React from 'react';
import styles from './Pagination.module.css';

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

  // Функция для генерации номеров страниц с пропусками (...)
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const delta = 1; // Сколько страниц показывать слева и справа от текущей

    for (let i = 1; i <= totalPages; i++) {
      // Всегда показываем первую, последнюю и соседние с текущей
      if (
        i === 1 || 
        i === totalPages || 
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } 
      // Добавляем троеточие, если есть пропуск
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
    <div className={styles.pagination}>
      <button 
        className={styles.navBtn} 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ←
      </button>

      <div className={styles.pageNumbers}>
        {visiblePages.map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className={styles.dots}>...</span>
            ) : (
              <button
                className={`${styles.pageBtn} ${currentPage === page ? styles.active : ''}`}
                onClick={() => onPageChange(page as number)}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      <button 
        className={styles.navBtn} 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        →
      </button>
    </div>
  );
}