"use client";
import { useState, useMemo } from "react";
import styles from "./ServerCard.module.css";
import Link from "next/link";
import { BoostModal } from "../payment/BoostModal";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { HiOutlineUserGroup, HiOutlineLightningBolt, HiOutlineStar, HiOutlineEye } from "react-icons/hi";

export default function ServerCard({ server, isDark }: any) {
  const { user, updateUser } = useAuth();
  const [isBoostOpen, setIsBoostOpen] = useState(false);
  const [boostLoading, setBoostLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const displayVersion = useMemo(() => {
    return server.status?.version || server.gameVersion || "1.20";
  }, [server.status?.version, server.gameVersion]);

  const displayIp = useMemo(() => {
    let ipData = server.ipAddress;
    if (typeof ipData === 'string' && ipData.startsWith('{')) {
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
      <div className={styles.cardContainer} data-theme={isDark ? "dark" : "light"}>
        <Link href={`/monitoring/${server.slug}`} className={styles.cardLink}>
          
          <div className={styles.topRow}>
            <div className={styles.titleWrapper}>
              <h3 className={styles.serverName}>{server.serverName}</h3>
            </div>
            <div className={styles.categories}>
              {server.categories?.length > 0 ? server.categories.join(" • ") : "Survival • Projects"}
            </div>
          </div>

          <div className={styles.bottomRow}>
            <div className={styles.bannerBlock}>
              <div className={styles.bannerWrapper}>
                {server.imageUrl ? (
                  <img src={server.imageUrl} alt="" className={styles.banner} />
                ) : (
                  <div className={styles.noImagePlaceholder}></div>
                )}
                <div className={styles.boostOverlay} onClick={openBoost}>
                   <HiOutlineLightningBolt size={14} /> BOOST
                </div>
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
                <div className={styles.mainStats}>
                   <div className={styles.statItem} title="Версия">
                      <span className={styles.version}>{displayVersion}</span>
                   </div>
                   
                   <div className={styles.players}>
                      <HiOutlineUserGroup size={16} className={styles.statIcon} />
                      <div className={styles.playerCount}>
                        <span className={styles.curP}>{server.status?.players ?? 0}</span>
                        <span className={styles.maxP}>/{server.status?.maxPlayers ?? 0}</span>
                      </div>
                   </div>

                   <div className={styles.views}>
                      <HiOutlineEye size={16} className={styles.statIcon} />
                      <span className={styles.viewCount}>{server.analytics?.views || 0}</span>
                   </div>
                </div>

                <div className={styles.votesGroup}>
                  {server.premiumVotes > 0 && (
                    <div className={styles.premiumRating} onClick={openBoost} title="Премиум голоса">
                      <span className={styles.diamondSmall}>💎</span>
                      <span>{server.premiumVotes}</span>
                    </div>
                  )}
                  <div className={styles.rating} onClick={openBoost} title="Голоса">
                    <HiOutlineStar size={14} className={styles.starIcon} />
                    <span>{server.votesWeekly || 0}</span>
                  </div>
                </div>

                <div className={`${styles.status} ${server.status?.online ? styles.online : styles.offline}`}>
                  <span className={styles.statusDot}></span>
                  <span className={styles.statusText}>{server.status?.online ? "Online" : "Offline"}</span>
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