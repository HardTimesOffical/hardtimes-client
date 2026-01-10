"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios"; // Добавьте AxiosError в импорт
import styles from "../settings.module.css";


export default function ProfileSettings() {
  const auth = useAuth();
  const [mounted, setMounted] = useState(false);

  // Состояния для полей
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  
  // Состояния статуса
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth.user) {
      setName(auth.user.username || "");
      setAvatar(auth.user.avatar || "");
    }
    setMounted(true);
  }, [auth.user]);

  if (!mounted) return <div className={styles.container} />;

  if (!auth.user) {
    return <div className={styles.container}>Необходима авторизация</div>;
  }

const save = async () => {
  const userId = (auth.user as any)?._id || (auth.user as any)?.id;

  if (!userId) {
    setError("ID пользователя не найден");
    return;
  }

  setLoading(true);
  setError("");
  
  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/users/${userId}`,
      { username: name, avatar },
      {
        headers: { Authorization: `Bearer ${auth.accessToken}` },
        withCredentials: true,
      }
    );

    auth.updateUser(response.data);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  } catch (err: unknown) { // Используем unknown для безопасности
    const axiosError = err as AxiosError<{ message: string }>; // Приводим к типу AxiosError
    setError(axiosError.response?.data?.message || "Ошибка при сохранении изменений");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Профиль</h1>
      <p className={styles.description}>
        Измените информацию, которая отображается публично в вашем профиле.
      </p>

      <div className={styles.form}>
        {/* Уведомление об успехе */}
        {success && (
          <div style={{ 
            color: '#2e7d32', 
            backgroundColor: '#edf7ed', 
            padding: '12px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            border: '1px solid #c3e6cb'
          }}>
            ✅ Изменения успешно сохранены!
          </div>
        )}

        <div style={{ marginBottom: '15px' }}>
          <label className={styles.label}>Имя пользователя</label>
          <input
            type="text"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введите ваше имя"
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label className={styles.label}>URL Аватара</label>
          <input
            type="text"
            className={styles.input}
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="https://example.com/photo.jpg"
          />
        </div>

        {/* Превью аватара */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', margin: '10px 0 20px 0' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#f0f0f0',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #ddd'
          }}>
            {avatar ? (
              <img
                src={avatar}
                alt="avatar preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64?text=Error';
                }}
              />
            ) : (
              <span style={{ fontSize: '24px' }}>👤</span>
            )}
          </div>
          <span style={{ fontSize: '14px', color: '#666' }}>Предпросмотр аватара</span>
        </div>

        {error && (
          <div style={{ color: '#d32f2f', marginBottom: '15px', fontSize: '14px' }}>
            ⚠️ {error}
          </div>
        )}

        <button 
          onClick={save} 
          className={styles.submit}
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? "Сохранение..." : "Сохранить изменения"}
        </button>
      </div>
    </div>
  );
}