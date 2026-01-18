"use client";

import { useEffect, useState, useMemo } from "react";
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
  const { accessToken, user, updateUser } = useAuth();
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
        updateUser({ balance: res.data.newBalance });
        setIsBoostOpen(false);
        setServer((prev) => prev ? ({
          ...prev, 
          premiumVotes: (prev.premiumVotes || 0) + option.votes
        }) : null);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Ошибка покупки");
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

  const handleVote = async () => {
    if (!accessToken) return;
    setVoteLoading(true);
    setMessage(null);
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
  if (error || !server) return <DashboardLayout><div className="p-10 text-center font-bold text-gray-500">Сервер не найден</div></DashboardLayout>;

  const isOnline = server.status?.online;

  const renderIpBlock = () => {
    let ipData = server.ipAddress;
    if (typeof ipData === 'string' && (ipData.startsWith('{') || ipData.includes('"java"'))) {
      try { ipData = JSON.parse(ipData); } catch (e) { console.error(e); }
    }

    const IpCard = ({ ip, label, statusKey }: { ip: string, label: string, statusKey: string }) => (
      <div 
        onClick={() => copyToClipboard(ip, statusKey)} 
        className="p-4 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer hover:bg-white hover:shadow-md transition-all group relative overflow-hidden"
      >
        <div className="flex justify-between items-center text-left">
          <div>
            <p className="text-gray-400 text-[10px] uppercase font-black mb-0.5 tracking-wider">{label}</p>
            <p className="font-mono text-sm text-gray-800 font-bold group-hover:text-[#ff7a00] transition">{ip}</p>
          </div>
          <div className={`text-[10px] font-bold px-2 py-1 rounded-md transition ${copyStatus === statusKey ? 'bg-green-100 text-green-600 opacity-100' : 'bg-orange-100 text-[#ff7a00] opacity-0 group-hover:opacity-100'}`}>
            {copyStatus === statusKey ? 'СКОПИРОВАНО' : 'КОПИРОВАТЬ'}
          </div>
        </div>
      </div>
    );

    if (typeof ipData === 'object' && ipData !== null) {
      const ipObj = ipData as { java?: string; bedrock?: string };
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          {ipObj.java && <IpCard ip={ipObj.java} label="Java Edition IP" statusKey="java" />}
          {ipObj.bedrock && <IpCard ip={ipObj.bedrock} label="Bedrock Edition IP" statusKey="bedrock" />}
        </div>
      );
    }
    return <IpCard ip={String(ipData)} label="Server IP" statusKey="main" />;
  };

  return (
  <DashboardLayout>
    {/* Фон всей страницы чуть темнее для контраста с карточками */}
    <div className="min-h-screen bg-[#f0f2f5] p-2 md:p-4">
      <div className="max-w-6xl mx-auto space-y-6 mt-20">
        
        {/* Шапка Сервера: Добавляем более глубокую тень */}
        <div className="relative h-50 md:h-40 w-full rounded-[2rem] overflow-hidden border border-gray-200 bg-white shadow-xl">
          {server.imageUrl ? (
            <img src={server.imageUrl} alt={server.serverName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-100 font-black italic tracking-tighter text-3xl">
              NO BANNER 470x60
            </div>
          )}
          {/* Градиент более плотный внизу для читаемости текста */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex items-end p-6 md:p-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between w-full gap-4">
              <div className="text-white">
                <h1 className="text-4xl md:text-4xl font-black tracking-tighter uppercase drop-shadow-lg" translate="no">
                  {server.serverName}
                </h1>
                <div className="flex items-center gap-3 mt-3">
                   <div className="flex items-center bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                    <span className={`h-2.5 w-2.5 rounded-full mr-2 ${isOnline ? 'bg-[#ff7a00] animate-pulse' : 'bg-gray-500'}`}></span>
                    <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white">
                      {isOnline ? `${server.status?.players} / ${server.status?.maxPlayers} ONLINE` : 'OFFLINE'}
                    </p>
                   </div>
                </div>
              </div>
              {server.isOwner && (
                <Link href={`/edit-server/${server.slug}`} className="w-fit px-8 py-3 bg-[#ff7a00] text-white font-black rounded-2xl text-xs uppercase hover:scale-105 transition-all shadow-[0_10px_20px_rgba(255,122,0,0.3)]">
                  Настройки
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Табы: делаем их более "кнопочными" */}
        <div className="flex gap-2 p-1.5 bg-gray-200/50 backdrop-blur-sm rounded-2xl border border-gray-200 w-fit">
          <button onClick={() => setActiveTab('info')} className={`px-8 py-3 rounded-xl text-xs font-black transition-all tracking-widest ${activeTab === 'info' ? 'bg-white text-[#ff7a00] shadow-md' : 'text-gray-500 hover:text-gray-700'}`}>
            ОБЗОР
          </button>
          <button onClick={() => setActiveTab('stats')} className={`px-8 py-3 rounded-xl text-xs font-black transition-all tracking-widest ${activeTab === 'stats' ? 'bg-white text-[#ff7a00] shadow-md' : 'text-gray-500 hover:text-gray-700'}`}>
            АНАЛИТИКА
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
             {activeTab === 'info' ? (
                <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 space-y-10">
                  
                  {/* IP БЛОК: Выделяем его фоном */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-1 bg-[#ff7a00] rounded-full"></div>
                      <h2 className="text-xs font-black uppercase tracking-widest text-gray-900">Адрес сервера</h2>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100">
                      {renderIpBlock()}
                    </div>
                  </div>

                  {/* Характеристики */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="group p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:border-[#ff7a00]/30 transition-colors">
                      <p className="text-gray-400 text-[10px] uppercase font-black mb-2 tracking-widest">Версия</p>
                      <p className="font-black text-gray-900 text-2xl group-hover:text-[#ff7a00] transition-colors">{server.gameVersion}</p>
                    </div>
                    <div className="group p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:border-[#ff7a00]/30 transition-colors">
                      <p className="text-gray-400 text-[10px] uppercase font-black mb-2 tracking-widest">Тип игры</p>
                      <p className="font-black text-gray-900 text-2xl group-hover:text-[#ff7a00] transition-colors">{server.gameType}</p>
                    </div>
                  </div>

                  {/* Описание */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-1 bg-[#ff7a00] rounded-full"></div>
                      <h2 className="text-xs font-black uppercase tracking-widest text-gray-900">Описание</h2>
                    </div>
                    <div className="text-gray-700 leading-relaxed bg-orange-50/30 p-8 rounded-[2rem] border border-orange-100/50 text-base italic whitespace-pre-wrap relative">
                      <span className="absolute top-4 left-4 text-4xl text-orange-200 font-serif">“</span>
                      {server.description || defaultDescription}
                    </div>
                  </div>

                  {/* Теги */}
                  <div className="flex flex-wrap gap-2 pt-4">
                    {server.categories?.map((cat, i) => (
                      <span key={i} className="px-5 py-2 bg-white text-[#ff7a00] text-[10px] font-black rounded-full uppercase border-2 border-orange-100 hover:border-[#ff7a00] transition-colors tracking-tighter">
                        # {cat}
                      </span>
                    ))}
                  </div>
                </div>
             ) : (
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl min-h-[450px] flex flex-col items-center justify-center">
                   <div className="w-full">
                    {stats.length > 0 ? <ServerChart data={stats} /> : <p className="text-center text-gray-300 font-black uppercase italic tracking-widest">Collecting Data...</p>}
                   </div>
                </div>
             )}
          </div>

          {/* Правая колонка */}
          <div className="space-y-6">
            {/* Голосование: Делаем его самым ярким */}
            <div className="bg-white p-8 rounded-[2rem] border-2 border-[#ff7a00] shadow-[0_15px_30px_rgba(255,122,0,0.15)] text-center relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-orange-50 rounded-full"></div>
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-6 relative z-10">Поддержать проект</h3>
              <button 
                onClick={handleVote}
                disabled={!accessToken || voteLoading}
                className="w-full py-5 bg-[#ff7a00] hover:bg-[#e66e00] text-white rounded-2xl font-black shadow-lg shadow-orange-200 transition-all active:scale-95 uppercase text-sm tracking-[0.1em] relative z-10"
              >
                {voteLoading ? "..." : "ПРОГОЛОСОВАТЬ"}
              </button>
              {message && <p className={`text-[10px] font-black mt-4 p-3 rounded-xl uppercase tracking-tighter ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message.text}</p>}
            </div>

            {/* Premium Stats */}
            <div onClick={() => setIsBoostOpen(true)} className="bg-[#111] p-8 rounded-[2rem] cursor-pointer hover:bg-black transition-all group shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <div className="w-12 h-12 bg-[#ff7a00] rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                </div>
              </div>
              <p className="text-[#ff7a00] text-[10px] font-black uppercase tracking-widest mb-1">Premium Stars</p>
              <p className="text-5xl font-black text-white italic">{server.premiumVotes || 0}</p>
              <p className="text-white/40 text-[9px] font-black uppercase mt-6 tracking-widest group-hover:text-white transition-colors">Boost Server with HC stars →</p>
            </div>

            {/* Weekly Votes */}
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-md flex justify-between items-center">
               <div>
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Weekly</p>
                  <p className="text-4xl font-black text-gray-900">{server.votesWeekly || 0}</p>
               </div>
               <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="#ff7a00" className="opacity-50"><path d="M5 15l7-7 7 7"/></svg>
               </div>
            </div>

            {/* Соцсети: Делаем их строгими */}
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-md space-y-4">
              <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Официальные ссылки</h3>
              {server.website && (
                <a href={server.website} target="_blank" className="flex items-center justify-between w-full p-4 rounded-2xl bg-gray-50 text-gray-900 hover:bg-gray-900 hover:text-white transition-all text-xs font-black uppercase tracking-widest group">
                  Сайт проекта <span className="opacity-0 group-hover:opacity-100 mr-2">→</span>
                </a>
              )}
              {server.discord && (
                <a href={server.discord} target="_blank" className="flex items-center justify-between w-full p-4 rounded-2xl bg-[#5865F2]/10 text-[#5865F2] hover:bg-[#5865F2] hover:text-white transition-all text-xs font-black uppercase tracking-widest group">
                  Discord <span className="opacity-0 group-hover:opacity-100 mr-2">→</span>
                </a>
              )}
            </div>
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
  </DashboardLayout>
);
}