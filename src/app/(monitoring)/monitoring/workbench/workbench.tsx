"use client";

import React, { useState, useRef, useEffect, ChangeEvent, FormEvent } from "react";
import { GAME_TYPES } from "@/constants/gameTypes";
import { GAME_VERSIONS } from "@/constants/gameVersions";
import { CATEGORIES } from "@/constants/categories";
import { TAGS } from "@/constants/tags";
import { LANGUAGES } from "@/constants/languages";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import InfoBlock from "../../../components/blocks/InfoBlock";

// Вспомогательный компонент CustomSelect (тот же дизайн)
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
    <div className="relative w-full text-sm font-sans" ref={selectRef}>
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
              {multiple && <input type="checkbox" readOnly checked={Array.isArray(selected) && selected.includes(option)} className="accent-accent" />}
              <span>{option}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Workbench() {
  const { user, accessToken } = useAuth();
  const router = useRouter();

  const [serverName, setServerName] = useState("");
  const [ips, setIps] = useState({ java: "", bedrock: "", hytale: "" });
  const [gameType, setGameType] = useState(GAME_TYPES[0]);
  const [gameVersion, setGameVersion] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [discord, setDiscord] = useState("");
  const [website, setWebsite] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user && !accessToken) router.push("/login");
  }, [user, accessToken, router]);

  const availableVersions = gameType === "JAVA & BEDROCK" 
    ? (GAME_VERSIONS["Minecraft Java"] || []) 
    : (GAME_VERSIONS[gameType] || []);

  const labelStyle = "text-[10px] font-bold text-muted uppercase tracking-widest mb-1.5 block";
  const inputStyle = "w-full px-3 py-2 bg-card border border-border rounded-md text-foreground focus:border-accent outline-none transition-all text-sm shadow-sm placeholder:text-muted/50";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    let finalIp = "";
    if (gameType === "JAVA & BEDROCK") {
      if (!ips.java.trim() || !ips.bedrock.trim()) return alert("Заполните оба IP адреса");
      finalIp = JSON.stringify({ java: ips.java.trim(), bedrock: ips.bedrock.trim() });
    } else if (gameType === "Hytale") {
      finalIp = ips.hytale.trim();
    } else {
      finalIp = gameType === "Minecraft Bedrock" ? ips.bedrock.trim() : ips.java.trim();
    }

    if (!finalIp) return alert("Введите IP адрес");
    if (!serverName.trim()) return alert("Введите название сервера");

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("ipAddress", finalIp);
      formData.append("serverName", serverName.trim());
      formData.append("gameType", gameType);
      formData.append("gameVersion", gameVersion);
      formData.append("categories", JSON.stringify(categories));
      formData.append("tags", JSON.stringify(tags));
      formData.append("languages", JSON.stringify(languages));
      formData.append("discord", discord.trim());
      formData.append("website", website.trim());
      if (imageFile) formData.append("image", imageFile);

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/servers/add-server`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Ошибка при сохранении");
      
      router.push(`/monitoring/${result.server?.slug || ""}`);
    } catch (error: any) {
      alert(error.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 font-sans">
      <InfoBlock title="Мастерская" text="Дополнительная ифнормация доступна в редакторе проекта!" />

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6">
        {/* ЛЕВАЯ КОЛОНКА */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-card border border-border rounded-md p-5 shadow-sm space-y-4">
            <div>
              <label className={labelStyle}>Название сервера</label>
              <input className={inputStyle} value={serverName} onChange={e => setServerName(e.target.value)} placeholder="Например: Survival World" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelStyle}>Тип игры</label>
                <CustomSelect options={[...GAME_TYPES, "JAVA & BEDROCK"]} selected={gameType} onChange={(v:any) => { setGameType(v); setGameVersion(""); }} />
              </div>
              <div>
                <label className={labelStyle}>Версия</label>
                <CustomSelect options={availableVersions} selected={gameVersion} onChange={(v:any) => setGameVersion(v)} placeholder="Выбрать версию" />
              </div>
            </div>

            <div className="space-y-3 bg-surface p-3 rounded-md border border-border/50">
              {(gameType.includes("Java") || gameType === "JAVA & BEDROCK") && (
                <div>
                  <label className={labelStyle}>Java IP</label>
                  <input className={inputStyle} value={ips.java} onChange={e => setIps({...ips, java: e.target.value})} placeholder="mc.server.com" />
                </div>
              )}
              {(gameType.includes("Bedrock") || gameType === "JAVA & BEDROCK") && (
                <div>
                  <label className={labelStyle}>Bedrock IP</label>
                  <input className={inputStyle} value={ips.bedrock} onChange={e => setIps({...ips, bedrock: e.target.value})} placeholder="pe.server.com:19132" />
                </div>
              )}
              {gameType === "Hytale" && (
                <div>
                  <label className={labelStyle}>Hytale Address</label>
                  <input className={inputStyle} value={ips.hytale} onChange={e => setIps({...ips, hytale: e.target.value})} placeholder="hytale.server.com" />
                </div>
              )}
            </div>

            <div>
              <label className={labelStyle}>Категории</label>
              <CustomSelect options={CATEGORIES} selected={categories} multiple onChange={(v:any) => setCategories(v)} placeholder="Выберите жанры" />
            </div>
          </div>
        </div>

        {/* ПРАВАЯ КОЛОНКА */}
        <div className="w-full md:w-[360px] flex flex-col gap-4">
          <div className="bg-card border border-border rounded-md p-5 shadow-sm space-y-4">
            <div>
              <label className={labelStyle}>Дополнительно</label>
              <div className="flex flex-col gap-3">
                <CustomSelect options={TAGS} selected={tags} multiple onChange={(v:any) => setTags(v)} placeholder="Теги" />
                <CustomSelect options={LANGUAGES} selected={languages} multiple onChange={(v:any) => setLanguages(v)} placeholder="Языки" />
              </div>
            </div>
            
            <div className="space-y-3 pt-2">
              <input className={inputStyle} placeholder="Discord (ссылка)" value={discord} onChange={e => setDiscord(e.target.value)} />
              <input className={inputStyle} placeholder="Сайт (https://...)" value={website} onChange={e => setWebsite(e.target.value)} />
            </div>
          </div>

          <div className="bg-card border border-border rounded-md p-4 shadow-sm">
            <label className={labelStyle}>Баннер сервера</label>
            <div 
              className="aspect-video bg-surface rounded-md border border-dashed border-border flex items-center justify-center overflow-hidden cursor-pointer group relative transition-all hover:border-accent"
              onClick={() => document.getElementById('img-input-create')?.click()}
            >
              {imagePreview ? (
                <img src={imagePreview} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4">
                  <div className="text-xl mb-1 text-muted">+</div>
                  <div className="text-[10px] font-bold text-muted uppercase">Загрузить 468x60</div>
                </div>
              )}
              <input id="img-input-create" type="file" accept="image/*" className="hidden" onChange={e => {
                const file = e.target.files?.[0];
                if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
              }} />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full py-3 bg-accent text-contrast-text font-bold rounded-md hover:opacity-90 disabled:opacity-50 transition-all shadow-md mt-2"
          >
            {isSubmitting ? "Публикация..." : "Опубликовать сервер"}
          </button>
        </div>
      </form>
    </div>
  );
}