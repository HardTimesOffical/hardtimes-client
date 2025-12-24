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
  const [ipAddress, setIpAddress] = useState("");
  const [gameType, setGameType] = useState("");
  const [gameVersion, setGameVersion] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [discord, setDiscord] = useState("");
  const [website, setWebsite] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const { accessToken } = useAuth();
  console.log("Access token:", accessToken);

  const availableVersions = gameType ? GAME_VERSIONS[gameType] || [] : [];

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
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await fetch("http://localhost:5000/servers/add-server", {
        method: "POST",
         headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to add server");
      const data = await res.json();
      console.log("Server added:", data);
      alert("Server successfully added!");

      // Очистка формы
      setServerName("");
      setIpAddress("");
      setGameType("");
      setGameVersion("");
      setCategories([]);
      setTags([]);
      setLanguages([]);
      setDiscord("");
      setWebsite("");
      setImageFile(null);
      setImagePreview("");
    } catch (error) {
      console.error(error);
      alert("Error adding server");
    }
  };

  return (
    <div className="flex justify-center p-4">
      <form className={`flex flex-col gap-4 ${styles.workbenchForm}`} onSubmit={handleSubmit}>
        <div className="flex flex-row gap-2">
          <div className={`${styles.container} ${styles.leftContainer} flex flex-col gap-4`}>
            <div className={styles.sectionTitle}>SERVER NAME</div>
            <input className={styles.input} type="text" placeholder="Server Name" value={serverName} onChange={e => setServerName(e.target.value)} />

            <div className={styles.sectionTitle}>IP ADDRESS</div>
            <input className={styles.input} type="text" placeholder="IP Address" value={ipAddress} onChange={e => setIpAddress(e.target.value)} />

            <div className={styles.sectionTitle}>GAME TYPE</div>
            <CustomSelect
              options={GAME_TYPES}
              selected={gameType}
              onChange={v => { setGameType(v as string); setGameVersion(""); }}
              placeholder="Select Game Type"
            />

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

          <div className="flex flex-col gap-4 w-1/2">
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

              <div className="flex flex-row gap-2">
                <div className="flex flex-col gap-2">
                  <div className={styles.sectionTitle}>DISCORD</div>
                  <input className={styles.input} type="text" placeholder="Discord" value={discord} onChange={e => setDiscord(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <div className={styles.sectionTitle}>WEBSITE</div>
                  <input className={styles.input} type="text" placeholder="Website" value={website} onChange={e => setWebsite(e.target.value)} />
                </div>
              </div>
            </div>

            <div className={`${styles.container} ${styles.imageContainer} h-40 flex flex-col items-center justify-center`}>
              <label className="cursor-pointer">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-40 w-full object-contain border" />
                ) : (
                  <span>Click to upload gif or image</span>
                )}
                <input type="file" accept="image/*,video/gif" onChange={handleImageChange} className="hidden" />
              </label>
            </div>

            <div className="w-full flex justify-end">
              <button className={styles.submit} type="submit">
                + Add Server
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
