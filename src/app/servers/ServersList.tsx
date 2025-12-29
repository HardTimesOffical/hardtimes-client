"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import ServerCard from "../components/servercard/ServerCard";
import { useAuth } from "@/context/AuthContext";
import WeeklyTimer from "../components/servercard/WeeklyTimer";
import LoadingCrystal from "../components/loading/LoadingCrystal";
import Pagination from "../components/blocks/Pagination";

interface Props {
  game: "java" | "bedrock" | "all";
}

export default function ServerList({ game }: Props) {
  const [servers, setServers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    setLoading(true);
    // Сбрасываем страницу на первую при смене категории игры
    setCurrentPage(1);

    // ВАЖНО: Если получаешь 404, проверь этот путь. 
    // Если API внутри Next.js, лучше писать так: `/api/servers?game=${game}`
    const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL 
      ? `${process.env.NEXT_PUBLIC_SERVER_URL}/servers?game=${game}`
      : `/api/servers?game=${game}`;

    fetch(apiUrl)
      .then(res => {
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        // Сортировка по недельным голосам
        const sortedServers = data.sort((a: any, b: any) => {
          return (b.votesWeekly || 0) - (a.votesWeekly || 0);
        });
        setServers(sortedServers);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, [game]);

  // ЛОГИКА ПАГИНАЦИИ (Вырезаем нужный кусок массива)
  const currentServers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return servers.slice(start, start + pageSize);
  }, [currentPage, servers]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

      {/* Нижний ряд: Кнопка и Пагинация */}
      <div className="flex flex-row w-full justify-between items-center h-fit border-b border-white/5 pb-2">
        <button className="blueBtn" onClick={handleAddServer}>
          + Add Server
        </button>
        
        {/* Пагинация (теперь плотно прижата) */}
        <div className="flex items-center">
          <Pagination 
            currentPage={currentPage}
            totalItems={servers.length}
            pageSize={pageSize}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
            <div className="flex flex-row gap-3 px-1 items-center block p-3 mb-1"> 
        <WeeklyTimer />
        <span className="text-sm text-gray-500">
          Total servers: <strong className="text-gray-300">{servers.length}</strong>
        </span> 
      </div>

          <div className="flex flex-col gap-2 w-full mt-2 block p-3">       
         {currentServers.length > 0 ? (
          currentServers.map((server, index) => {
            // Вычисляем реальный ранг с учетом страницы
            const globalIndex = (currentPage - 1) * pageSize + index + 1;
            return (
              <ServerCard key={server._id} server={server} rank={globalIndex} />
            );
          })
        ) : (
          <div className="py-10 text-gray-400">No servers found.</div>
        )}
      </div>

      {/* Добавляем компонент пагинации */}
      <div className="mt-4">
        <Pagination 
          currentPage={currentPage}
          totalItems={servers.length}
          pageSize={pageSize}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}