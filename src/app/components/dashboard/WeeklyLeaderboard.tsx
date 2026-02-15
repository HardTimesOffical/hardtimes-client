'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { HiFire } from 'react-icons/hi2';

interface Leader {
  _id: string;
  username: string;
  avatar?: string;
  votesWeekly: number;
}

export const WeeklyLeaderboard = () => {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/leaderboard/weekly`);
        setLeaders(data);
      } catch (error) {
        console.error("Failed to fetch leaders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaders();
  }, []);

  if (!loading && leaders.length === 0) return null;

  return (
    <aside className="w-full">
      <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
        
        {/* Шапка */}
        <div className="px-3 py-2.5 border-b border-border bg-background/40 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <HiFire className="w-4 h-4 text-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-foreground-bright">
              Топ голосов за неделю
            </span>
          </div>
          <span className="text-[8px] font-bold text-muted/50 uppercase">
            Лидеры
          </span>
        </div>

        {/* Список лидеров */}
        <div className="flex flex-col">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="p-3 border-b border-border animate-pulse flex items-center gap-3">
                <div className="h-3 w-3 bg-border rounded" />
                <div className="w-7 h-7 rounded-full bg-border" />
                <div className="flex-1">
                  <div className="h-2 w-16 bg-border rounded" />
                </div>
              </div>
            ))
          ) : (
            leaders.map((user, index) => {
              const isFirst = index === 0;
              return (
                <Link 
                  key={user._id} 
                  href={`/profile/${user.username}`}
                  className={`
                    px-3 py-2.5 border-b border-border last:border-0 transition-colors group flex items-center justify-between
                    ${isFirst ? 'bg-blue-500/[0.04] hover:bg-blue-500/[0.08]' : 'hover:bg-foreground/[0.02]'}
                  `}
                >
                  <div className="flex items-center gap-2.5">
                    {/* Номер места */}
                    <span className={`text-[10px] font-black w-3 ${isFirst ? 'text-blue-500' : 'text-muted/40'}`}>
                      {index + 1}.
                    </span>

                    {/* Аватар */}
                    <div className={`w-7 h-7 rounded-full bg-border overflow-hidden border ${isFirst ? 'border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.2)]' : 'border-border/50'}`}>
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-background text-[10px] font-bold text-muted">
                          {user.username[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col">
                      <span className={`text-[11px] font-bold transition-colors truncate max-w-[100px] ${isFirst ? 'text-blue-400' : 'text-foreground-bright group-hover:text-foreground'}`}>
                        {user.username}
                      </span>
                    </div>
                  </div>

                  {/* Голоса */}
                  <div className="flex items-center gap-1.5">
                    <div className={`text-[11px] font-black flex items-center gap-1 ${isFirst ? 'text-blue-500' : 'text-muted'}`}>
                      <span className="opacity-40 text-[8px] font-bold uppercase">Votes</span>
                      {user.votesWeekly}
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>

        {/* Футер пустой для симметрии или можно убрать совсем */}
      </div>
    </aside>
  );
};