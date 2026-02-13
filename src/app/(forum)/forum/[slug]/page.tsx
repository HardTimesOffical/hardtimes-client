'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  HiHeart, HiEye, HiUserCircle, HiCalendarDays, HiArrowLeft, 
  HiLink, HiArrowTopRightOnSquare 
} from "react-icons/hi2";
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function PostPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { user, accessToken } = useAuth();
  const [post, setPost] = useState<any>(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const hasIncremented = useRef(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/forum/posts/${slug}`);
        const data = await res.json();
        setPost(data);
        setLikesCount(data.likes?.length || 0);
        if (user && data.likes?.includes(user.id)) setLiked(true);
      } catch (err) { console.error(err); }
    };
    fetchPost();
  }, [slug, user]);

  useEffect(() => {
    if (post?._id && !hasIncremented.current) {
      hasIncremented.current = true;
      fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/forum/posts/${post._id}/view`, { method: 'PATCH' });
    }
  }, [post?._id]);

  const handleLike = async () => {
    if (!user) return alert("Войдите, чтобы поставить лайк");
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/forum/posts/${post._id}/like`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    const data = await res.json();
    setLiked(data.isLiked);
    setLikesCount(data.likesCount);
  };

  if (!post) return <div className="p-20 text-center text-slate-500 font-black uppercase">Загрузка...</div>;

  return (
    <div className="min-h-screen bg-[#f1f5f9] dark:bg-[var(--background)] pb-20">
      
      {/* 1. УВЕЛИЧЕННАЯ ШАПКА И НАВИГАЦИЯ (Прижата к низу) */}
      <div className="sticky items-bottom z-30 bg-white/95 dark:bg-[var(--background)]/95 backdrop-blur-md border-b border-slate-200 dark:border-[var(--border)] shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-end pb-3">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-[11px] font-black text-slate-400 dark:text-[var(--muted)] hover:text-blue-600 transition-colors uppercase tracking-widest"
          >
            <HiArrowLeft className="w-4 h-4" /> Назад
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-6">
        
        {/* ВЕРХНЯЯ СЕКЦИЯ: ЗАГОЛОВОК + КАРТОЧКА ПРОЕКТА */}
        <div className="flex flex-col lg:flex-row gap-6 items-start mb-6">
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-0.5 bg-blue-600/10 text-blue-600 dark:text-[var(--accent)] rounded text-[9px] font-black uppercase border border-blue-600/20">
                {post.category}
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ru })}
              </span>
            </div>

            {/* УМЕНЬШЕННЫЙ ЗАГОЛОВОК */}
            <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-[var(--foreground-bright)] leading-tight mb-4 break-words">
              {post.title}
            </h1>

            <div className="flex items-center gap-2.5">
              <div onClick={() => router.push(`/profile/${post.author?.username}`)} className="cursor-pointer">
                {post.author?.avatar ? (
                  <img src={post.author.avatar} className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-[var(--border)]" alt="" />
                ) : (
                  <HiUserCircle className="w-8 h-8 text-slate-300" />
                )}
              </div>
              <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                {post.author?.username}
              </div>
            </div>
          </div>

          {/* ПРАВАЯ ЧАСТЬ: ВИДЖЕТ ПРОЕКТА */}
          {post.relatedProject && (
            <div 
              onClick={() => router.push(`/projects/${post.relatedProject.slug}`)}
              className="w-full lg:w-72 bg-white dark:bg-[var(--surface)] border border-slate-200 dark:border-[var(--border)] rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3 mb-3">
                <img src={post.relatedProject.iconUrl} className="w-12 h-12 rounded-lg object-cover bg-slate-100" alt="" />
                <div className="min-w-0">
                  <h3 className="font-black text-slate-900 dark:text-white text-xs truncate uppercase tracking-tight">
                    {post.relatedProject.title}
                  </h3>
                  <div className="text-[9px] text-blue-500 font-black uppercase tracking-widest">
                    {post.relatedProject.gameType}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-slate-50 dark:bg-black/20 p-2 rounded-lg text-center">
                  <div className="text-[8px] text-slate-400 font-black uppercase">Просмотры</div>
                  <div className="text-xs font-black text-slate-900 dark:text-white">{post.relatedProject.analytics?.views || 0}</div>
                </div>
                <div className="bg-slate-50 dark:bg-black/20 p-2 rounded-lg text-center">
                  <div className="text-[8px] text-slate-400 font-black uppercase">Загрузки</div>
                  <div className="text-xs font-black text-slate-900 dark:text-white">{post.relatedProject.analytics?.downloads || 0}</div>
                </div>
              </div>

              <div className="w-full py-1.5 bg-slate-900 dark:bg-blue-600 text-white text-[9px] font-black uppercase text-center rounded-md group-hover:bg-blue-600 dark:group-hover:bg-blue-700 transition-colors">
                К проекту
              </div>
            </div>
          )}
        </div>

        {/* 2. УМЕНЬШЕННЫЙ БАННЕР */}
        {post.bannerUrl && (
          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-[var(--border)] mb-6 bg-black h-[200px] md:h-[300px]">
            <img src={post.bannerUrl} className="w-full h-full object-cover" alt="" />
          </div>
        )}

        {/* 3. ОТДЕЛЬНЫЙ БЛОК ДЛЯ ТЕКСТА (Повышение читаемости) */}
        <div className="bg-white dark:bg-[var(--card)] border border-slate-200 dark:border-[var(--border)] rounded-2xl p-6 md:p-10 shadow-sm max-w-4xl mx-auto">
          <article className="prose prose-slate dark:prose-invert max-w-none 
                            prose-p:text-slate-700 dark:prose-p:text-slate-300 
                            prose-p:text-base prose-p:leading-[1.7]
                            prose-headings:text-slate-900 dark:prose-headings:text-white
                            prose-headings:font-black
                            
                            /* ОГРАНИЧЕНИЕ ФОТО В ОПИСАНИИ */
                            prose-img:max-h-[350px] prose-img:w-auto prose-img:mx-auto prose-img:rounded-xl prose-img:my-4
                            
                            break-words">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>

          {/* КОМПАКТНЫЙ ФУТЕР ВНУТРИ БЛОКА */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-100 dark:border-[var(--border)]">
              <button 
                onClick={handleLike}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs transition-all ${
                  liked 
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-500'
                }`}
              >
                <HiHeart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                {likesCount}
              </button>

              <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <HiEye className="w-4 h-4 opacity-40" />
                {post.views} просмотров
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}