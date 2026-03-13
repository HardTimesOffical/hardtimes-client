'use client';
import { useState, useMemo } from "react";
import Link from "next/link";
import { BoostModal } from "../payment/BoostModal";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { HiBolt, HiOutlineStar, HiOutlineCheck, HiOutlineHandThumbUp, HiOutlinePhoto } from "react-icons/hi2";

export default function ServerCard({ server }: any) {
  const { user, updateUser } = useAuth();
  const [isBoostOpen, setIsBoostOpen] = useState(false);
  const [boostLoading, setBoostLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const displayIp = useMemo(() => {
    let ipData = server.ipAddress;
    if (typeof ipData === 'string' && ipData.startsWith('{')) {
      try { ipData = JSON.parse(ipData); } catch {}
    }
    if (typeof ipData === 'object' && ipData !== null) {
      return ipData.java || ipData.bedrock || "IP не указан";
    }
    return ipData || "IP не указан";
  }, [server.ipAddress]);

  const handleOpenBoost = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); setIsBoostOpen(true); };
  const handleCopyIp = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    navigator.clipboard.writeText(displayIp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const handleBoostPurchase = async (option: any) => {
    setBoostLoading(true);
    try {
      const res = await api.post('/boost/boost', { serverId: server._id, votes: option.votes, days: option.days, price: option.price });
      if (res.data.success) { updateUser({ balance: res.data.newBalance }); setIsBoostOpen(false); }
    } catch (err: any) { alert(err.response?.data?.message || "Ошибка"); }
    finally { setBoostLoading(false); }
  };

  const isOnline = server.status?.online;

  return (
    <>
      <div className="group relative w-full bg-card border border-border
        transition-colors duration-150 overflow-hidden hover:border-foreground/20">

        <Link href={`/monitoring/${server.slug}`} className="flex flex-col md:flex-row items-stretch min-w-0">

          {/* ── ЛЕВАЯ: контент ── */}
          <div className="flex-1 p-3 flex flex-col gap-2.5 min-w-0">

            {/* Ряд 1: Название + версия */}
            <div className="flex items-start justify-between gap-3 min-w-0">
              <div className="min-w-0 flex-1">
                <h3 className="font-mc-title text-foreground-bright truncate leading-tight
                  transition-colors duration-150 group-hover:text-foreground-bright"
                  style={{ fontSize: 'clamp(11px, 1.2vw, 13px)', textShadow: '1px 1px 0 rgba(0,0,0,0.4)' }}>
                  {server.serverName}
                </h3>
                <p className="font-standard text-[10px] text-muted truncate mt-0.5">
                  {server.categories?.length > 0
                    ? server.categories.slice(0, 3).join(" · ")
                    : "Minecraft Project"}
                </p>
              </div>
              {/* Версия — нейтральный тег */}
              <span className="shrink-0 font-mc-pixel text-[8px] text-muted/60
                border border-border/60 px-1.5 py-0.5 bg-surface leading-none">
                {server.status?.version || server.gameVersion || "1.20"}
              </span>
            </div>

            {/* Ряд 2: Баннер
                - object-contain: баннер виден целиком, не обрезается
                - Центрируется по горизонтали и вертикали
                - Высота 72px — больше чем было 60px, баннер заметнее
            */}
            <div className="relative w-full bg-surface border border-border/60 group/banner overflow-hidden"
              style={{ height: '72px' }}>
              {server.imageUrl ? (
                <img
                  src={server.imageUrl}
                  alt={server.serverName}
                  className="w-full h-full object-contain object-center
                    opacity-85 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ imageRendering: 'auto' }}
                />
              ) : (
                /* Плейсхолдер: название сервера как текст */
                <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                  <HiOutlinePhoto className="w-4 h-4 text-muted/30" />
                  <span className="font-mc-pixel text-[8px] text-muted/30 uppercase tracking-wide">
                    {server.serverName}
                  </span>
                </div>
              )}

              {/* Оверлей буста при hover — тёмный, нейтральный */}
              <div
                onClick={handleOpenBoost}
                className="absolute inset-0 flex items-center justify-center cursor-pointer
                  opacity-0 group-hover/banner:opacity-100 transition-opacity duration-150"
                style={{ background: 'rgba(0,0,0,0.7)' }}
              >
                <button
                  className="flex items-center gap-1.5 font-standard font-bold text-[11px] text-white
                    px-4 py-1.5 border border-white/20 transition-all hover:bg-white/10"
                  style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(4px)' }}
                >
                  <HiBolt className="w-3.5 h-3.5" />
                  Поднять в ТОП
                </button>
              </div>
            </div>

            {/* Ряд 3: IP + голоса */}
            <div className="flex items-center gap-2 min-w-0">

              {/* Копировать IP */}
              <button
                onClick={handleCopyIp}
                className="h-7 flex-1 min-w-0 flex items-center justify-center gap-1.5
                  border border-border bg-surface font-standard text-[11px]
                  transition-all duration-150 px-2 hover:border-foreground/30"
                style={copied ? {
                  background: '#1a1a1a',
                  borderColor: '#3a3a3a',
                  color: '#d4d4d4',
                } : undefined}
              >
                {copied && <HiOutlineCheck className="w-3 h-3 shrink-0 text-muted" />}
                <span className="truncate font-mono text-[10px] text-muted">
                  {copied ? "Скопировано" : displayIp}
                </span>
              </button>

              {/* Голоса */}
              <div className="flex items-center h-7 border border-border bg-surface
                shrink-0 divide-x divide-border overflow-hidden">
                <button
                  onClick={handleOpenBoost}
                  className="flex items-center gap-1 px-2.5 h-full
                    hover:bg-foreground/5 transition-colors"
                  title="Поднять в топ"
                >
                  {/* Звезда — нейтральный цвет, только у премиум-серверов акцент */}
                  <HiOutlineStar
                    className="w-3 h-3 shrink-0"
                    style={{
                      color: (server.premiumVotes || 0) > 0 ? '#eab308' : 'var(--muted)',
                      fill:  (server.premiumVotes || 0) > 0 ? '#eab308' : 'none',
                    }}
                  />
                  <span className="font-standard font-bold text-[10px] text-foreground-bright">
                    {server.premiumVotes || 0}
                  </span>
                </button>
                <div className="flex items-center gap-1 px-2.5 h-full opacity-40">
                  <HiOutlineHandThumbUp className="w-3 h-3 text-muted shrink-0" />
                  <span className="font-standard text-[10px] text-muted">
                    {server.votesWeekly || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── ПРАВАЯ: онлайн — тёмная нейтральная панель ── */}
          <div className="flex flex-col items-center justify-center px-4 py-3 md:py-0 md:w-[80px]
            bg-surface shrink-0 border-t md:border-t-0 md:border-l border-border">

            {/* Число игроков */}
            <span className="font-standard font-black text-[22px] text-foreground-bright
              leading-none tabular-nums mb-1">
              {server.status?.players ?? 0}
            </span>

            <div className="flex items-center gap-1">
              {/* Статус-точка: только здесь зелёный/красный — функциональный цвет */}
              <div
                className={`w-1.5 h-1.5 shrink-0 ${isOnline ? 'animate-pulse' : ''}`}
                style={{ background: isOnline ? '#5aac44' : '#ef4444' }}
              />
              <span className="font-mc-pixel text-[7px] text-muted uppercase tracking-wide">
                {isOnline ? 'Онлайн' : 'Оффлайн'}
              </span>
            </div>

            <span className="font-mc-pixel text-[6px] text-muted/30 uppercase mt-1">
              /{server.status?.maxPlayers ?? 0}
            </span>
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