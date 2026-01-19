"use client";

import React, { useState, useRef, useEffect, ChangeEvent, FormEvent } from "react";
import styles from "../../workbench/workbench.module.css";
import { GAME_TYPES } from "@/constants/gameTypes";
import { GAME_VERSIONS } from "@/constants/gameVersions";
import { CATEGORIES } from "@/constants/categories";
import { TAGS } from "@/constants/tags";
import { LANGUAGES } from "@/constants/languages";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/app/components/dashboard/dashboard";

// Вспомогательный компонент CustomSelect
const CustomSelect: React.FC<any> = ({ options, selected, multiple = false, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const toggleOption = (option: string) => {
    if (multiple) {
      const arr = Array.isArray(selected) ? [...selected] : [];
      if (arr.includes(option)) {
        onChange(arr.filter(v => v !== option));
      } else {
        onChange([...arr, option]);
      }
    } else {
      onChange(option);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayValue = multiple
    ? (Array.isArray(selected) ? selected.join(", ") : "")
    : (selected as string || "");

  return (
    <div className={styles.customSelectWrapper} ref={selectRef}>
      <div className={styles.customSelectInput} onClick={() => setIsOpen(!isOpen)}>
        {displayValue || placeholder || "Выбрать..."}
        <span className={styles.arrow}>{isOpen ? "▲" : "▼"}</span>
      </div>
      <div className={`${styles.customSelectDropdown} ${isOpen ? styles.open : ""}`}>
        {options.map((option: string) => (
          <div key={option} className={styles.customSelectOption} onClick={() => toggleOption(option)}>
            {multiple && Array.isArray(selected) && (
              <input type="checkbox" readOnly checked={selected.includes(option)} />
            )}
            <span>{option}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function EditServer() {
  const [serverName, setServerName] = useState("");
  // Состояние для IP теперь как в Workbench
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
  
  // Состояние блокировки
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, accessToken } = useAuth();
  const router = useRouter();
  const params = useParams();
  const slug = params.slug;

  const availableVersions = (() => {
    if (gameType === "JAVA & BEDROCK") return GAME_VERSIONS["Minecraft Java"] || [];
    return gameType ? GAME_VERSIONS[gameType] || [] : [];
  })();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchServerData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/servers/by-slug/${slug}`);
        const data = await res.json();

        setServerName(data.serverName);
        
        // Логика восстановления IP из базы (JSON или строка)
        try {
            const parsedIps = JSON.parse(data.ipAddress);
            setIps(parsedIps);
        } catch (e) {
            // Если в базе была обычная строка, определяем куда её положить
            if (data.gameType === "Minecraft Bedrock") {
                setIps({ java: "", bedrock: data.ipAddress });
            } else {
                setIps({ java: data.ipAddress, bedrock: "" });
            }
        }

        setGameType(data.gameType);
        setGameVersion(data.gameVersion);
        setCategories(Array.isArray(data.categories) ? data.categories : JSON.parse(data.categories || "[]"));
        setTags(Array.isArray(data.tags) ? data.tags : JSON.parse(data.tags || "[]"));
        setLanguages(Array.isArray(data.languages) ? data.languages : JSON.parse(data.languages || "[]"));
        setDiscord(data.discord || "");
        setWebsite(data.website || "");
        setDescription(data.description || "");
        if (data.imageUrl) setImagePreview(data.imageUrl);
      } catch (error) {
        console.error("Error fetching server:", error);
      }
    };

    if (slug) fetchServerData();
  }, [slug, user]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      
      // Формируем IP обратно в JSON для комбо или в строку
      const finalIp = gameType === "JAVA & BEDROCK" 
        ? JSON.stringify(ips) 
        : (gameType === "Minecraft Bedrock" ? ips.bedrock : ips.java);

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

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/servers/edit/${slug}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to update server");
      const updatedData = await res.json();
      alert("Server successfully updated!");
      router.push(`/${updatedData.slug}`);
    } catch (error) {
      console.error(error);
      alert("Error updating server");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div className="flex justify-center p-4">
        <form className={`flex flex-col gap-4 w-full max-w-5xl ${styles.workbenchForm}`} onSubmit={handleSubmit}>
          <h2 className="text-white text-xl font-bold px-2">Редактировать сервер</h2>
          
          <div className="flex flex-col md:flex-row gap-4">
            
            {/* Левая колонка */}
            <div className={`${styles.container} flex flex-col gap-2 flex-1`}>
              <div className={styles.sectionTitle}>НАЗВАНИЕ СЕРВЕРА</div>
              <input className={styles.input} type="text" value={serverName} onChange={e => setServerName(e.target.value)} />

              <div className={styles.sectionTitle}>ТИП ИГРЫ</div>
              <CustomSelect 
                options={[...GAME_TYPES, "JAVA & BEDROCK"]} 
                selected={gameType} 
                onChange={(v:any) => { setGameType(v); setGameVersion(""); }} 
              />

              {/* БЛОК IP (КАК В WORKBENCH) */}
              <div className="flex flex-col gap-2 mt-2">
                {(gameType === "Minecraft Java" || gameType === "JAVA & BEDROCK") && (
                  <div className="flex flex-col gap-1">
                    <div className={styles.sectionTitle} style={{fontSize: '10px', opacity: 0.8}} translate="no">JAVA IP</div>
                    <input className={styles.input} type="text" placeholder="mc.example.com" value={ips.java} onChange={e => setIps({...ips, java: e.target.value})} />
                  </div>
                )}
                {gameType === "JAVA & BEDROCK" && <div className="border-t border-white/5 my-2" />}
                {(gameType === "Minecraft Bedrock" || gameType === "JAVA & BEDROCK") && (
                  <div className="flex flex-col gap-1">
                    <div className={styles.sectionTitle} style={{fontSize: '10px', opacity: 0.8}}>BEDROCK IP / PORT</div>
                    <input className={styles.input} type="text" placeholder="pe.example.com:19132" value={ips.bedrock} onChange={e => setIps({...ips, bedrock: e.target.value})} />
                  </div>
                )}
                {/* Добавляем || gameType === "Hytale" */}
                {(gameType === "Minecraft Java" || gameType === "JAVA & BEDROCK" || gameType === "Hytale") && (
                  <div className="flex flex-col gap-1">
                    <div className={styles.sectionTitle} style={{fontSize: '10px', opacity: 0.8}}>
                      {gameType === "Hytale" ? "SERVER IP" : "JAVA IP"}
                    </div>
                    <input 
                      className={styles.input} 
                      type="text" 
                      placeholder="play.example.com" 
                      value={ips.java} 
                      onChange={e => setIps({...ips, java: e.target.value})} 
                    />
                  </div>
                )}
              </div>

              <div className={styles.sectionTitle}>ВЕРСИЯ ИГРЫ</div>
              <CustomSelect options={availableVersions} selected={gameVersion} onChange={(v:any) => setGameVersion(v)} />

              <div className={styles.sectionTitle}>ОПИСАНИЕ</div>
              <textarea 
                className={`${styles.input} h-40 resize-none p-2`} 
                placeholder="Полное описание сервера..." 
                value={description} 
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            {/* Правая колонка */}
            <div className="flex flex-col gap-4 w-full md:w-1/2">
              <div className={`${styles.container} flex flex-col gap-2`}>
                <div className={styles.sectionTitle}>КАТЕГОРИИ</div>
                <CustomSelect options={CATEGORIES} selected={categories} multiple onChange={(v:any) => setCategories(v)} />

                <div className={styles.sectionTitle}>ТЕГИ</div>
                <CustomSelect options={TAGS} selected={tags} multiple onChange={(v:any) => setTags(v)} />

                <div className={styles.sectionTitle}>ЯЗЫКИ</div>
                <CustomSelect options={LANGUAGES} selected={languages} multiple onChange={(v:any) => setLanguages(v)} />

                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex flex-col gap-1 w-full sm:w-1/2">
                    <div className={styles.sectionTitle} translate="no">DISCORD</div>
                    <input className={styles.input} type="text" value={discord} onChange={e => setDiscord(e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1 w-full sm:w-1/2">
                    <div className={styles.sectionTitle}>САЙТ</div>
                    <input className={styles.input} type="text" value={website} onChange={e => setWebsite(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className={`${styles.container} ${styles.imageContainer} min-h-[160px] flex flex-col items-center justify-center p-4`}>
                <label className="cursor-pointer w-full flex flex-col items-center">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="max-h-40 w-full object-contain border border-white/10 rounded" />
                  ) : (
                    <span className="text-gray-400">Нажмите чтобы изменить изображение</span>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>

              <div className="w-full flex justify-end items-center gap-4 mt-2">
                <button type="button" className="text-gray-400 hover:text-white transition-colors" onClick={() => router.back()}>Отмена</button>
                <button 
                  className={styles.submit} 
                  type="submit" 
                  disabled={isSubmitting}
                  style={{ opacity: isSubmitting ? 0.6 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
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