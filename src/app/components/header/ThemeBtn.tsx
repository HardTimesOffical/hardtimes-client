"use client";
import { useTheme } from "@/context/ThemeContext";
import { HiMoon, HiSun } from "react-icons/hi";

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button 
      onClick={toggleTheme}
      style={{
        padding: '8px',
        borderRadius: '50%',
        border: '1px solid var(--border)',
        background: 'var(--card-bg)',
        color: 'var(--text-main)',
        cursor: 'pointer'
      }}
    >
      {isDark ? <HiSun size={20} /> : <HiMoon size={20} />}
    </button>
  );
};