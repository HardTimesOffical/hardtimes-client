"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import ServerCard from "@/app/components/servercard/ServerCard";
import { useAuth } from "@/context/AuthContext";
import WeeklyTimer from "@/app/components/servercard/WeeklyTimer";
import Pagination from "@/app/components/blocks/Pagination";
import { HiPlus } from "react-icons/hi2";

// Компонент скелетона внутри файла для удобства (или вынеси в отдельный файл)
const ServerCardSkeleton = () => (
  <div className="w-full h-[180px] md:h-[165px] bg-surface border border-border rounded-2xl overflow-hidden flex flex-col md:flex-row animate-pulse">
    <div className="flex-1 p-5 flex flex-col gap-4">
      {/* Заголовок и версия */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <div className="h-5 w-48 bg-border rounded-md" />
          <div className="h-3 w-32 bg-border/50 rounded-md" />
        </div>
        <div className="h-6 w-12 bg-border/50 rounded-lg" />
      </div>
      {/* Баннер */}
      <div className="h-[84px] w-full bg-border/30 rounded-xl" />
      {/* Кнопки */}
      <div className="flex gap-3">
        <div className="h-10 flex-1 bg-border/40 rounded-xl" />
        <div className="h-10 w-32 bg-border/40 rounded-xl" />
      </div>
    </div>
    {/* Блок онлайна справа */}
    <div className="md:w-[130px] border-t md:border-t-0 md:border-l border-border bg-background/10 flex flex-col items-center justify-center gap-2">
      <div className="h-10 w-12 bg-border/60 rounded-lg" />
      <div className="h-3 w-16 bg-border/40 rounded-md" />
    </div>
  </div>
);

interface Props {
  game: "java" | "bedrock" | "hytale" | "all";
  sort?: "new" | "rating";
  filters?: {
    version?: string;
    category?: string;
    lang?: string;
  };
}

export default function ServerList({ game, filters, sort }: Props) {
  const [servers, setServers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  useEffect(() => {
    setLoading(true);
    setCurrentPage(1);

    const params = new URLSearchParams();
    if (game !== "all") params.append("game", game);
    if (sort) params.append("sort", sort); 
    if (filters?.version) params.append("version", filters.version);
    if (filters?.category) params.append("category", filters.category);
    if (filters?.lang) params.append("lang", filters.lang);

    const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL 
      ? `${process.env.NEXT_PUBLIC_SERVER_URL}/servers?${params.toString()}`
      : `/api/servers?${params.toString()}`;

    fetch(apiUrl)
      .then(res => {
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        let finalData = data;
        if (sort !== "new") {
          finalData = [...data].sort((a: any, b: any) => {
            const aPremium = a.premiumVotes || 0;
            const bPremium = b.premiumVotes || 0;
            const aWeekly = a.votesWeekly || 0;
            const bWeekly = b.votesWeekly || 0;
            if (aPremium !== bPremium) return bPremium - aPremium;
            return bWeekly - aWeekly;
          });
        }
        setServers(finalData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, [game, filters, sort]);

  const currentServers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return servers.slice(start, start + pageSize);
  }, [currentPage, servers]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleAddServer = () => {
    router.push(user ? "/monitoring/workbench" : "/login");
  };

  return (
    <div className="flex flex-col w-full max-w-5xl mb-20">
      
      {/* ШАПКА СПИСКА */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border">
        <button 
          onClick={handleAddServer}
          className="flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent/90 text-contrast-text rounded-xl font-[1000] text-[11px] uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-accent/20 shrink-0"
        >
          <HiPlus className="w-4 h-4" />
          Добавить сервер
        </button>
        
        <div className="flex items-center">
          {!loading && (
            <Pagination 
              currentPage={currentPage}
              totalItems={servers.length}
              pageSize={pageSize}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>

      {/* Список серверов или Скелетоны */}
      <div className="flex flex-col gap-4 w-full mt-6">       
        {loading ? (
          // Показываем 5 скелетонов во время загрузки
          Array.from({ length: 5 }).map((_, i) => <ServerCardSkeleton key={i} />)
        ) : currentServers.length > 0 ? (
          currentServers.map((server, index) => (
            <ServerCard 
              key={server._id} 
              server={server} 
              rank={(currentPage - 1) * pageSize + index + 1} 
            />
          ))
        ) : (
          <div className="py-24 text-center rounded-[2rem] border-2 border-dashed border-border bg-surface/50">
            <p className="text-muted font-bold uppercase tracking-widest text-xs">Серверы не найдены</p>
          </div>
        )}
      </div>

      {/* Нижняя пагинация и инфо */}
      {!loading && servers.length > 0 && (
        <div className="mt-10 flex flex-col gap-6">
          <div className="flex justify-center border-t border-border pt-6">
            <Pagination 
                currentPage={currentPage}
                totalItems={servers.length}
                pageSize={pageSize}
                onPageChange={handlePageChange}
              />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center p-5 rounded-2xl bg-surface border border-border gap-4"> 
            <WeeklyTimer /> 
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted">
              Всего проектов: <span className="text-foreground-bright text-xs">{servers.length}</span>
            </div> 
          </div>
        </div>
      )}
    </div>
  );
}