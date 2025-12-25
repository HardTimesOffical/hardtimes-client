"use client";

import React, { useState, useRef, useEffect, ChangeEvent, FormEvent } from "react";
import styles from "../../workbench/workbench.module.css"; // Путь к твоим стилям
import { GAME_TYPES } from "@/constants/gameTypes";
import { GAME_VERSIONS } from "@/constants/gameVersions";
import { CATEGORIES } from "@/constants/categories";
import { TAGS } from "@/constants/tags";
import { LANGUAGES } from "@/constants/languages";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/app/components/dashboard/dashboard";

// Твой вспомогательный компонент CustomSelect остается таким же
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
        {displayValue || placeholder || "Select..."}
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
  const [ipAddress, setIpAddress] = useState("");
  const [gameType, setGameType] = useState("");
  const [gameVersion, setGameVersion] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [discord, setDiscord] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState(""); // НОВОЕ ПОЛЕ
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  
  const { user, accessToken } = useAuth();
  const router = useRouter();
  const params = useParams(); // Получаем id сервера из URL
  const slug = params.slug;

  const availableVersions = gameType ? GAME_VERSIONS[gameType] || [] : [];

  // Загрузка текущих данных сервера
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
        setIpAddress(data.ipAddress);
        setGameType(data.gameType);
        setGameVersion(data.gameVersion);
        setCategories(Array.isArray(data.categories) ? data.categories : JSON.parse(data.categories || "[]"));
        setTags(Array.isArray(data.tags) ? data.tags : JSON.parse(data.tags || "[]"));
        setLanguages(Array.isArray(data.languages) ? data.languages : JSON.parse(data.languages || "[]"));
        setDiscord(data.discord || "");
        setWebsite(data.website || "");
        setDescription(data.description || ""); // Загружаем описание
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
    try {
      const formData = new FormData();
      formData.append("serverName", serverName);
      formData.append("ipAddress", ipAddress);
      formData.append("gameType", gameType);
      formData.append("gameVersion", gameVersion);
      formData.append("categories", JSON.stringify(categories));
      formData.append("tags", JSON.stringify(tags));
      formData.append("languages", JSON.stringify(languages));
      formData.append("discord", discord);
      formData.append("website", website);
      formData.append("description", description); // НОВОЕ ПОЛЕ
      if (imageFile) formData.append("image", imageFile);

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/servers/edit/${slug}`, {
        method: "PATCH", // Или PUT, зависит от твоего API
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to update server");
      alert("Server successfully updated!");
      router.back(); 
    } catch (error) {
      console.error(error);
      alert("Error updating server");
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-center p-4">
        {/* Добавлен max-w-5xl для ограничения ширины на огромных мониторах */}
        <form className={`flex flex-col gap-4 w-full max-w-5xl ${styles.workbenchForm}`} onSubmit={handleSubmit}>
          <h2 className="text-white text-xl font-bold px-2">Edit Server</h2>
          
          {/* Изменено на flex-col md:flex-row (в ряд только от планшета) */}
          <div className="flex flex-col md:flex-row gap-4">
            
            {/* Левая колонка - убран styles.leftContainer (ширина теперь в CSS через медиа) */}
            <div className={`${styles.container} flex flex-col gap-2 flex-1`}>
              <div className={styles.sectionTitle}>SERVER NAME</div>
              <input className={styles.input} type="text" value={serverName} onChange={e => setServerName(e.target.value)} />

              <div className={styles.sectionTitle}>IP ADDRESS</div>
              <input className={styles.input} type="text" value={ipAddress} onChange={e => setIpAddress(e.target.value)} />

              <div className={styles.sectionTitle}>GAME TYPE</div>
              <CustomSelect options={GAME_TYPES} selected={gameType} onChange={(v:any) => { setGameType(v); setGameVersion(""); }} />

              <div className={styles.sectionTitle}>GAME VERSION</div>
              <CustomSelect options={availableVersions} selected={gameVersion} onChange={(v:any) => setGameVersion(v)} />

              <div className={styles.sectionTitle}>DESCRIPTION</div>
              <textarea 
                className={`${styles.input} h-32 md:h-full resize-none p-2`} 
                placeholder="Full server description..." 
                value={description} 
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            {/* Правая колонка - изменена ширина w-full md:w-1/2 */}
            <div className="flex flex-col gap-4 w-full md:w-1/2">
              <div className={`${styles.container} flex flex-col gap-2`}>
                <div className={styles.sectionTitle}>CATEGORIES</div>
                <CustomSelect options={CATEGORIES} selected={categories} multiple onChange={(v:any) => setCategories(v)} />

                <div className={styles.sectionTitle}>TAGS</div>
                <CustomSelect options={TAGS} selected={tags} multiple onChange={(v:any) => setTags(v)} />

                <div className={styles.sectionTitle}>LANGUAGES</div>
                <CustomSelect options={LANGUAGES} selected={languages} multiple onChange={(v:any) => setLanguages(v)} />

                {/* Социалки: тоже делаем адаптивными (в ряд только на десктопе) */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex flex-col gap-1 w-full sm:w-1/2">
                    <div className={styles.sectionTitle}>DISCORD</div>
                    <input className={styles.input} type="text" value={discord} onChange={e => setDiscord(e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1 w-full sm:w-1/2">
                    <div className={styles.sectionTitle}>WEBSITE</div>
                    <input className={styles.input} type="text" value={website} onChange={e => setWebsite(e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Контейнер изображения - убрана фиксированная h-40 для гибкости */}
              <div className={`${styles.container} ${styles.imageContainer} min-h-[160px] flex flex-col items-center justify-center p-4`}>
                <label className="cursor-pointer w-full flex flex-col items-center">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="max-h-40 w-full object-contain border border-white/10 rounded" />
                  ) : (
                    <span className="text-gray-400">Click to change image</span>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>

              {/* Кнопки управления */}
              <div className="w-full flex justify-end items-center gap-4 mt-2">
                <button type="button" className="text-gray-400 hover:text-white transition-colors" onClick={() => router.back()}>Cancel</button>
                <button className={styles.submit} type="submit">Save Changes</button>
              </div>
            </div>

          </div>  
        </form>
      </div>
    </DashboardLayout>
  );
}