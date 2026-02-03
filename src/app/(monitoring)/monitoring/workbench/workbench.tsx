"use client";

import React, { useState, useRef, useEffect, ChangeEvent, FormEvent } from "react";
import styles from "./workbench.module.css";
import { GAME_TYPES } from "@/constants/gameTypes";
import { GAME_VERSIONS } from "@/constants/gameVersions";
import { CATEGORIES } from "@/constants/categories";
import { TAGS } from "@/constants/tags";
import { LANGUAGES } from "@/constants/languages";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import InfoBlock from "../../../components/blocks/InfoBlock";

interface CustomSelectProps {
  options: string[];
  selected: string | string[];
  multiple?: boolean;
  onChange: (value: string | string[]) => void;
  placeholder?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, selected, multiple = false, onChange, placeholder }) => {
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

  const displayValue = multiple
    ? (Array.isArray(selected) ? selected.join(", ") : "")
    : (selected as string || "");

  return (
    <div className={styles.customSelectWrapper} ref={selectRef}>
      <div className={styles.customSelectInput} onClick={() => setIsOpen(!isOpen)}>
        <span className="truncate">{displayValue || placeholder || "Выбрать..."}</span>
        <span className="text-[10px] opacity-50">{isOpen ? "▲" : "▼"}</span>
      </div>
      <div className={`${styles.customSelectDropdown} ${isOpen ? styles.open : ""}`}>
        {options.map(option => (
          <div key={option} className={styles.customSelectOption} onClick={() => toggleOption(option)}>
            {multiple && (
              <input 
                type="checkbox" 
                checked={Array.isArray(selected) && selected.includes(option)} 
                readOnly
                className="mr-2 accent-[var(--accent)]" 
              />
            )}
            {option}
          </div>
        ))}
      </div>
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

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // --- ВАЛИДАЦИЯ ---
    let finalIp = "";
    if (gameType === "JAVA & BEDROCK") {
      // Для комбинированного типа проверяем оба поля
      if (!ips.java.trim() || !ips.bedrock.trim()) {
        alert("Заполните оба IP адреса (Java и Bedrock)");
        return;
      }
      finalIp = JSON.stringify({ java: ips.java.trim(), bedrock: ips.bedrock.trim() });
    } else if (gameType === "Hytale") {
      if (!ips.hytale.trim()) { alert("Введите адрес Hytale"); return; }
      finalIp = ips.hytale.trim();
    } else if (gameType === "Minecraft Bedrock") {
      if (!ips.bedrock.trim()) { alert("Введите Bedrock IP"); return; }
      finalIp = ips.bedrock.trim();
    } else {
      if (!ips.java.trim()) { alert("Введите Java IP"); return; }
      finalIp = ips.java.trim();
    }

    // Проверка дополнительных обязательных полей
    if (!serverName.trim()) { alert("Введите название сервера"); return; }
    if (!gameVersion) { alert("Выберите версию игры"); return; }

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

      // --- РЕДИРЕКТ ---
      // Бэкенд должен возвращать объект сервера, где есть slug или id
      // Например: { success: true, server: { slug: "my-cool-server" } }
      if (result.server?.slug) {
        router.push(`/monitoring/${result.server.slug}`);
      } else {
        // Если слаг не пришел, отправляем в общий список
        router.push("/workbench/servers");
      }
      
    } catch (error: any) {
      alert(error.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      <InfoBlock title="Мастерская" text="Заполните базовые данные сервера." />

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-6">
        {/* ЛЕВАЯ ЧАСТЬ */}
        <div className="flex-1 flex flex-col gap-6">
          <div className={styles.container}>
            <div className={styles.sectionTitle}>Название сервера</div>
            <input className={styles.input} value={serverName} onChange={e => setServerName(e.target.value)} required />

            <div className={styles.sectionTitle}>Тип игры</div>
            <CustomSelect options={[...GAME_TYPES, "JAVA & BEDROCK"]} selected={gameType} onChange={v => setGameType(v as string)} />

            <div className={styles.ipGroup}>
              {(gameType.includes("Java") || gameType === "JAVA & BEDROCK") && (
                <div className="mb-4">
                  <div className="text-[10px] font-bold opacity-50 mb-1 text-[var(--foreground)] uppercase">Java IP</div>
                  <input className={styles.input} value={ips.java} onChange={e => setIps({...ips, java: e.target.value})} placeholder="mc.server.com" />
                </div>
              )}
              {(gameType.includes("Bedrock") || gameType === "JAVA & BEDROCK") && (
                <div>
                  <div className="text-[10px] font-bold opacity-50 mb-1 text-[var(--foreground)] uppercase">Bedrock IP</div>
                  <input className={styles.input} value={ips.bedrock} onChange={e => setIps({...ips, bedrock: e.target.value})} placeholder="pe.server.com:19132" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <div className={styles.sectionTitle}>Версия</div>
                <CustomSelect options={availableVersions} selected={gameVersion} onChange={v => setGameVersion(v as string)} />
              </div>
              <div>
                <div className={styles.sectionTitle}>Категории</div>
                <CustomSelect options={CATEGORIES} selected={categories} multiple onChange={v => setCategories(v as string[])} />
              </div>
            </div>
          </div>
        </div>

        {/* ПРАВАЯ ЧАСТЬ */}
        <div className="w-full lg:w-[360px] flex flex-col gap-6">
          <div className={styles.container}>
            <div className={styles.sectionTitle}>Дополнительно</div>
            <div className="flex flex-col gap-3">
              <CustomSelect options={TAGS} selected={tags} multiple onChange={v => setTags(v as string[])} placeholder="Теги" />
              <CustomSelect options={LANGUAGES} selected={languages} multiple onChange={v => setLanguages(v as string[])} placeholder="Языки" />
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <input className={styles.input} placeholder="Discord" value={discord} onChange={e => setDiscord(e.target.value)} />
              <input className={styles.input} placeholder="Сайт" value={website} onChange={e => setWebsite(e.target.value)} />
            </div>
          </div>

          <div className={`${styles.container} flex flex-col items-center justify-center border-2 border-dashed border-[var(--auth-stroke)] min-h-[120px] cursor-pointer`}>
            <label className="w-full h-full flex flex-col items-center justify-center p-4 cursor-pointer">
              {imagePreview ? <img src={imagePreview} className="h-10 object-contain" /> : <span className="text-[10px] font-bold opacity-40 uppercase">Баннер 468x60</span>}
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          </div>

         <button 
          type="submit" 
          disabled={isSubmitting} 
          className={styles.submitBtn}
        >
          {isSubmitting ? "Отправка..." : "Опубликовать"}
        </button>
        </div>
      </form>
    </div>
  );
}