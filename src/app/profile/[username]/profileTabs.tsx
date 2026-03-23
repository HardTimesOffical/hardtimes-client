"use client";

import { useState } from "react";
import { HiOutlineServer, HiOutlineEye, HiOutlineCube, HiOutlineArrowDownTray } from "react-icons/hi2";
import Link from "next/link";

export default function ProfileTabs({ user, isOwner }: { user: any; isOwner: boolean }) {
  const [activeTab, setActiveTab] = useState<"servers" | "projects">("servers");

  const renderIP = (ip: any) => {
    if (!ip) return "IP не указан";
    if (typeof ip === "string") return ip;
    if (typeof ip === "object") {
      const address = ip.address || ip.ip || "unknown";
      const port = ip.port ? `:${ip.port}` : "";
      return `${address}${port}`;
    }
    return String(ip);
  };

  const tabButtonStyle = (isActive: boolean) => `
    pb-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all relative flex items-center gap-3
    ${isActive ? "text-white" : "text-zinc-600 hover:text-zinc-400"}
  `;

  return (
    <div className="w-full p-6 lg:p-10">
      {/* Навигация вкладок */}
      <div className="flex items-center gap-10 border-b border-white/5 mb-8">
        <button onClick={() => setActiveTab("servers")} className={tabButtonStyle(activeTab === "servers")}>
          <HiOutlineServer size={16} className={activeTab === "servers" ? "text-[#5a6e60]" : ""} />
          Серверы
          <span className="text-[9px] opacity-40">[{user.servers?.length || 0}]</span>
          {activeTab === "servers" && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#5a6e60]" />}
        </button>

        <button onClick={() => setActiveTab("projects")} className={tabButtonStyle(activeTab === "projects")}>
          <HiOutlineCube size={16} className={activeTab === "projects" ? "text-[#5a6e60]" : ""} />
          Проекты
          <span className="text-[9px] opacity-40">[{user.projects?.length || 0}]</span>
          {activeTab === "projects" && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#5a6e60]" />}
        </button>
      </div>

      {/* Контент Серверов */}
      {activeTab === "servers" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {user.servers?.map((server: any) => (
            <div key={server._id} className="bg-[#1a1a1a] border border-white/5 group flex flex-col h-full hover:border-[#5a6e60]/50 transition-all duration-300 shadow-lg">
              {/* Увеличенная высота баннера h-36 вместо h-28 и убрано затемнение (opacity-100) */}
              <div className="h-36 w-full bg-[#141414] relative overflow-hidden shrink-0 border-b border-white/5">
                {server.imageUrl ? (
                  <img 
                    src={server.imageUrl} 
                    className="w-full h-full object-cover opacity-100 group-hover:scale-105 transition-all duration-700 grayscale-[0.2] group-hover:grayscale-0" 
                    alt="" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-700 font-bold uppercase tracking-widest bg-[#181818]">
                    No Banner
                  </div>
                )}
                {/* Версия сервера */}
                <div className="absolute top-3 right-3 px-2.5 py-1 bg-[#1a1a1a]/90 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase tracking-tighter">
                   {server.version || '1.20.1'}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col gap-5">
                <div className="min-w-0">
                  <Link href={`/monitoring/${server.slug}`} className="font-bold text-base text-white uppercase tracking-tight hover:text-[#5a6e60] transition-colors block truncate">
                    {server.serverName}
                  </Link>
                  <div className="mt-2.5 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#5a6e60] rotate-45" />
                    <code className="text-[11px] font-mono text-zinc-400 bg-black/20 px-2 py-0.5 border border-white/5 truncate" title={renderIP(server.ipAddress)}>
                      {renderIP(server.ipAddress)}
                    </code>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-auto pt-5 border-t border-white/5">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-2 h-2 rounded-full ${server.status?.online ? 'bg-[#5a6e60] shadow-[0_0_10px_#5a6e60]' : 'bg-red-600'}`} />
                    <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-tight">
                      {server.status?.online ? `${server.status.players} / ${server.status.maxPlayers}` : 'Offline'}
                    </span>
                  </div>
                  <button className="text-[10px] font-bold text-[#5a6e60] uppercase hover:text-white transition-colors tracking-widest">
                    Подробнее
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Контент Проектов */}
      {activeTab === "projects" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {user.projects?.map((project: any) => (
            <div key={project._id} className="bg-[#1a1a1a] border border-white/5 p-6 flex flex-col gap-5 relative hover:border-[#5a6e60]/50 transition-all duration-300">
                <div className="flex items-start gap-5">
                  {/* Увеличенная иконка проекта */}
                  <div className="w-20 h-20 bg-[#242424] border border-white/5 shrink-0 flex items-center justify-center relative group-hover:border-[#5a6e60]/30 shadow-inner">
                    {project.iconUrl ? (
                        <img src={project.iconUrl} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all opacity-100" alt={project.title} />
                    ) : (
                        <HiOutlineCube size={28} className="text-zinc-700" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                      <Link href={`/content/project/${project.slug}`} className="text-base font-bold text-white uppercase tracking-tight hover:text-[#5a6e60] truncate block">
                        {project.title}
                      </Link>
                      <p className="text-[12px] text-zinc-500 line-clamp-3 mt-1.5 leading-relaxed italic opacity-80">
                        {project.summary}
                      </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 mt-auto pt-5 border-t border-white/5">
                  <div className="flex items-center gap-2 text-zinc-500" title="Просмотры">
                      <HiOutlineEye size={14} />
                      <span className="text-[11px] font-bold">{project.analytics?.views || 0}</span> 
                  </div>
                  <div className="flex items-center gap-2 text-zinc-500" title="Загрузки">
                      <HiOutlineArrowDownTray size={14} />
                      <span className="text-[11px] font-bold">{project.analytics?.downloads || 0}</span>
                  </div>
                  
                  <div className="ml-auto px-3 py-1 bg-[#5a6e60]/10 border border-[#5a6e60]/30 text-[#5a6e60] text-[10px] font-bold uppercase tracking-[0.2em]">
                      {project.projectType}
                  </div>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}