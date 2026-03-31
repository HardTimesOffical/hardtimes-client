'use client';
import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { BoostModal } from "../payment/BoostModal";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { HiBolt, HiOutlineStar, HiOutlineCheck, HiOutlineHandThumbUp, HiOutlinePhoto, HiPlay } from "react-icons/hi2";
import { LauncherDownloadModal } from "./LauncherDownloadModal"

// ── Portal-обёртка для модалки ───────────────────────────────
function BoostModalPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

export default function ServerCard({ server }: any) {
  const { user, updateUser } = useAuth();
  const [isBoostOpen, setIsBoostOpen] = useState(false);
  const [boostLoading, setBoostLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLauncherOpen, setIsLauncherOpen] = useState(false);

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
        price: option.price,
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

  const isOnline = server.status?.online;

  return (
    <>
      <div className="group relative w-full bg-card border border-border transition-all duration-150 overflow-visible hover:border-foreground/30">
        <div className="flex flex-col md:flex-row items-stretch min-w-0">

          {/* Кликабельная область */}
          <Link href={`/monitoring/${server.slug}`} className="flex flex-1 flex-col md:flex-row items-stretch min-w-0">

            {/* ── ЛЕВАЯ ЧАСТЬ ── */}
            <div className="flex-[2] p-2.5 flex flex-col gap-2 min-w-0">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3
                    className="font-mc-title text-foreground-bright truncate leading-tight"
                    style={{ fontSize: '13px', textShadow: '1px 1px 0 rgba(0,0,0,0.4)' }}
                  >
                    {server.serverName}
                  </h3>
                  <p className="font-standard text-[10px] text-muted truncate">
                    {server.categories?.length > 0
                      ? server.categories.slice(0, 5).join(" · ")
                      : "Minecraft Project"}
                  </p>
                </div>
                <span className="shrink-0 font-mc-pixel text-[8px] text-muted/50 border border-border/40 px-1.5 py-0.5 bg-surface/50">
                  {server.status?.version || server.gameVersion || "1.20"}
                </span>
              </div>

              <div
                className="relative w-full bg-surface border border-border/40 group/banner overflow-hidden"
                style={{ height: '60px' }}
              >
                {server.imageUrl ? (
                  <img
                    src={server.imageUrl}
                    alt={server.serverName}
                    className="w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center opacity-20">
                    <HiOutlinePhoto className="w-4 h-4" />
                  </div>
                )}
                <div
                  onClick={handleOpenBoost}
                  className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover/banner:opacity-100 transition-opacity bg-black/70"
                >
                  <button className="flex items-center gap-1.5 font-standard font-bold text-[10px] text-white px-3 py-1 border border-white/20 bg-white/5 backdrop-blur-md">
                    <HiBolt className="w-3.5 h-3.5" /> ПОДНЯТЬ В ТОП
                  </button>
                </div>
              </div>
            </div>

            {/* ── СРЕДНЯЯ ЧАСТЬ ── */}
            <div className="flex-1 p-2.5 flex flex-col justify-end gap-2 md:border-l border-border/30">
              <button
                onClick={handleCopyIp}
                className="h-7 w-full flex items-center justify-center gap-2 border border-border bg-surface/30 font-mono text-[10px] text-muted hover:border-foreground/30 transition-colors"
              >
                {copied ? <HiOutlineCheck className="w-3.5 h-3.5 text-green-500" /> : null}
                <span className="truncate px-2">{copied ? "IP СКОПИРОВАН" : displayIp}</span>
              </button>

              <div className="flex items-center h-7 border border-border bg-surface divide-x divide-border">
                <div
                  className="flex-1 flex items-center justify-center gap-1.5 h-full cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={handleOpenBoost}
                >
                  <HiOutlineStar
                    className="w-3.5 h-3.5"
                    style={{
                      color: (server.premiumVotes || 0) > 0 ? '#eab308' : 'gray',
                      fill: (server.premiumVotes || 0) > 0 ? '#eab308' : 'none',
                    }}
                  />
                  <span className="font-standard font-bold text-[11px]">{server.premiumVotes || 0}</span>
                </div>
                <div className="flex-1 flex items-center justify-center gap-1.5 h-full opacity-40">
                  <HiOutlineHandThumbUp className="w-3.5 h-3.5" />
                  <span className="font-standard text-[11px]">{server.votesWeekly || 0}</span>
                </div>
              </div>
            </div>
          </Link>

          {/* ── ПРАВАЯ ЧАСТЬ ── */}
          <div className="flex flex-row md:flex-col items-center justify-between md:justify-center p-2.5 md:w-[120px] bg-surface/40 shrink-0 border-t md:border-t-0 md:border-l border-border gap-2">
            <div className="flex flex-col items-center">
              <span className="font-standard font-black text-[22px] text-foreground-bright leading-none tabular-nums">
                {server.status?.players ?? 0}
              </span>
              <div className="flex items-center gap-1 mt-1">
                <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                <span className="font-mc-pixel text-[7px] text-muted uppercase tracking-tighter">
                  {isOnline ? 'online' : 'offline'}
                </span>
              </div>
            </div>

            <button
              className="flex items-center justify-center gap-1.5 w-full py-2 px-2 bg-foreground text-background font-mc-pixel text-[10px] hover:bg-foreground-bright transition-all active:scale-95 shadow-[inset_0_-2px_0_rgba(0,0,0,0.2)]"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsLauncherOpen(true); }}
            >
              <HiPlay className="w-3 h-3" />
              ИГРАТЬ
            </button>
          </div>
        </div>
      </div>

      {/* Лаунчер модалка */}
      <LauncherDownloadModal
        isOpen={isLauncherOpen}
        onClose={() => setIsLauncherOpen(false)}
        serverName={server.serverName}
      />

      {/* Буст модалка рендерится в document.body через портал — fixed работает корректно */}
      {isBoostOpen && (
        <BoostModalPortal>
          <BoostModal
            isOpen={isBoostOpen}
            onClose={() => setIsBoostOpen(false)}
            serverId={server._id}
            serverName={server.serverName}
            userBalance={user?.balance ?? 0}
            onPurchase={handleBoostPurchase}
            loading={boostLoading}
          />
        </BoostModalPortal>
      )}
    </>
  );
}