"use client";

import React, { useState, useRef, useEffect, ChangeEvent, FormEvent } from "react";
import { GAME_TYPES } from "@/constants/gameTypes";
import { GAME_VERSIONS } from "@/constants/gameVersions";
import { CATEGORIES } from "@/constants/categories";
import { TAGS } from "@/constants/tags";
import { LANGUAGES } from "@/constants/languages";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// Вспомогательный компонент CustomSelect с твоими переменными
const CustomSelect: React.FC<any> = ({ options, selected, multiple = false, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    if (multiple) {
      const arr = Array.isArray(selected) ? [...selected] : [];
      onChange(arr.includes(option) ? arr.filter(v => v !== option) : [...arr, option]);
    } else {
      onChange(option);
      setIsOpen(false);
    }
  };

  const displayValue = multiple ? (Array.isArray(selected) ? selected.join(", ") : "") : (selected as string || "");

  return (
    <div className="relative w-full text-sm" ref={selectRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 bg-card border border-border rounded-md cursor-pointer text-foreground hover:border-accent transition-colors shadow-sm"
      >
        <span className="truncate">{displayValue || placeholder || "Выбрать..."}</span>
        <span className="text-[10px] opacity-50">{isOpen ? "▲" : "▼"}</span>
      </div>
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-md shadow-xl max-h-60 overflow-y-auto scrollbar-thin">
          {options.map((option: string) => (
            <div
              key={option}
              onClick={() => toggleOption(option)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-surface cursor-pointer text-foreground border-b border-border/30 last:border-0"
            >
              {multiple && <input type="checkbox" readOnly checked={selected.includes(option)} className="accent-accent" />}
              <span>{option}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function EditServer() {
  const { user, accessToken } = useAuth();
  const router = useRouter();
  const { slug } = useParams();

  const [loading, setLoading] = useState(true);
  const [isAuthor, setIsAuthor] = useState(true);
  
  const [serverName, setServerName] = useState("");
  const [ips, setIps] = useState({ java: "", bedrock: "" });
  const [gameType, setGameType] = useState("");
  const [gameVersion, setGameVersion] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [discord, setDiscord] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableVersions = (() => {
    if (gameType === "JAVA & BEDROCK") return GAME_VERSIONS["Minecraft Java"] || [];
    return gameType ? GAME_VERSIONS[gameType] || [] : [];
  })();

  const fetchServerData = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/servers/by-slug/${slug}`);
      if (!res.ok) throw new Error();
      const data = await res.json();

      const serverOwnerId = (data.owner?._id || data.owner || "").toString();
      const currentUserId = (user?.id || user?._id || "").toString();

      if (serverOwnerId !== currentUserId && user?.role !== 'admin') {
        setIsAuthor(false);
        return;
      }

      setServerName(data.serverName);
      try {
        const parsedIps = typeof data.ipAddress === 'string' ? JSON.parse(data.ipAddress) : data.ipAddress;
        setIps(parsedIps);
      } catch (e) {
        if (data.gameType === "Minecraft Bedrock") setIps({ java: "", bedrock: data.ipAddress });
        else setIps({ java: data.ipAddress, bedrock: "" });
      }

      setGameType(data.gameType);
      setGameVersion(data.gameVersion);
      setCategories(Array.isArray(data.categories) ? data.categories : []);
      setTags(Array.isArray(data.tags) ? data.tags : []);
      setLanguages(Array.isArray(data.languages) ? data.languages : []);
      setDiscord(data.discord || "");
      setWebsite(data.website || "");
      setDescription(data.description || "");
      if (data.imageUrl) setImagePreview(data.imageUrl);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => {
    if (slug && user) fetchServerData();
    else if (!user) router.push("/login");
  }, [slug, user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      const finalIp = gameType === "JAVA & BEDROCK" ? JSON.stringify(ips) : (gameType === "Minecraft Bedrock" ? ips.bedrock : ips.java);
      formData.append("serverName", serverName);
      formData.append("ipAddress", finalIp);
      formData.append("gameType", gameType);
      formData.append("gameVersion", gameVersion);
      formData.append("categories", JSON.stringify(categories));
      formData.append("tags", JSON.stringify(tags));
      formData.append("languages", JSON.stringify(languages));
      formData.append("discord", discord);
      formData.append("website", website);
      formData.append("description", description);
      if (imageFile) formData.append("image", imageFile);

      await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/servers/edit/${slug}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      });
      router.push(`/monitoring/${slug}`);
    } catch (e) { alert("Ошибка сохранения"); } finally { setIsSubmitting(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
    </div>
  );

  if (!isAuthor) return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-md p-6 text-center shadow-md">
        <h2 className="text-xl font-bold mb-2">Вы не владелец</h2>
        <p className="text-muted text-sm mb-6">У вас нет прав для редактирования этого сервера.</p>
        <button onClick={() => router.push("/")} className="w-full py-2 bg-accent text-contrast-text rounded-md font-bold">На главную</button>
      </div>
    </div>
  );

  const labelStyle = "text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5 block";
  const inputStyle = "w-full px-3 py-2 bg-card border border-border rounded-md text-foreground focus:border-accent outline-none transition-all text-sm shadow-sm";

  return (
    <div className="min-h-screen bg-surface pt-24 pb-12 px-4 transition-colors">
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto flex flex-col gap-6">
        <div className="px-2">
          <h1 className="text-2xl font-bold text-foreground-bright">Редактировать сервер</h1>
          <p className="text-muted text-sm">Внесите изменения в конфигурацию вашего проекта</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Левая колонка */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="bg-card border border-border rounded-md p-5 shadow-sm space-y-4">
              <div>
                <label className={labelStyle}>Название сервера</label>
                <input className={inputStyle} type="text" value={serverName} onChange={e => setServerName(e.target.value)} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>Тип игры</label>
                  <CustomSelect options={[...GAME_TYPES, "JAVA & BEDROCK"]} selected={gameType} onChange={(v:any) => { setGameType(v); setGameVersion(""); }} />
                </div>
                <div>
                  <label className={labelStyle}>Версия</label>
                  <CustomSelect options={availableVersions} selected={gameVersion} onChange={(v:any) => setGameVersion(v)} />
                </div>
              </div>

              <div className="space-y-3 bg-surface p-3 rounded-md border border-border/50">
                {(gameType.includes("Java") || gameType.includes("JAVA")) && (
                  <div>
                    <label className={labelStyle}>Java IP</label>
                    <input className={inputStyle} type="text" placeholder="mc.server.com" value={ips.java} onChange={e => setIps({...ips, java: e.target.value})} />
                  </div>
                )}
                {(gameType.includes("Bedrock") || gameType.includes("JAVA & BEDROCK")) && (
                  <div>
                    <label className={labelStyle}>Bedrock IP / Port</label>
                    <input className={inputStyle} type="text" placeholder="pe.server.com:19132" value={ips.bedrock} onChange={e => setIps({...ips, bedrock: e.target.value})} />
                  </div>
                )}
              </div>

              <div>
                <label className={labelStyle}>Описание</label>
                <textarea className={`${inputStyle} h-44 resize-none`} value={description} onChange={e => setDescription(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Правая колонка */}
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <div className="bg-card border border-border rounded-md p-5 shadow-sm space-y-4">
              <div>
                <label className={labelStyle}>Категории</label>
                <CustomSelect options={CATEGORIES} selected={categories} multiple onChange={(v:any) => setCategories(v)} />
              </div>
              <div>
                <label className={labelStyle}>Теги</label>
                <CustomSelect options={TAGS} selected={tags} multiple onChange={(v:any) => setTags(v)} />
              </div>
              <div>
                <label className={labelStyle}>Языки</label>
                <CustomSelect options={LANGUAGES} selected={languages} multiple onChange={(v:any) => setLanguages(v)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>Discord</label>
                  <input className={inputStyle} type="text" value={discord} onChange={e => setDiscord(e.target.value)} />
                </div>
                <div>
                  <label className={labelStyle}>Сайт</label>
                  <input className={inputStyle} type="text" value={website} onChange={e => setWebsite(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-md p-4 shadow-sm">
              <label className={labelStyle}>Изображение</label>
              <div 
                className="aspect-video bg-surface rounded-md border border-dashed border-border flex items-center justify-center overflow-hidden cursor-pointer group relative"
                onClick={() => document.getElementById('img-input')?.click()}
              >
                {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" /> : <span className="text-muted text-xs">Загрузить баннер</span>}
                <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-card px-3 py-1 rounded text-xs border border-border shadow-md">Изменить</span>
                </div>
                <input id="img-input" type="file" accept="image/*" className="hidden" onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
                }} />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-2">
              <button type="button" onClick={() => router.back()} className="text-muted hover:text-foreground text-sm font-medium transition-colors">Отмена</button>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="px-8 py-2 bg-accent text-contrast-text font-bold rounded-md hover:opacity-90 disabled:opacity-50 transition-all shadow-md"
              >
                {isSubmitting ? "Сохранение..." : "Сохранить"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}