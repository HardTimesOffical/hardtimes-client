"use client";

import { useState, useEffect } from "react";
import { HiOutlineServer, HiOutlineEye, HiOutlineCube, HiOutlineArrowDownTray } from "react-icons/hi2";
import Link from "next/link";

export default function ProfileTabs({ user, isOwner }: { user: any; isOwner: boolean }) {
  const [activeTab, setActiveTab] = useState<"servers" | "projects">("servers");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const renderIP = (ip: any) => {
    if (!ip) return "0.0.0.0";
    if (typeof ip === "string") return ip;
    return ip.address || ip.ip || "0.0.0.0";
  };

  const tabButtonStyle = (isActive: boolean) => `
    pb-3 text-[11px] font-bold uppercase tracking-wider transition-all relative flex items-center gap-2
    ${isActive ? "text-[#8da081]" : "text-zinc-500 hover:text-zinc-300"}
  `;

  const SkeletonCard = () => (
    <div className="w-full h-20 bg-white/[0.02] border border-white/5 flex items-center p-4 gap-4 animate-pulse">
      <div className="w-12 h-12 bg-white/5" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-1/4 bg-white/5" />
        <div className="h-2 w-1/3 bg-white/5" />
      </div>
    </div>
  );

  return (
    <div className="w-full p-4 lg:p-6">
      {/* Вкладки */}
      <div className="flex items-center gap-8 border-b border-white/5 mb-6">
        <button onClick={() => setActiveTab("servers")} className={tabButtonStyle(activeTab === "servers")}>
          <HiOutlineServer size={16} />
          Серверы
          <span className="opacity-40 text-[9px]">({user.servers?.length || 0})</span>
          {activeTab === "servers" && <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[#8da081]" />}
        </button>

        <button onClick={() => setActiveTab("projects")} className={tabButtonStyle(activeTab === "projects")}>
          <HiOutlineCube size={16} />
          Проекты
          <span className="opacity-40 text-[9px]">({user.projects?.length || 0})</span>
          {activeTab === "projects" && <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[#8da081]" />}
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {loading ? (
          <><SkeletonCard /><SkeletonCard /></>
        ) : (
          <>
            {/* Список Серверов */}
            {activeTab === "servers" && user.servers?.map((server: any) => (
              <div key={server._id} className="flex items-center bg-[#111] border border-white/5 p-3 gap-4 hover:bg-[#141414] transition-colors">
                <div className="w-14 h-14 bg-black border border-white/10 shrink-0 overflow-hidden">
                  {server.imageUrl ? (
                    <img src={server.imageUrl} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[8px] text-zinc-600 uppercase">Нет фото</div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-[13px] text-white uppercase truncate">{server.serverName}</h3>
                    <span className="text-[9px] text-white/30 font-mono border border-white/5 px-1">{server.version || '1.20.1'}</span>
                  </div>
                  <code className="text-[10px] text-zinc-500 block mt-1">{renderIP(server.ipAddress)}</code>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="text-[10px] font-bold text-[#8da081]">
                    {server.status?.online ? `${server.status.players}/${server.status.maxPlayers}` : 'Оффлайн'}
                  </div>
                  <Link 
                    href={`/monitoring/${server.slug}`}
                    className="px-4 py-1.5 bg-[#1a1a1a] border border-white/10 text-[9px] font-bold uppercase text-white hover:bg-[#8da081] hover:text-black transition-all"
                  >
                    Открыть
                  </Link>
                </div>
              </div>
            ))}

            {/* Список Проектов */}
            {activeTab === "projects" && user.projects?.map((project: any) => (
              <div key={project._id} className="flex items-center bg-[#111] border border-white/5 p-3 gap-4 hover:bg-[#141414] transition-colors">
                <div className="w-14 h-14 bg-[#1a1a1a] border border-white/10 shrink-0 overflow-hidden flex items-center justify-center">
                  {project.iconUrl ? (
                    <img src={project.iconUrl} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <HiOutlineCube size={20} className="text-zinc-700" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[13px] text-white uppercase">{project.title}</h3>
                  <div className="flex gap-3 mt-1 opacity-50">
                    <div className="flex items-center gap-1 text-[9px]"><HiOutlineEye size={10} /> {project.analytics?.views || 0}</div>
                    <div className="flex items-center gap-1 text-[9px]"><HiOutlineArrowDownTray size={10} /> {project.analytics?.downloads || 0}</div>
                  </div>
                </div>

                <Link 
                  href={`/content/project/${project.slug}`}
                  className="px-4 py-1.5 bg-[#1a1a1a] border border-white/10 text-[9px] font-bold uppercase text-white hover:bg-[#8da081] hover:text-black transition-all"
                >
                  Открыть
                </Link>
              </div>
            ))}
          </>
        )}
      </div>

      {!loading && ((activeTab === "servers" && !user.servers?.length) || (activeTab === "projects" && !user.projects?.length)) && (
        <div className="py-20 text-center text-[10px] text-zinc-600 uppercase tracking-widest">Список пуст</div>
      )}
    </div>
  );
}