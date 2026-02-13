'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { 
  HiChatBubbleLeft, HiEye, HiUserCircle, HiLink, HiHeart 
} from "react-icons/hi2";

export default function ForumPostCard({ post }: any) {
  const router = useRouter();
  const [likesCount, setLikesCount] = useState<number>(post.likes?.length || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setIsLiked(!isLiked);
    // Исправленная ошибка TypeScript ts(7006)
    setLikesCount((prev: number) => isLiked ? prev - 1 : prev + 1);
  };

  const goToProfile = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    router.push(`/profile/${post.author.username}`);
  };

  const goToProject = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (post.relatedProject?.slug) router.push(`/content/project/${post.relatedProject.slug}`);
  };

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ru });
  
  // Категории с цветами
  const getCategoryColor = (cat: string) => {
    const map: Record<string, string> = {
      "Ищу напарника": "text-blue-500 bg-blue-500/10 border-blue-500/20",
      "Набираю команду": "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
      "Обсуждение игр": "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      "Гайды и туториалы": "text-amber-500 bg-amber-500/10 border-amber-500/20",
    };
    return map[cat] || "text-gray-500 bg-gray-500/10 border-gray-500/20";
  };

  return (
    <div className="group bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden transition-all flex hover:shadow-md mb-3 max-h-[500px]">
      
      {/* ЛАЙКИ */}
      <div className="flex flex-col items-center gap-0.5 p-2 bg-[var(--surface)]/20 w-12 border-r border-[var(--border)] shrink-0">
        <button 
          onClick={handleLike}
          className={`p-1 rounded-full transition-all ${isLiked ? 'text-red-500' : 'text-[var(--muted)] hover:text-red-500'}`}
        >
          <HiHeart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
        </button>
        <span className="text-[11px] font-black text-[var(--foreground)]">
          {likesCount}
        </span>
      </div>

      <Link href={`/forum/${post.slug}`} className="flex-1 p-3 flex flex-col min-w-0">
        
        {/* ШАПКА: АВАТАР И ИНФО */}
        <div className="flex items-center justify-between mb-2 gap-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <div onClick={goToProfile} className="shrink-0 cursor-pointer">
                {/* Проверяем post.author.avatar вместо avatarUrl */}
                {post.author?.avatar && !imgError ? (
                    <img 
                    src={post.author.avatar} 
                    onError={() => setImgError(true)}
                    className="w-9 h-9 rounded-xl object-cover border border-[var(--border)]" 
                    alt={post.author.username} 
                    />
                ) : (
                    <HiUserCircle className="w-7 h-7 text-[var(--muted)]" />
                )}
                </div>
            <div className="flex flex-col overflow-hidden leading-tight">
              <span onClick={goToProfile} className="text-xs font-bold text-[var(--foreground-bright)] hover:text-[var(--accent)] cursor-pointer truncate">
                {post.author?.username || 'Аноним'}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-[var(--muted)]">{timeAgo}</span>
                <span className={`px-1.5 py-0.5 rounded-[4px] text-[8px] font-black uppercase border ${getCategoryColor(post.category)}`}>
                  {post.category}
                </span>
              </div>
            </div>
          </div>

          {post.relatedProject && (
            <button onClick={goToProject} className="flex items-center gap-1 px-2 py-1 bg-blue-500/5 hover:bg-blue-500/10 text-blue-500 rounded border border-blue-500/10 text-[9px] font-bold uppercase shrink-0">
              <HiLink className="w-3 h-3" />
              Проект: <span className="ml-0.5">{post.relatedProject.title}</span>
            </button>
          )}
        </div>

        {/* БАННЕР */}
        {post.bannerUrl && (
          <div className="mb-2 rounded-lg border border-[var(--border)] overflow-hidden bg-black relative h-[160px] w-full shrink-0">
            <img src={post.bannerUrl} className="absolute inset-0 w-full h-full object-cover blur-md opacity-40" alt="" />
            <img src={post.bannerUrl} className="relative w-full h-full object-contain" alt="Banner" />
          </div>
        )}

        {/* КОНТЕНТ */}
        <div className="flex flex-col gap-1 overflow-hidden">
          <h2 className="text-base font-black text-[var(--foreground-bright)] leading-snug group-hover:text-[var(--accent)] line-clamp-1">
            {post.title}
          </h2>
          <div className="relative max-h-[60px] overflow-hidden">
            <article 
              className="prose prose-xs dark:prose-invert max-w-none text-[var(--muted)] text-[13px] prose-img:hidden prose-p:my-0"
              dangerouslySetInnerHTML={{ __html: post.content?.substring(0, 250) || '' }}
            />
            <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-[var(--card)] to-transparent" />
          </div>
        </div>

        {/* ФУТЕР */}
        <div className="flex items-center gap-4 mt-2 pt-2 border-t border-[var(--border)]/30">
          <div className="flex items-center gap-1 text-[var(--muted)] text-[10px] font-bold">
            <HiChatBubbleLeft className="w-3.5 h-3.5 opacity-60" /> {post.repliesCount || 0}
          </div>
          <div className="flex items-center gap-1 text-[var(--muted)] text-[10px] font-bold">
            <HiEye className="w-3.5 h-3.5 opacity-60" /> {post.views || 0}
          </div>
        </div>
      </Link>
    </div>
  );
}