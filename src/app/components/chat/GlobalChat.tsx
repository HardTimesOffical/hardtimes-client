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
  const { t } = useLanguage();
  
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null)

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatMessage = (text: string) => {
    if (!text) return "";
    const parts = text.split(/(\s+)/);
    return parts.map((part, index) => {
      if (part.startsWith("@") && part.length > 1) {
        return (
          <span 
            key={index} 
            className="bg-indigo-500/10 text-indigo-300 px-1 rounded border border-indigo-500/20 font-medium"
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

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
          setTimeout(scrollToBottom, 100);
        } else {
          const oldHeight = scrollRef.current?.scrollHeight || 0;
          setMessages((prev) => [...data, ...prev]);
          setSkip(currentSkip);
          setTimeout(() => {
            if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight - oldHeight;
          }, 0);
        }
      }
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

useEffect(() => {
    // Инициализируем сокет только один раз при монтировании
    if (!socketRef.current) {
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
      console.log("Connecting to socket at:", serverUrl); // Проверь это в консоли браузера!

      socketRef.current = io(serverUrl as string, {
        transports: ["websocket"], // Форсируем использование вебсокетов (важно для Nginx)
        upgrade: false
      });

      socketRef.current.on("connect", () => console.log("✅ Socket connected!"));
      socketRef.current.on("connect_error", (err) => console.error("❌ Socket error:", err));
    }

    if (isOpen && messages.length === 0) loadMessages(true);

    const handleReceive = (msg: MessageData) => {
      setMessages((prev) => [...prev, msg]);
      // ... логика скролла
    };

    socketRef.current.on("receive_message", handleReceive);

    return () => {
      socketRef.current?.off("receive_message", handleReceive);
    };
  }, [isOpen]);

const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !socketRef.current) return;

    console.log("Sending message...", newMessage);

    socketRef.current.emit("send_message", {
      message: newMessage,
      authorName: user.username,
      userId: (user as any)._id || user.id,
    });
    setNewMessage("");
  };

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col items-end font-sans text-white">
      {isOpen && (
        <div className="mb-2 w-[320px] h-[550px] bg-[#0b1224] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-white/5 animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {/* HEADER: Градиент остается только здесь */}
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-2.5 flex justify-between items-center shrink-0">
            <span className="font-bold text-[13px] uppercase tracking-widest text-white/90">{t.chat.chat}</span>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 rounded-full p-1 transition-colors">
              <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* MAIN AREA: Темный фон для защиты глаз */}
          <div 
            ref={scrollRef} 
            className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#0b1224] custom-chat-scrollbar"
          >
            <style>{`
              .custom-chat-scrollbar::-webkit-scrollbar { width: 4px; }
              .custom-chat-scrollbar::-webkit-scrollbar-track { background: transparent; }
              .custom-chat-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
              .custom-chat-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }
            `}</style>

            {hasMore && (
              <button 
                onClick={() => loadMessages()} 
                className="w-full py-1.5 text-[10px] text-indigo-400/80 font-bold uppercase hover:text-indigo-300 transition-colors"
              >
                {isLoading ? "..." : t.chat.load_more}
              </button>
            )}

            {messages.map((msg, i) => ( 
              <div key={msg._id || i} className="flex flex-col border-b border-white/[0.03] pb-2 last:border-0">
                <div className="flex gap-2 items-center mb-1">
                  <div className="relative flex-shrink-0 w-8 h-8">
                    {msg.avatar ? (
                      <img 
                        src={msg.avatar} referrerPolicy="no-referrer" alt=""
                        className="w-9 h-9 rounded-md object-cover border border-white/5 block" 
                        onError={(e) => { 
                          const target = e.target as HTMLElement; 
                          target.style.display = 'none'; 
                          if (target.nextElementSibling) (target.nextElementSibling as HTMLElement).style.display = 'flex'; 
                        }}
                      />
                    ) : null}
                    <div 
                      style={{ display: msg.avatar ? 'none' : 'flex' }} 
                      className="w-8 h-8 rounded-md bg-indigo-500/10 border border-indigo-500/20 items-center justify-center text-indigo-400/80 font-bold text-xs uppercase"
                    >
                      {msg.authorName?.charAt(0)}
                    </div>
                  </div>
                  
                  <div className="flex flex-1 items-center justify-between min-w-0">
                    <Link href={`/profile/${msg.authorName}`} className="text-indigo-400/90 font-bold text-[13px] hover:text-indigo-300 transition truncate mr-2">
                      {msg.authorName}
                    </Link>
                    <span className="text-white/20 text-[10px] tabular-nums shrink-0">
                      {formatTime(msg.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="text-[15px] text-slate-300 leading-snug break-words px-0.5 ml-10">
                  {formatMessage(msg.message)}
                </div>

                <button 
                  onClick={() => {
                    setNewMessage(`@${msg.authorName}, `);
                    document.getElementById("chat-input")?.focus();
                  }} 
                  className="ml-10 mt-1 text-white/20 text-[9px] font-bold uppercase hover:text-indigo-400/60 transition-colors w-fit"
                >
                  {t.chat.reply}
                </button>
              </div>
            ))}
          </div>

          {/* INPUT AREA: Проверка авторизации */}
          <div className="p-2 bg-[#0b1224] border-t border-white/5 shrink-0">
            {user ? (
              <form onSubmit={handleSend} className="flex items-center gap-2">
                <div className="flex-1 bg-white/[0.03] rounded-lg border border-white/5 flex items-center px-2.5 py-1.5 focus-within:border-indigo-500/30 transition-all">
                  <input 
                    id="chat-input" 
                    autoComplete="off" 
                    value={newMessage} 
                    onChange={(e) => setNewMessage(e.target.value)} 
                    placeholder={t.chat.message} 
                    className="bg-transparent flex-1 text-[13px] text-slate-200 focus:outline-none placeholder:text-white/10" 
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={!newMessage.trim()} 
                  className="bg-gradient-to-tr from-indigo-600 to-violet-600 p-2 rounded-lg text-white hover:brightness-110 transition disabled:opacity-20 disabled:grayscale shrink-0"
                >
                  <svg className="w-4 h-4 rotate-90" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                  </svg>
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-center p-2 rounded-lg bg-indigo-500/5 border border-indigo-500/10 text-center">
                <p className="text-[11px] text-indigo-300/80 font-medium">
                  {"You must be logged in to chat."}
                  <Link href="/login" className="ml-2 underline hover:text-indigo-200 transition-colors uppercase font-bold tracking-tighter">
                    Login
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)} 
          className="p-3.5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 shadow-xl shadow-indigo-900/20 hover:scale-105 active:scale-95 transition-all text-white border border-white/10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}
    </div>
  );
}