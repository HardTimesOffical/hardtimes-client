"use client";

import { useState } from "react";
import { HiOutlineServer,HiOutlineEye, HiOutlineCube,HiOutlineArrowDownTray, HiOutlineStar, HiOutlineCog6Tooth } from "react-icons/hi2";
import Link from "next/link";

export default function ProfileTabs({ user, isOwner }: { user: any; isOwner: boolean }) {
  const [activeTab, setActiveTab] = useState<"servers" | "projects">("servers");

    const renderIP = (ip: any) => {
    if (!ip) return "IP не указан";
    if (typeof ip === "string") return ip;
    if (typeof ip === "object") {
        // Склеиваем адрес и порт, если это объект
        const address = ip.address || ip.ip || "unknown";
        const port = ip.port ? `:${ip.port}` : "";
        return `${address}${port}`;
    }
    return String(ip);
    };

  return (
    <div className="w-full">
      {/* Навигация вкладок */}
      <div className="flex items-center gap-8 border-b border-border mb-6">
        <button
          onClick={() => setActiveTab("servers")}
          className={`pb-3 text-sm font-medium transition-colors relative ${
            activeTab === "servers" ? "text-foreground-bright" : "text-muted hover:text-foreground"
          }`}
        >
          <div className="flex items-center gap-2">
            <HiOutlineServer size={18} />
            Серверы
            <span className="bg-secondary px-2 py-0.5 rounded-full text-[10px]">{user.servers?.length || 0}</span>
          </div>
        {activeTab === "servers" && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-accent" />}
        </button>

        <button
          onClick={() => setActiveTab("projects")}
          className={`pb-3 text-sm font-medium transition-colors relative ${
            activeTab === "projects" ? "text-foreground-bright" : "text-muted hover:text-foreground"
          }`}
        >
          <div className="flex items-center gap-2">
            <HiOutlineCube size={18} />
            Проекты
            <span className="bg-secondary px-2 py-0.5 rounded-full text-[10px]">{user.projects?.length || 0}</span>
          </div>
          {activeTab === "projects" && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-accent" />}
        </button>
      </div>

      {/* Контент Серверов */}
      {activeTab === "servers" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user.servers?.map((server: any) => (
            <div key={server._id} className="bg-card border border-border rounded-lg overflow-hidden flex flex-col group h-full">
              <div className="h-24 w-full bg-surface relative overflow-hidden shrink-0">
                {server.imageUrl ? (
                  <img src={server.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-muted font-mono uppercase">No Banner</div>
                )}
              </div>

              <div className="p-3 flex-1 flex flex-col justify-between gap-3">
                <div className="min-w-0">
                  <Link href={`/monitoring/${server.slug}`} className="font-bold text-sm text-foreground-bright hover:text-accent transition-colors block truncate">
                    {server.serverName}
                  </Link>
                  {/* IP: Скрываем переполнение через truncate и max-width */}
                  <div className="mt-1 max-w-full">
                    <code className="text-[10px] font-mono text-muted bg-surface px-1.5 py-0.5 rounded border border-border block truncate" title={renderIP(server.ipAddress)}>
                      {renderIP(server.ipAddress)}
                    </code>
                  </div>
                </div>
                
                {/* Онлайн: Переносим ниже для экономии места */}
                <div className="flex items-center justify-between border-t border-border/50 pt-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className={`shrink-0 w-2 h-2 rounded-full ${server.status?.online ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-red-500'}`} />
                    <span className="text-[10px] font-bold text-muted uppercase truncate">
                      {server.status?.online ? `${server.status.players}/${server.status.maxPlayers}` : 'Offline'}
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-accent/80 uppercase shrink-0">{server.version || '1.20'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Контент Проектов */}
      {activeTab === "projects" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user.projects?.map((project: any) => (
            <div key={project._id} className="bg-card border border-border rounded-lg p-4 flex flex-col gap-3 relative">
                <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-md border border-border bg-surface overflow-hidden shrink-0 flex items-center justify-center">
                {project.iconUrl ? (
                    <img 
                    src={project.iconUrl} 
                    className="w-full h-full object-cover" 
                    alt={project.title}
                    onError={(e) => {
                        // Если картинка не прогрузилась (404 или битая ссылка), заменяем на иконку
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="text-muted/20"><svg ...></svg></div>';
                    }}
                    />
                ) : (
                    <HiOutlineCube size={24} className="text-muted/20" />
                )}
                </div>
                <div className="min-w-0 flex-1">
                    <Link href={`/content/project/${project.slug}`} className="text-sm font-bold text-foreground-bright hover:text-accent truncate block">
                    {project.title}
                    </Link>
                    <p className="text-[11px] text-muted truncate mt-0.5">{project.summary}</p>
                </div>
                </div>

                {/* СТАТИСТИКА: берем из объекта analytics */}
                <div className="flex items-center gap-4 mt-auto pt-2 border-t border-border/50">
                <div className="flex items-center gap-1 text-muted text-[10px]" title="Просмотры">
                    <HiOutlineEye size={12} />
                    <span>{project.analytics?.views || 0}</span> 
                </div>
                <div className="flex items-center gap-1 text-muted text-[10px]" title="Загрузки">
                    <HiOutlineArrowDownTray size={12} />
                    <span>{project.analytics?.downloads || 0}</span>
                </div>
                
                <span className="ml-auto text-[9px] px-1.5 py-0.5 bg-secondary rounded text-muted font-bold uppercase">
                    {project.projectType}
                </span>
                </div>
            </div>
            ))}
        </div>
      )}
    </div>
  );
}