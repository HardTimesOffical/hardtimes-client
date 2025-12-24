"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import axios from "axios";

export default function ProfileEditor({ user }: { user: any }) {
  const auth = useAuth();
  
  // 1. ЗАЩИТА: Если user не передан, не пытаемся читать его свойства
  if (!user) return null;

  // Используем опциональную цепочку для безопасности
  const isOwner = auth.user?.id === user?._id;

  // Инициализируем состояние, проверяя наличие bio
  const [bio, setBio] = useState(user?.bio || "");

  if (!isOwner) return null;

  const save = async () => {
    try {
      // 2. ENV: Используем переменную окружения вместо localhost
      const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      
      await axios.put(
        `${apiUrl}/users/${user._id}`,
        { bio },
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
          withCredentials: true,
        }
      );
      alert("Сохранено!");
    } catch (error) {
      console.error("Ошибка при сохранении:", error);
    }
  };

  return (
    <div className="space-y-4">
      <textarea 
        className="w-full p-2 border rounded text-black"
        value={bio} 
        onChange={e => setBio(e.target.value)} 
      />
      <button 
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={save}
      >
        Save
      </button>
    </div>
  );
}