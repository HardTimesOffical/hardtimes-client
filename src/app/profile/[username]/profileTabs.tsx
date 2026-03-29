"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ProfileTabs({ user, isOwner }: { user: any; isOwner: boolean }) {
  const [activeTab, setActiveTab] = useState<"servers" | "projects">("servers");
  const [loading, setLoading] = useState(true);

  const colors = {
    brand: "#84a98c",
    brandDim: "rgba(132, 169, 140, 0.25)",
    bgElevated: "#161817",
    bgSubtle: "#1e211f",
    border: "rgba(255, 255, 255, 0.08)",
    text: "#f2f2f2",
    textDim: "#7d8581",
  };

  // Сбрасываем загрузку, когда меняем таб или когда прилетают данные пользователя
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, [activeTab, user]);

  const renderIPs = (ipData: any) => {
    if (!ipData) return <span style={{ color: colors.textDim }}>0.0.0.0</span>;
    const values = typeof ipData === "string" 
      ? [ipData] 
      : Object.values(ipData).filter((v): v is string => typeof v === "string" && v.length > 0);
    
    return (
      <div className="flex flex-col gap-0.5">
        {values.length ? values.map((v, i) => <span key={i} className="block truncate">{v}</span>) : "0.0.0.0"}
      </div>
    );
  };

  return (
    <div className="w-full space-y-4">
      {/* Кнопки переключения */}
      <div className="flex gap-2">
        {(["servers", "projects"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className="flex-1 py-2 font-mc-pixel text-[9px] uppercase transition-all border"
            style={{ 
              borderColor: activeTab === t ? colors.brand : colors.border,
              color: activeTab === t ? colors.brand : colors.textDim,
              boxShadow: activeTab === t ? `inset 0 0 8px ${colors.brandDim}` : "none"
            }}
          >
            {t === "servers" ? "Серверы" : "Проекты"} ({user[t]?.length || 0})
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {loading ? (
          <div className="py-10 text-center font-mc-pixel text-[9px] text-[#555555] animate-pulse">Синхронизация данных...</div>
        ) : (
          <>
            {/* Рендер серверов */}
            {activeTab === "servers" && (user.servers || []).map((server: any) => (
              <div key={server._id} className="flex items-start border p-3 gap-3 transition-colors"
                   style={{ backgroundColor: colors.bgElevated, borderColor: colors.border }}>
                <div className="w-12 h-12 bg-black border shrink-0 overflow-hidden" style={{ borderColor: colors.border }}>
                  <img src={server.imageUrl || "/no-img.png"} className="w-full h-full object-cover pixelated" alt="" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                  <h3 className="font-mc-pixel text-[11px] uppercase truncate" style={{ color: colors.text }}>{server.serverName}</h3>
                  <div className="font-mc-pixel text-[9px] uppercase" style={{ color: colors.textDim }}>{renderIPs(server.ipAddress)}</div>
                </div>
                <Link href={`/monitoring/${server.slug}`} className="px-3 py-1.5 border font-mc-pixel text-[8px] uppercase"
                      style={{ backgroundColor: colors.bgSubtle, borderColor: colors.border, color: colors.text }}>
                  Открыть
                </Link>
              </div>
            ))}

            {/* Рендер проектов */}
            {activeTab === "projects" && (user.projects || []).map((project: any) => (
              <div key={project._id} className="flex items-center border p-3 gap-3 transition-colors"
                   style={{ backgroundColor: colors.bgElevated, borderColor: colors.border }}>
                <div className="w-12 h-12 bg-[--color-bg-subtle] border shrink-0 flex items-center justify-center" style={{ borderColor: colors.border }}>
                  {project.iconUrl ? <img src={project.iconUrl} className="w-full h-full object-cover pixelated" /> : <span className="opacity-20 text-[14px]">📦</span>}
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                  <h3 className="font-mc-pixel text-[11px] uppercase truncate" style={{ color: colors.text }}>{project.title}</h3>
                  <div className="flex gap-3 font-mc-pixel text-[8px]" style={{ color: colors.textDim }}>
                    <span>ПРОСМОТРЫ: {project.analytics?.views || 0}</span>
                    <span>ЗАГРУЗКИ: {project.analytics?.downloads || 0}</span>
                  </div>
                </div>
                <Link href={`/content/project/${project.slug}`} className="px-3 py-1.5 border font-mc-pixel text-[8px] uppercase"
                      style={{ backgroundColor: colors.bgSubtle, borderColor: colors.border, color: colors.text }}>
                  Открыть
                </Link>
              </div>
            ))}

            {/* Проверка на пустой список */}
            {((activeTab === "servers" && !user.servers?.length) || (activeTab === "projects" && !user.projects?.length)) && (
              <div className="py-10 text-center font-mc-pixel text-[9px] uppercase tracking-widest border border-dashed"
                   style={{ color: colors.textDim, borderColor: colors.border }}>
                Список пуст
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}