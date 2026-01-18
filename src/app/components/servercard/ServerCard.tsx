"use client";

import { useState, useMemo } from "react";
import styles from "./ServerCard.module.css";
import Link from "next/link";
import { BoostModal } from "../payment/BoostModal";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function ServerCard({ server }: any) {
  const { user, updateUser } = useAuth();
  const [isBoostOpen, setIsBoostOpen] = useState(false);
  const [boostLoading, setBoostLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // 1. Приоритет реальной версии из статуса
  const displayVersion = useMemo(() => {
    return server.status?.version || server.gameVersion || "1.20";
  }, [server.status?.version, server.gameVersion]);

  const displayIp = useMemo(() => {
    let ipData = server.ipAddress;
    if (typeof ipData === 'string' && (ipData.startsWith('{') || ipData.includes('"java"'))) {
      try { ipData = JSON.parse(ipData); } catch (e) { console.error(e); }
    }
    if (typeof ipData === 'object' && ipData !== null) {
      return ipData.java || ipData.bedrock || "IP не указан";
    }
    return ipData || "IP не указан";
  }, [server.ipAddress]);

  const handleCopyIp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(displayIp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Метод для открытия модалки без перехода по ссылке
  const openBoost = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Ошибка");
    } finally {
      setBoostLoading(false);
    }
  };

  return (
    <>
      <div className={styles.cardContainer}>

        <Link href={`/${server.slug}`} className={styles.cardLink}>
          <div className={styles.topRow}>
            <div className={styles.titleWrapper}>
              <h3 className={styles.serverName}>{server.serverName}</h3>
            </div>
            <div className={styles.categories}>
              {server.categories?.length > 0 ? server.categories.join(" • ") : "Survival • SkyBlock"}
            </div>
          </div>

          <div className={styles.bottomRow}>
            <div className={styles.bannerBlock}>
              <div className={styles.bannerWrapper}>
                {server.imageUrl ? (
                  <img src={server.imageUrl} alt="" className={styles.banner} />
                ) : (
                  <div className={styles.noImagePlaceholder}><span>Баннер отсутствует</span></div>
                )}
                {/* Кнопка БУСТА прямо на баннере */}
                <div className={styles.boostOverlay} onClick={openBoost}>🚀 BOOST</div>
              </div>
            </div>

            <div className={styles.actionGroup}>
              <button 
                className={`${styles.ipButton} ${copied ? styles.copied : ""}`} 
                onClick={handleCopyIp}
              >
                <span className={styles.ipText}>{copied ? "Скопировано!" : displayIp}</span>
              </button>

            <div className={styles.statsRow}>
              {/* Реальная версия сервера */}
              <span className={styles.version} title="Версия сервера">{displayVersion}</span>
              
              <div className={styles.players}>
                <span className={styles.curP}>{server.status?.players ?? 0}</span>
                <span className={styles.maxP}>/{server.status?.maxPlayers ?? 0}</span>
              </div>

              {/* ГРУППА ГОЛОСОВ */}
              <div className={styles.votesGroup}>
                
                {/* ПРЕМИУМ голоса (показываем только если они > 0) */}
                {server.premiumVotes > 0 && (
                  <div className={styles.premiumRating} onClick={openBoost} title="Премиум голоса">
                    <span className={styles.diamondSmall}>💎</span>
                    <span>{server.premiumVotes}</span>
                  </div>
                )}
                <div className={styles.rating} onClick={openBoost} title="Еженедельные голоса">
                  <svg className={styles.star} viewBox="0 0 24 24">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                  </svg>
                  <span>{server.votesWeekly || 0}</span>
                </div>
              </div>

              <div className={`${styles.status} ${server.status?.online ? styles.online : styles.offline}`}>
                {server.status?.online ? "Online" : "Offline"}
              </div>
            </div>
            </div>
          </div>
        </Link>
      </div>

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