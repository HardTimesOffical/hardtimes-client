'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  HiHeart, HiEye, HiUserCircle, HiArrowLeft, 
  HiOutlineMegaphone, HiOutlineUserGroup,
  HiOutlineCalendarDays, HiOutlineTag,
  HiOutlineRocketLaunch, HiOutlineChatBubbleLeftEllipsis
} from "react-icons/hi2";
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import Link from 'next/link';
import CategorySelect from '@/app/components/forum/CategorySelect';
import PostComments from '@/app/components/forum/PostComments';
import { ThemeToggle } from '@/app/components/header/ThemeBtn'

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
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/forum/posts/${slug}`);
        const data = await res.json();
        setPost(data);
        setLikesCount(data.likes?.length || 0);
        if (user && data.likes?.includes(user.id)) setLiked(true);

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

  if (!post) return <div className="p-20 text-center text-[var(--muted)] font-black uppercase">Загрузка...</div>;

  const project = post?.relatedProject || post?.project;
  
  return (
    // ЗАМЕНА: bg-[#f1f5f9] -> bg-background
    <div className="min-h-screen bg-background pb-20 transition-colors duration-200">
      
      {/* НАВИГАЦИЯ */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-[1300px] mx-auto px-4 h-14 flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-[10px] font-black text-muted hover:text-accent transition-all uppercase tracking-[0.2em]"
          >
            <HiArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Назад
          </button>
          
          {/* ДОБАВЛЕНА КНОПКА ТЕМЫ */}
          <ThemeToggle />
        </div>
      </div>

      <div className="max-w-[1300px] mx-auto px-4 mt-6">
        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className="flex-1 min-w-0">
            <div className="mb-8">
              <h1 className="text-3xl md:text-5xl font-black text-foreground-bright leading-[1.1] mb-6 tracking-tighter break-words">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-y-4 gap-x-6 pb-6 border-b border-border">
                <div className="flex items-center gap-3 pr-6 border-r border-border">
                  <div onClick={() => router.push(`/profile/${post.author?.username}`)} className="cursor-pointer">
                    {post.author?.avatar ? (
                      <img src={post.author.avatar} className="w-10 h-10 rounded-xl object-cover ring-2 ring-accent/20" alt="" />
                    ) : (
                      <HiUserCircle className="w-10 h-10 text-muted" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-black text-foreground-bright uppercase tracking-tight">{post.author?.username}</div>
                    <div className="text-[10px] text-accent font-bold uppercase">Автор</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-5">
                  <div className="flex items-center gap-2">
                    <HiOutlineCalendarDays className="w-4 h-4 text-accent" />
                    <span className="text-[11px] font-bold text-muted uppercase">
                      {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ru })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiEye className="w-4 h-4 text-emerald-500" />
                    <span className="text-[11px] font-bold text-muted uppercase">{post.views || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* КОНТЕНТ: Замена bg-white на bg-card */}
            <div className="bg-card border border-border rounded-[2.5rem] p-6 md:p-12 shadow-sm mb-8 relative overflow-hidden">
              <article className="prose prose-slate dark:prose-invert max-w-none break-words
                                 prose-p:text-base prose-p:leading-[1.8] prose-p:text-foreground
                                 prose-headings:text-foreground-bright prose-headings:font-black
                                 prose-img:rounded-3xl">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </article>

              <div className="flex items-center justify-start mt-12 pt-8 border-t border-border">
                  <button 
                    onClick={handleLike}
                    className={`group flex items-center gap-3 px-8 py-3 rounded-2xl font-black text-xs transition-all ${
                      liked 
                      ? 'bg-red-500 text-white shadow-xl shadow-red-500/30 scale-105' 
                      : 'bg-surface text-muted hover:bg-red-500/10 hover:text-red-500 border border-border'
                    }`}
                  >
                    <HiHeart className={`w-5 h-5 transition-transform group-active:scale-125 ${liked ? 'fill-current' : ''}`} />
                    <span>{liked ? 'Понравилось' : 'Оценить'}</span>
                    <span className="ml-2 opacity-50">{likesCount}</span>
                  </button>
              </div>
            </div>

            <PostComments postId={post._id} user={user} accessToken={accessToken} />
          </div>

          <aside className="w-full lg:w-72 shrink-0 space-y-6">
            {/* РЕКЛАМА (оставляем темной, как в дизайне) */}
            <Link href="https://t.me/SamuraiMFG" className="block group">
              <div className="bg-[#1c1c1e] border border-blue-500/20 rounded-[2rem] p-6 text-white relative overflow-hidden shadow-2xl transition-all hover:border-blue-500/50 hover:translate-y-[-4px]">
                <div className="relative z-10">
                   <h3 className="text-xl font-extrabold leading-[1.2] text-white">Рекламный <br /> блок</h3>
                   <div className="mt-4 inline-block bg-white text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase">Подробнее</div>
                </div>
              </div>
            </Link>

            {/* КАТЕГОРИИ И ТОП: Замена bg-white на bg-card */}
            {/* КАТЕГОРИИ */}
           <div className="bg-card border border-border p-5 rounded-[2rem] shadow-xl flex flex-col gap-4">
              <CategorySelect 
                selected={post.category} 
                onSelect={(cat) => router.push(`/forum?category=${cat}`)} 
              />
              
              <div className="h-px bg-border w-full opacity-30" />

              <button 
                onClick={() => router.push('/forum')}
                className="flex items-center justify-center gap-3 w-full py-2 rounded-[0.50rem] bg-surface hover:bg-blue-500/10 text-muted hover:text-blue-400 border border-border hover:border-blue-500/30 transition-all group"
              >
                <HiOutlineChatBubbleLeftEllipsis className="w-5 h-5 transition-transform group-hover:scale-110 group-hover:rotate-3" />
                <span className="text-[10px] font-black uppercase tracking-[0.15em]">Все темы форума</span>
              </button>
            </div>

            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-border bg-surface/50">
                <h4 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-foreground-bright">
                  <HiOutlineUserGroup className="text-accent" /> Топ авторов
                </h4>
              </div>
              <div className="p-2 space-y-1">
                {activeAuthors.map((author: any) => (
                  <Link 
                    href={`/profile/${author.username}`} 
                    key={author.username} 
                    className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-surface transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-surface border border-border overflow-hidden shrink-0">
                        {author.avatar ? <img src={author.avatar} className="w-full h-full object-cover" /> : <HiUserCircle className="w-full h-full text-muted" />}
                      </div>
                      <span className="text-xs font-bold truncate text-foreground">{author.username}</span>
                    </div>
                    <span className="text-[10px] font-black text-accent bg-accent/10 px-2 py-1 rounded-lg">{author.count}</span>
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