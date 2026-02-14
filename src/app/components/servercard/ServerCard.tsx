'use client';
import { useState, useMemo } from "react";
import Link from "next/link";
import { BoostModal } from "../payment/BoostModal";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { 
  HiBolt, 
  HiOutlineStar, 
  HiOutlineCheck, 
  HiOutlineHandThumbUp,
  HiOutlinePhoto 
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
      <div className="group relative w-full bg-surface border border-border rounded-xl transition-all duration-300 hover:border-accent/30 overflow-hidden shadow-sm hover:shadow-md">
        <Link href={`/monitoring/${server.slug}`} className="flex flex-col md:flex-row items-stretch min-w-0">
          
          <div className="flex-1 p-4 flex flex-col gap-3 min-w-0">
            
            {/* Ряд 1: Название (с жестким ограничением) */}
            <div className="flex items-start justify-between gap-4 min-w-0">
              <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                <h3 className="text-lg font-[1000] text-foreground-bright uppercase tracking-tighter leading-tight group-hover:text-accent transition-colors truncate">
                  {server.serverName}
                </h3>
                <div className="text-[9px] font-bold text-muted uppercase tracking-[0.15em] opacity-70 truncate">
                  {server.categories?.length > 0 ? server.categories.slice(0, 3).join(" • ") : "Minecraft Project"}
                </div>
              </div>
              <div className="shrink-0 bg-accent/10 text-accent text-[9px] font-black px-2 py-0.5 rounded-lg border border-accent/20 h-fit mt-1">
                {server.status?.version || server.gameVersion || "1.20"}
              </div>
            </div>

            {/* Ряд 2: БАННЕР (Центрирован, h-100, overflow-hidden) */}
            <div className="relative w-full h-[100px] rounded-lg overflow-hidden bg-background border border-border group/banner flex items-center justify-center">
              {server.imageUrl ? (
                <img 
                  src={server.imageUrl} 
                  className="w-full h-full object-cover opacity-95 group-hover:opacity-100 transition-opacity" 
                  alt=""
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-surface via-background/50 to-surface flex items-center justify-center relative">
                  <HiBolt className="absolute w-24 h-24 text-foreground/[0.03] rotate-12 -right-4 -bottom-4" />
                  <div className="flex flex-col items-center gap-1 opacity-30">
                    <HiOutlinePhoto className="w-5 h-5 text-muted" />
                    <span className="text-[8px] font-[1000] uppercase tracking-[0.1em] text-muted">Нет изображения</span>
                  </div>
                </div>
              )}

              {/* Кнопка "В ТОП" поверх баннера */}
              <div 
                onClick={handleOpenBoost}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer backdrop-blur-[1px]"
              >
                <div className="flex items-center gap-2 text-white text-[9px] font-black uppercase tracking-widest bg-accent px-4 py-2 rounded-full shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                  <HiBolt className="w-4 h-4" /> В ТОП
                </div>
              </div>
            </div>

            {/* Ряд 3: Кнопки и Статистика */}
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <button 
                onClick={handleCopyIp}
                className={`h-9 px-4 rounded-lg border font-black text-[10px] uppercase tracking-wider transition-all flex-1 min-w-0 flex items-center justify-center gap-2
                  ${copied 
                    ? "bg-green-500 border-green-500 text-white" 
                    : "bg-background border-border text-foreground-bright hover:border-accent shadow-sm"
                  }`}
              >
                {copied ? <HiOutlineCheck className="w-3.5 h-3.5 shrink-0" /> : null}
                <span className="truncate">{copied ? "Скопировано" : displayIp}</span>
              </button>

              <div className="flex items-center h-9 bg-background rounded-lg border border-border overflow-hidden shadow-sm shrink-0">
                <div className="flex items-center gap-1.5 px-3 h-full hover:bg-accent/5 transition-colors cursor-pointer border-r border-border" onClick={handleOpenBoost}>
                  <HiOutlineStar className="w-4 h-4 text-accent fill-accent" />
                  <span className="text-xs font-black text-foreground-bright">{server.premiumVotes || 0}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 h-full opacity-50">
                  <HiOutlineHandThumbUp className="w-4 h-4 text-muted" />
                  <span className="text-xs font-bold text-muted">{server.votesWeekly || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Правая часть: ОНЛАЙН */}
          <div className="flex flex-col items-center justify-center px-5 py-4 md:py-0 md:w-[110px] bg-background/20 shrink-0 border-t md:border-t-0 md:border-l border-border group-hover:bg-accent/5 transition-colors">
            <div className="relative mb-1">
              <div className={`w-2 h-2 rounded-full absolute -right-2.5 -top-0.5 border border-surface shadow-[0_0_6px_rgba(34,197,94,0.4)] ${server.status?.online ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <div className="text-3xl font-[1000] text-foreground-bright tracking-tighter leading-none">
                {server.status?.players ?? 0}
              </div>
            </div>
            <div className="flex flex-col items-center leading-none">
              <span className="text-[8px] font-black text-muted uppercase tracking-widest">Онлайн</span>
              <span className="text-[7px] font-bold text-muted/40 mt-1 uppercase tracking-tighter">max: {server.status?.maxPlayers ?? 0}</span>
            </div>
          </div>

        </Link>
      </div>
      <BoostModal 
        isOpen={isBoostOpen}
        onClose={() => setIsBoostOpen(false)}
        serverId={server._id}
        serverName={server.serverName}
        userBalance={user?.balance ?? 0}
        onPurchase={handleBoostPurchase}
        loading={boostLoading}
      />
    </>
  );
}