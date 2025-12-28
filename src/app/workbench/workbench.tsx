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
import InfoBlock from "../components/blocks/InfoBlock";
import { useLanguage } from "@/context/LanguageContext";

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

  const { user } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user]);

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
  <div
    className={`${styles.customSelectDropdown} ${isOpen ? styles.open : ""}`}
  >
    {options.map(option => (
      <div
        key={option}
        className={styles.customSelectOption}
        onClick={() => toggleOption(option)}
      >
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

export default function Workbench() {
  const [serverName, setServerName] = useState("");
  const [ips, setIps] = useState({ java: "", bedrock: "" });
  const [gameType, setGameType] = useState(GAME_TYPES[0]);
  const [gameVersion, setGameVersion] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [discord, setDiscord] = useState("");
  const [website, setWebsite] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const { accessToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage()

  useEffect(() => {
    setGameVersion("");
  }, [gameType]);

  const availableVersions = (() => {
    if (gameType === "JAVA & BEDROCK") {
      // Если оба типа, принудительно берем версии для Java
      return GAME_VERSIONS["Minecraft Java"] || [];
    }
    // В остальных случаях берем по ключу
    return gameType ? GAME_VERSIONS[gameType] || [] : [];
  })();

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
      
      // ЛОГИКА ОПРЕДЕЛЕНИЯ IP:
      // Сохраняем как JSON только если это комбо, иначе просто строку
      const finalIp = gameType === "JAVA & BEDROCK" 
        ? JSON.stringify(ips) 
        : (gameType === "Minecraft Bedrock" ? ips.bedrock : ips.java);

      formData.append("ipAddress", finalIp);
      formData.append("serverName", serverName);
      formData.append("gameType", gameType);
      formData.append("gameVersion", gameVersion);
      formData.append("categories", JSON.stringify(categories));
      formData.append("tags", JSON.stringify(tags));
      formData.append("languages", JSON.stringify(languages));
      formData.append("discord", discord);
      formData.append("website", website);
      if (imageFile) formData.append("image", imageFile);

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/servers/add-server`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to add server");
      alert("Server successfully added!");
      
      // Очистка с возвратом к дефолту
      setServerName("");
      setIps({ java: "", bedrock: "" });
      setGameType(GAME_TYPES[0]);
    } catch (error) {
      console.error(error);
      alert("Error adding server");
      setIsSubmitting(false);
    }
  };

  return (
  <div className="flex justify-center p-4">
      <form className={`flex flex-col gap-4 w-full max-w-5xl ${styles.workbenchForm}`} onSubmit={handleSubmit}>
        <div className="w-full max-w-5xl">
        <InfoBlock 
          title="Important" 
          text={t.workbench.workbench_faq}
        />
      </div>
        <div className="flex flex-col md:flex-row gap-4">
          
          <div className={`${styles.container} flex flex-col gap-2 flex-1`}>
            <div className={styles.sectionTitle}>SERVER NAME</div>
            <input className={styles.input} type="text" placeholder="My Awesome Server" value={serverName} onChange={e => setServerName(e.target.value)} />

            <div className={styles.sectionTitle}>GAME TYPE</div>
            <CustomSelect
              options={[...GAME_TYPES, "JAVA & BEDROCK"]} 
              selected={gameType}
              onChange={v => setGameType(v as string)}
              placeholder="Select Game Type"
            />

            {/* БЛОК IP АДРЕСОВ */}
            <div className="flex flex-col gap-2 mt-2">
              {/* Поле Java: показываем для Java или для Комбо */}
              {(gameType === "Minecraft Java" || gameType === "JAVA & BEDROCK") && (
                <div className="flex flex-col gap-1">
                  <div className={styles.sectionTitle} style={{fontSize: '10px', opacity: 0.8}}>JAVA IP</div>
                  <input 
                    className={styles.input} 
                    type="text" 
                    placeholder="mc.example.com" 
                    value={ips.java} 
                    onChange={e => setIps({...ips, java: e.target.value})} 
                  />
                </div>
              )}

              {gameType === "JAVA & BEDROCK" && <div className="border-t border-white/5 my-2" />}

              {/* Поле Bedrock: показываем для Bedrock или для Комбо */}
              {(gameType === "Minecraft Bedrock" || gameType === "JAVA & BEDROCK") && (
                <div className="flex flex-col gap-1">
                  <div className={styles.sectionTitle} style={{fontSize: '10px', opacity: 0.8}}>BEDROCK IP / PORT</div>
                  <input 
                    className={styles.input} 
                    type="text" 
                    placeholder="pe.example.com:19132" 
                    value={ips.bedrock} 
                    onChange={e => setIps({...ips, bedrock: e.target.value})} 
                  />
                </div>
              )}
            </div>

            <div className={styles.sectionTitle}>GAME VERSION</div>
            <CustomSelect
              options={availableVersions}
              selected={gameVersion}
              onChange={v => setGameVersion(v as string)}
              placeholder="Select Game Version"
            />
            <div className={styles.sectionTitle}>CATEGORIES</div>
            <CustomSelect
              options={CATEGORIES}
              selected={categories}
              multiple
              onChange={v => setCategories(v as string[])}
              placeholder="Select Categories"
            />
          </div>


          {/* Правая колонка - изменена ширина w-full md:w-1/2 */}
          <div className="flex flex-col gap-4 w-full md:w-1/2">
            <div className={`${styles.container} flex flex-col gap-2`}>
              <div className={styles.sectionTitle}>TAGS</div>
              <CustomSelect
                options={TAGS}
                selected={tags}
                multiple
                onChange={v => setTags(v as string[])}
                placeholder="Select Tags"
              />

              <div className={styles.sectionTitle}>LANGUAGES</div>
              <CustomSelect
                options={LANGUAGES}
                selected={languages}
                multiple
                onChange={v => setLanguages(v as string[])}
                placeholder="Select Languages"
              />

              {/* Социалки: адаптивный ряд */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex flex-col gap-1 w-full sm:w-1/2">
                  <div className={styles.sectionTitle}>DISCORD</div>
                  <input className={styles.input} type="text" placeholder="Discord" value={discord} onChange={e => setDiscord(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1 w-full sm:w-1/2">
                  <div className={styles.sectionTitle}>WEBSITE</div>
                  <input className={styles.input} type="text" placeholder="Website" value={website} onChange={e => setWebsite(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Контейнер изображения */}
            <div className={`${styles.container} ${styles.imageContainer} min-h-[160px] flex flex-col items-center justify-center p-4`}>
              <label className="cursor-pointer w-full flex flex-col items-center text-center">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="max-h-40 w-full object-contain border border-white/10 rounded" />
                ) : (
                  <span className="text-gray-400">Click to upload gif or image | 470x60</span>
                )}
                <input type="file" accept="image/*,video/gif" onChange={handleImageChange} className="hidden" />
              </label>
            </div>

            <div className="w-full flex justify-end mt-2">
              <button 
                className={styles.submit} 
                type="submit"
                disabled={isSubmitting} // 4. Сама блокировка визуально и технически
                style={{ opacity: isSubmitting ? 0.6 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
              >
                {isSubmitting ? "Adding..." : "+ Add Server"}
              </button>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}
