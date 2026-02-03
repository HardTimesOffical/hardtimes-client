"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronDown, HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { CATEGORIES } from "@/constants/categories"; 
import { GAME_VERSIONS } from "@/constants/gameVersions";

export default function ServerFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Устанавливаем true, чтобы фильтры были открыты при загрузке
  const [isExpanded, setIsExpanded] = useState(true);

  const isBedrockPage = pathname.includes("bedrock");
  const currentVersions = isBedrockPage ? GAME_VERSIONS["Minecraft Bedrock"] : GAME_VERSIONS["Minecraft Java"];

  const getActiveItems = (key: string) => searchParams.get(key)?.split(",") || [];

  const activeVersions = getActiveItems("version");
  const activeCategories = getActiveItems("category");

  const totalActive = activeVersions.length + activeCategories.length;

  const toggleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    let currentItems = getActiveItems(key);

    if (currentItems.includes(value)) {
      currentItems = currentItems.filter(i => i !== value);
    } else {
      currentItems.push(value);
    }

    if (currentItems.length > 0) {
      params.set(key, currentItems.join(","));
    } else {
      params.delete(key);
    }
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-full bg-surface border border-border rounded-2xl overflow-hidden transition-all duration-200 shadow-sm">
      
      {/* Шапка фильтров */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-background/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/10 rounded-lg">
            <HiOutlineAdjustmentsHorizontal className="w-5 h-5 text-accent" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm font-black uppercase tracking-tight text-foreground-bright leading-none">
              Фильтры поиска
            </span>
            {totalActive > 0 && (
              <span className="text-[10px] font-bold text-accent uppercase mt-1">
                Активно: {totalActive}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {totalActive > 0 && (
            <div 
              onClick={(e) => {
                e.stopPropagation();
                router.push(pathname);
              }}
              className="text-[10px] font-black uppercase text-muted hover:text-red-500 transition-colors border-r border-border pr-3 cursor-pointer"
            >
              Сбросить
            </div>
          )}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <HiChevronDown className="w-5 h-5 text-muted" />
          </motion.div>
        </div>
      </button>

      {/* Выпадающая панель */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "circOut" }}
          >
            <div className="px-5 pb-6 pt-2 border-t border-border flex flex-col gap-6">
              
              {/* Исправлено: указан тип string для val */}
              <FilterGroup 
                label="Версия игры" 
                items={currentVersions} 
                activeItems={activeVersions} 
                onToggle={(val: string) => toggleFilter("version", val)} 
              />

              <FilterGroup 
                label="Режим или категория" 
                items={CATEGORIES} 
                activeItems={activeCategories} 
                onToggle={(val: string) => toggleFilter("category", val)} 
              />

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Добавили интерфейс для пропсов, чтобы типизировать компонент
interface FilterGroupProps {
  label: string;
  items: string[];
  activeItems: string[];
  onToggle: (val: string) => void;
}

function FilterGroup({ label, items, activeItems, onToggle }: FilterGroupProps) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-[11px] font-black uppercase tracking-[0.1em] text-muted flex items-center gap-2">
        <div className="w-1 h-1 bg-accent rounded-full" />
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const isActive = activeItems.includes(item);
          return (
            <button
              key={item}
              onClick={() => onToggle(item)}
              className={`
                px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase transition-all border
                ${isActive 
                  ? "bg-accent border-accent text-contrast-text shadow-md shadow-accent/20" 
                  : "bg-background border-border text-muted hover:border-accent/50 hover:text-foreground"
                }
              `}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}