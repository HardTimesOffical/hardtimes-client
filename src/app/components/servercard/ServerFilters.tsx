"use client";

import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import styles from "./filters.module.css";
// Импортируй свои константы (пути подправь под свой проект)
import { CATEGORIES } from "@/constants/categories"; 
import { GAME_VERSIONS } from "@/constants/gameVersions";

export default function ServerFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Определяем, какие версии показывать в зависимости от текущего раздела
  // Если мы на странице /bedrock — берем версии для Bedrock, иначе Java
  const isBedrockPage = pathname.includes("bedrock");
  const currentVersions = isBedrockPage ? GAME_VERSIONS["Minecraft Bedrock"] : GAME_VERSIONS["Minecraft Java"];

  // Получаем активные фильтры из URL (превращаем строку "1.20,1.19" в массив)
  const getActiveItems = (key: string) => searchParams.get(key)?.split(",") || [];

  const activeVersions = getActiveItems("version");
  const activeCategories = getActiveItems("category");
  const activeLangs = getActiveItems("lang");

  const toggleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    let currentItems = getActiveItems(key);

    if (currentItems.includes(value)) {
      // Удаляем, если уже есть
      currentItems = currentItems.filter(i => i !== value);
    } else {
      // Добавляем, если нет
      currentItems.push(value);
    }

    if (currentItems.length > 0) {
      params.set(key, currentItems.join(","));
    } else {
      params.delete(key);
    }
    
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const renderChips = (label: string, key: string, items: string[], activeItems: string[]) => (
    <div className={styles.filterGroup}>
      <span className={styles.label}>{label}:</span>
      <div className={styles.chipsRow}>
        {items.map((item) => (
          <button
            key={item}
            onClick={() => toggleFilter(key, item)}
            className={`${styles.chip} ${activeItems.includes(item) ? styles.activeChip : ""}`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className={styles.filterContainer}>
      {renderChips("Версии", "version", currentVersions, activeVersions)}
      {renderChips("Категории", "category", CATEGORIES, activeCategories)}
      
      {(activeVersions.length > 0 || activeCategories.length > 0) && (
        <button className={styles.resetBtn} onClick={() => router.push(pathname)}>
          Сбросить все фильтры
        </button>
      )}
    </div>
  );
}