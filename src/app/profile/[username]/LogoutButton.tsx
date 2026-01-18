"use client";

import { useRouter } from "next/navigation";
import styles from "./profile.module.css";
import Link from "next/link";
// Предположим, у вас есть контекст или функция выхода
// import { useAuth } from "@/context/AuthContext"; 

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // 1. Очистка данных (зависит от вашей реализации)
    localStorage.removeItem("accessToken"); 
    // auth.logout(); 

    // 2. Редирект
    router.push("/login");
    router.refresh(); // Обновить состояние страницы
  };

  return (
   <div className="flex flex-col gap-2 w-full mt-6">
      {/* Кнопка Настроек */}
      <Link href="/settings" className={styles.settingsButton}>
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.1a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
        Settings
      </Link>

      {/* Кнопка Выхода */}
      <button onClick={handleLogout} className={styles.logoutButton}>
        Log Out
      </button>
    </div>
  );
}