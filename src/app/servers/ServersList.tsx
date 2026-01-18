"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import ServerCard from "../components/servercard/ServerCard";
import { useAuth } from "@/context/AuthContext";
import WeeklyTimer from "../components/servercard/WeeklyTimer";
import LoadingCrystal from "../components/loading/LoadingCrystal";
import Pagination from "../components/blocks/Pagination";

interface Props {
  game: "java" | "bedrock" | "hytale" | "all";
  sort?: "new" | "rating"; // Вынесли сюда
  filters?: {
    version?: string;
    category?: string;
    lang?: string;
    // Убрали отсюда
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

    // Формируем URL с учетом фильтров
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

    // ПРАВКА: Сортируем по рейтингу ТОЛЬКО если это не раздел "Новые"
    if (sort !== "new") {
      finalData = [...data].sort((a: any, b: any) => {
        const aPremium = a.premiumVotes || 0;
        const bPremium = b.premiumVotes || 0;
        const aWeekly = a.votesWeekly || 0;
        const bWeekly = b.votesWeekly || 0;

        if (aPremium !== bPremium) return bPremium - aPremium;
        return bWeekly - aWeekly;
      });
    } else {
      // Если sort === "new", оставляем порядок как прислал бэкенд
      finalData = data;
    }

    setServers(finalData);
    setLoading(false);
  })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, [game, filters, sort]); // Добавляем filters в зависимости

  const currentServers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return servers.slice(start, start + pageSize);
  }, [currentPage, servers]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleAddServer = () => {
    router.push(user ? "/workbench" : "/login");
  };

  if (loading) return (
    <div className="relative w-full h-[60vh] flex items-center justify-center">
      <LoadingCrystal />
    </div>
  );

  return (
    <div className="flex flex-col w-full max-w-5xl mb-5">
      
      {/* Шапка списка */}
      <div className="flex flex-row w-full justify-between items-center pb-4 border-b border-gray-100">
        <button className="submit" onClick={handleAddServer}>
          + Add Server
        </button>
        
        <div className="flex items-center">
          <Pagination 
            currentPage={currentPage}
            totalItems={servers.length}
            pageSize={pageSize}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* Список серверов */}
      <div className="flex flex-col gap-3 w-full mt-4">       
        {currentServers.length > 0 ? (
          currentServers.map((server, index) => {
            const globalIndex = (currentPage - 1) * pageSize + index + 1;
            return (
              <ServerCard key={server._id} server={server} rank={globalIndex} />
            );
          })
        ) : (
          <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100">
            <p className="text-gray-400 font-medium">No servers found with these filters.</p>
            <button 
              onClick={() => router.push("/")}
              className="text-orange-500 font-bold mt-2 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Нижняя пагинация и таймер */}
      <div className="mt-8 flex flex-col gap-6">
        <Pagination 
          currentPage={currentPage}
          totalItems={servers.length}
          pageSize={pageSize}
          onPageChange={handlePageChange}
        />
        
        <div className="flex flex-row justify-between items-center bg-gray-50 p-4 rounded-2xl"> 
          <WeeklyTimer />
          <span className="text-sm font-bold text-gray-400">
            Total servers: <span className="text-gray-900">{servers.length}</span>
          </span> 
        </div>
      </div>
    </div>
  );
}