"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import axios from "axios";
import styles from "../settings.module.css";
import { useLanguage } from "@/context/LanguageContext";

export default function SecuritySettings() {
  const auth = useAuth();
  
  // Состояния для значений полей
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  
  // Состояния видимости паролей
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { t } = useLanguage();

  if (auth.user === null) {
    return <div className={styles.container}>Загрузка...</div>;
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы
    setError("");
    setSuccess(false);

    if (next !== confirm) {
      setError(`${t.security.not_equal}`);
      return;
    }

    setLoading(true);
    try {
      const userId = auth.user?.id;
      await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/users/${userId}/password`,
        {
          currentPassword: current,
          newPassword: next,
        },
        {
          headers: { Authorization: `Bearer ${auth.accessToken}` },
          withCredentials: true,
        }
      );

      setSuccess(true);
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (err: any) {
      setError(err.response?.data?.message || `${t.security.error}`);
    } finally {
      setLoading(false);
    }
  };

  // Вспомогательная функция для рендеринга поля (устраняем проблемы с фокусом)
  const renderInput = (
    placeholder: string, 
    value: string, 
    setter: (v: string) => void, 
    isVisible: boolean, 
    toggle: () => void
  ) => (
    <div style={{ position: 'relative', width: '100%', marginBottom: '15px' }}>
      <input
        type={isVisible ? "text" : "password"}
        className={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setter(e.target.value)} // Прямое обновление состояния
        style={{ width: '100%', paddingRight: '45px' }} 
      />
      <button
        type="button"
        onClick={toggle}
        style={{
          position: 'absolute',
          right: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '18px',
          lineHeight: '1'
        }}
      >
        {isVisible ? "🙈" : "👁️"}
      </button>
    </div>
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>{t.security.securityTitle}</h1>
      <div className={styles.form}>
        <label className={styles.label}>{t.security.password}</label>
        {success && (
          <div style={{ color: '#2e7d32', backgroundColor: '#edf7ed', padding: '10px', borderRadius: '8px', marginBottom: '15px' }}>
            ✅ {t.security.successfull}!
          </div>
        )}

        {renderInput(`${t.security.current}`, current, setCurrent, showCurrent, () => setShowCurrent(!showCurrent))}
        {renderInput(`${t.security.new}`, next, setNext, showNext, () => setShowNext(!showNext))}
        {renderInput(`${t.security.repeat}`, confirm, setConfirm, showConfirm, () => setShowConfirm(!showConfirm))}

        {error && <div style={{ color: '#d32f2f', marginBottom: '15px' }}>{error}</div>}

        <button 
          className={styles.submit} 
          onClick={submit}
          disabled={loading || !current || !next}
        >
          {loading ? `${t.security.wait}` : `${t.security.change}`}
        </button>
      </div>
    </div>
  );
}