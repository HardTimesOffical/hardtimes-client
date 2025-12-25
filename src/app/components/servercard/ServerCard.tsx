"use client";

import styles from "./ServerCard.module.css";
import Link from "next/link";

interface ServerCardProps {
  server: any;
  index?: number;
  rank?: number;
  contextGame?: "java" | "bedrock" | "all"; // Новый пропс
}

export default function ServerCard({ server, rank, contextGame = "all" }: ServerCardProps) {
  const { status } = server;

  // Логика определения отображаемого IP
  const displayIp = () => {
    if (server.gameType === "JAVA & BEDROCK") {
      try {
        const parsedIps = JSON.parse(server.ipAddress);
        
        // Если мы на странице Bedrock — показываем Bedrock IP
        if (contextGame === "bedrock") return parsedIps.bedrock;
        // В остальных случаях (Java или All) — показываем Java IP
        return parsedIps.java;
      } catch (e) {
        return server.ipAddress; // Фолбэк для старых записей
      }
    }
    return server.ipAddress;
  };

  return (
    <Link href={`/${server.slug}`} className="w-full">
      <div className={styles.wrapper}>
        <div className={styles.card}>
          
          <div className={styles.mobileRow}>
            <div className={`${styles.votesSection} gap-1 items-center text-center`}>       
              <span className={styles.label}>Votes</span>     
              <span className={styles.voteCount}>  
                {server.votesWeekly ?? 0}
              </span>
            </div>

            <div className={styles.nameSection}>
              <h3 className={styles.serverName}>
                {/* Добавим значок комбо для наглядности */}
                {server.gameType === "JAVA & BEDROCK" && (
                  <span title="Java & Bedrock" className="mr-2 text-xs bg-blue-500/20 text-blue-400 px-1 rounded">J+B</span>
                )}
                {server.serverName}
              </h3>
            </div>
          </div>

          <div className={styles.imageSection}>
            <img
              src={server.imageUrl || "/server-placeholder.png"}
              alt={server.serverName}
              className={styles.banner}
            />
            {/* Выводим правильный IP */}
            <div className={styles.ipBadge}>
              {contextGame === "bedrock" && server.gameType === "JAVA & BEDROCK" ? "PE: " : "IP: "}
              {displayIp()}
            </div>
          </div>

          <div className={styles.mobileRow}>
            <div className={styles.playersSection}>
              <span className={styles.label}>Players</span>
              <span className={styles.value}>
                {status.players}/{status.maxPlayers}
              </span>
            </div>

            <div className={styles.statusSection}>
              <span className={styles.label}>Status</span>
              <span className={`${styles.statusText} ${status.online ? styles.online : styles.offline}`}>
                {status.online ? "Online" : "Offline"}
              </span>
            </div>
          </div>

        </div>
      </div>
    </Link>
  );
}