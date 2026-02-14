'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { 
  HiChatBubbleLeft, HiOutlineEye, HiUserCircle, HiLink, HiHeart 
} from "react-icons/hi2";
import { useAuth } from '@/context/AuthContext';// Предполагаю, что юзер и токен берутся отсюда

export default function ForumPostCard({ post }: any) {
  const router = useRouter();
  const { user, accessToken } = useAuth(); // Подключи свой хук авторизации
  
  // Состояние лайка напрямую из данных поста (если сервер их присылает)
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState<number>(post.likes?.length || 0);
  const [imgError, setImgError] = useState(false);

  // Синхронизация, если пропсы обновятся
  useEffect(() => {
    setIsLiked(post.isLiked);
    setLikesCount(post.likes?.length || 0);
  }, [post.isLiked, post.likes]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();

    if (!user) return alert("Войдите, чтобы поставить лайк");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/forum/posts/${post._id}/like`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        // Сервер должен вернуть актуальное состояние: { isLiked: boolean, likesCount: number }
        setIsLiked(data.isLiked);
        setLikesCount(data.likesCount);
      }
    } catch (error) {
      console.error("Ошибка при лайке:", error);
    }
  };

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ru });
  
  const getCategoryColor = (cat: string) => {
    const map: Record<string, string> = {
      "Ищу напарника": "text-blue-500 bg-blue-500/10",
      "Набираю команду": "text-indigo-500 bg-indigo-500/10",
      "Обсуждение игр": "text-emerald-500 bg-emerald-500/10",
      "Гайды и туториалы": "text-amber-500 bg-amber-500/10",
    };
    return map[cat] || "text-gray-500 bg-gray-500/10";
  };

  return (
    <div className="group bg-[var(--card)] border border-[var(--border)] rounded-2xl transition-all hover:border-blue-500/40 mb-3 shadow-sm overflow-hidden">
      <Link href={`/forum/${post.slug}`} className="p-5 flex flex-col gap-4">
        
        {/* ВЕРХ: АВТОР */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-[var(--surface)] border border-[var(--border)] shadow-sm">
              {post.author?.avatar && !imgError ? (
                <img src={post.author.avatar} onError={() => setImgError(true)} className="w-full h-full object-cover" alt="" />
              ) : (
                <HiUserCircle className="w-full h-full text-[var(--muted)]" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-black text-[var(--foreground-bright)] leading-none">{post.author?.username}</span>
              <span className="text-[10px] text-[var(--muted)] opacity-60 mt-1 uppercase tracking-tighter">{timeAgo}</span>
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-tight ${getCategoryColor(post.category)}`}>
            {post.category}
          </span>
        </div>

        {/* СЕРЕДИНА: ТЕКСТ СЛЕВА, БОЛЬШОЕ ФОТО СПРАВА */}
        <div className="flex gap-5 items-start">
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <h2 className="text-[18px] font-black text-[var(--foreground-bright)] leading-tight group-hover:text-blue-500 transition-colors line-clamp-2">
              {post.title}
            </h2>
            <div 
              className="text-[14px] text-[var(--muted)] opacity-80 line-clamp-3 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />
          </div>

          {post.bannerUrl && (
            <div className="w-32 h-24 sm:w-44 sm:h-28 rounded-xl border border-[var(--border)] overflow-hidden bg-black shrink-0 relative shadow-inner">
              <img src={post.bannerUrl} className="absolute inset-0 w-full h-full object-cover blur-md opacity-30" alt="" />
              <img src={post.bannerUrl} className="relative w-full h-full object-contain p-1" alt="Banner" />
            </div>
          )}
        </div>

        {/* НИЗ: СТАТИСТИКА */}
        <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]/30">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5 text-blue-500/80">
              <HiChatBubbleLeft className="w-4 h-4" />
              <span className="text-[12px] font-black text-[var(--foreground)]">{post.repliesCount || 0}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <HiOutlineEye className="w-4 h-4" />
              <span className="text-[12px] font-black text-[var(--foreground)]">{post.views || 0}</span>
            </div>
            {post.relatedProject && (
              <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 bg-blue-500/5 rounded-md text-blue-400 hover:text-blue-500 transition-colors">
                <HiLink className="w-3 h-3" />
                <span className="text-[10px] font-black uppercase tracking-tight truncate max-w-[120px]">
                  {post.relatedProject.title}
                </span>
              </div>
            )}
          </div>

          <button 
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl transition-all font-black text-[12px] border ${
              isLiked 
                ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/20' 
                : 'bg-[var(--surface)] text-[var(--muted)] border-[var(--border)] hover:border-rose-500/50 hover:text-rose-500'
            }`}
          >
            <HiHeart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            <span>{likesCount}</span>
          </button>
        </div>

      </Link>
    </div>
  );
}