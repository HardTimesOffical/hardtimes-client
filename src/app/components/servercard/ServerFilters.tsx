"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { HiChevronDown } from "react-icons/hi2";
import { CATEGORIES } from "@/constants/categories";
import { GAME_VERSIONS } from "@/constants/gameVersions";

export default function ServerFilters() {
  const router      = useRouter();
  const pathname    = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const isBedrockPage   = pathname.includes("bedrock");
  const currentVersions = isBedrockPage
    ? GAME_VERSIONS["Minecraft Bedrock"]
    : GAME_VERSIONS["Minecraft Java"];

  // Определяем базовый путь и текущую версию из URL
  // /monitoring/servers/java/1-16-5 → base=/monitoring/servers/java, currentUrlVersion=1.16.5
  const javaBase    = "/monitoring/servers/java";
  const bedrockBase = "/monitoring/servers/bedrock";
  const base        = isBedrockPage ? bedrockBase : javaBase;

  // Версия может быть либо в URL-сегменте, либо в query
  const versionFromPath = pathname.startsWith(`${base}/`)
    ? pathname.replace(`${base}/`, "").replace(/-/g, ".")
    : null;
  const versionFromQuery = searchParams.get("version");
  const activeVersionFromUrl = versionFromPath || versionFromQuery || null;

  const getActive = (key: string) => searchParams.get(key)?.split(",") || [];
  const activeCategories = getActive("category");
  const totalActive = (activeVersionFromUrl ? 1 : 0) + activeCategories.length;

  // Версии — редирект на /monitoring/servers/java/1-16-5
  const toggleVersion = (version: string) => {
    const slug = version.replace(/\./g, "-");
    if (activeVersionFromUrl === version) {
      // Снять версию — перейти на базовую страницу
      router.push(base, { scroll: false });
    } else {
      router.push(`${base}/${slug}`, { scroll: false });
    }
  };

  // Категории — обычные query-параметры
  const toggleCategory = (value: string) => {
    const params  = new URLSearchParams(searchParams.toString());
    let current   = getActive("category");
    current       = current.includes(value)
      ? current.filter(i => i !== value)
      : [...current, value];
    current.length > 0 ? params.set("category", current.join(",")) : params.delete("category");
    // Сохраняем pathname (с версией в URL если есть)
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const reset = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Сбросить всё — перейти на базовую страницу без версии и категорий
    router.push(base);
  };

  return (
    <div className="w-full bg-card border border-border overflow-hidden">

      {/* ── Шапка ── */}
      <button
        onClick={() => setIsOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5
          hover:bg-surface transition-colors duration-100"
      >
        <div className="flex items-center gap-3">
          {/* Пиксельный маркер */}
          <div className="w-[3px] h-4 shrink-0"
            style={{ background: 'linear-gradient(to bottom, #5aac44, #2a5e1a)' }} />
          <span className="font-mc-title text-[10px] text-foreground-bright">
            Фильтры поиска
          </span>
          {totalActive > 0 && (
            <span className="font-mc-pixel text-[8px] px-1.5 py-0.5 text-white"
              style={{ background: '#3c8527' }}>
              {totalActive}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {totalActive > 0 && (
            <button
              onClick={reset}
              className="font-standard text-[11px] text-muted hover:text-foreground-bright
                border-r border-border pr-3 transition-colors"
            >
              Сбросить
            </button>
          )}
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <HiChevronDown className="w-3.5 h-3.5 text-muted" />
          </motion.div>
        </div>
      </button>

      {/* ── Содержимое ── */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "circOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-3 border-t border-border flex flex-col gap-5">
              <FilterGroup
                label="Версия игры"
                items={currentVersions}
                activeItems={activeVersionFromUrl ? [activeVersionFromUrl] : []}
                onToggle={toggleVersion}
              />
              <FilterGroup
                label="Режим или категория"
                items={CATEGORIES}
                activeItems={activeCategories}
                onToggle={toggleCategory}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── FilterGroup ─────────────────────────────────────────────────
interface FilterGroupProps {
  label: string;
  items: string[];
  activeItems: string[];
  onToggle: (val: string) => void;
}

function FilterGroup({ label, items, activeItems, onToggle }: FilterGroupProps) {
  return (
    <div className="flex flex-col gap-2">
      {/* Заголовок группы */}
      <div className="flex items-center gap-2">
        <div className="w-1 h-1 shrink-0 bg-border" />
        <span className="font-mc-pixel text-[8px] uppercase tracking-widest text-muted/60">
          {label}
        </span>
      </div>

      {/* Теги */}
      <div className="flex flex-wrap gap-1.5">
        {items.map(item => {
          const active = activeItems.includes(item);
          return (
            <button
              key={item}
              onClick={() => onToggle(item)}
              className="font-standard text-[11px] px-2.5 py-1 border transition-all duration-100"
              style={active ? {
                background: '#3c8527',
                borderColor: '#2a5e1a',
                color: '#fff',
                boxShadow: 'inset 1px 1px 0 #5aac44, inset -1px -1px 0 #2a5e1a',
              } : {
                background: 'var(--surface)',
                borderColor: 'var(--border)',
                color: 'var(--muted)',
              }}
              onMouseEnter={e => {
                if (!active) (e.currentTarget as HTMLElement).style.borderColor = '#5aac44';
              }}
              onMouseLeave={e => {
                if (!active) (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
              }}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}