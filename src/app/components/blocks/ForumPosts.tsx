'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { HiOutlineChatBubbleLeftRight, HiOutlineClock, HiOutlineEye, HiOutlineHeart } from 'react-icons/hi2';

export default function ForumPosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/forum/posts?limit=5&sort=new`);
        const data = await res.json();
        setPosts(data.posts || []);
      } catch (err) {
        console.error("Failed to fetch forum posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestPosts();
  }, []);

  if (!loading && posts.length === 0) return null;

  return (
    <aside className="w-full">
      <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
        {/* Компактная шапка в нейтральном стиле */}
        <div className="px-3 py-2.5 border-b border-border bg-background/40 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <HiOutlineChatBubbleLeftRight className="w-4 h-4 text-foreground-bright" />
            <span className="text-[10px] font-black uppercase tracking-widest text-foreground-bright">
              Форум
            </span>
          </div>
          <Link href="/forum" className="text-[9px] font-bold text-muted hover:text-foreground-bright uppercase transition-colors">
            Все темы
          </Link>
        </div>

        <div className="flex flex-col">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="p-3 border-b border-border animate-pulse">
                <div className="h-2 w-12 bg-border rounded mb-2" />
                <div className="h-3 w-full bg-border rounded" />
              </div>
            ))
          ) : (
            posts.map((post) => (
              <Link 
                key={post._id} 
                href={`/forum/${post.slug}`}
                className="px-3 py-3 border-b border-border last:border-0 hover:bg-foreground/[0.02] transition-colors group"
              >
                {/* Категория */}
                <div className="text-[8px] font-bold text-muted/60 uppercase tracking-wider mb-1">
                  {post.category || 'Обсуждение'}
                </div>

                {/* Заголовок */}
                <h3 className="text-[12px] font-bold text-foreground-bright leading-snug group-hover:text-foreground transition-colors line-clamp-2">
                  {post.title}
                </h3>
                
                {/* Статистика и инфо */}
                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex items-center justify-between text-[9px] text-muted font-medium">
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 rounded-full bg-border overflow-hidden">
                         {post.author?.avatar && <img src={post.author.avatar} alt={post.author.username} className="w-full h-full object-cover" />}
                      </div>
                      <span className="truncate max-w-[70px]">{post.author?.username}</span>
                    </div>
                    
                    {/* Просмотры и Лайки */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        <HiOutlineEye className="w-3 h-3" />
                        <span>{post.views || 0}</span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <HiOutlineHeart className="w-3 h-3" />
                        <span>{post.likesCount || post.likes?.length || 0}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[8px] text-muted/50">
                    <HiOutlineClock className="w-2.5 h-2.5" />
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Футер блока */}
        <div className="p-2 bg-background/20">
          <Link 
            href="/forum/create"
            className="flex items-center justify-center w-full py-1.5 border border-border rounded-lg text-[9px] font-black uppercase tracking-tighter text-muted hover:border-foreground hover:text-foreground-bright transition-all bg-surface"
          >
            Создать тему
          </Link>
        </div>
      </div>
    </aside>
  );
}