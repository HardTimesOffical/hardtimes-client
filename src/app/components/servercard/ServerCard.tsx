"use client";

import { useState } from "react";
import styles from "./ServerCard.module.css";
import Link from "next/link";
import { BoostModal } from "../payment/BoostModal";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function ServerCard({ server, rank, contextGame = "all" }: any) {
  const { user, updateUser } = useAuth();
  const [isBoostOpen, setIsBoostOpen] = useState(false);
  const [boostLoading, setBoostLoading] = useState(false);
  
  const hasPremium = server.premiumVotes > 0;

  const handleOpenBoost = (e: React.MouseEvent) => {
    e.preventDefault(); // Чтобы не переходить на страницу сервера
    setIsBoostOpen(true);
  };

  const handleBoostPurchase = async (option: any) => {
    setBoostLoading(true);
    try {
      const res = await api.post('/boost/boost', {
        serverId: server._id,
        votes: option.votes,
        days: option.days,
        price: option.price
      });
      if (res.data.success) {
        updateUser({ balance: res.data.newBalance });
        setIsBoostOpen(false);
        // Здесь можно добавить Toast уведомление об успехе
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Ошибка");
    } finally {
      setBoostLoading(false);
    }
  };

  return (
    <>
      <Link href={`/${server.slug}`} className="w-full">
        <div className={`${styles.wrapper} ${hasPremium ? styles.premiumWrapper : ""}`}>
          <div className={styles.card}>
            
            <div className={styles.mobileRow}>
              {/* СЕКЦИЯ ГОЛОСОВ (Переключаемая) */}
            <div 
              onClick={handleOpenBoost}
              className={styles.votesSection} // Используем существующий класс из CSS модулей
            >
              {hasPremium ? (
                /* Премиум Буст на всё пространство */
                <div className="flex flex-col items-center justify-center w-full h-full bg-blue-500/10 border border-blue-500/30 shadow-[inset_0_0_10px_rgba(59,130,246,0.1)] group">
                  <span translate="no" className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none mb-1">
                    Boost
                  </span>
                  <div className="flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-blue-400 group-hover:scale-110 transition-transform">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                    </svg>
                    <span className="text-lg font-black text-white leading-none">
                      {server.premiumVotes}
                    </span>
                  </div>
                </div>
              ) : (
                /* Обычные голоса (также растянутые) */
                <div className="flex flex-col items-center justify-center w-full h-full">
                  <span className={styles.label}>Votes</span>
                  <span className={styles.voteCount}>{server.votesWeekly ?? 0}</span>
                </div>
              )}
            </div>

              <div className={styles.nameSection}>
                <h3 className={styles.serverName}>
                  {server.gameType === "JAVA & BEDROCK" && (
                    <span className="mr-2 text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-bold border border-blue-500/10">J+B</span>
                  )}
                  {server.serverName}
                </h3>
              </div>
            </div>

            {/* Оставшаяся часть карточки... */}
            <div className={styles.imageSection}>
              {server.imageUrl ? (
                <img src={server.imageUrl} alt={server.serverName} className={styles.banner} />
              ) : (
                <div className={styles.noImagePlaceholder}><span>No banner</span></div>
              )}
              <div className={styles.ipBadge}>IP: {server.ipAddress}</div>
            </div>

            <div className={styles.mobileRow}>
              <div className={styles.playersSection}>
                <span className={styles.label}>Players</span>
                <span className={styles.value}>{server.status?.players}/{server.status?.maxPlayers}</span>
              </div>
              <div className={styles.statusSection}>
                <span className={styles.label}>Status</span>
                <span className={`${styles.statusText} ${server.status?.online ? styles.online : styles.offline}`}>
                  {server.status?.online ? "Online" : "Offline"}
                </span>
              </div>
            </div>

          </div>
        </div>
      </Link>

      <BoostModal 
        isOpen={isBoostOpen}
        onClose={() => setIsBoostOpen(false)}
        serverName={server.serverName}
        userBalance={user?.balance || 0}
        onPurchase={handleBoostPurchase}
        loading={boostLoading}
      />
    </>
  );
}