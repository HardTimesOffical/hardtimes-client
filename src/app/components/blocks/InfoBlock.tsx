"use client";

import React from "react";

interface InfoBlockProps {
  text: string;     // Теперь текст обязателен
  title?: string;   // Заголовок остается опциональным
}

export default function InfoBlock({ text, title }: InfoBlockProps) {
  return (
    <div className="w-full bg-blue-600/5 border border-blue-500/20 rounded-xl p-4 flex gap-4 my-4">
      <div className="flex-shrink-0">
        <div className="w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center">
          <span className="text-blue-500 font-bold text-sm">!</span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {title && (
          <h4 className="text-blue-400 font-bold text-sm uppercase tracking-wider">
            {title}
          </h4>
        )}
        {/* Выводим пропс text */}
        <p className="text-white/60 text-sm leading-relaxed">
          {text}
        </p>
      </div>
    </div>
  );
}