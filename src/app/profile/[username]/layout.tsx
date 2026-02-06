"use client";

import Sidebar from "@/app/components/dashboard/dashboard";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-200">
      
      {/* 1. Общее боковое меню */}
      <Sidebar />

      {/* 2. Область контента */}
      <main className="flex-1 w-full overflow-x-hidden">
        {/* Добавляем bg-surface или оставляем прозрачным, чтобы видеть основной фон */}
        <div className="max-w-[1200px] mx-auto py-10 px-4 md:px-10">
          {children}
        </div>
      </main>
    </div>
  );
}