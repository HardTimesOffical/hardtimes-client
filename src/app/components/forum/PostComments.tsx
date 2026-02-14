'use client';
import { useState, useEffect } from 'react';
import { HiUserCircle, HiOutlineChatBubbleLeftRight, HiOutlinePaperAirplane, HiOutlineLockClosed, HiArrowTurnDownRight, HiXMark } from "react-icons/hi2";
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
  
  // Состояние для ответа
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
          parentId: replyTo?.id || null // Передаем ID родителя, если отвечаем
        })
      });
      
      if (res.ok) {
        const newComment = await res.json();
        setComments((prev) => [newComment, ...prev]);
        setCommentText('');
        setReplyTo(null); // Сбрасываем режим ответа
      }
    } catch (err) { console.error(err); } finally { setIsSubmitting(false); }
  };

  // Фильтруем основные комменты и ответы (для простоты рендерим плоским списком с отступом)
  // В идеале лучше делать рекурсию, но для начала сделаем визуальную пометку
  return (
    <div className="mt-10 space-y-6">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <HiOutlineChatBubbleLeftRight className="w-4 h-4 text-blue-500" />
          <h3 className="text-sm font-black text-[var(--foreground-bright)] uppercase tracking-wider">Обсуждение</h3>
        </div>
      </div>

      <div className="bg-white dark:bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
        {user ? (
          <form onSubmit={handleSendComment}>
            {/* Панель режима ответа */}
            {replyTo && (
              <div className="bg-blue-50 dark:bg-blue-500/10 px-4 py-2 flex items-center justify-between border-b border-blue-100 dark:border-blue-500/20">
                <div className="flex items-center gap-2 text-[10px] font-bold text-blue-600 uppercase">
                  <HiArrowTurnDownRight className="w-3 h-3" />
                  Ответ пользователю <span className="underline">{replyTo.username}</span>
                </div>
                <button onClick={() => setReplyTo(null)} type="button">
                  <HiXMark className="w-4 h-4 text-blue-400 hover:text-red-500" />
                </button>
              </div>
            )}
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={replyTo ? `Ваш ответ...` : "Напишите ваше мнение..."}
              className="w-full min-h-[80px] p-4 bg-transparent border-none outline-none resize-none text-sm text-[var(--foreground)]"
            />
            <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-white/[0.02] border-t border-[var(--border)]">
              <span className="text-[9px] font-black uppercase text-[var(--muted)] ml-2">{user.username}</span>
              <button
                disabled={isSubmitting || !commentText.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest disabled:opacity-50"
              >
                {isSubmitting ? '...' : 'Отправить'}
              </button>
            </div>
          </form>
        ) : (
          <div className="py-6 text-center bg-slate-50 dark:bg-white/[0.02]">
            <Link href="/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg text-[9px] font-black uppercase inline-block">Войти</Link>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="h-20 bg-[var(--card)] animate-pulse rounded-xl" />
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div 
              key={comment._id} 
              className={`flex gap-3 p-4 bg-white dark:bg-[var(--card)] border border-[var(--border)] rounded-xl transition-all ${comment.parentId ? 'ml-8 border-l-4 border-l-blue-500/30' : ''}`}
            >
              <img src={comment.author?.avatar || '/default-avatar.png'} className="w-9 h-9 rounded-lg object-cover shrink-0" alt="" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-[var(--foreground-bright)] uppercase">{comment.author?.username}</span>
                    {comment.parentId && <span className="text-[8px] bg-blue-100 dark:bg-blue-500/20 text-blue-600 px-1 rounded font-bold uppercase">Ответ</span>}
                  </div>
                  <span className="text-[8px] text-[var(--muted)] font-bold uppercase opacity-60">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: ru })}
                  </span>
                </div>
                <p className="text-[13px] text-[var(--foreground)] leading-snug mb-2">{comment.text}</p>
                
                {/* Кнопка ответа */}
                {user && (
                  <button 
                    onClick={() => {
                      setReplyTo({ id: comment._id, username: comment.author?.username });
                      window.scrollTo({ top: document.querySelector('form')?.offsetTop ? document.querySelector('form')!.offsetTop - 100 : 0, behavior: 'smooth' });
                    }}
                    className="text-[9px] font-black text-blue-500 uppercase hover:text-blue-700 transition-colors"
                  >
                    Ответить
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="py-10 text-center text-[var(--muted)] font-bold uppercase text-[9px] tracking-[0.2em] opacity-40">Комментариев пока нет</p>
        )}
      </div>
    </div>
  );
}