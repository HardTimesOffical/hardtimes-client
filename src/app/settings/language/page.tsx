"use client";

import { useLanguage } from "@/context/LanguageContext";
import LanguageSettings from "./language";
import styles from "../settings.module.css";

export default function AppearanceSettings() {
  const { t } = useLanguage();

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>
        {t.settings.appearanceTitle}
      </h1>
      
      {/* Убрали flex (чтобы не сжималось) и дали полную ширину */}
      <div className="w-full">
        <LanguageSettings />
      </div>
    </div>
  );
}