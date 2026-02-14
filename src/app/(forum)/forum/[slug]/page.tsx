'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  HiHeart, HiEye, HiUserCircle, HiArrowLeft, 
  HiOutlineMegaphone, HiOutlineUserGroup,
  HiOutlineCalendarDays, HiOutlineTag,
  HiOutlineRocketLaunch,HiOutlineChatBubbleLeftEllipsis // <--- Добавьте это
} from "react-icons/hi2";
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import Link from 'next/link';
import CategorySelect from '@/app/components/forum/CategorySelect';
import PostComments from '@/app/components/forum/PostComments';

export default function PostPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { user, accessToken } = useAuth();
  
  const [post, setPost] = useState<any>(null);
  const [activeAuthors, setActiveAuthors] = useState<any[]>([]);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const hasIncremented = useRef(false);

  useEffect(() => {
    const fetchPostAndSidebar = async () => {
      try {
        // Загружаем пост
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/forum/posts/${slug}`);
        const data = await res.json();
        setPost(data);
        setLikesCount(data.likes?.length || 0);
        if (user && data.likes?.includes(user.id)) setLiked(true);

        // Загружаем авторов для боковой панели
        const resAuth = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/forum/posts?limit=100`);
        const dataAuth = await resAuth.json();
        const authorsMap: any = {};
        (dataAuth.posts || []).forEach((p: any) => {
          const name = p.author?.username || p.authorName;
          if (name) {
            authorsMap[name] = {
              username: name,
              avatar: p.author?.avatar || p.authorAvatar,
              count: (authorsMap[name]?.count || 0) + 1
            };
          }
        });
        setActiveAuthors(Object.values(authorsMap).sort((a: any, b: any) => b.count - a.count).slice(0, 5));
      } catch (err) { console.error(err); }
    };
    fetchPostAndSidebar();
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

  const relatedProject = post.relatedProject || post.project;
  const project = post?.relatedProject || post?.project;
  
  return (
    <div className="min-h-screen bg-[#f1f5f9] dark:bg-[var(--background)] pb-20">
      
      {/* НАВИГАЦИЯ */}
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--border)]">
        <div className="max-w-[1300px] mx-auto px-4 h-14 flex items-center">
          <button 
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-[10px] font-black text-[var(--muted)] hover:text-blue-600 transition-all uppercase tracking-[0.2em]"
          >
            <HiArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Назад к списку
          </button>
        </div>
      </div>

      <div className="max-w-[1300px] mx-auto px-4 mt-6">
        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className="flex-1 min-w-0">
            {/* ШАПКА ПОСТА С РАСШИРЕННОЙ ИНФОЙ */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-5xl font-black text-[var(--foreground-bright)] leading-[1.1] mb-6 tracking-tighter break-words">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-y-4 gap-x-6 pb-6 border-b border-[var(--border)]">
                {/* АВТОР */}
                <div className="flex items-center gap-3 pr-6 border-r border-[var(--border)]">
                  <div onClick={() => router.push(`/profile/${post.author?.username}`)} className="cursor-pointer">
                    {post.author?.avatar ? (
                      <img src={post.author.avatar} className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-500/20" alt="" />
                    ) : (
                      <HiUserCircle className="w-10 h-10 text-[var(--muted)]" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-black text-[var(--foreground-bright)] uppercase tracking-tight">{post.author?.username}</div>
                    <div className="text-[10px] text-blue-500 font-bold uppercase">Автор публикации</div>
                  </div>
                </div>

                {/* ДАТА, ПРОСМОТРЫ, КАТЕГОРИЯ */}
                <div className="flex flex-wrap items-center gap-5">
                  <div className="flex items-center gap-2">
                    <HiOutlineCalendarDays className="w-4 h-4 text-blue-500" />
                    <span className="text-[11px] font-bold text-[var(--muted)] uppercase">
                      {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ru })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiEye className="w-4 h-4 text-emerald-500" />
                    <span className="text-[11px] font-bold text-[var(--muted)] uppercase">{post.views || 0} просмотров</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiOutlineTag className="w-4 h-4 text-purple-500" />
                    <span className="px-2 py-0.5 bg-[var(--surface)] text-purple-500 rounded text-[9px] font-black uppercase border border-[var(--border)]">
                      {post.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* БАННЕР */}
            {post.bannerUrl && (
              <div className="rounded-[2rem] overflow-hidden border border-[var(--border)] mb-8 bg-black aspect-video lg:aspect-[21/9] shadow-2xl shadow-blue-500/5">
                <img src={post.bannerUrl} className="w-full h-full object-cover" alt="" />
              </div>
            )}

            {/* КОНТЕНТ */}
            <div className="bg-white dark:bg-[var(--card)] border border-[var(--border)] rounded-[2.5rem] p-6 md:p-12 shadow-sm mb-8 relative overflow-hidden">
              <article className="prose prose-slate dark:prose-invert max-w-none break-words
                                 prose-p:text-base prose-p:leading-[1.8] prose-p:text-[var(--foreground)]
                                 prose-headings:font-black prose-headings:tracking-tighter
                                 prose-img:rounded-3xl prose-img:shadow-xl">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </article>

              {/* ЛАЙКИ */}
              <div className="flex items-center justify-start mt-12 pt-8 border-t border-[var(--border)]">
                  <button 
                    onClick={handleLike}
                    className={`group flex items-center gap-3 px-8 py-3 rounded-2xl font-black text-xs transition-all ${
                      liked 
                      ? 'bg-red-500 text-white shadow-xl shadow-red-500/30 scale-105' 
                      : 'bg-[var(--surface)] text-[var(--muted)] hover:bg-red-500/10 hover:text-red-500 border border-[var(--border)]'
                    }`}
                  >
                    <HiHeart className={`w-5 h-5 transition-transform group-active:scale-125 ${liked ? 'fill-current' : ''}`} />
                    <span>{liked ? 'Понравилось' : 'Оценить'}</span>
                    <span className="ml-2 opacity-50">{likesCount}</span>
                  </button>
              </div>
            </div>
            {project && (
                <div className="mt-8">
                  <div className="flex items-center gap-2 mb-4 ml-2">
                    <HiOutlineRocketLaunch className="text-blue-500 w-4 h-4" />
                    <h3 className="text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.2em]">Связанный проект</h3>
                  </div>
                  
                  <div 
                    onClick={() => router.push(`/content/projects/${project.slug}`)}
                    className="group relative flex items-center gap-4 p-4 bg-white dark:bg-[var(--card)] border border-[var(--border)] rounded-[2rem] hover:border-blue-500/50 transition-all cursor-pointer shadow-sm hover:shadow-md"
                  >
                    {/* Иконка */}
                    <div className="relative shrink-0">
                      <img 
                        src={project.iconUrl || '/default-icon.png'} 
                        className="w-16 h-16 rounded-2xl object-cover bg-[var(--surface)] border border-[var(--border)] group-hover:scale-105 transition-transform" 
                        alt="" 
                      />
                      <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 rounded-lg shadow-lg">
                        <HiOutlineRocketLaunch className="w-3 h-3" />
                      </div>
                    </div>

                    {/* Инфо */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-black text-blue-500 uppercase tracking-wider">{project.gameType}</span>
                        <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
                        <span className="text-[9px] font-bold text-[var(--muted)] uppercase">{project.projectType}</span>
                      </div>
                      <h4 className=" font-black text-[var(--foreground-bright)] uppercase leading-tight truncate">
                        {project.title}
                      </h4>
                      
                      {/* Мини-аналитика (из модели IProject) */}
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          <HiEye className="w-3 h-3 text-[var(--muted)]" />
                          <span className="text-[10px] font-bold text-[var(--muted)]">{project.analytics?.views || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <HiHeart className="w-3 h-3 text-[var(--muted)]" />
                          <span className="text-[10px] font-bold text-[var(--muted)]">{project.analytics?.downloads || 0}</span>
                        </div>
                      </div>
                      
                    </div>
                    
                    {/* Кнопка (стрелка) */}
                    <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--surface)] border border-[var(--border)] group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <HiArrowLeft className="w-5 h-5 rotate-180" />
                    </div>
                  </div>
                </div>
                
              )}
              <PostComments 
              postId={post._id} 
              user={user} 
              accessToken={accessToken} 
            />
          </div>

          {/* ПРАВАЯ ЧАСТЬ: БОКОВАЯ ПАНЕЛЬ */}
          <aside className="w-full lg:w-72 shrink-0 space-y-6">
            {/* РЕКЛАМА */}
            <Link href="https://t.me/SamuraiMFG" className="block group">
              <div className="bg-[#1c1c1e] border border-blue-500/20 rounded-[2rem] p-6 text-white relative overflow-hidden shadow-2xl transition-all hover:border-blue-500/50 hover:translate-y-[-4px]">
                <div className="absolute inset-0 opacity-10 pointer-events-none" 
                     style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-600/20 rounded-full blur-[80px]" />
                <div className="relative z-10">
                  <div className="mb-5">
                    <div className="bg-blue-600 w-10 h-10 flex items-center justify-center rounded-xl">
                      <HiOutlineMegaphone className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[11px] font-black uppercase text-blue-400 tracking-[0.1em]">Продвижение</p>
                    <h3 className="text-xl font-extrabold leading-[1.2] tracking-tight text-white">
                      Место для вашей <br /> <span className="text-blue-500">рекламы</span>
                    </h3>
                  </div>
                  <div className="mt-8 pt-5 border-t border-white/10 text-center">
                    <div className="inline-block bg-white text-black px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all group-hover:bg-blue-600 group-hover:text-white">
                      Узнать больше
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* КАТЕГОРИИ */}
            <div className="bg-white dark:bg-[var(--card)] border border-slate-200 dark:border-[var(--border)] p-4 rounded-3xl shadow-sm">
              <CategorySelect 
                selected={post.category} 
                onSelect={(cat) => router.push(`/forum?category=${cat}`)} 
              />
            </div>

            {/* ТОП АВТОРОВ */}
            <div className="bg-white dark:bg-[var(--card)] border border-slate-200 dark:border-[var(--border)] rounded-3xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-100 dark:border-[var(--border)] bg-slate-50/50 dark:bg-[var(--surface)]/50">
                <h4 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-slate-900 dark:text-white">
                  <HiOutlineUserGroup className="text-blue-600" /> Топ авторов
                </h4>
              </div>
              <div className="p-2 space-y-1">
                {activeAuthors.map((author: any) => (
                  <Link 
                    href={`/profile/${author.username}`} 
                    key={author.username} 
                    className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-[var(--surface)] transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-[var(--surface)] border border-slate-200 dark:border-[var(--border)] overflow-hidden shrink-0">
                        {author.avatar ? <img src={author.avatar} className="w-full h-full object-cover" /> : <HiUserCircle className="w-full h-full text-slate-300" />}
                      </div>
                      <span className="text-xs font-bold truncate text-slate-700 dark:text-slate-300">{author.username}</span>
                    </div>
                    <span className="text-[10px] font-black text-blue-600 bg-blue-500/10 px-2 py-1 rounded-lg">{author.count}</span>
                  </Link>
                ))}
              </div>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}