"use client";

import React, { useState, useRef, useEffect, FormEvent } from "react";
import { GAME_TYPES } from "@/constants/gameTypes";
import { GAME_VERSIONS } from "@/constants/gameVersions";
import { CATEGORIES } from "@/constants/categories";
import { TAGS } from "@/constants/tags";
import { LANGUAGES } from "@/constants/languages";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { HiServer, HiGlobeAlt, HiCollection, HiPlus, HiPhotograph, HiCheckCircle } from "react-icons/hi";
import { Turnstile } from '@marsidev/react-turnstile';

// --- Стилизация под Синегарск ---
const labelStyle = "text-[10px] font-bold text-zinc-500 uppercase tracking-[0.15em] mb-2 block";
const inputStyle = "w-full px-4 py-3 bg-[#1a1a1a] border border-white/5 text-white focus:border-[#5a6e60]/50 outline-none transition-all text-sm placeholder:text-zinc-700 rounded-none";

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
    <div className="relative w-full" ref={selectRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full px-4 py-3 bg-[#1a1a1a] border transition-colors cursor-pointer rounded-none ${isOpen ? 'border-[#5a6e60]' : 'border-white/5'}`}
      >
        <span className="truncate text-sm text-zinc-300">{displayValue || placeholder || "Выбрать..."}</span>
        <span className={`text-[10px] transition-transform ${isOpen ? "rotate-180" : ""}`}>▼</span>
      </div>
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-[#242424] border border-white/10 shadow-2xl max-h-60 overflow-y-auto scrollbar-hide">
          {options.map((option: string) => (
            <div
              key={option}
              onClick={() => toggleOption(option)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-[#5a6e60]/10 cursor-pointer text-sm text-zinc-400 hover:text-white border-b border-white/5 last:border-0 transition-colors"
            >
              {multiple && (
                <div className={`w-3.5 h-3.5 border flex items-center justify-center ${Array.isArray(selected) && selected.includes(option) ? 'bg-[#5a6e60] border-[#5a6e60]' : 'border-zinc-700'}`}>
                   {Array.isArray(selected) && selected.includes(option) && <HiCheckCircle className="text-white w-3 h-3" />}
                </div>
              )}
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

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  console.log("DEBUG: Turnstile Key is:", process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

  useEffect(() => {
    if (!user && !accessToken) router.push("/login");
  }, [user, accessToken, router]);

  const availableVersions = gameType === "JAVA & BEDROCK" 
    ? (GAME_VERSIONS["Minecraft Java"] || []) 
    : (GAME_VERSIONS[gameType] || []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    if (!captchaToken) {
      return alert("Пожалуйста, подтвердите, что вы не робот.");
    }

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
      formData.append("cf-turnstile-response", captchaToken);
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
      if (!res.ok) {
        setIsSubmitting(false);
        throw new Error(result.message || "Ошибка при сохранении")
      };
      
      router.push(`/monitoring/${result.server?.slug || ""}`);
    } catch (error: any) {
      alert(error.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 py-10 px-4 animate-in fade-in duration-500">
      
      {/* Заголовок страницы в стиле плашки */}
      <div className="bg-[#242424] p-6 border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#5a6e60]"></div>
        <div className="flex items-center gap-5">
           <div className="bg-[#5a6e60]/10 p-3 border border-[#5a6e60]/30 flex items-center justify-center">
              <HiPlus className="w-6 h-6 text-[#5a6e60]" />
           </div>
           <div>
              <h1 className="text-2xl font-bold text-white uppercase tracking-tighter">Новый Сервер</h1>
              <p className="text-zinc-500 text-[11px] font-mc-pixel uppercase mt-1">Добавление нового сервера в мониторинг</p>
           </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
        {/* ЛЕВАЯ КОЛОНКА */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-[#242424] border border-white/5 p-7 space-y-6 shadow-2xl">
            <div>
              <label className={labelStyle}>Название сервера</label>
              <input className={inputStyle} value={serverName} onChange={e => setServerName(e.target.value)} placeholder="Например: Синегарск RolePlay" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelStyle}>Тип игры</label>
                <CustomSelect options={[...GAME_TYPES, "JAVA & BEDROCK"]} selected={gameType} onChange={(v:any) => { setGameType(v); setGameVersion(""); }} />
              </div>
              <div>
                <label className={labelStyle}>Версия</label>
                <CustomSelect options={availableVersions} selected={gameVersion} onChange={(v:any) => setGameVersion(v)} placeholder="Выбрать версию" />
              </div>
            </div>

            <div className="space-y-4 bg-black/20 p-5 border border-white/5">
              {(gameType.includes("Java") || gameType === "JAVA & BEDROCK") && (
                <div>
                  <label className={labelStyle}>Java IP адрес</label>
                  <input className={inputStyle} value={ips.java} onChange={e => setIps({...ips, java: e.target.value})} placeholder="play.server.ru" />
                </div>
              )}
              {(gameType.includes("Bedrock") || gameType === "JAVA & BEDROCK") && (
                <div>
                  <label className={labelStyle}>Bedrock IP адрес</label>
                  <input className={inputStyle} value={ips.bedrock} onChange={e => setIps({...ips, bedrock: e.target.value})} placeholder="pe.server.ru:19132" />
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
              <label className={labelStyle}>Категории сервера</label>
              <div className="flex items-start gap-3">
                <div className="bg-[#5a6e60]/20 p-3 border border-[#5a6e60]/20 hidden sm:block">
                  <HiCollection className="w-5 h-5 text-[#5a6e60]" />
                </div>
                <CustomSelect options={CATEGORIES} selected={categories} multiple onChange={(v:any) => setCategories(v)} placeholder="Выберите жанры" />
              </div>
            </div>
          </div>
        </div>

        {/* ПРАВАЯ КОЛОНКА */}
        <div className="w-full lg:w-[380px] flex flex-col gap-6">
          <div className="bg-[#242424] border border-white/5 p-7 space-y-6">
            <div>
              <label className={labelStyle}>Социальные сети и теги</label>
              <div className="flex flex-col gap-4">
                <CustomSelect options={TAGS} selected={tags} multiple onChange={(v:any) => setTags(v)} placeholder="Выберите теги" />
                <CustomSelect options={LANGUAGES} selected={languages} multiple onChange={(v:any) => setLanguages(v)} placeholder="Языки проекта" />
              </div>
            </div>
            
            <div className="space-y-3 pt-2">
              <div className="relative">
                <input className={inputStyle} placeholder="Discord (ссылка)" value={discord} onChange={e => setDiscord(e.target.value)} />
              </div>
              <div className="relative">
                <input className={inputStyle} placeholder="Сайт (https://...)" value={website} onChange={e => setWebsite(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="bg-[#242424] border border-white/5 p-6">
            <label className={labelStyle}>Баннер сервера (468x60)</label>
            <div 
              className="aspect-video bg-[#1a1a1a] border border-white/5 flex flex-col items-center justify-center overflow-hidden cursor-pointer group relative transition-colors hover:border-[#5a6e60]/50 shadow-inner"
              onClick={() => document.getElementById('img-input-create')?.click()}
            >
              {imagePreview ? (
                <img src={imagePreview} className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <HiPhotograph className="w-8 h-8 text-zinc-700 group-hover:text-[#5a6e60] transition-colors" />
                  <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Выбрать файл</div>
                </div>
              )}
              <input id="img-input-create" type="file" accept="image/*" className="hidden" onChange={e => {
                const file = e.target.files?.[0];
                if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
              }} />
            </div>
          </div>

          <div className="bg-[#242424] w-fit border border-white/5 flex justify-center overflow-hidden">
            {SITE_KEY ? (
              <Turnstile 
                siteKey={SITE_KEY}
                onSuccess={(token) => setCaptchaToken(token)}
                onExpire={() => setCaptchaToken(null)}
                options={{ theme: 'dark', size: 'normal' }}
              />
            ) : (
              <div className="text-[9px] text-zinc-600 uppercase border border-white/5 p-2">
                Загрузка CAPTHA...
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full py-5 bg-white text-[#1a1a1a] font-bold uppercase text-sm tracking-widest hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-600 transition-all active:scale-[0.98] shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-4 h-4 border-2 border-zinc-400 border-t-[#1a1a1a] rounded-full animate-spin" />
                <span>Публикация...</span>
              </div>
            ) : "Опубликовать проект"}
          </button>
          
          <p className="text-[9px] text-zinc-600 uppercase text-center tracking-tighter">
            Нажимая кнопку, вы соглашаетесь с правилами размещения проектов
          </p>
        </div>
      </form>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}