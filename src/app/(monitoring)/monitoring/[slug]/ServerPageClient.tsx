"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import LoadingCrystal from "../../../components/loading/LoadingCrystal";
import { useLanguage } from "@/context/LanguageContext";
import ServerChart from "../../../components/stats/ServerChart";
import { BoostModal } from "../../../components/payment/BoostModal";
import api from "@/lib/api";
import {
  HiOutlineArrowTopRightOnSquare, HiOutlineGlobeAlt,
  HiOutlineChatBubbleLeftRight, HiOutlineCog6Tooth,
  HiOutlineClipboard, HiOutlineCheck,
} from 'react-icons/hi2';
import YandexAds from "@/app/components/yandex/YandexAds";
import { useRouter } from "next/navigation";

// ── Константы стиля ──────────────────────────────────────────
const BRAND = "#84a98c";

// ── Утилита: извлечь YouTube embed ID ───────────────────────
function getYoutubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

// ── Интерфейс сервера ────────────────────────────────────────
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
  owner?: string;
  status?: { online: boolean; players: number; maxPlayers: number };
  categories?: string[];
  tags?: string[];
  languages?: string[];
  website?: string;
  discord?: string;
  telegram?: string;
  vk?: string;
  youtube?: string;
}

interface Props {
  slug: string;
  initialData: IServerData | null;
}

