"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/app/components/dashboard/dashboard";
import Link from "next/link";
import LoadingCrystal from "../components/loading/LoadingCrystal";
import { useLanguage } from "@/context/LanguageContext";
import ServerChart from "../components/stats/ServerChart";
import { BoostModal } from "../components/payment/BoostModal";
import api from "@/lib/api";

// Интерфейсы
interface IServerData {
  _id: string;
  serverName: string;
  slug: string;
  imageUrl?: string;
  gameVersion: string;
  gameType: string;
  ipAddress: string | { java?: string; bedrock?: string };
  description?: string;
  premiumVotes: number;
  votesWeekly: number;
  isOwner?: boolean;
  status?: {
    online: boolean;
    players: number;
    maxPlayers: number;
  };
  categories?: string[];
  tags?: string[];
  website?: string;
  discord?: string;
}

interface Props {
  slug: string;
  initialData: IServerData | null;
}

export default function ServerPageClient({ slug, initialData }: Props) {
  const { accessToken, user } = useAuth();
  const { t } = useLanguage();
  
  const [activeTab, setActiveTab] = useState<'info' | 'stats'>('info');
  const [stats, setStats] = useState<any[]>([]);
  const [isBoostOpen, setIsBoostOpen] = useState(false);
  const [boostLoading, setBoostLoading] = useState(false);
  
  const [server, setServer] = useState<IServerData | null>(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState(false);
  const [voteLoading, setVoteLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const defaultDescription = `Добро пожаловать на наш официальный игровой проект...`;

  useEffect(() => {
    if (server?._id) {
      api.get(`/statistics/${server._id}/stats?days=1`)
        .then(res => {
          if (res.data && res.data.length > 0) {
            setStats(res.data[res.data.length - 1].points || []);
          }
        })
        .catch(err => console.error("Stats loading error:", err));
    }
  }, [server?._id]);

  const handleBoostPurchase = async (option: any) => {
    setBoostLoading(true);
    try {
      const res = await api.post('/boost/boost', {
        serverId: server?._id,
        votes: option.votes,
        days: option.days,
        price: option.price
      });
      
      if (res.data.success) {
        alert(`Сервер успешно забущен! Остаток: ${res.data.newBalance} HC`);
        setIsBoostOpen(false);
        setServer((prev) => prev ? ({
          ...prev, 
          premiumVotes: (prev.premiumVotes || 0) + option.votes
        }) : null);
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Ошибка покупки";
      alert(errMsg);
    } finally {
      setBoostLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyStatus(label);
      setTimeout(() => setCopyStatus(null), 2000);
    });
  };

  const confirmVote = async () => {
    try {
      const res = await api.post(`/servers/${server?._id}/vote`);
      if (res.status === 200) {
        setMessage({ type: 'success', text: 'Голос засчитан!' });
        setServer((prev) => prev ? ({ ...prev, votesWeekly: (prev.votesWeekly || 0) + 1 }) : null);
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Ошибка' });
    } finally {
      setVoteLoading(false);
    }
  };

  const handleVote = () => {
    if (!accessToken) return;
    setVoteLoading(true);
    setMessage(null);
    confirmVote();
  };

  useEffect(() => {
    const shouldFetch = !initialData || (accessToken && !server?.isOwner);
    if (shouldFetch && slug) {
      const fetchServer = async () => {
        try {
          if (!server) setLoading(true);
          const res = await api.get(`/servers/by-slug/${slug}`);
          setServer(res.data);
          setError(false);
        } catch (err) {
          if (!server) setError(true);
        } finally {
          setLoading(false);
        }
      };
      fetchServer();
    }
  }, [slug, accessToken]);

  if (loading && !server) return <DashboardLayout><div className="relative w-full h-[60vh] flex items-center justify-center"><LoadingCrystal /></div></DashboardLayout>;
  if (error || !server) return <DashboardLayout><div className="p-10 text-center">Сервер не найден</div></DashboardLayout>;

  const isOnline = server.status?.online;

  // ИСПРАВЛЕННЫЙ Хелпер для отрисовки IP
  const renderIpBlock = () => {
    // 1. Проверка на строку
    if (typeof server.ipAddress === 'string') {
      const currentIp = server.ipAddress;
      return (
        <div 
          onClick={() => copyToClipboard(currentIp, 'main')}
          className="p-4 bg-white/5 rounded-xl border border-white/5 cursor-pointer hover:bg-white/10 transition group"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="opacity-40 text-[10px] uppercase font-bold mb-1">IP Address</p>
              <p className="font-mono text-white group-hover:text-blue-400 transition">{currentIp}</p>
            </div>
            <span className="text-[10px] text-blue-500 font-bold opacity-0 group-hover:opacity-100 transition">
              {copyStatus === 'main' ? 'COPIED!' : 'CLICK TO COPY'}
            </span>
          </div>
        </div>
      );
    }

    // 2. Если это объект (Сужаем тип для TypeScript)
    const ipObj = server.ipAddress;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ipObj?.java && (
          <div 
            onClick={() => copyToClipboard(ipObj.java!, 'java')}
            className="p-4 bg-white/5 rounded-xl border border-white/5 cursor-pointer hover:bg-white/10 transition group"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="opacity-40 text-[10px] uppercase font-bold mb-1">Java Edition IP</p>
                <p className="font-mono text-white group-hover:text-blue-400 transition">{ipObj.java}</p>
              </div>
              <span className="text-[10px] text-blue-500 font-bold opacity-0 group-hover:opacity-100 transition">
                {copyStatus === 'java' ? 'COPIED!' : 'COPY'}
              </span>
            </div>
          </div>
        )}
        {ipObj?.bedrock && (
          <div 
            onClick={() => copyToClipboard(ipObj.bedrock!, 'bedrock')}
            className="p-4 bg-white/5 rounded-xl border border-white/5 cursor-pointer hover:bg-white/10 transition group"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="opacity-40 text-[10px] uppercase font-bold mb-1">Bedrock IP</p>
                <p className="font-mono text-white group-hover:text-purple-400 transition">{ipObj.bedrock}</p>
              </div>
              <span className="text-[10px] text-purple-500 font-bold opacity-0 group-hover:opacity-100 transition">
                {copyStatus === 'bedrock' ? 'COPIED!' : 'COPY'}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto p-4 space-y-6 text-white">
        
        {/* Шапка Сервера */}
        <div className="relative h-40 w-full rounded-2xl overflow-hidden border border-white/10 bg-gray-900 shadow-2xl">
          {server.imageUrl ? (
            <img src={server.imageUrl} alt={server.serverName} className="w-full h-40 object-cover" />
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
                     {isOnline ? `Online: ${server.status?.players}/${server.status?.maxPlayers}` : 'Offline'}
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

        {/* Табы */}
        <div className="flex gap-1 p-1 bg-white/5 rounded-xl border border-white/5 w-fit">
          <button onClick={() => setActiveTab('info')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'info' ? 'bg-blue-600 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}>
            Информация
          </button>
          <button onClick={() => setActiveTab('stats')} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'stats' ? 'bg-blue-600 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}>
            Статистика
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
             {activeTab === 'info' ? (
                <div className="bg-[#0b1224] p-6 rounded-2xl border border-white/5 shadow-xl space-y-6">
                  <h2 className="text-lg font-bold">Информация</h2>
                  
                  {/* IP БЛОК */}
                  {renderIpBlock()}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                      <p className="opacity-40 text-[10px] uppercase font-bold mb-1">Версия</p>
                      <p className="font-semibold text-blue-400">{server.gameVersion}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                      <p className="opacity-40 text-[10px] uppercase font-bold mb-1">Тип</p>
                      <p className="font-semibold text-purple-400">{server.gameType}</p>
                    </div>
                  </div>
                  <div className="italic text-white/80 whitespace-pre-wrap bg-white/5 p-4 rounded-xl border border-white/5">
                    {server.description || defaultDescription}
                  </div>
                </div>
             ) : (
                <div className="bg-[#0b1224] p-6 rounded-2xl border border-white/5 shadow-xl">
                   {stats.length > 0 ? <ServerChart data={stats} /> : <p className="text-center opacity-20">Загрузка данных...</p>}
                </div>
             )}
          </div>

          <div className="space-y-4">
            <div className="bg-[#0b1224] p-6 rounded-2xl border border-white/5 shadow-xl text-center">
              <h3 className="text-lg font-bold mb-4 italic">Поддержать сервер</h3>
              <button 
                onClick={handleVote}
                disabled={!accessToken || voteLoading}
                className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-gray-700 disabled:to-gray-800 font-black shadow-lg transition-all active:scale-95 uppercase"
              >
                {voteLoading ? "..." : "Голосовать"}
              </button>
              {message && <p className={`text-xs font-bold mt-3 p-2 rounded bg-white/5 ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>{message.text}</p>}
            </div>

            <div 
              onClick={() => setIsBoostOpen(true)}
              className="bg-blue-600/10 border border-blue-500/20 p-5 rounded-2xl cursor-pointer hover:bg-blue-600/20 transition-all group shadow-xl"
            >
              <div className="flex justify-between items-center">
                 <div>
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Premium Votes</p>
                    <p className="text-3xl font-black">{server.premiumVotes || 0}</p>
                 </div>
                 <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/40 group-hover:scale-110 transition-transform">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                 </div>
              </div>
              <p className="text-[9px] font-bold text-white/30 uppercase mt-3 tracking-widest">Усилить сервер за HC звезды</p>
            </div>

            <div className="bg-[#0b1224] border border-white/5 p-5 rounded-2xl shadow-xl">
              <div className="flex justify-between items-center">
                 <div>
                    <p className="text-[10px] font-black text-green-400 uppercase tracking-widest">Weekly Votes</p>
                    <p className="text-3xl font-black">{server.votesWeekly || 0}</p>
                 </div>
                 <div className="w-12 h-12 bg-green-600/20 rounded-2xl flex items-center justify-center border border-green-500/20">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#4ade80"><path d="M5 15l7-7 7 7"/></svg>
                 </div>
              </div>
              <p className="text-[9px] font-bold text-white/20 uppercase mt-3 tracking-widest">Голоса обычных пользователей</p>
            </div>

            <div className="bg-[#0b1224] p-6 rounded-2xl border border-white/5 shadow-xl space-y-3">
              <h3 className="text-[10px] font-black uppercase opacity-30 tracking-widest">Ссылки</h3>
              {server.website && <a href={server.website} target="_blank" className="block text-center py-2 rounded-lg bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 transition text-sm font-bold">Сайт проекта</a>}
              {server.discord && <a href={server.discord} target="_blank" className="block text-center py-2 rounded-lg bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600/20 transition text-sm font-bold">Discord</a>}
            </div>
          </div>
        </div>
      </div>

      <BoostModal 
        isOpen={isBoostOpen}
        onClose={() => setIsBoostOpen(false)}
        serverName={server.serverName}
        userBalance={user?.balance ?? 0}
        onPurchase={handleBoostPurchase}
        loading={boostLoading}
      />
      
      <div id="video-ad-container" style={{ position: 'fixed', zIndex: 9999 }}></div>
    </DashboardLayout>
  );
}