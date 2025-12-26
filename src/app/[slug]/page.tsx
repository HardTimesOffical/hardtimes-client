"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/app/components/dashboard/dashboard";
import Link from "next/link";

export default function ServerPage() {
  const { slug } = useParams();
  const { accessToken } = useAuth();

  const [server, setServer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [voteLoading, setVoteLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  // Функция для копирования IP
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyStatus(text);
      setTimeout(() => setCopyStatus(null), 2000);
    });
  };

  // Парсинг IP (строка или JSON)
const renderIPs = () => {
  if (!server?.ipAddress) return null;

  const CopyFeedback = () => (
    <span className="absolute -top-10 right-0 bg-green-500 text-white text-[10px] px-2 py-1 rounded shadow-lg copy-tooltip font-bold z-50">
      Copied!
      <span className="absolute -bottom-1 right-3 w-2 h-2 bg-green-500 rotate-45"></span>
    </span>
  );

  try {
    const parsed = JSON.parse(server.ipAddress);
    return (
      /* Добавляем pt-8, чтобы тултипу Java было куда всплывать */
      <div className="flex flex-col gap-2 w-full pt-8"> 
        {parsed.java && (
          <div 
            onClick={() => copyToClipboard(parsed.java)}
            /* Убеждаемся, что здесь НЕТ overflow-hidden */
            className="group relative flex items-center justify-between bg-white/5 p-2.5 rounded-lg border border-white/5 hover:border-green-500/50 hover:bg-green-500/5 transition-all cursor-pointer"
          >
            <div className="flex flex-col overflow-hidden flex-1">
              <span className="text-[9px] uppercase opacity-40 font-bold tracking-tighter">Java Edition</span>
              <span className="font-mono text-green-400 truncate text-sm">{parsed.java}</span>
            </div>
            <svg className="w-4 h-4 ml-2 opacity-20 group-hover:opacity-100 transition-opacity shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
            {copyStatus === parsed.java && <CopyFeedback />}
          </div>
        )}

        {parsed.bedrock && (
          <div 
            onClick={() => copyToClipboard(parsed.bedrock)}
            className="group relative flex items-center justify-between bg-white/5 p-2.5 rounded-lg border border-white/5 hover:border-green-500/50 hover:bg-green-500/5 transition-all cursor-pointer"
          >
            <div className="flex flex-col overflow-hidden flex-1">
              <span className="text-[9px] uppercase opacity-40 font-bold tracking-tighter">Bedrock / PE</span>
              <span className="font-mono text-green-400 truncate text-sm">{parsed.bedrock}</span>
            </div>
            <svg className="w-4 h-4 ml-2 opacity-20 group-hover:opacity-100 transition-opacity shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
            {copyStatus === parsed.bedrock && <CopyFeedback />}
          </div>
        )}
      </div>
    );
  } catch (e) {
    /* Для одиночного IP тоже добавляем пространство сверху */
    return (
      <div className="pt-8 w-full">
        <div 
          onClick={() => copyToClipboard(server.ipAddress)}
          className="group relative flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/5 hover:border-green-500/50 transition-all cursor-pointer"
        >
          <span className="font-mono text-green-400 truncate text-sm">{server.ipAddress}</span>
          {copyStatus === server.ipAddress && <CopyFeedback />}
        </div>
      </div>
    );
  }
};

  const handleVote = () => {
    if (!accessToken) return;
    setVoteLoading(true);
    setMessage(null);

    if (window.onclicka) {
      window.onclicka.runAd({
        zoneId: "405773",
        container: "#video-ad-container",
        onAdFinished: () => confirmVote(),
        onAdError: () => confirmVote(),
        onAdClosed: () => {
          setVoteLoading(false);
          setMessage({ type: 'error', text: 'Нужно досмотреть видео для голосования' });
        }
      });
    } else {
      confirmVote();
    }
  };

  const confirmVote = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/servers/${server._id}/vote`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${accessToken}` }
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: 'Голос засчитан!' });
        setServer({ ...server, votesWeekly: server.votesWeekly + 1 });
      } else {
        setMessage({ type: 'error', text: data.message || 'Ошибка' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Ошибка сети' });
    } finally {
      setVoteLoading(false);
    }
  };

  useEffect(() => {
    if (!slug) return;
    const fetchServer = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/servers/by-slug/${slug}`, {
          headers: { ...(accessToken ? { "Authorization": `Bearer ${accessToken}` } : {}) }
        });
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setServer(data);
        setError(false);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchServer();
  }, [slug, accessToken]);

  if (loading || !server) return <DashboardLayout><div className="p-10 text-center">Загрузка...</div></DashboardLayout>;
  if (error) return <DashboardLayout><div className="p-10 text-center">Сервер не найден</div></DashboardLayout>;

  const isOnline = server.status?.online;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto p-4 space-y-6 text-white">
        
        {/* Шапка */}
        <div className="relative h-48 md:h-64 w-full rounded-2xl overflow-hidden border border-white/10 bg-gray-900 shadow-2xl">
          {server.imageUrl ? (
            <img src={server.imageUrl} alt={server.serverName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/20">Нет изображения</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end p-6">
            <div className="flex items-center justify-between w-full">
              <div>
                <h1 className="text-3xl md:text-4xl font-black">{server.serverName}</h1>
                <div className="flex items-center gap-3 mt-1">
                   <span className={`h-2.5 w-2.5 rounded-full animate-pulse ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
                   <p className="text-sm font-medium opacity-80">
                     {isOnline ? `Online: ${server.status.players}/${server.status.maxPlayers}` : 'Offline'}
                   </p>
                </div>
              </div>
              {server.isOwner && (
                <Link href={`/edit-server/${server.slug}`} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm backdrop-blur-md transition">
                  Редактировать
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Сетка контента */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="md:col-span-2 space-y-6">
            {/* Карточки параметров */}
            <div className="bg-[#0b1224] p-6 rounded-2xl border border-white/5 shadow-xl">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="h-5 rounded-full"></span>
                Информация
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <p className="opacity-40 text-[10px] uppercase font-bold tracking-wider mb-1">Версия</p>
                  <p className="font-semibold text-blue-400">{server.gameVersion}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <p className="opacity-40 text-[10px] uppercase font-bold tracking-wider mb-1">Тип игры</p>
                  <p className="font-semibold text-purple-400">{server.gameType}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5 overflow-hidden">
                  <p className="opacity-40 text-[10px] uppercase font-bold tracking-wider mb-1">IP Адрес (click to copy)</p>
                  {renderIPs()}
                </div>
                <div className="p-4 bg-white/4 rounded-xl flex flex-col justify-between border border-white/5">
                  <p className="opacity-40 text-[10px] uppercase font-bold tracking-wider mb-1">Рейтинг</p>
                  <p className="font-bold text-yellow-500 text-lg">⭐ {server.votesWeekly}</p>
                </div>
              </div>

              {/* Описание */}
              {server.description && (
                <div className="mt-8">
                  <h3 className="text-sm font-bold opacity-40 uppercase mb-3">Описание</h3>
                  <div className="text-white/80 leading-relaxed whitespace-pre-wrap bg-white/5 p-4 rounded-xl italic">
                    {server.description}
                  </div>
                </div>
              )}

              {/* Теги */}
              <div className="mt-8 flex flex-wrap gap-2">
                {server.categories.map((c: string) => (
                  <span key={c} className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-xs font-medium">
                    {c}
                  </span>
                ))}
                {server.tags.map((t: string) => (
                  <span key={t} className="px-3 py-1 bg-white/5 text-white/40 border border-white/10 rounded-lg text-xs hover:text-white transition">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Правая колонка */}
          <div className="space-y-6">
            <div className="bg-[#0b1224] p-6 rounded-2xl border border-white/5 shadow-xl text-center">
              <h3 className="text-lg font-bold mb-4 italic">Support Server</h3>
              <button 
                onClick={handleVote}
                disabled={!accessToken || voteLoading}
                className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-gray-700 disabled:to-gray-800 font-black shadow-lg shadow-green-900/100 transition-all active:scale-95 uppercase"
              >
                {voteLoading ? "Processing..." : "Vote Now"}
              </button>

              {message && (
                <p className={`text-xs font-bold mt-3 p-2 rounded bg-white/5 ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                  {message.text}
                </p>
              )}
              {!accessToken && <p className="text-[10px] text-white/30 mt-3 uppercase tracking-tighter">Login required to vote</p>}
            </div>

            <div className="bg-[#0b1224] p-6 rounded-2xl border border-white/5 shadow-xl space-y-4">
              <h3 className="text-[10px] font-black uppercase opacity-30 tracking-widest">Community Links</h3>
              <div className="grid grid-cols-1 gap-2">
                {server.website && (
                  <a href={server.website} target="_blank" className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 transition text-sm font-bold">
                    Official Website
                  </a>
                )}
                {server.discord && (
                  <a href={server.discord} target="_blank" className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600/20 transition text-sm font-bold">
                    Discord Server
                  </a>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
      <div id="video-ad-container" style={{ position: 'fixed', zIndex: 9999 }}></div>
    </DashboardLayout>
  );
}