'use client';
import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingCrystal() {
  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="relative flex items-center justify-center w-24 h-24">
        
        {/* Внешнее пульсирующее кольцо */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 border-2 border-orange-500 rounded-full"
        />

        {/* Вращающиеся "осколки" (орбиты) */}
        {[0, 120, 240].map((rotation, i) => (
          <motion.div
            key={i}
            className="absolute w-full h-full"
            style={{ rotate: rotation }}
            animate={{ rotate: rotation + 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-orange-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
          </motion.div>
        ))}

        {/* Центральный элемент (ромб/кристалл) */}
        <motion.div
          animate={{ 
            rotate: [45, 225, 45],
            scale: [1, 0.9, 1],
            borderRadius: ["20%", "40%", "20%"]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 shadow-xl shadow-orange-500/30 rotate-45"
        />
      </div>

      {/* Текст загрузки */}
      <motion.span 
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-900 select-none"
        translate="no"
      >
        Loading
      </motion.span>
    </div>
  );
}