"use client";

import React from "react";
import Workbench from "./workbench";
import styles from "./workbench.module.css";
// Импортируй компонент рекламы, если он уже создан
import YandexAds from "@/app/components/yandex/YandexAds"; 

const WorkbenchPage: React.FC = () => {
  return (
    <div className={`${styles.pageWrapper} relative min-h-screen text-foreground`} style={{ backgroundColor: '#0a0b0b' }}>
      
      {/* ── ФОНОВОЕ ИЗОБРАЖЕНИЕ (Fixed) ── */}
      <div className="fixed inset-0 z-0 pointer-events-none" 
        style={{ 
          backgroundImage: "url('https://i.pinimg.com/1200x/1c/86/12/1c86122cdfc9fac2b55523ee09b14ccb.jpg')", 
          backgroundSize: "cover", 
          backgroundPosition: "center", 
          filter: "saturate(0.5) brightness(0.5)" 
        }} 
      />
      
      {/* Плавный градиент в темноту (Overlay) */}
      <div className="fixed inset-0 z-0 pointer-events-none" 
        style={{ background: "linear-gradient(to bottom, transparent 0%, #0a0b0b 70%, #0a0b0b 100%)" }} 
      />

      {/* ── КОНТЕНТ ── */}
      <div className="relative z-10 pt-10 md:pt-16 pb-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          
          {/* Основная форма */}
          <div className="w-full">
            <Workbench />
          </div>

          {/* ── МЕСТО ПОД ЯНДЕКС РЕКЛАМУ (Горизонтальное) ── */}
          <div className="w-full max-w-5xl mt-12">
            <div className="flex flex-col gap-2">
              <div className="w-full min-h-[120px] bg-black/40 border border-white/5 backdrop-blur-sm flex items-center justify-center relative overflow-hidden">
                {/* Декоративные уголки как в основном стиле */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/10" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/10" />
                
                {/* Сам компонент рекламы */}
                <div className="w-full py-4 flex justify-center">
                   <YandexAds /> 
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default WorkbenchPage;