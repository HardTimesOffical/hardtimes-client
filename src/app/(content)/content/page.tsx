'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GAME_PLATFORMS as STATIC_PLATFORMS } from '@/constants/project';

// Тип для хранения агрегированной статистики игры
interface GameStats {
  id: string;
  label: string;
  icon: string;
  projectCount: number;
  totalDownloads: number;
}

export default function ContentPage() {
  const [platforms, setPlatforms] = useState<GameStats[]>([]);
  const [loading, setLoading] = useState(true);
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        // Запрашиваем проекты (без фильтров, чтобы получить всё для статистики)
        const res = await fetch(`${SERVER_URL}/projects?limit=1000`);
        const data = await res.json();
        const projects = data.projects || [];

        // Агрегируем данные: считаем сколько проектов и скачиваний у каждой игры
        const stats = STATIC_PLATFORMS.map(platform => {
          const gameProjects = projects.filter((p: any) => 
            p.gameType.toLowerCase() === platform.id.toLowerCase()
          );

          const downloads = gameProjects.reduce((sum: number, p: any) => 
            sum + (p.analytics?.downloads || 0), 0
          );

          return {
            ...platform,
            projectCount: gameProjects.length,
            totalDownloads: downloads
          };
        });

        setPlatforms(stats);
      } catch (e) {
        console.error("Ошибка загрузки статистики игр:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();
  }, [SERVER_URL]);

  if (loading) return <div className="min-h-screen bg-[var(--background)]" />;

  return (
    <div className="min-h-screen bg-[var(--background)] p-6 md:p-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        <header className="mb-8 flex flex-col gap-1 border-b border-[var(--border)] pb-6"> <h1 className="text-2xl font-bold text-[var(--foreground-bright)] tracking-tight"> Все игры </h1></header>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {platforms.map((game) => (
            <Link key={game.id} href={`/content/${game.id}`}>
              <motion.div whileHover={{ y: -4 }} className="group flex flex-col">
                <div className="relative aspect-square w-full bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden transition-all duration-300 group-hover:border-[var(--muted)]">
                  {game.icon && game.icon.startsWith('http') ? (
                    <img src={game.icon} alt={game.label} className="w-full h-full object-cover opacity-90 group-hover:opacity-100" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[var(--surface)] text-4xl grayscale group-hover:grayscale-0">
                      {game.icon}
                    </div>
                  )}
                </div>

                <div className="mt-3 px-1">
                  <h3 className="font-bold text-[13px] text-[var(--foreground)] uppercase tracking-tight group-hover:text-[var(--accent)] transition-colors">
                    {game.label}
                  </h3>
                  
                  <div className="flex flex-col gap-0.5 mt-1.5 border-l-2 border-[var(--border)] pl-2 group-hover:border-[var(--accent)] transition-colors">
                    <div className="flex items-center gap-1.5 text-[9px] font-black text-[var(--muted)] uppercase tracking-wider">
                      <span>Проектов:</span>
                      <span className="text-[var(--foreground)]">{game.projectCount}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] font-black text-[var(--muted)] uppercase tracking-wider">
                      <span>Загрузок:</span>
                      <span className="text-[var(--accent)]">
                        {game.totalDownloads > 999 ? `${(game.totalDownloads / 1000).toFixed(1)}k` : game.totalDownloads}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}