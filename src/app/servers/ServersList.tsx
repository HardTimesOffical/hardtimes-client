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
  sort?: "new" | "rating";
  filters?: {
    version?: string;
    category?: string;
    lang?: string;
  };
  isDark?: boolean; // Добавили новый пропс
}

export default function ServerList({ game, filters, sort, isDark }: Props) {
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
    <div className={`flex flex-col w-full max-w-5xl mb-5 ${isDark ? 'text-white' : 'text-gray-900'}`}>
      
      {/* Шапка списка */}
      <div className={`flex flex-col w-full justify-between items-center pb-4 border-b ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
      <button 
        onClick={handleAddServer}
        className={`
          relative overflow-hidden transition-all duration-300 group
          px-6 py-2.5 rounded-xl font-[900] text-xs uppercase tracking-[0.15em]
          active:scale-95 active:duration-75
          ${isDark 
            ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:bg-purple-500 border border-white/20" 
            : "bg-[#FF6A00] text-white shadow-[0_4px_15px_rgba(255,106,0,0.3)] hover:bg-[#e66e00] hover:-translate-y-0.5"
          }
        `}
      >
        {/* Эффект блика при наведении (только для темной темы) */}
        {isDark && (
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
        )}
        
        <span className="relative z-10 flex items-center gap-2">
          <span className="text-lg leading-none">+</span>
          Добавить
        </span>
      </button>
        
        <div className="flex items-center">
          <Pagination 
            currentPage={currentPage}
            totalItems={servers.length}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            // Если компонент Pagination поддерживает темную тему, прокиньте и туда
          />
        </div>
      </div>

      {/* Список серверов */}
      <div className="flex flex-col gap-3 w-full mt-4">       
        {currentServers.length > 0 ? (
          currentServers.map((server, index) => {
            const globalIndex = (currentPage - 1) * pageSize + index + 1;
            return (
              <ServerCard 
                key={server._id} 
                server={server} 
                rank={globalIndex} 
                isDark={isDark} // ПРОКИДЫВАЕМ ТЕМУ В КАРТОЧКУ
              />
            );
          })
        ) : (
          <div className={`py-20 text-center rounded-3xl border-2 border-dashed ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-100'}`}>
            <p className="text-gray-400 font-medium">No servers found.</p>
          </div>
        )}
      </div>
      <div className="flex items-center">
          <Pagination 
            currentPage={currentPage}
            totalItems={servers.length}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            // Если компонент Pagination поддерживает темную тему, прокиньте и туда
          />
        </div>
      
      {/* Нижний таймер - адаптируем под темный фон */}
      <div className="mt-8">
         <div className={`flex flex-row justify-between items-center p-4 rounded-2xl ${isDark ? 'bg-white/5 border border-white/10' : 'bg-gray-50'}`}> 
            <WeeklyTimer /> 
            <span className="text-sm font-bold text-gray-400">
              Total: <span className={isDark ? "text-white" : "text-gray-900"}>{servers.length}</span>
            </span> 
         </div>
      </div>
    </div>
  );
}