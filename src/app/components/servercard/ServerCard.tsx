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
          
          {/* Левая часть: уменьшили padding с p-4 до p-3 и gap с 3 до 2 */}
          <div className="flex-1 p-3 flex flex-col gap-2 min-w-0">
            
            {/* Ряд 1: Название */}
            <div className="flex items-start justify-between gap-4 min-w-0">
              <div className="flex flex-col gap-0 min-w-0 flex-1">
                <h3 className="text-base font-[1000] text-foreground-bright uppercase tracking-tighter leading-tight group-hover:text-accent transition-colors truncate">
                  {server.serverName}
                </h3>
                <div className="text-[8px] font-bold text-muted uppercase tracking-[0.12em] opacity-70 truncate">
                  {server.categories?.length > 0 ? server.categories.slice(0, 3).join(" • ") : "Minecraft Project"}
                </div>
              </div>
              <div className="shrink-0 bg-accent/10 text-accent text-[8px] font-black px-1.5 py-0.5 rounded-md border border-accent/20 h-fit">
                {server.status?.version || server.gameVersion || "1.20"}
              </div>
            </div>

          {/* Ряд 2: БАННЕР (Центрирован, строго 468x60) */}
<div className="relative w-full flex justify-center">
  <div className="relative w-full max-w-[468px] h-[60px] md:w-[468px] rounded-lg overflow-hidden bg-background border border-border group/banner flex items-center justify-center">
    {server.imageUrl ? (
      <img 
        src={server.imageUrl} 
        /* object-cover: растягивает без искажения пропорций, заполняя всё место */
        className="w-full h-full object-cover opacity-95 group-hover:opacity-100 transition-opacity" 
        alt={server.serverName}
      />
    ) : (
      <div className="w-full h-full bg-gradient-to-br from-surface via-background/50 to-surface flex items-center justify-center relative">
        <HiBolt className="absolute w-12 h-12 text-foreground/[0.03] rotate-12 -right-2 -bottom-2" />
        <div className="flex flex-col items-center gap-0.5 opacity-30">
          <HiOutlinePhoto className="w-4 h-4 text-muted" />
          <span className="text-[7px] font-[1000] uppercase tracking-[0.1em] text-muted">Нет изображения</span>
        </div>
      </div>
    )}

    {/* Оверлей при наведении */}
    <div 
      onClick={handleOpenBoost}
      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer backdrop-blur-[1px]"
    >
      <div className="flex items-center gap-2 text-white text-[9px] font-black uppercase tracking-widest bg-accent px-4 py-1.5 rounded-full shadow-2xl scale-90 group-hover:scale-100 transition-transform">
        <HiBolt className="w-3 h-3" /> В ТОП
      </div>
    </div>
  </div>
</div>

            {/* Ряд 3: Кнопки (Уменьшена высота h-9 -> h-8) */}
            <div className="flex items-center gap-2 min-w-0">
              <button 
                onClick={handleCopyIp}
                className={`h-8 px-3 rounded-lg border font-black text-[9px] uppercase tracking-wider transition-all flex-1 min-w-0 flex items-center justify-center gap-2
                  ${copied 
                    ? "bg-green-500 border-green-500 text-white" 
                    : "bg-background border-border text-foreground-bright hover:border-accent shadow-sm"
                  }`}
              >
                {copied ? <HiOutlineCheck className="w-3 h-3 shrink-0" /> : null}
                <span className="truncate">{copied ? "Скопировано" : displayIp}</span>
              </button>

              <div className="flex items-center h-8 bg-background rounded-lg border border-border overflow-hidden shadow-sm shrink-0">
                <div className="flex items-center gap-1 px-2.5 h-full hover:bg-accent/5 transition-colors cursor-pointer border-r border-border" onClick={handleOpenBoost}>
                  <HiOutlineStar className="w-3.5 h-3.5 text-accent fill-accent" />
                  <span className="text-[10px] font-black text-foreground-bright">{server.premiumVotes || 0}</span>
                </div>
                <div className="flex items-center gap-1 px-2.5 h-full opacity-50">
                  <HiOutlineHandThumbUp className="w-3.5 h-3.5 text-muted" />
                  <span className="text-[10px] font-bold text-muted">{server.votesWeekly || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Правая часть: ОНЛАЙН (Уменьшена ширина 110px -> 90px) */}
          <div className="flex flex-col items-center justify-center px-3 py-3 md:py-0 md:w-[90px] bg-background/20 shrink-0 border-t md:border-t-0 md:border-l border-border group-hover:bg-accent/5 transition-colors">
            <div className="relative mb-0.5">
              <div className={`w-1.5 h-1.5 rounded-full absolute -right-2 -top-0 border border-surface shadow-[0_0_4px_rgba(34,197,94,0.4)] ${server.status?.online ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <div className="text-2xl font-[1000] text-foreground-bright tracking-tighter leading-none">
                {server.status?.players ?? 0}
              </div>
            </div>
            <div className="flex flex-col items-center leading-none">
              <span className="text-[7px] font-black text-muted uppercase tracking-widest">Онлайн</span>
              <span className="text-[6px] font-bold text-muted/40 mt-0.5 uppercase tracking-tighter">max: {server.status?.maxPlayers ?? 0}</span>
            </div>
          </div>

        </Link>
      </div>
      {/* BoostModal остается без изменений */}
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