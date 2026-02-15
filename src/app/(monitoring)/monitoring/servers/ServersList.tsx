"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import ServerCard from "@/app/components/servercard/ServerCard";
import { useAuth } from "@/context/AuthContext";
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
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { user } = useAuth();
  const router = useRouter()

  const [servers, setServers] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Инициализируем страницу из URL или ставим 1
  const currentPage = Number(searchParams.get("page")) || 1;
  const pageSize = 15;

  useEffect(() => {
    const fetchServers = async () => {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (game && game !== "all") params.append("game", game);
      if (sort) params.append("sort", sort); 

      // Добавляем только если значение реально существует
      if (filters?.version && filters.version !== "undefined") {
        params.append("version", filters.version);
      }
      if (filters?.category && filters.category !== "undefined") {
        params.append("category", filters.category);
      }
      if (filters?.lang && filters.lang !== "undefined") {
        params.append("lang", filters.lang);
      }

      params.append("page", currentPage.toString());
      params.append("limit", pageSize.toString());

      const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL 
        ? `${process.env.NEXT_PUBLIC_SERVER_URL}/servers?${params.toString()}`
        : `/api/servers?${params.toString()}`;

      try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        
        const data = await res.json();
        console.log("API response:", data); // Проверь это в консоли браузера!

        const items = Array.isArray(data) ? data : (data.items || []);
        const total = Array.isArray(data) ? data.length : (data.total || 0);

        setServers(items);
        setTotalCount(total);

      } catch (err) {
        console.error("Fetch error:", err);
        setServers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServers();
  }, [game, filters, sort, currentPage, pageSize]); // Добавил зависимости

  const handlePageChange = (page: number) => {
    // Обновляем URL, чтобы страница появилась в куери
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleAddServer = () => {
    router.push(user ? "/monitoring/workbench" : "/login");
  };

  return (
    <div className="flex flex-col w-full max-w-5xl mb-20">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border">
        <button 
          onClick={handleAddServer}
          className="flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent/90 text-contrast-text rounded-xl font-[1000] text-[11px] uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-accent/20 shrink-0"
        >
          <HiPlus className="w-4 h-4" />
          Добавить сервер
        </button>
        
        <div className="flex items-center">
          {!loading && totalCount > 0 && (
            <Pagination 
              currentPage={currentPage}
              totalItems={totalCount}
              pageSize={pageSize}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full mt-6">       
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <ServerCardSkeleton key={i} />)
        ) : servers.length > 0 ? (
          servers.map((server, index) => (
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

      {!loading && servers.length > 0 && (
        <div className="mt-10 flex flex-col gap-6">
          <div className="flex justify-center border-t border-border pt-6">
            <Pagination 
              currentPage={currentPage}
              totalItems={totalCount}
              pageSize={pageSize}
              onPageChange={handlePageChange}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center p-5 rounded-2xl bg-surface border border-border gap-4"> 
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted">
              Всего проектов: <span className="text-foreground-bright text-xs">{totalCount}</span>
            </div> 
          </div>
        </div>
      )}
    </div>
  );
}