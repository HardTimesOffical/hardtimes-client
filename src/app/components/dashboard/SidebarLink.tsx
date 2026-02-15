'use client';
import React, { memo } from 'react';
import Link from 'next/link';
import { IconType } from 'react-icons';

interface SidebarItem {
  href: string;
  name: string;
  icon: IconType;
  color?: string;
  count?: number;
}

interface SidebarLinkProps {
  item: SidebarItem;
  isExpanded: boolean;
  isActive: boolean;
  isForum?: boolean;
}

const SidebarLink = memo(({ item, isExpanded, isActive, isForum }: SidebarLinkProps) => {
  const Icon = item.icon;
  
  return (
    <Link 
      href={item.href} 
      className={`flex items-center transition-all duration-200 group relative
        ${isExpanded ? 'h-9 px-3 gap-3 rounded-lg' : 'w-10 h-10 mx-auto justify-center rounded-lg mb-1'}
        ${isActive 
          ? (isForum ? 'bg-surface text-accent' : 'bg-foreground-bright text-contrast-text shadow-sm') 
          : 'text-muted hover:bg-surface hover:text-foreground-bright'}`}
    >
      {/* Индикатор для форума */}
      {isActive && isForum && (
        <div className="absolute left-0 w-0.5 h-4 bg-accent rounded-r-full" />
      )}

      {/* Иконка */}
      <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 will-change-transform
        ${isActive && !isForum ? 'text-contrast-text' : (isActive && isForum ? 'text-accent' : (item.color || ''))}`} 
      />
      
      {/* Текстовая часть (только при раскрытом сайдбаре) */}
      {isExpanded && (
        <div className="flex flex-1 items-center justify-between overflow-hidden">
          <span className="font-bold text-[10px] tracking-tight whitespace-nowrap uppercase">
            {item.name}
          </span>
          {item.count !== undefined && item.count > 0 && (
            <span className={`text-[8px] px-1.5 py-0.5 rounded-md font-black ${
              isActive ? 'bg-white/20' : 'bg-black/5 dark:bg-white/5'
            }`}>
              {item.count}
            </span>
          )}
        </div>
      )}
    </Link>
  );
});

SidebarLink.displayName = 'SidebarLink';

export default SidebarLink;