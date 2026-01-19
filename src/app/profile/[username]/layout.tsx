"use client";

import Sidebar from "@/app/components/dashboard/dashboard";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#f8f9fa]">
      {/* 1. Общее боковое меню для всех страниц профиля */}
      <Sidebar />

      {/* 2. Область контента, которая будет меняться */}
      <main className="flex-1 w-full">
        <div className="max-w-[1200px] mx-auto py-10 px-4 md:px-10">
          {children}
        </div>
      </main>
    </div>
  );
}