// ── Section wrapper (в стиле Workbench) ─────────────────────
function Section({
  title, accent, children,
}: { title: string; accent?: string; children: React.ReactNode }) {
  return (
    <div
      className="relative border"
      style={{ background: "#161817", borderColor: "rgba(255,255,255,0.05)" }}
    >
      {/* Угловые акценты */}
      <div
        className="absolute top-0 left-0 w-2 h-2 border-t border-l opacity-40"
        style={{ borderColor: accent || BRAND }}
      />
      <div
        className="absolute bottom-0 right-0 w-2 h-2 border-b border-r opacity-40"
        style={{ borderColor: accent || BRAND }}
      />
      {/* Заголовок */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 border-b"
        style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.05)" }}
      >
        <div className="w-1 h-3 flex-shrink-0" style={{ background: accent || BRAND }} />
       <span
        className="font-mc-pixel text-[9px] uppercase tracking-widest"
        style={{ 
          color: accent || BRAND,
          lineHeight: "1.4", // Увеличивает пространство сверху и снизу текста
          display: "inline-block" // Гарантирует корректное применение высоты строки
        }}
      >
        {title}
      </span>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

// ── IP блок ──────────────────────────────────────────────────
function IpRow({
  label, ip, copyKey, copyStatus, onCopy,
}: {
  label?: string; ip: string; copyKey: string;
  copyStatus: string | null; onCopy: (ip: string, key: string) => void;
}) {
  const copied = copyStatus === copyKey;
  return (
    <div
      onClick={() => onCopy(ip, copyKey)}
      className="flex items-center justify-between p-3 border cursor-pointer transition-all group"
      style={{
        background: copied ? "rgba(132,169,140,0.05)" : "rgba(0,0,0,0.3)",
        borderColor: copied ? `${BRAND}60` : "rgba(255,255,255,0.05)",
      }}
    >
      <div className="flex items-center gap-2 min-w-0">
        {label && (
          <span
            className="font-mc-pixel text-[8px] uppercase px-1.5 py-0.5 border flex-shrink-0"
            style={
              label === "Java"
                ? { color: "#f2994a", borderColor: "rgba(242,153,74,0.3)", background: "rgba(242,153,74,0.1)" }
                : { color: "#6fcf97", borderColor: "rgba(111,207,151,0.3)", background: "rgba(111,207,151,0.1)" }
            }
          >
            {label}
          </span>
        )}
        <code
          className="text-xs font-mono font-bold truncate"
          style={{ color: copied ? BRAND : "#f2f2f2" }}
        >
          {ip}
        </code>
      </div>
      <div
        className="flex items-center gap-1.5 font-mc-pixel text-[8px] uppercase flex-shrink-0 ml-3 transition-colors"
        style={{ color: copied ? BRAND : "#7d8581" }}
      >
        {copied
          ? <><HiOutlineCheck size={13} /> Скопировано</>
          : <><HiOutlineClipboard size={13} /> Копировать</>
        }
      </div>
    </div>
  );
}

// ── Кнопка вкладки ───────────────────────────────────────────
function TabBtn({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="px-5 py-2 font-mc-pixel text-[9px] uppercase tracking-widest transition-all border"
      style={
        active
          ? { background: BRAND, color: "#0a0b0b", borderColor: BRAND }
          : { background: "transparent", color: "#7d8581", borderColor: "rgba(255,255,255,0.05)" }
      }
    >
      {children}
    </button>
  );
}

// ── Главный компонент ────────────────────────────────────────
export default function ServerPageClient({ slug, initialData }: Props) {
  const { accessToken, user, updateUser } = useAuth();
  const { t } = useLanguage();

  type Tab = "info" | "video" | "stats";
  const [activeTab, setActiveTab] = useState<Tab>("info");
  const [stats, setStats] = useState<any[]>([]);
  const [isBoostOpen, setIsBoostOpen] = useState(false);
  const [boostLoading, setBoostLoading] = useState(false);
  const [server, setServer] = useState<IServerData | null>(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState(false);
  const [voteLoading, setVoteLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const canEdit = server?.isOwner || (user && server?.owner === user._id);
  const defaultDescription = "Добро пожаловать на наш проект! Описание сервера скоро будет обновлено.";

  const [isFollowed, setIsFollowed] = useState(false);
  const [followers, setFollowers] = useState<any[]>([]);
  const [followLoading, setFollowLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (server?._id) {
      // Запрашиваем только тех, кто подписан НА сервер
      api.get(`/follows/data/${server._id}?type=followers`)
        .then(res => setFollowers(res.data))
        .catch(err => console.error("Ошибка загрузки подписчиков:", err));
    }
  }, [server?._id]);

  const handleFollow = async () => {
  // Если не авторизован — просто уводим на логин без лишних слов
  if (!user || !accessToken) {
    router.push('/login');
    return;
  }

  // Если авторизован — стандартная логика
  setVoteLoading(true); // или создай отдельный стейт followLoading
  try {
    const res = await api.post('/follow/toggle', { 
      targetId: server?._id, 
      targetType: 'Server' 
    });
    
    setIsFollowed(res.data.followed);
    
    // Локальное обновление списка аватарок
    if (res.data.followed) {
      setFollowers(prev => [...prev, { 
        _id: user._id, 
        avatar: user.avatar, 
        username: user.username 
      }]);
    } else {
      setFollowers(prev => prev.filter(f => f._id !== user._id));
    }
  } catch (err) {
    console.error("Follow error:", err);
  } finally {
    setVoteLoading(false);
  }
};

  useEffect(() => {
    if (server?._id) {
      api.get(`/statistics/${server._id}/stats?days=1`)
        .then(res => {
          if (res.data?.length > 0) setStats(res.data[res.data.length - 1].points || []);
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
        setMessage({ type: "success", text: "Голос успешно засчитан!" });
        setServer(prev => prev ? { ...prev, votesWeekly: (prev.votesWeekly || 0) + 1 } : null);
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.response?.data?.message || "Ошибка" });
    } finally {
      setVoteLoading(false);
    }
  };

  const handleBoostPurchase = async (option: any) => {
    setBoostLoading(true);
    try {
      const res = await api.post("/boost/boost", {
        serverId: server?._id, votes: option.votes, days: option.days, price: option.price,
      });
      if (res.data.success) {
        updateUser({ balance: res.data.newBalance });
        setIsBoostOpen(false);
        setServer(prev => prev ? { ...prev, premiumVotes: (prev.premiumVotes || 0) + option.votes } : null);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Ошибка");
    } finally {
      setBoostLoading(false);
    }
  };

  if (loading && !server) return (
    <div className="relative w-full h-[60vh] flex items-center justify-center" style={{ background: "#0a0b0b" }}>
      <LoadingCrystal />
    </div>
  );
  if (error || !server) return (
    <div className="p-10 text-center font-mc-pixel text-[10px] uppercase tracking-widest" style={{ color: "#7d8581" }}>
      Сервер не найден
    </div>
  );

  // Парсим IP
  const parsedIp = typeof server.ipAddress === "string"
    ? (() => { try { return JSON.parse(server.ipAddress); } catch { return null; } })()
    : server.ipAddress;
  const isDualIp = parsedIp && typeof parsedIp === "object" && (parsedIp.java || parsedIp.bedrock);

  const isOnline = server.status?.online;
  const youtubeId = getYoutubeId(server.youtube || "");

  // Ссылки соцсетей
  const socialLinks = [
    server.website  && { href: server.website,  label: "Сайт",     color: BRAND,      icon: <HiOutlineGlobeAlt size={14} /> },
    server.discord  && { href: server.discord,  label: "Discord",  color: "#5865F2",  icon: <HiOutlineChatBubbleLeftRight size={14} /> },
    server.telegram && { href: server.telegram, label: "Telegram", color: "#29a8eb",  icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.247l-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.48 13.9l-2.95-.924c-.64-.203-.654-.64.136-.954l11.527-4.446c.535-.194 1.002.131.37.671z"/>
      </svg>
    )},
    server.vk && { href: server.vk, label: "ВКонтакте", color: "#4a76a8", icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.372 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.253-1.406 2.151-3.574 2.151-3.574.119-.254.339-.491.78-.491h1.744c.525 0 .643.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.474-.085.712-.576.712z"/>
      </svg>
    )},
  ].filter(Boolean) as { href: string; label: string; color: string; icon: React.ReactNode }[];

  return (
    <div
      className="flex pt-16 min-h-screen transition-colors duration-200"
    >
      {/* Фоновое свечение */}
      <div
        className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
      />

      <main className="flex-1 w-full pb-10 relative z-10">
        <div className="max-w-4xl mx-auto px-4 md:px-6 space-y-5 mt-6">

          {/* ── Баннер / шапка ── */}
          <div
            className="relative border overflow-hidden"
            style={{ background: "#161817", borderColor: "rgba(255,255,255,0.05)" }}
          >
            {/* Угловые акценты */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l opacity-50" style={{ borderColor: BRAND }} />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r opacity-50" style={{ borderColor: BRAND }} />
            {/* Левая полоса */}
            <div className="absolute top-0 left-0 w-1 h-full" style={{ background: BRAND }} />

            {/* Баннер-изображение */}
            <div className="h-25 md:h-26 w-full ml-1" style={{ background: "#111312" }}>
              {server.imageUrl && (
                <img src={server.imageUrl} alt={server.serverName} className="w-full h-full object-cover opacity-80" />
              )}
            </div>

            <div className="pl-6 pr-5 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  {/* Индикатор онлайн */}
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{
                      background: isOnline ? "#6fcf97" : "#7d8581",
                      boxShadow: isOnline ? "0 0 8px rgba(111,207,151,0.5)" : "none",
                    }}
                  />
                  <h1 className="font-mc-pixel text-base md:text-lg uppercase tracking-tight text-[#f2f2f2]">
                    {server.serverName}
                  </h1>
                </div>
                <p className="font-mc-pixel text-[9px] uppercase tracking-widest mt-1" style={{ color: "#7d8581" }}>
                  {isOnline
                    ? <span style={{ color: "#6fcf97" }}>{server.status?.players} / {server.status?.maxPlayers} онлайн</span>
                    : "Статус: Оффлайн"
                  }
                </p>
              </div>

              {canEdit && (
                <Link
                  href={`/monitoring/edit-server/${server.slug}`}
                  className="flex items-center gap-2 px-4 py-2 border font-mc-pixel text-[9px] uppercase tracking-widest transition-all"
                  style={{ borderColor: "rgba(255,255,255,0.08)", color: "#7d8581", background: "transparent" }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = BRAND;
                    (e.currentTarget as HTMLElement).style.color = BRAND;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                    (e.currentTarget as HTMLElement).style.color = "#7d8581";
                  }}
                >
                  <HiOutlineCog6Tooth size={14} /> Настройки
                </Link>
              )}
            </div>
          </div>

          {/* ── Вкладки ── */}
          <div
            className="flex gap-0 border w-fit"
            style={{ borderColor: "rgba(255,255,255,0.05)", background: "#161817" }}
          >
            <TabBtn active={activeTab === "info"} onClick={() => setActiveTab("info")}>Обзор</TabBtn>
            {youtubeId && (
              <TabBtn active={activeTab === "video"} onClick={() => setActiveTab("video")}>
                <span className="flex items-center gap-1.5">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  Трейлер
                </span>
              </TabBtn>
            )}
            <TabBtn active={activeTab === "stats"} onClick={() => setActiveTab("stats")}>Статистика</TabBtn>
          </div>

          {/* ── Основной грид ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* ── Левая колонка ── */}
            <div className="lg:col-span-2 space-y-4">

              {/* Обзор */}
              {activeTab === "info" && (
                <div className="space-y-4">

                  {/* IP */}
                  <Section title="Подключение">
                    <div className="space-y-2">
                      {isDualIp ? (
                        <>
                          {parsedIp.java && (
                            <IpRow label="Java" ip={parsedIp.java} copyKey="java"
                                   copyStatus={copyStatus} onCopy={copyToClipboard} />
                          )}
                          {parsedIp.bedrock && (
                            <IpRow label="Bedrock" ip={parsedIp.bedrock} copyKey="bedrock"
                                   copyStatus={copyStatus} onCopy={copyToClipboard} />
                          )}
                        </>
                      ) : (
                        <IpRow
                          ip={typeof server.ipAddress === "string" ? server.ipAddress : String(server.ipAddress)}
                          copyKey="main" copyStatus={copyStatus} onCopy={copyToClipboard}
                        />
                      )}
                    </div>
                  </Section>

                  {/* Версия и режим */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Версия", value: server.gameVersion },
                      { label: "Режим",  value: server.gameType },
                    ].map(item => (
                      <div
                        key={item.label}
                        className="relative border p-4"
                        style={{ background: "#161817", borderColor: "rgba(255,255,255,0.05)" }}
                      >
                        <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l opacity-30" style={{ borderColor: BRAND }} />
                        <p className="font-mc-pixel text-[8px] uppercase tracking-widest mb-2" style={{ color: "#7d8581" }}>
                          {item.label}
                        </p>
                        <p className="font-mc-pixel text-sm text-[#f2f2f2]">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Описание */}
                  <Section title="Описание">
                  <div
                    className="font-mc-pixel whitespace-pre-wrap"
                    style={{ 
                      color: "#c2c2c2",
                      fontSize: "11px",
                      lineHeight: "18px", // Фиксированное расстояние между строками
                      letterSpacing: "0.05em", // Небольшой разряд между буквами
                      textShadow: "1px 1px 0px rgba(0,0,0,0.5)" // Добавит четкости на темном фоне
                    }}
                  >
                    {server.description || defaultDescription}
                  </div>
                  </Section>

                  {/* Категории и теги */}
                  {((server.categories?.length ?? 0) > 0 || (server.tags?.length ?? 0) > 0) && (
                    <Section title="Категории и теги">
                      {(server.categories?.length ?? 0) > 0 && (
                        <div>
                          <p className="font-mc-pixel text-[8px] uppercase tracking-widest mb-2" style={{ color: "#7d8581" }}>
                            Категории
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {server.categories!.map(c => (
                              <span
                                key={c}
                                className="font-mc-pixel text-[9px] uppercase px-2 py-1 border"
                                style={{ color: "#c2c2c2", borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {(server.tags?.length ?? 0) > 0 && (
                        <div>
                          <p className="font-mc-pixel text-[8px] uppercase tracking-widest mb-2" style={{ color: "#7d8581" }}>
                            Теги
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {server.tags!.map(tag => (
                              <span
                                key={tag}
                                className="font-mc-pixel text-[9px] uppercase px-2 py-1 border"
                                style={{ color: BRAND, borderColor: `${BRAND}30`, background: `${BRAND}10` }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </Section>
                    
                  )}
                </div>
              )}

              {/* Видео */}
              {activeTab === "video" && youtubeId && (
                <Section title="Трейлер сервера" accent="#ff4444">
                  <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
                      title="Server Trailer"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <a
                    href={server.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 font-mc-pixel text-[9px] uppercase tracking-widest transition-colors"
                    style={{ color: "#7d8581" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#ff4444"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#7d8581"}
                  >
                    <HiOutlineArrowTopRightOnSquare size={12} />
                    Открыть на YouTube
                  </a>
                </Section>
              )}

              {/* Статистика */}
              {activeTab === "stats" && (
                <Section title="Статистика">
                  <div className="min-h-[300px] flex items-center justify-center">
                    {stats.length > 0
                      ? <ServerChart data={stats} />
                      : (
                        <p className="font-mc-pixel text-[10px] uppercase tracking-widest" style={{ color: "#7d8581" }}>
                          Данные обновляются...
                        </p>
                      )
                    }
                  </div>
                </Section>
              )}
            </div>

            {/* ── Правая колонка ── */}
            <div className="space-y-4">
              {/* Блок подписчиков проекта */}
                <Section title="Следи за проектом и получай уведомления о новых событиях на сервере!" accent="#6fcf97">
                  <div className="space-y-4">
                    {/* Счетчик и кнопка (мы их уже обсудили) */}
                    <div className="flex justify-between items-center">
                      <span className="font-mc-pixel text-[10px] text-[#f2f2f2]">
                        {followers.length} {followers.length === 1 ? 'игрок' : 'игроков'}
                      </span>
                      <button
                        onClick={handleFollow}
                        disabled={followLoading} 
                        className="px-4 py-1.5 font-mc-pixel text-[8px] uppercase tracking-widest border transition-all"
                        style={{ 
                          background: isFollowed ? "transparent" : BRAND, 
                          color: isFollowed ? BRAND : "#0a0b0b",
                          borderColor: BRAND,
                          cursor: "pointer"
                        }}
                      >
                        {/* Надпись всегда статична, никаких "Войдите" */}
                        {isFollowed ? "Вы подписаны" : "Подписаться"}
                    </button>
                    </div>

                    {/* Сетка аватарок */}
                    <div className="grid grid-cols-6 gap-2">
                      {followers.slice(0, 11).map((f, idx) => (
                        <Link 
                          key={f._id} 
                          href={`/profile/${f.username}`}
                          className="aspect-square border border-white/5 hover:border-brand transition-all relative group bg-black/40"
                          title={f.username}
                        >
                          {f.avatar ? (
                            <img src={f.avatar} alt={f.username} className="w-full h-full object-cover opacity-80 group-hover:opacity-100" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[8px] text-white/20">
                              {f.username[0].toUpperCase()}
                            </div>
                          )}
                        </Link>
                      ))}

                      {/* Кнопка "Показать всех" */}
                      {followers.length > 11 && (
                        <button 
                          onClick={() => {/* Здесь логика открытия модалки */}}
                          className="aspect-square border border-white/5 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all"
                        >
                          <span className="font-mc-pixel text-[8px] text-[#7d8581]">
                            +{followers.length - 11}
                          </span>
                        </button>
                      )}
                    </div>

                    {followers.length === 0 && (
                      <p className="font-mc-pixel text-[8px] text-[#7d8581] text-center py-2 opacity-50">
                        Станьте первым подписчиком!
                      </p>
                    )}
                  </div>
                </Section>
                <YandexAds />
              {/* Голоса */}
              <div
                className="relative border p-5 space-y-4"
                style={{ background: "#161817", borderColor: "rgba(255,255,255,0.05)" }}
              >
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l opacity-40" style={{ borderColor: BRAND }} />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r opacity-40" style={{ borderColor: BRAND }} />

                <div className="text-center">
                  <p className="font-mc-pixel text-[8px] uppercase tracking-widest mb-1" style={{ color: "#7d8581" }}>
                    Голоса проекта
                  </p>
                  <p className="font-mc-pixel text-3xl text-[#f2f2f2]">{server.votesWeekly || 0}</p>
                </div>

                <button
                  onClick={handleVote}
                  disabled={!accessToken || voteLoading}
                  className="w-full py-2.5 font-mc-pixel text-[9px] uppercase tracking-widest transition-all border disabled:opacity-40"
                  style={{ background: BRAND, color: "#0a0b0b", borderColor: BRAND }}
                  onMouseEnter={e => { if (accessToken && !voteLoading) (e.currentTarget as HTMLElement).style.opacity = "0.85"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                >
                  {voteLoading ? "Загрузка..." : "Проголосовать"}
                </button>

                {message && (
                  <div
                    className="font-mc-pixel text-[8px] uppercase tracking-widest text-center p-2.5 border"
                    style={
                      message.type === "success"
                        ? { color: "#6fcf97", borderColor: "rgba(111,207,151,0.2)", background: "rgba(111,207,151,0.05)" }
                        : { color: "#eb5757", borderColor: "rgba(235,87,87,0.2)", background: "rgba(235,87,87,0.05)" }
                    }
                  >
                    {message.text}
                  </div>
                )}
              </div>

              {/* Буст */}
              <div
                onClick={() => setIsBoostOpen(true)}
                className="relative border p-5 cursor-pointer transition-all flex justify-between items-center"
                style={{ background: "#f2f2f2", borderColor: "#f2f2f2" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "0.9"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
              >
                <div>
                  <p className="font-mc-pixel text-[8px] uppercase tracking-widest mb-1 opacity-50" style={{ color: "#0a0b0b" }}>
                    Буст-звёзды
                  </p>
                  <p className="font-mc-pixel text-3xl" style={{ color: "#0a0b0b" }}>
                    {server.premiumVotes || 0}
                  </p>
                </div>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#f2994a">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </div>

              {/* Ссылки */}
              {socialLinks.length > 0 && (
                <Section title="Ссылки и соцсети">
                  <div className="space-y-2">
                    {socialLinks.map(link => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-2.5 border font-mc-pixel text-[10px] uppercase tracking-widest transition-all"
                        style={{ color: "#7d8581", borderColor: "rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.2)" }}
                        onMouseEnter={e => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.color = link.color;
                          el.style.borderColor = `${link.color}40`;
                        }}
                        onMouseLeave={e => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.color = "#7d8581";
                          el.style.borderColor = "rgba(255,255,255,0.05)";
                        }}
                      >
                        <span style={{ color: link.color }}>{link.icon}</span>
                        {link.label}
                      </a>
                    ))}
                  </div>
                </Section>
              )}
            </div>
          </div>
        </div>
      </main>

      <BoostModal
        isOpen={isBoostOpen}
        onClose={() => setIsBoostOpen(false)}
        serverId={server._id}
        serverName={server.serverName}
        userBalance={user?.balance ?? 0}
        onPurchase={handleBoostPurchase}
        loading={boostLoading}
      />
    </div>
  );
}