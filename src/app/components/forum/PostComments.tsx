'use client';
import { useState, useEffect } from 'react';
import { HiOutlineChatBubbleLeftRight, HiArrowTurnDownRight, HiXMark } from "react-icons/hi2";
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import Link from 'next/link';

interface PostCommentsProps {
  postId: string;
  user: any;
  accessToken: string | null;
}

export default function PostComments({ postId, user, accessToken }: PostCommentsProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [replyTo, setReplyTo] = useState<{id: string, username: string} | null>(null);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/forum/posts/${postId}/comments`);
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleSendComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !accessToken || !commentText.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/forum/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}` 
        },
        body: JSON.stringify({ 
          text: commentText,
          parentId: replyTo?.id || null 
        })
      });
      
      if (res.ok) {
        const newComment = await res.json();
        setComments((prev) => [newComment, ...prev]);
        setCommentText('');
        setReplyTo(null);
      }
    } catch (err) { console.error(err); } finally { setIsSubmitting(false); }
  };

  return (
    <div className="mt-10 space-y-6">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <HiOutlineChatBubbleLeftRight className="w-4 h-4 text-blue-500" />
          <h3 className="text-sm font-black text-[var(--foreground-bright)] uppercase tracking-wider">Обсуждение</h3>
        </div>
      </div>

      {/* Основной блок ввода */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
        {user ? (
          <form onSubmit={handleSendComment}>
            {/* Панель ответа */}
            {replyTo && (
              <div className="bg-blue-500/5 dark:bg-blue-500/10 px-4 py-2 flex items-center justify-between border-b border-blue-500/10">
                <div className="flex items-center gap-2 text-[10px] font-bold text-blue-500 uppercase tracking-tighter">
                  <HiArrowTurnDownRight className="w-3 h-3" />
                  Ответ <span className="text-[var(--foreground-bright)]">{replyTo.username}</span>
                </div>
                <button onClick={() => setReplyTo(null)} type="button">
                  <HiXMark className="w-4 h-4 text-[var(--muted)] hover:text-red-500 transition-colors" />
                </button>
              </div>
            )}
            
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={replyTo ? `Ваш ответ...` : "Напишите ваше мнение..."}
              className="w-full min-h-[100px] p-4 bg-transparent border-none outline-none resize-none text-[13px] text-[var(--foreground)] placeholder:text-[var(--muted)] placeholder:opacity-50"
            />
            
            <div className="flex items-center justify-between p-2.5 bg-black/[0.02] dark:bg-white/[0.02] border-t border-[var(--border)]">
              <span className="text-[9px] font-black uppercase text-[var(--muted)] ml-2 opacity-60">
                {user.username}
              </span>
              <button
                disabled={isSubmitting || !commentText.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest disabled:opacity-50 transition-all active:scale-95"
              >
                {isSubmitting ? '...' : 'Отправить'}
              </button>
            </div>
          </form>
        ) : (
          <div className="py-8 text-center bg-black/[0.02] dark:bg-white/[0.02]">
            <p className="text-[10px] font-black uppercase text-[var(--muted)] mb-3">Войдите, чтобы оставить комментарий</p>
            <Link href="/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg text-[9px] font-black uppercase inline-block">Войти</Link>
          </div>
        )}
      </div>

      {/* Список комментариев */}
      <div className="space-y-3">
        {loading ? (
          <div className="h-20 bg-[var(--surface)] border border-[var(--border)] animate-pulse rounded-xl" />
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div 
              key={comment._id} 
              className={`flex gap-3 p-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl transition-all 
                ${comment.parentId ? 'ml-8 border-l-2 border-l-blue-500/30' : ''}`}
            >
              <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-[var(--card)] border border-[var(--border)]">
                {comment.author?.avatar ? (
                    <img src={comment.author.avatar} className="w-full h-full object-cover" alt="" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--muted)] text-xs font-bold">
                        {comment.author?.username?.[0]?.toUpperCase()}
                    </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-[var(--foreground-bright)] uppercase tracking-tight">
                        {comment.author?.username}
                    </span>
                    {comment.parentId && (
                        <span className="text-[7px] bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">Ответ</span>
                    )}
                  </div>
                  <span className="text-[8px] text-[var(--muted)] font-bold uppercase opacity-50">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: ru })}
                  </span>
                </div>
                
                <p className="text-[13px] text-[var(--foreground)] leading-relaxed mb-2 selection:bg-blue-500/30">
                    {comment.text}
                </p>
                
                {user && (
                  <button 
                    onClick={() => {
                      setReplyTo({ id: comment._id, username: comment.author?.username });
                      const form = document.querySelector('form');
                      form?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    className="text-[9px] font-black text-blue-500 uppercase hover:text-blue-400 transition-colors flex items-center gap-1"
                  >
                    <HiArrowTurnDownRight className="w-2.5 h-2.5" />
                    Ответить
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center border border-dashed border-[var(--border)] rounded-2xl">
            <p className="text-[9px] font-black uppercase text-[var(--muted)] tracking-[0.2em] opacity-30">Обсуждение пока пусто</p>
          </div>
        )}
      </div>
    </div>
  );
}