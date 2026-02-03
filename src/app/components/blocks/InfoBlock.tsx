"use client";

import React from "react";

interface InfoBlockProps {
  text: string;
  title?: string;
}

export default function InfoBlock({ text, title }: InfoBlockProps) {
  return (
    <div className="w-full bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5 flex gap-4 my-6 transition-colors dark:bg-blue-600/10">
      {/* Иконка (синяя всегда) */}
      <div className="flex-shrink-0">
        <div className="w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center bg-blue-500/5">
          <span className="text-blue-500 font-black text-xs">!</span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {title && (
          <h4 className="text-blue-600 dark:text-blue-400 font-black text-[11px] uppercase tracking-widest">
            {title}
          </h4>
        )}
        
        {/* Текст: используем твою переменную --foreground */}
        <p className="text-[var(--foreground)] opacity-80 dark:opacity-90 text-sm leading-relaxed font-medium">
          {text}
        </p>
      </div>
    </div>
  );
}