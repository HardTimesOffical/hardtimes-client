"use client";

import styles from "./ServerCard.module.css";
import Link from "next/link";

interface ServerCardProps {
  server: any;
  index?: number;
  rank?: number;
}

export default function ServerCard({ server, index }: ServerCardProps) {
  const { status } = server;

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
            <h3 className={styles.serverName}>{server.serverName}</h3>
          </div>
        </div>

        <div className={styles.imageSection}>
          <img
            src={server.imageUrl || "/server-placeholder.png"}
            alt={server.serverName}
            className={styles.banner}
          />
          <div className={styles.ipBadge}>IP: {server.ipAddress}</div>
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