"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { io, Socket } from "socket.io-client";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface MessageData {
  _id: string;
  authorName: string;
  avatar?: string;
  message: string;
  userId?: string;
  createdAt: string;
}

export default function GlobalChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  
  const { t } = useLanguage();
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const loadMessages = async (isInitial = false) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const currentSkip = isInitial ? 0 : skip + 30;
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/chat?limit=30&skip=${currentSkip}`);
      if (res.ok) {
        const data: MessageData[] = await res.json();
        if (data.length < 30) setHasMore(false);
        if (isInitial) {
          setMessages(data);
          setSkip(0);
        } else {
          setMessages((prev) => [...prev, ...data]);
          setSkip(currentSkip);
        }
      }
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  };

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(process.env.NEXT_PUBLIC_SERVER_URL as string, {
        transports: ["websocket"],
        upgrade: false
      });
    }
    if (isOpen && messages.length === 0) loadMessages(true);
    const handleReceive = (msg: MessageData) => {
      setMessages((prev) => [msg, ...prev]);
      setTimeout(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, 100);
    };
    socketRef.current.on("receive_message", handleReceive);
    return () => { socketRef.current?.off("receive_message", handleReceive); };
  }, [isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !socketRef.current || cooldown > 0) return;
    socketRef.current.emit("send_message", {
      message: newMessage,
      authorName: user.username,
      userId: (user as any)._id || user.id,
      avatar: (user as any).avatar
    });
    setNewMessage("");
    setCooldown(5);
  };

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col items-end font-sans text-white">
      {isOpen && (
        <div className="mb-3 w-[300px] h-[500px] bg-[#0b0f1a]/95 backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-white/10 animate-in fade-in zoom-in-95 duration-300">
          
          {/* HEADER */}
          <div className="p-3.5 flex justify-between items-center bg-white/5 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
              <span className="font-black text-[10px] uppercase tracking-[0.15em] text-white/80">Чат</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/20 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* MESSAGES */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 custom-chat-scrollbar">
            <style>{`
              .custom-chat-scrollbar::-webkit-scrollbar { width: 3px; }
              .custom-chat-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
            `}</style>

            <div className="flex flex-col gap-3">
              {messages.map((msg, i) => ( 
                <div key={msg._id || i} className="group flex gap-2.5 animate-in slide-in-from-top-1 duration-200">
                  <div className="w-7 h-7 shrink-0 rounded-lg bg-indigo-600/20 border border-white/5 overflow-hidden flex items-center justify-center font-black text-[10px] text-indigo-400 uppercase">
                    {msg.avatar ? <img src={msg.avatar} className="w-full h-full object-cover" /> : msg.authorName[0]}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[12px] font-bold text-white/90 truncate">{msg.authorName}</span>
                      <span className="text-[9px] text-white/20 tabular-nums">{formatTime(msg.createdAt)}</span>
                    </div>
                    <div className="text-[13px] text-slate-300 leading-snug bg-white/[0.03] p-2 rounded-xl rounded-tl-none border border-white/[0.02] group-hover:bg-white/[0.05] transition-colors">
                      {msg.message}
                    </div>
                    <button 
                      onClick={() => {
                        setNewMessage(`@${msg.authorName}, `);
                        document.getElementById("chat-input")?.focus();
                      }} 
                      className="mt-1 text-[9px] font-black uppercase text-indigo-500/50 hover:text-indigo-400 transition-colors"
                    >
                      Ответить
                    </button>
                  </div>
                </div>
              ))}

              {hasMore && (
                <button onClick={() => loadMessages()} className="py-2 text-[9px] font-black uppercase text-white/5 hover:text-indigo-400">
                  Загрузить еще
                </button>
              )}
            </div>
          </div>

          {/* INPUT */}
          <div className="p-3 bg-[#0d1324] border-t border-white/5 shrink-0">
            {user ? (
              <form onSubmit={handleSend} className="relative">
                <input 
                  id="chat-input"
                  disabled={cooldown > 0}
                  autoComplete="off" 
                  value={newMessage} 
                  onChange={(e) => setNewMessage(e.target.value)} 
                  placeholder={cooldown > 0 ? `${cooldown}s` : "Сообщение..."} 
                  className={`w-full bg-white/5 rounded-xl border ${cooldown > 0 ? 'border-red-500/20' : 'border-white/5'} px-3 py-2.5 text-xs focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-white/10`} 
                />
                <button 
                  type="submit" 
                  disabled={!newMessage.trim() || cooldown > 0} 
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-indigo-600 rounded-lg text-white hover:bg-indigo-500 disabled:opacity-0 transition-all active:scale-90"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/></svg>
                </button>
              </form>
            ) : (
              <div className="text-center py-1 text-[9px] text-white/20 uppercase font-black">Нужен вход</div>
            )}
          </div>
        </div>
      )}

      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)} 
          className="p-3.5 rounded-2xl bg-indigo-600 shadow-lg hover:scale-110 active:scale-95 transition-all text-white border border-white/10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        </button>
      )}
    </div>
  );
}