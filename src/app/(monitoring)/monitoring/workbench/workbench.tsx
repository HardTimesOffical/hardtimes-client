"use client";

import React, { useState, useRef, useEffect, FormEvent } from "react";
import { GAME_TYPES } from "@/constants/gameTypes";
import { GAME_VERSIONS } from "@/constants/gameVersions";
import { CATEGORIES } from "@/constants/categories";
import { TAGS } from "@/constants/tags";
import { LANGUAGES } from "@/constants/languages";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  HiCollection, HiPlus, HiPhotograph, HiCheckCircle,
  HiGlobeAlt, HiChat, HiVideoCamera, HiMenuAlt2,
} from "react-icons/hi";

// ── Константы стиля ──────────────────────────────────────────
const BRAND = "#84a98c";
const BG_MAIN = "#0a0b0b";
const BG_ELEVATED = "#161817";
const BG_CARD = "#1e211f";

const labelStyle = "block font-mc-pixel text-[9px] uppercase tracking-widest mb-1.5"
const inputStyle = "w-full px-3 py-2.5 bg-black/30 border border-white/5 text-[#f2f2f2] focus:border-white/10 outline-none transition-all text-[11px] font-mc-pixel placeholder:text-[#7d8581] rounded-none";

// ── CustomSelect ─────────────────────────────────────────────
const CustomSelect: React.FC<{
  options: string[];
  selected: string | string[];
  multiple?: boolean;
  onChange: (v: any) => void;
  placeholder?: string;
}> = ({ options, selected, multiple = false, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (option: string) => {
    if (multiple) {
      const arr = Array.isArray(selected) ? [...selected] : [];
      onChange(arr.includes(option) ? arr.filter(v => v !== option) : [...arr, option]);
    } else {
      onChange(option);
      setIsOpen(false);
    }
  };

  const display = multiple
    ? (Array.isArray(selected) && selected.length > 0 ? selected.join(", ") : "")
    : (selected as string || "");

  return (
    <div className="relative w-full" ref={ref}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2.5 bg-black/30 border cursor-pointer transition-colors"
        style={{ borderColor: isOpen ? `${BRAND}60` : "rgba(255,255,255,0.05)" }}
      >
        <span className="truncate font-mc-pixel text-[11px] p-1"
              style={{ color: display ? "#f2f2f2" : "#7d8581" }}>
          {display || placeholder || "Выбрать..."}
        </span>
        <span className={`text-[8px] transition-transform opacity-40 ${isOpen ? "rotate-180" : ""}`}>▼</span>
      </div>
      {isOpen && (
        <div className="absolute z-50 w-full mt-0.5 border border-white/10 shadow-2xl max-h-52 overflow-y-auto"
             style={{ background: "#1a1c1b" }}>
          {options.map(opt => {
            const checked = multiple && Array.isArray(selected) && selected.includes(opt);
            return (
              <div
                key={opt}
                onClick={() => toggle(opt)}
                className="flex items-center gap-2.5 px-3 py-2.5 cursor-pointer border-b border-white/5 last:border-0 transition-colors"
                style={{ color: checked ? BRAND : "#7d8581" }}
                onMouseEnter={e => (e.currentTarget.style.background = `${BRAND}10`)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                {multiple && (
                  <div className="w-3 h-3 border flex items-center justify-center flex-shrink-0"
                       style={{ borderColor: checked ? BRAND : "#2d322f", background: checked ? `${BRAND}20` : "transparent" }}>
                    {checked && <HiCheckCircle className="w-2.5 h-2.5" style={{ color: BRAND }} />}
                  </div>
                )}
                <span className="font-mc-pixel text-[10px]">{opt}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ── Section wrapper ──────────────────────────────────────────
const Section: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="border border-white/5 relative" style={{ background: BG_ELEVATED }}>
    {/* Угловые акценты */}
    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l opacity-40" style={{ borderColor: BRAND }} />
    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r opacity-40" style={{ borderColor: BRAND }} />
    {/* Заголовок */}
    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
      <div className="w-1 h-3 flex-shrink-0" style={{ background: BRAND }} />
      {icon && <span style={{ color: BRAND }} className="opacity-70">{icon}</span>}
      <span className="font-mc-pixel text-[9px] uppercase tracking-widest" style={{ color: BRAND }}>
        {title}
      </span>
    </div>
    <div className="p-5 space-y-4">{children}</div>
  </div>
);

// ── Поле ввода с иконкой ─────────────────────────────────────
const IconInput: React.FC<{
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  color?: string;
}> = ({ icon, placeholder, value, onChange, color = "#7d8581" }) => (
  <div className="flex items-center gap-2 border border-white/5 bg-black/30 focus-within:border-white/10 transition-colors">
    <div className="pl-3 flex-shrink-0" style={{ color }}>{icon}</div>
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="flex-1 py-2.5 pr-3 bg-transparent outline-none font-mc-pixel text-[11px] text-[#f2f2f2] placeholder:text-[#7d8581]"
    />
  </div>
);

// ── Основной компонент ───────────────────────────────────────
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
  const [telegram, setTelegram] = useState("");
  const [vk, setVk] = useState("");
  const [youtube, setYoutube] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user && !accessToken) router.push("/login");
  }, [user, accessToken, router]);

  const availableVersions = gameType === "JAVA & BEDROCK"
    ? (GAME_VERSIONS["Minecraft Java"] || [])
    : (GAME_VERSIONS[gameType] || []);

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
      if (discord.trim())     formData.append("discord",     discord.trim());
      if (website.trim())     formData.append("website",     website.trim());
      if (telegram.trim())    formData.append("telegram",    telegram.trim());
      if (vk.trim())          formData.append("vk",          vk.trim());
      if (youtube.trim())     formData.append("youtube",     youtube.trim());
      if (description.trim()) formData.append("description", description.trim());
      if (imageFile)          formData.append("image", imageFile);

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/servers/add-server`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) {
        setIsSubmitting(false);
        throw new Error(result.message || "Ошибка при сохранении");
      }
      router.push(`/monitoring/${result.server?.slug || ""}`);
    } catch (error: any) {
      alert(error.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen px-4 pt-10 relative overflow-hidden">

      {/* Фоновое свечение */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[140px] opacity-10 pointer-events-none"
           style={{ background: BRAND }}/>

      <div className="max-w-4xl mx-auto relative z-10 space-y-6">

        {/* Заголовок */}
        <div className="border border-white/5 relative overflow-hidden" style={{ background: BG_ELEVATED }}>
          <div className="absolute top-0 left-0 w-1.5 h-full" style={{ background: BRAND }} />
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l opacity-50" style={{ borderColor: BRAND }} />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r opacity-50" style={{ borderColor: BRAND }} />
          <div className="flex items-center gap-4 pl-7 pr-5 py-5">
            <div className="p-2.5 border flex items-center justify-center"
                 style={{ borderColor: `${BRAND}30`, background: `${BRAND}10` }}>
              <HiPlus className="w-5 h-5" style={{ color: BRAND }} />
            </div>
            <div>
              <h1 className="font-mc-pixel text-lg uppercase tracking-tight text-[#f2f2f2]">
                Новый сервер
              </h1>
              <p className="font-mc-pixel text-[9px] uppercase mt-0.5" style={{ color: "#7d8581" }}>
                Добавление сервера в мониторинг
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">

          {/* ── ЛЕВАЯ КОЛОНКА ── */}
          <div className="space-y-5">

            {/* Основная информация */}
            <Section title="Основное" icon={<HiMenuAlt2 className="w-3.5 h-3.5" />}>
              <div>
                <label className={labelStyle} style={{ color: "#7d8581" }}>Название сервера</label>
                <input
                  className={inputStyle}
                  value={serverName}
                  onChange={e => setServerName(e.target.value)}
                  placeholder="Например: LowQualityServer"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelStyle} style={{ color: "#7d8581" }}>Тип игры</label>
                  <CustomSelect
                    options={[...GAME_TYPES, "JAVA & BEDROCK"]}
                    selected={gameType}
                    onChange={(v: any) => { setGameType(v); setGameVersion(""); }}
                  />
                </div>
                <div>
                  <label className={labelStyle} style={{ color: "#7d8581" }}>Версия</label>
                  <CustomSelect
                    options={availableVersions}
                    selected={gameVersion}
                    onChange={(v: any) => setGameVersion(v)}
                    placeholder="Выбрать..."
                  />
                </div>
              </div>

              {/* IP блок */}
              <div className="space-y-3 p-4 border border-white/5 bg-black/20">
                <span className="font-mc-pixel text-[9px] uppercase tracking-widest" style={{ color: "#7d8581" }}>
                  Адреса подключения
                </span>
                {(gameType.includes("Java") || gameType === "JAVA & BEDROCK") && (
                  <div>
                    <label className={labelStyle} style={{ color: "#7d8581" }}>Java IP</label>
                    <input className={inputStyle} value={ips.java}
                           onChange={e => setIps({ ...ips, java: e.target.value })}
                           placeholder="play.server.ru" />
                  </div>
                )}
                {(gameType.includes("Bedrock") || gameType === "JAVA & BEDROCK") && (
                  <div>
                    <label className={labelStyle} style={{ color: "#7d8581" }}>Bedrock IP</label>
                    <input className={inputStyle} value={ips.bedrock}
                           onChange={e => setIps({ ...ips, bedrock: e.target.value })}
                           placeholder="pe.server.ru:19132" />
                  </div>
                )}
                {gameType === "Hytale" && (
                  <div>
                    <label className={labelStyle} style={{ color: "#7d8581" }}>Hytale Address</label>
                    <input className={inputStyle} value={ips.hytale}
                           onChange={e => setIps({ ...ips, hytale: e.target.value })}
                           placeholder="hytale.server.com" />
                  </div>
                )}
              </div>

              {/* Описание */}
              <div>
                <label className={labelStyle} style={{ color: "#7d8581" }}>
                  Описание сервера
                  <span className="ml-2 opacity-40 normal-case tracking-normal">необязательно</span>
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Расскажите о своём сервере, особенностях, правилах..."
                  rows={4}
                  maxLength={2000}
                  className="w-full px-3 py-2.5 bg-black/30 border border-white/5 text-[#f2f2f2] focus:border-white/10 outline-none transition-all text-[11px] font-mc-pixel placeholder:text-[#7d8581] rounded-none resize-none"
                />
                <div className="flex justify-end mt-1">
                  <span className="font-mc-pixel text-[8px]" style={{ color: "#7d8581" }}>
                    {description.length}/2000
                  </span>
                </div>
              </div>
            </Section>

            {/* Категории и теги */}
            <Section title="Категории и теги" icon={<HiCollection className="w-3.5 h-3.5" />}>
              <div>
                <label className={labelStyle} style={{ color: "#7d8581" }}>Категории</label>
                <CustomSelect options={CATEGORIES} selected={categories} multiple
                              onChange={(v: any) => setCategories(v)} placeholder="Выберите жанры" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelStyle} style={{ color: "#7d8581" }}>Теги</label>
                  <CustomSelect options={TAGS} selected={tags} multiple
                                onChange={(v: any) => setTags(v)} placeholder="Теги" />
                </div>
                <div>
                  <label className={labelStyle} style={{ color: "#7d8581" }}>Языки</label>
                  <CustomSelect options={LANGUAGES} selected={languages} multiple
                                onChange={(v: any) => setLanguages(v)} placeholder="Языки" />
                </div>
              </div>
            </Section>
          </div>

          {/* ── ПРАВАЯ КОЛОНКА ── */}
          <div className="space-y-5">

            {/* Баннер */}
            <Section title="Баннер сервера" icon={<HiPhotograph className="w-3.5 h-3.5" />}>
              <div
                className="aspect-video bg-black/40 border border-white/5 flex flex-col items-center justify-center overflow-hidden cursor-pointer group transition-colors relative"
                style={{ borderColor: imagePreview ? `${BRAND}30` : "rgba(255,255,255,0.05)" }}
                onClick={() => document.getElementById("img-input-create")?.click()}
              >
                {imagePreview ? (
                  <img src={imagePreview} className="w-full h-full object-cover" alt="preview" />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <HiPhotograph className="w-7 h-7 opacity-20 group-hover:opacity-40 transition-opacity"
                                  style={{ color: BRAND }} />
                    <span className="font-mc-pixel text-[8px] uppercase tracking-widest opacity-30"
                          style={{ color: BRAND }}>
                      Выбрать файл
                    </span>
                  </div>
                )}
                <input id="img-input-create" type="file" accept="image/*" className="hidden"
                       onChange={e => {
                         const file = e.target.files?.[0];
                         if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
                       }} />
              </div>
              <p className="font-mc-pixel text-[8px] uppercase tracking-widest opacity-30 text-center"
                 style={{ color: "#7d8581" }}>
                Рекомендуется 468×60
              </p>
            </Section>

            {/* Ссылки */}
            <Section title="Ссылки и соцсети" icon={<HiGlobeAlt className="w-3.5 h-3.5" />}>

              {/* Discord */}
              <div>
                <label className={labelStyle} style={{ color: "#7d8581" }}>
                  Discord
                  <span className="ml-2 opacity-40 normal-case tracking-normal">необязательно</span>
                </label>
                <IconInput
                  icon={<HiChat className="w-3.5 h-3.5" />}
                  placeholder="discord.gg/server"
                  value={discord}
                  onChange={setDiscord}
                  color="#5865f2"
                />
              </div>

              {/* Telegram */}
              <div>
                <label className={labelStyle} style={{ color: "#7d8581" }}>
                  Telegram
                  <span className="ml-2 opacity-40 normal-case tracking-normal">необязательно</span>
                </label>
                <IconInput
                  icon={
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.247l-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.48 13.9l-2.95-.924c-.64-.203-.654-.64.136-.954l11.527-4.446c.535-.194 1.002.131.37.671z" />
                    </svg>
                  }
                  placeholder="t.me/server"
                  value={telegram}
                  onChange={setTelegram}
                  color="#29a8eb"
                />
              </div>

              {/* VK */}
              <div>
                <label className={labelStyle} style={{ color: "#7d8581" }}>
                  ВКонтакте
                  <span className="ml-2 opacity-40 normal-case tracking-normal">необязательно</span>
                </label>
                <IconInput
                  icon={
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.372 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.253-1.406 2.151-3.574 2.151-3.574.119-.254.339-.491.78-.491h1.744c.525 0 .643.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.474-.085.712-.576.712z" />
                    </svg>
                  }
                  placeholder="vk.com/server"
                  value={vk}
                  onChange={setVk}
                  color="#4a76a8"
                />
              </div>

              {/* Сайт */}
              <div>
                <label className={labelStyle} style={{ color: "#7d8581" }}>
                  Сайт
                  <span className="ml-2 opacity-40 normal-case tracking-normal">необязательно</span>
                </label>
                <IconInput
                  icon={<HiGlobeAlt className="w-3.5 h-3.5" />}
                  placeholder="https://server.ru"
                  value={website}
                  onChange={setWebsite}
                  color={BRAND}
                />
              </div>

              {/* YouTube */}
              <div>
                <label className={labelStyle} style={{ color: "#7d8581" }}>
                  Трейлер YouTube
                  <span className="ml-2 opacity-40 normal-case tracking-normal">необязательно</span>
                </label>
                <IconInput
                  icon={<HiVideoCamera className="w-3.5 h-3.5" />}
                  placeholder="youtube.com/watch?v=..."
                  value={youtube}
                  onChange={setYoutube}
                  color="#ff4444"
                />
              </div>
            </Section>

            {/* Кнопка */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-3 py-2.5 bg-black/30 border border-white/5 text-[#f2f2f2] focus:border-white/10 outline-none transition-all text-[11px] font-mc-pixel placeholder:text-[#7d8581] rounded-none resize-none"
              style={{
                background: isSubmitting ? "transparent" : "#f2f2f2",
                color: isSubmitting ? "#7d8581" : "#0a0b0b",
                borderColor: isSubmitting ? "#2d322f" : "#f2f2f2",
              }}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-[#7d8581] border-t-transparent rounded-full animate-spin" />
                  <span>Публикация...</span>
                </div>
              ) : (
                "Опубликовать сервер"
              )}
            </button>

            <p className="font-mc-pixel text-[8px] uppercase text-center tracking-widest opacity-30"
               style={{ color: "#7d8581" }}>
              Нажимая кнопку, вы соглашаетесь с правилами размещения
            </p>
          </div>
        </form>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}