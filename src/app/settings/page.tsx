"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();

  useEffect(() => {
    // Если ширина экрана больше 768px, сразу кидаем в профиль
    if (window.innerWidth > 768) {
      router.replace("/settings/profile");
    }
  }, [router]);

  return (
    <div className="p-4 md:hidden">
      {/* На мобилках тут может быть пусто или приветствие, 
          так как Layout покажет Sidebar */}
      <p className="opacity-40 text-sm italic">Выберите раздел настроек выше</p>
    </div>
  );
}