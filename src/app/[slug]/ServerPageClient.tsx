"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/app/components/dashboard/dashboard";
import Link from "next/link";
import LoadingCrystal from "../components/loading/LoadingCrystal";
import { useLanguage } from "@/context/LanguageContext";
import ServerChart from "../components/stats/ServerChart";
import { BoostModal } from "../components/payment/BoostModal";
import api from "@/lib/api";
import { HiOutlineArrowTopRightOnSquare, HiOutlineGlobeAlt, HiOutlineChatBubbleLeftRight, HiOutlineCog6Tooth } from 'react-icons/hi2';

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
  owner?: string; // ID владельца сервера
  status?: { online: boolean; players: number; maxPlayers: number; };
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

  // Проверка прав на редактирование
  const canEdit = server?.isOwner || (user && server?.owner === user._id);

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
        setMessage({ type: 'success', text: 'Голос успешно засчитан!' });
        setServer((prev) => prev ? ({ ...prev, votesWeekly: (prev.votesWeekly || 0) + 1 }) : null);
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Ошибка при голосовании' });
    } finally {
      setVoteLoading(false);
    }
  };

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
        setServer((prev) => prev ? ({ ...prev, premiumVotes: (prev.premiumVotes || 0) + option.votes }) : null);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Ошибка покупки");
    } finally {
      setBoostLoading(false);
    }
  };

  if (loading && !server) return <div className="relative w-full h-[60vh] flex items-center justify-center"><LoadingCrystal /></div>;
  if (error || !server) return <div className="p-10 text-center font-bold text-gray-500 uppercase text-[10px]">Сервер не найден</div>;

  const isOnline = server.status?.online;

  const renderIpBlock = () => {
    let ipData = server.ipAddress;
    if (typeof ipData === 'string' && ipData.includes('"java"')) {
      try { ipData = JSON.parse(ipData); } catch (e) { console.error(e); }
    }

    const IpCard = ({ ip, label, statusKey }: { ip: string, label: string, statusKey: string }) => (
      <div 
        onClick={() => copyToClipboard(ip, statusKey)} 
        className="p-3 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer hover:bg-white hover:shadow-sm transition-all group relative overflow-hidden flex justify-between items-center"
      >
        <div className="text-left">
          <p className="text-gray-400 text-[8px] uppercase font-black mb-0.5 tracking-wider">{label}</p>
          <p className="font-mono text-[11px] text-gray-800 font-bold group-hover:text-orange-500 transition">{ip}</p>
        </div>
        <div className={`text-[8px] font-black px-2 py-1 rounded-md transition uppercase ${copyStatus === statusKey ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-500 opacity-0 group-hover:opacity-100'}`}>
          {copyStatus === statusKey ? 'Copied' : 'Copy'}
        </div>
      </div>
    );

    if (typeof ipData === 'object' && ipData !== null) {
      const ipObj = ipData as { java?: string; bedrock?: string };
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
          {ipObj.java && <IpCard ip={ipObj.java} label="Java IP" statusKey="java" />}
          {ipObj.bedrock && <IpCard ip={ipObj.bedrock} label="Bedrock IP" statusKey="bedrock" />}
        </div>
      );
    }
    return <IpCard ip={String(ipData)} label="Server IP" statusKey="main" />;
  };

  return (
    <div className="flex pt-15 min-h-screen bg-[#f8f9fa]">
      <Sidebar />

      <main className="flex-1 w-full pb-10">
        <div className="max-w-5xl mx-auto px-4 md:px-6 space-y-4 mt-6 md:mt-10">
          
          {/* Баннер */}
          <div className="relative h-40 md:h-44 w-full rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm">
            {server.imageUrl ? (
              <img src={server.imageUrl} alt={server.serverName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-200 bg-gray-50 font-black italic tracking-tighter text-lg uppercase">Asset missing</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end p-5 md:p-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between w-full gap-3">
                <div translate="no">
                  <h1 className="text-xl md:text-3xl font-black tracking-tighter uppercase text-white leading-none drop-shadow-md">
                    {server.serverName}
                  </h1>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                      <span className={`h-1.5 w-1.5 rounded-full mr-2 ${isOnline ? 'bg-orange-500 animate-pulse' : 'bg-gray-500'}`}></span>
                      <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white">
                        {isOnline ? `${server.status?.players} / ${server.status?.maxPlayers} ONLINE` : 'OFFLINE'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* КНОПКА РЕДАКТИРОВАНИЯ */}
                {canEdit && (
                  <Link 
                    href={`/edit-server/${server.slug}`} 
                    className="flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md text-white border border-white/20 font-black rounded-xl text-[9px] uppercase hover:bg-white hover:text-black transition-all shadow-xl group"
                  >
                    <HiOutlineCog6Tooth className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-500" />
                    Настройки
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Табы и контент (остальная часть без изменений) */}
          <div className="flex gap-1 p-1 bg-gray-200/40 rounded-xl border border-gray-200 w-fit">
            {(['info', 'stats'] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-1.5 rounded-lg text-[9px] font-black transition-all tracking-widest uppercase ${activeTab === tab ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                {tab === 'info' ? 'Обзор' : 'Аналитика'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
               {activeTab === 'info' ? (
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-1 bg-orange-500 rounded-full"></div>
                        <h2 className="text-[9px] font-black uppercase tracking-widest text-gray-400">Connection</h2>
                      </div>
                      <div className="bg-gray-50/50 p-1 rounded-xl border border-gray-100">
                        {renderIpBlock()}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 bg-gray-50 rounded-xl border border-transparent hover:border-orange-100 transition-all group">
                        <p className="text-gray-400 text-[7px] uppercase font-black mb-1 tracking-widest">Version</p>
                        <p className="font-black text-gray-900 text-lg group-hover:text-orange-500 transition-colors tracking-tighter">{server.gameVersion}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl border border-transparent hover:border-orange-100 transition-all group">
                        <p className="text-gray-400 text-[7px] uppercase font-black mb-1 tracking-widest">Type</p>
                        <p className="font-black text-gray-900 text-lg group-hover:text-orange-500 transition-colors tracking-tighter">{server.gameType}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-1 bg-orange-500 rounded-full"></div>
                        <h2 className="text-[9px] font-black uppercase tracking-widest text-gray-400">Description</h2>
                      </div>
                      <div className="text-gray-600 leading-relaxed bg-gray-50/20 p-5 rounded-xl border border-gray-100 text-xs italic whitespace-pre-wrap">
                        {server.description || defaultDescription}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {server.categories?.map((cat, i) => (
                        <span key={i} className="px-3 py-1 bg-white text-orange-500 text-[8px] font-black rounded-lg uppercase border border-orange-100 shadow-sm"># {cat}</span>
                      ))}
                    </div>
                  </div>
               ) : (
                  <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm min-h-[300px]">
                      {stats.length > 0 ? <ServerChart data={stats} /> : <p className="text-center text-gray-300 font-black text-[9px] uppercase mt-20">Analyzing data...</p>}
                  </div>
               )}
            </div>

            <div className="space-y-4">
              {/* Vote Block */}
              <div className="bg-white p-5 rounded-2xl border-2 border-orange-500 shadow-lg shadow-orange-500/5 text-center">
                <h3 className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Support project</h3>
                <button 
                  onClick={handleVote}
                  disabled={!accessToken || voteLoading}
                  className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-black shadow-md transition-all active:scale-95 uppercase text-[10px] tracking-widest disabled:opacity-50"
                >
                  {voteLoading ? "Wait..." : "Vote"}
                </button>
                {message && (
                  <div className={`mt-3 p-3 rounded-lg text-[8px] font-black uppercase tracking-tighter border ${
                    message.type === 'success' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
                  }`}>
                    {message.text}
                  </div>
                )}
              </div>

              {/* Boost Block */}
              <div onClick={() => setIsBoostOpen(true)} className="bg-[#111] p-5 rounded-2xl cursor-pointer hover:bg-black transition-all group border border-white/5 relative overflow-hidden">
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <p className="text-orange-500 text-[8px] font-black uppercase tracking-widest mb-1">Boost stars</p>
                    <p className="text-4xl font-black text-white italic tracking-tighter leading-none">{server.premiumVotes || 0}</p>
                  </div>
                  <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center text-white shadow-lg">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                  </div>
                </div>
                <p className="text-white/20 text-[7px] font-black uppercase mt-5 tracking-widest group-hover:text-white transition-colors flex items-center gap-1">
                  Boost priority <HiOutlineArrowTopRightOnSquare className="w-2.5 h-2.5" />
                </p>
              </div>

              {/* Weekly Stats */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 flex justify-between items-center">
                  <div>
                    <p className="text-gray-400 text-[8px] font-black uppercase tracking-widest">Weekly</p>
                    <p className="text-2xl font-black text-gray-900 tracking-tighter leading-none">{server.votesWeekly || 0}</p>
                  </div>
                  <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center text-gray-300 border border-gray-100">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M5 15l7-7 7 7"/></svg>
                  </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-100 space-y-2">
                <h3 className="text-[8px] font-black uppercase text-gray-300 tracking-widest mb-2">Network</h3>
                {server.website && (
                  <a href={server.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50 text-gray-700 hover:bg-orange-500 hover:text-white transition-all text-[9px] font-black uppercase group">
                    <HiOutlineGlobeAlt className="w-3.5 h-3.5" /> Web
                  </a>
                )}
                {server.discord && (
                  <a href={server.discord} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50 text-gray-700 hover:bg-[#5865F2] hover:text-white transition-all text-[9px] font-black uppercase group">
                    <HiOutlineChatBubbleLeftRight className="w-3.5 h-3.5" /> Discord
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <BoostModal 
        isOpen={isBoostOpen}
        onClose={() => setIsBoostOpen(false)}
        serverName={server.serverName}
        userBalance={user?.balance ?? 0}
        onPurchase={handleBoostPurchase}
        loading={boostLoading}
      />
    </div>
  );
}