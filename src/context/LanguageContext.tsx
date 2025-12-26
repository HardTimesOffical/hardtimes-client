"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import en from "@/locales/en.json";
import ru from "@/locales/ru.json";

type Language = "en" | "ru";
const translations = { en, ru };

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: any; // Функция для получения перевода
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("app_lang") as Language;
    if (savedLang) {
      setLanguageState(savedLang);
    } else {
      const browserLang = navigator.language.split("-")[0] as Language;
      const defaultLang = translations[browserLang] ? browserLang : "en";
      setLanguageState(defaultLang);
      localStorage.setItem("app_lang", defaultLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("app_lang", lang);
  };

  // Хелпер для доступа к ключам (например: t.server.about)
  const t = translations[language];

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