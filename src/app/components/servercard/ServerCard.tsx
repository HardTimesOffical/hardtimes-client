"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { BoostModal } from "../payment/BoostModal";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { 
  HiOutlineUserGroup, 
  HiBolt,              // Замена молнии
  HiOutlineStar, 
  HiOutlineCheck, 
  HiOutlineHandThumbUp,
  HiOutlinePhoto       // Иконка для заглушки
} from "react-icons/hi2";

export default function ServerCard({ server }: any) {
  const { user, updateUser } = useAuth();
  const [isBoostOpen, setIsBoostOpen] = useState(false);
  const [boostLoading, setBoostLoading] = useState(false);
  const [copied, setCopied] = useState(false);

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

  // Функция открытия буста (исправляет ошибку Cannot find name)
  const handleOpenBoost = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBoostOpen(true);
  };

  const handleCopyIp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(displayIp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      <div className="group relative w-full bg-surface border border-border rounded-2xl transition-all duration-300 hover:border-accent/30 overflow-hidden shadow-sm hover:shadow-md">
        <Link href={`/monitoring/${server.slug}`} className="flex flex-col md:flex-row items-stretch">
          
          {/* 1. КОНТЕНТ (Слева и центр) */}
          <div className="flex-1 p-5 flex flex-col gap-4">
            
            {/* Ряд 1: Название + Версия */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-[1000] text-foreground-bright uppercase tracking-tighter leading-tight group-hover:text-accent transition-colors">
                  {server.serverName}
                </h3>
                <div className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] opacity-70">
                  {server.categories?.length > 0 ? server.categories.slice(0, 2).join(" • ") : "Minecraft Project"}
                </div>
              </div>
              <div className="shrink-0 bg-accent/10 text-accent text-[10px] font-black px-2.5 py-1 rounded-lg border border-accent/20">
                {server.status?.version || server.gameVersion || "1.20"}
              </div>
            </div>

            {/* Ряд 2: УВЕЛИЧЕННЫЙ БАННЕР (84px высотой) */}
            <div className="relative w-full h-[84px] rounded-xl overflow-hidden bg-background border border-border group/banner">
              {server.imageUrl ? (
                <img 
                  src={server.imageUrl} 
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
                  alt={`${server.serverName} banner`}
                />
              ) : (
                /* ЗАГЛУШКА */
                <div className="w-full h-full bg-gradient-to-br from-surface via-background/50 to-surface flex items-center justify-center relative overflow-hidden">
                  {/* Декоративная иконка на фоне */}
                  <HiBolt className="absolute w-32 h-32 text-foreground/[0.03] rotate-12 -right-4 -bottom-4 pointer-events-none" />
                  
                  <div className="flex flex-col items-center gap-1.5 opacity-30">
                    <HiOutlinePhoto className="w-6 h-6 text-muted" />
                    <span className="text-[9px] font-[1000] uppercase tracking-[0.2em] text-muted">
                      Баннер отсутствует  
                    </span>
                  </div>
                </div>
              )}

              {/* Overlay при наведении */}
              <div 
                onClick={handleOpenBoost}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer backdrop-blur-[2px]"
              >
                <div className="flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest bg-accent px-5 py-2.5 rounded-full shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                  <HiBolt className="w-4 h-4" /> 
                  {server.imageUrl ? "В ТОП" : "В ТОП"}
                </div>
              </div>
            </div>

            {/* Ряд 3: Интерактивы и Рейтинг */}
            <div className="flex flex-wrap items-center gap-3">
              <button 
                onClick={handleCopyIp}
                className={`h-11 px-6 rounded-xl border-2 font-black text-[11px] uppercase tracking-wider transition-all flex-1 min-w-[140px] flex items-center justify-center gap-2
                  ${copied 
                    ? "bg-green-500 border-green-500 text-white" 
                    : "bg-background border-border text-foreground-bright hover:border-accent shadow-sm"
                  }`}
              >
                {copied ? <HiOutlineCheck className="w-4 h-4" /> : null}
                {copied ? "Скопировано" : displayIp}
              </button>

              <div className="flex items-center h-11 bg-background rounded-xl border border-border overflow-hidden shadow-sm">
                <div className="flex items-center gap-2 px-4 h-full hover:bg-accent/5 transition-colors cursor-pointer border-r border-border" onClick={handleOpenBoost}>
                  <HiOutlineStar className="w-4 h-4 text-accent fill-accent" />
                  <span className="text-sm font-black text-foreground-bright">{server.premiumVotes || 0}</span>
                </div>
                <div className="flex items-center gap-2 px-4 h-full opacity-60">
                  <HiOutlineHandThumbUp className="w-4 h-4 text-muted" />
                  <span className="text-sm font-bold text-muted">{server.votesWeekly || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. АКЦЕНТ: ОНЛАЙН (Теперь справа) */}
          <div className="flex flex-col items-center justify-center px-6 py-6 md:py-0 md:w-[130px] bg-background/20 shrink-0 border-t md:border-t-0 md:border-l border-border group-hover:bg-accent/5 transition-colors">
            <div className="relative mb-2">
              <div className={`w-3 h-3 rounded-full absolute -right-2 -top-1 border-2 border-surface shadow-[0_0_8px_rgba(34,197,94,0.5)] ${server.status?.online ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <div className="text-4xl font-[1000] text-foreground-bright tracking-tighter leading-none">
                {server.status?.players ?? 0}
              </div>
            </div>
            <div className="flex flex-col items-center leading-none">
              <span className="text-[10px] font-black text-muted uppercase tracking-widest">Онлайн</span>
              <span className="text-[9px] font-bold text-muted/50 mt-1 uppercase tracking-tighter">max: {server.status?.maxPlayers ?? 0}</span>
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