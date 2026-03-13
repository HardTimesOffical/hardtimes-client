"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import LoadingCrystal from "../../../components/loading/LoadingCrystal";
import { useLanguage } from "@/context/LanguageContext";
import ServerChart from "../../../components/stats/ServerChart";
import { BoostModal } from "../../../components/payment/BoostModal";
import api from "@/lib/api";
// Используем HiOutlineClipboard для копирования
import { HiOutlineArrowTopRightOnSquare, HiOutlineGlobeAlt, HiOutlineChatBubbleLeftRight, HiOutlineCog6Tooth, HiOutlineClipboard, HiOutlineCheck } from 'react-icons/hi2';
import YandexAds from "@/app/components/yandex/YandexAds";

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

  const canEdit = server?.isOwner || (user && server?.owner === user._id);
  const defaultDescription = `Добро пожаловать на наш проект! Описание сервера скоро будет обновлено.`;

  useEffect(() => {
    if (server?._id) {
      api.get(`/statistics/${server._id}/stats?days=1`)
        .then(res => {
          if (res.data && res.data.length > 0) {
            setStats(res.data[res.data.length - 1].points || []);
          }
        })
        .catch(err => console.error("Ошибка статистики:", err));
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
      setMessage({ type: 'error', text: err.response?.data?.message || 'Ошибка' });
    } finally {
      setVoteLoading(false);
    }
  };

  const handleBoostPurchase = async (option: any) => {
    setBoostLoading(true);
    try {
      const res = await api.post('/boost/boost', {
        serverId: server?._id, votes: option.votes, days: option.days, price: option.price
      });
      if (res.data.success) {
        updateUser({ balance: res.data.newBalance });
        setIsBoostOpen(false);
        setServer((prev) => prev ? ({ ...prev, premiumVotes: (prev.premiumVotes || 0) + option.votes }) : null);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Ошибка");
    } finally {
      setBoostLoading(false);
    }
  };

  const hasSocialLinks = server?.website || server?.discord;

  if (loading && !server) return <div className="relative w-full h-[60vh] flex items-center justify-center"><LoadingCrystal /></div>;
  if (error || !server) return <div className="p-10 text-center font-bold text-muted-foreground uppercase text-[10px]">Сервер не найден</div>;

  const isOnline = server.status?.online;
  console.log({serverImageUrl: server.imageUrl})
  

  return (
 <div className="flex pt-16 min-h-screen bg-background text-foreground transition-colors duration-200">

      <main className="flex-1 w-full pb-10">
        <div className="max-w-4xl mx-auto px-4 md:px-6 space-y-4 mt-6">
          
          {/* Баннер проекта */}
          <div className="relative overflow-hidden border border-border rounded-lg bg-card shadow-sm">
            <div className="h-28 md:h-36 w-full bg-muted/20">
              {server.imageUrl && <img src={server.imageUrl} alt={server.serverName} className="w-full h-full object-cover" />}
            </div>
            
            <div className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2 uppercase">
                  {server.serverName}
                  {/* Зеленая лампочка онлайна */}
                  <span className={`h-3 w-3 rounded-full shadow-sm ${isOnline ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)] animate-pulse' : 'bg-gray-500'}`} />
                </h1>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.1em] mt-1">
                  {isOnline ? (
                    <span className="text-green-600 dark:text-green-500">{server.status?.players} / {server.status?.maxPlayers} Игроков в сети</span>
                  ) : 'Статус: Оффлайн'}
                </p>
              </div>

              {canEdit && (
                <Link 
                  href={`/monitoring/edit-server/${server.slug}`} 
                  className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground border border-border rounded-lg text-[11px] font-bold uppercase hover:bg-orange-500 hover:text-white transition-all shadow-sm group"
                >
                  <HiOutlineCog6Tooth size={15} className="group-hover:rotate-90 transition-transform" /> Настройки
                </Link>
              )}
            </div>
          </div>

          {/* Контейнер вкладок - сделан чище */}
          <div className="flex gap-1.5 p-1 bg-card border border-border rounded-lg w-fit shadow-sm">
            {(['info', 'stats'] as const).map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)} 
                className={`px-6 py-2 rounded-md text-[11px] font-black transition-all uppercase tracking-wider ${
                  activeTab === tab 
                  ? 'bg-orange-500 text-white shadow-md' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {tab === 'info' ? 'Обзор' : 'Статистика'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
               {activeTab === 'info' ? (
                  <div className="space-y-4">
                    {/* IP адрес с зеленым акцентом при копировании */}
                    <div className="border border-border rounded-lg bg-card p-5">
                      <h3 className="text-[10px] font-black text-muted-foreground uppercase mb-4 tracking-widest flex items-center gap-2">
                        <div className="w-1 h-3 bg-orange-500 rounded-full" />
                        Подключение
                      </h3>
                      <div 
                        onClick={() => copyToClipboard(String(server.ipAddress), 'main')}
                        className={`flex justify-between items-center p-3 border rounded-lg cursor-pointer transition-all group ${
                          copyStatus === 'main' ? 'bg-green-500/5 border-green-500' : 'bg-muted/10 border-border hover:border-orange-500/50'
                        }`}
                      >
                        <code className={`text-xs font-mono font-bold ${copyStatus === 'main' ? 'text-green-600 dark:text-green-400' : ''}`}>
                          {String(server.ipAddress)}
                        </code>
                        <div className={`flex items-center gap-2 text-[10px] font-bold uppercase ${copyStatus === 'main' ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground group-hover:text-orange-500'}`}>
                          {copyStatus === 'main' ? (
                            <><HiOutlineCheck size={16} /> Готово</>
                          ) : (
                            <><HiOutlineClipboard size={16} /> Копировать</>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="border border-border rounded-lg bg-card p-4">
                        <p className="text-muted-foreground text-[9px] font-black uppercase mb-1 tracking-widest">Версия</p>
                        <p className="text-sm font-black text-foreground">{server.gameVersion}</p>
                      </div>
                      <div className="border border-border rounded-lg bg-card p-4">
                        <p className="text-muted-foreground text-[9px] font-black uppercase mb-1 tracking-widest">Режим</p>
                        <p className="text-sm font-black text-foreground">{server.gameType}</p>
                      </div>
                    </div>

                    <div className="border border-border rounded-lg bg-card p-5">
                      <h3 className="text-[10px] font-black text-muted-foreground uppercase mb-4 tracking-widest flex items-center gap-2">
                        <div className="w-1 h-3 bg-orange-500 rounded-full" />
                        Описание
                      </h3>
                      <div className="text-[13px] text-foreground/80 leading-relaxed whitespace-pre-wrap font-medium">
                        {server.description || defaultDescription}
                      </div>
                    </div>
                  </div>
               ) : (
                  <div className="border border-border rounded-lg bg-card p-5 min-h-[350px]">
                      {stats.length > 0 ? <ServerChart data={stats} /> : <p className="text-center text-muted-foreground text-[11px] uppercase mt-24 font-bold">Данные обновляются...</p>}
                  </div>
               )}
            </div>

            <div className="space-y-4">
              <YandexAds/>
              {/* Голоса с зеленым уведомлением */}
              <div className="border border-border rounded-lg bg-card p-5 flex flex-col gap-4 shadow-sm">
                <div className="text-center">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em] mb-1">Голоса Проекта</p>
                  <p className="text-3xl font-black text-foreground tracking-tighter">{server.votesWeekly || 0}</p>
                </div>
                <button 
                  onClick={handleVote}
                  disabled={!accessToken || voteLoading}
                  className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-black transition-all shadow-md shadow-orange-500/20 text-xs uppercase tracking-widest disabled:opacity-50 active:scale-95"
                >
                  {voteLoading ? "Загрузка..." : "Проголосовать"}
                </button>
                {message && (
                  <div className={`text-[9px] text-center font-bold uppercase p-2.5 rounded-md border shadow-sm ${
                    message.type === 'success' 
                    ? 'bg-green-500/10 text-green-600 border-green-500/20' 
                    : 'bg-red-500/10 text-red-500 border-red-500/20'
                  }`}>
                    {message.text}
                  </div>
                )}
              </div>

              {/* Буст */}
              <div onClick={() => setIsBoostOpen(true)} className="border border-border rounded-lg bg-foreground text-background p-5 cursor-pointer hover:shadow-lg transition-all flex justify-between items-center group relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-[9px] font-black uppercase opacity-60 tracking-widest">Буст-звезды</p>
                  <p className="text-3xl font-black">{server.premiumVotes || 0}</p>
                </div>
                <div className="text-orange-500 relative z-10 group-hover:scale-110 transition-transform">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                </div>
              </div>

              {hasSocialLinks && (
                <div className="border border-border rounded-lg bg-card p-5 space-y-3">
                  <h3 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-2">Ссылки</h3>
                  {server.website && (
                    <a href={server.website} target="_blank" className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30 text-foreground hover:bg-orange-500 hover:text-white transition-all text-[11px] font-bold border border-border group">
                      <HiOutlineGlobeAlt size={16} /> Сайт проекта
                    </a>
                  )}
                  {server.discord && (
                    <a href={server.discord} target="_blank" className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30 text-foreground hover:bg-[#5865F2] hover:text-white transition-all text-[11px] font-bold border border-border group">
                      <HiOutlineChatBubbleLeftRight size={16} /> Сообщество Discord
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

        <BoostModal 
          isOpen={isBoostOpen}
          onClose={() => setIsBoostOpen(false)}
          serverId={server._id}        // <--- ДОБАВЬ ЭТО
          serverName={server.serverName}
          userBalance={user?.balance ?? 0}
          onPurchase={handleBoostPurchase}
          loading={boostLoading}
        />
    </div>
  );
}

