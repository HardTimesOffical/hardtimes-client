"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ServerCard from "../components/servercard/ServerCard";
import { useAuth } from "@/context/AuthContext";
import WeeklyTimer from "../components/servercard/WeeklyTimer";

interface Props {
  game: "java" | "bedrock" | "all";
  rank?: number;
}

export default function ServerList({ game }: Props) {
  const [servers, setServers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    fetch(`http://localhost:5000/servers?game=${game}`)
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row gap-3 w-full">
        <button className="blueBtn" onClick={handleAddServer}>
          + Add Server
        </button>
        <div className="flex flex-row gap-3 block">
          <WeeklyTimer />
          <span className="text-sm flex items-center text-gray-500">
            Servers total : {servers.length}
          </span> 
        </div>
      </div>
      <div className="flex flex-col justify-center items-center block gap-1 w-full">
        {servers.map((server, index) => (
          /* Можно добавить index + 1, чтобы отображать место сервера в топе */
          <ServerCard key={server._id} server={server} rank={index + 1} />
        ))}
      </div>
    </div>
  );
}