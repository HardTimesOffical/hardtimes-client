"use client";
import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import en from "@/locales/en.json";
import ru from "@/locales/ru.json";

// Эталонный тип на основе английского файла
type TranslationType = typeof en;
type Language = "en" | "ru";

const translations: Record<Language, TranslationType> = {
  en: en,
  ru: ru as TranslationType // Принудительно приводим к типу, так как мы синхронизировали ключи
};

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationType;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

 useEffect(() => {
  const savedLang = localStorage.getItem("app_lang") as Language;
  
  if (savedLang) {
    // 1. Если пользователь уже заходил и выбирал язык — берем его
    setLanguageState(savedLang);
  } else {
    // 2. Если это новый пользователь, проверяем язык браузера
    const browserLang = navigator.language.split("-")[0]; // получаем 'ru' или 'en'
    
    // Проверяем, есть ли у нас перевод для этого языка
    if (browserLang === "ru") {
      setLanguageState("ru");
      localStorage.setItem("app_lang", "ru");
    } else {
      setLanguageState("en");
      localStorage.setItem("app_lang", "en");
    }
  }
  setMounted(true);
}, []);

const setLanguage = (lang: Language) => {
    if (lang !== language) {
      localStorage.setItem("app_lang", lang);
      // Мы не вызываем setLanguageState, так как страница все равно перезагрузится
      // и подтянет новое значение из localStorage в useEffect
      window.location.reload(); 
    }
  };

  // useMemo гарантирует, что как только изменится state language, 
  // изменится и объект t, и все компоненты перерисуются СРАЗУ.
  const t = useMemo(() => translations[language], [language]);

  if (!mounted) return null;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};