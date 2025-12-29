"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ServerCard from "../components/servercard/ServerCard";
import { useAuth } from "@/context/AuthContext";
import WeeklyTimer from "../components/servercard/WeeklyTimer";
import LoadingCrystal from "../components/loading/LoadingCrystal";

interface Props {
  game: "java" | "bedrock" | "all";
}

export default function ServerList({ game }: Props) {
  const [servers, setServers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/servers?game=${game}`)
      .then(res => res.json())
      .then(data => {
        // СОРТИРОВКА:
        // b.votes - a.votes выставит сервер с наибольшим числом голосов первым.
        // Если у тебя поле называется votesWeekly, замени на него.
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

  const handleAddServer = () => {
    if (!user) {
      router.push("/login");
    } else {
      router.push("/workbench");
    }
  };

  if (loading) return <div className="relative w-full h-[60vh] flex items-center justify-center">
                        <LoadingCrystal />
                      </div>;

  return (
    <div className="flex flex-col gap-3 w-fit mb-5">
      <div className="flex flex-row justify-between gap-3 w-full">
        <div className="flex flex-row gap-3 block p-3">
          <WeeklyTimer />
          <span className="text-sm flex items-center text-gray-500">
            Servers total : {servers.length}
          </span> 
        </div>
          <button className="blueBtn" onClick={handleAddServer}>
            + Add Server
          </button>
      </div>
      <div className="flex flex-col justify-center p-3 items-center block gap-2 w-full">
        {servers.map((server, index) => (
          /* Можно добавить index + 1, чтобы отображать место сервера в топе */
          <ServerCard key={server._id} server={server} rank={index + 1} />
        ))}
      </div>
    </div>
  );
}