"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/app/components/dashboard/dashboard";
import Link from "next/link";

declare global {
  interface Window {
    onclicka?: any;
  }
}

export default function ServerPage() {
  const { slug } = useParams();
  const { accessToken } = useAuth();

  const [server, setServer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);


  const [voteLoading, setVoteLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

const handleVote = () => {
    if (!accessToken) return;
    setVoteLoading(true);
    setMessage(null);

    // Логика вызова видео-рекламы Onclicka
    if (window.onclicka) {
      // Вызываем метод показа видео. 
      // Примечание: точные названия методов могут быть в твоем ЛК (напр. runAd или show)
      window.onclicka.runAd({
        zoneId: "405773", // Твой ID места
        container: "#video-ad-container",
        onAdFinished: () => {
          // Callback при успешном досмотре
          confirmVote();
        },
        onAdError: () => {
          // Если реклама не сработала (блокировщик), разрешаем голос или выводим ошибку
          confirmVote(); 
        },
        onAdClosed: () => {
          // Если закрыли раньше времени - отменяем загрузку
          setVoteLoading(false);
          setMessage({ type: 'error', text: 'Нужно досмотреть видео для голосования' });
        }
      });
    } else {
      // Если скрипт не загружен (AdBlock)
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
          headers: {
            ...(accessToken ? { "Authorization": `Bearer ${accessToken}` } : {})
          }
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
      <div className="max-w-5xl mx-auto p-4 space-y-6">
        
        {/* Шапка: Баннер и Основная информация */}
        <div className="relative h-30 w-full rounded-2xl overflow-hidden border border-white/10 bg-gray-900">
          {server.imageUrl ? (
            <img src={server.imageUrl} alt={server.serverName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/20">Нет изображения</div>
          )}
          <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">{server.serverName}</h1>
                <p className="text-white/70 flex items-center gap-2">
                  <span className={`h-3 w-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  {isOnline ? `Онлайн  ${server.status.players}/${server.status.maxPlayers} игроков` : 'Оффлайн'}
                </p>
              </div>
              {server.isOwner && (
                  <Link href={`/edit-server/${server.slug}`}>
                    Редактировать
                  </Link>
              )}
            </div>
          </div>
        </div>

        {/* Сетка контента */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Левая колонка: Детали */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-[#0b1224] p-6 rounded-xl border border-white/5">
              <h2 className="text-xl font-semibold mb-4">О сервере</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-white/5 rounded-lg">
                  <p className="opacity-50 text-xs">Версия</p>
                  <p className="font-medium text-blue-400">{server.gameVersion}</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                  <p className="opacity-50 text-xs">Тип игры</p>
                  <p className="font-medium text-purple-400">{server.gameType}</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                  <p className="opacity-50 text-xs">IP Адрес</p>
                  <p className="font-mono text-green-400 select-all">{server.ipAddress}</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                  <p className="opacity-50 text-xs">Голосов на этой неделе</p>
                  <p className="font-medium text-yellow-500">⭐ {server.votesWeekly}</p>
                </div>
              </div>

              {/* Теги и Категории */}
              <div className="mt-6 flex flex-wrap gap-2">
                {server.categories.map((c: string) => (
                  <span key={c} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                    {c}
                  </span>
                ))}
                {server.tags.map((t: string) => (
                  <span key={t} className="px-3 py-1 bg-white/5 text-white/60 rounded-full text-xs">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Правая колонка: Действия и Ссылки */}
          <div className="space-y-6">
            <div className="bg-[#0b1224] p-6 rounded-xl border border-white/5 text-center">
              <h3 className="text-lg font-bold mb-4">Поддержите проект</h3>
              <button 
                onClick={handleVote}
                disabled={!accessToken || voteLoading}
                className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-xl font-bold transition"
              >
                {voteLoading ? "Загрузка..." : "ПРОГОЛОСОВАТЬ"}
              </button>

              {message && (
                <p className={`text-xs mt-2 ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                  {message.text}
                </p>
              )}
              {!accessToken && <p className="text-xs text-white/40 mt-2">Нужна авторизация</p>}
            </div>

            <div className="bg-[#0b1224] p-6 rounded-xl border border-white/5 space-y-4">
              <h3 className="text-sm font-semibold uppercase opacity-40">Ссылки</h3>
              {server.website && (
                <a href={server.website} target="_blank" className="flex items-center justify-between text-sm hover:text-blue-400 transition">
                  <span className="flex items-center gap-2"> Сайт</span>
                </a>
              )}
              {server.discord && (
                <a href={server.discord} target="_blank" className="flex items-center justify-between text-sm hover:text-indigo-400 transition">
                  <span className="flex items-center gap-2"> Discord</span>
                </a>
              )}
            </div>
          </div>

        </div>
      </div>
      <div id="video-ad-container" style={{ position: 'fixed', zIndex: 9999 }}></div>
    </DashboardLayout>
  );
}