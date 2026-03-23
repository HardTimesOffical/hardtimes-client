"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import ServerCard from "@/app/components/servercard/ServerCard";
import { useAuth } from "@/context/AuthContext";
import Pagination from "@/app/components/blocks/Pagination";
import { HiPlus } from "react-icons/hi2";

// ─── Скелетон ────────────────────────────────────────────────────
const ServerCardSkeleton = () => (
  <div className="w-full bg-card border border-border overflow-hidden flex flex-col md:flex-row animate-pulse"
    style={{ height: '148px' }}>
    <div className="flex-1 p-3 flex flex-col gap-2.5">
      <div className="flex justify-between items-start gap-3">
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="h-3.5 w-44 bg-border" />
          <div className="h-2.5 w-28 bg-border/50" />
        </div>
        <div className="h-4 w-10 bg-border/40" />
      </div>
      <div className="h-[72px] w-full bg-border/20" />
      <div className="flex gap-2">
        <div className="h-7 flex-1 bg-border/30" />
        <div className="h-7 w-20 bg-border/30" />
      </div>
    </div>
    <div className="md:w-[80px] border-t md:border-t-0 md:border-l border-border bg-surface flex flex-col items-center justify-center gap-1.5">
      <div className="h-7 w-10 bg-border/50" />
      <div className="h-2 w-12 bg-border/30" />
    </div>
  </div>
);

interface Props {
  game: "java" | "bedrock" | "hytale" | "all";
  sort?: "new" | "rating";
  filters?: { version?: string; category?: string; lang?: string; };
}

export default function ServerList({ game, filters, sort }: Props) {
  const searchParams = useSearchParams();
  const pathname     = usePathname();
  const { user }     = useAuth();
  const router       = useRouter();

  const [servers,    setServers]    = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading,    setLoading]    = useState(true);

  const currentPage = Number(searchParams.get("page")) || 1;
  const pageSize    = 25;

  useEffect(() => {
    (async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (game && game !== "all") params.append("game", game);
      if (sort) params.append("sort", sort);
      if (filters?.version  && filters.version  !== "undefined") params.append("version",  filters.version);
      if (filters?.category && filters.category !== "undefined") params.append("category", filters.category);
      if (filters?.lang     && filters.lang     !== "undefined") params.append("lang",     filters.lang);
      params.append("page",  currentPage.toString());
      params.append("limit", pageSize.toString());

      const url = process.env.NEXT_PUBLIC_SERVER_URL
        ? `${process.env.NEXT_PUBLIC_SERVER_URL}/servers?${params}`
        : `/api/servers?${params}`;

      try {
        const res  = await fetch(url);
        if (!res.ok) throw new Error(`${res.status}`);
        const data = await res.json();
        setServers(Array.isArray(data) ? data : (data.items || []));
        setTotalCount(Array.isArray(data) ? data.length : (data.total || 0));
      } catch { setServers([]); }
      finally  { setLoading(false); }
    })();
  }, [game, filters, sort, currentPage]);

  const handlePageChange = (page: number) => {
    const p = new URLSearchParams(searchParams.toString());
    p.set("page", page.toString());
    router.push(`${pathname}?${p}`, { scroll: false });
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col w-full max-w-5xl mb-16">

      {/* ── Панель над списком ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-border">

        {/* Кнопка добавить */}
        <button
          onClick={() => router.push(user ? "/monitoring/workbench" : "/login")}
          className="flex items-center gap-2 px-4 py-2 font-standard font-bold text-[12px] text-white
            transition-all duration-150 hover:brightness-110 active:scale-95 shrink-0"
          style={{
            background: '#3c8527',
            boxShadow: 'inset 1px 1px 0 #5aac44, inset -1px -1px 0 #2a5e1a, 0 2px 0 #2a5e1a',
          }}
        >
          <HiPlus className="w-3.5 h-3.5" />
          Добавить сервер
        </button>

        {/* Пагинация сверху */}
        {!loading && totalCount > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={totalCount}
            pageSize={pageSize}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* ── Список ── */}
      <div className="flex flex-col gap-2 w-full">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <ServerCardSkeleton key={i} />)
        ) : servers.length > 0 ? (
          servers.map((server, i) => (
            <ServerCard
              key={server._id}
              server={server}
              rank={(currentPage - 1) * pageSize + i + 1}
            />
          ))
        ) : (
          /* Пустое состояние */
          <div className="py-16 flex flex-col items-center justify-center gap-3
            border border-dashed border-border bg-surface/30">
            <div className="w-8 h-8 border-2 border-border flex items-center justify-center">
              <span className="font-mc-pixel text-[10px] text-muted">?</span>
            </div>
            <p className="font-mc-pixel text-[9px] text-muted uppercase tracking-widest">
              Серверы не найдены
            </p>
          </div>
        )}
      </div>

      {/* ── Панель под списком ── */}
      {!loading && servers.length > 0 && (
        <div className="mt-6 flex flex-col gap-4">
          <div className="flex justify-center border-t border-border pt-5">
            <Pagination
              currentPage={currentPage}
              totalItems={totalCount}
              pageSize={pageSize}
              onPageChange={handlePageChange}
            />
          </div>

          {/* Итого */}
          <div className="flex items-center justify-between px-3 py-2.5
            border border-border bg-surface">
            <div className="flex items-center gap-2">
              <div className="w-[3px] h-3"
                style={{ background: 'linear-gradient(to bottom, #5aac44, #2a5e1a)' }} />
              <span className="font-mc-pixel text-[8px] text-muted uppercase tracking-widest">
                Всего серверов
              </span>
            </div>
            <span className="font-standard font-black text-[13px] text-foreground-bright tabular-nums">
              {totalCount}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
