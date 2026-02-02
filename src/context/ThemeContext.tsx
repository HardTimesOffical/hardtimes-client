"use client";
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({ isDark: false, toggleTheme: () => {} });

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    // Проверяем сохраненную тему или системные настройки
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

 const toggleTheme = () => {
  const newTheme = !isDark;
  setIsDark(newTheme);
  
  if (newTheme) {
    document.documentElement.classList.add("dark");
    // Удаляем старые атрибуты, если они были
    document.documentElement.removeAttribute("data-theme"); 
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
};

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);