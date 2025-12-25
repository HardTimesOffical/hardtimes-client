import React, { useState, useEffect } from 'react';

const WeeklyTimer = () => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, "");

  useEffect(() => {
    // 1. Получаем данные с сервера при монтировании
    const fetchTimer = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/votes/votes-info`);
        const data = await response.json();
        setTimeLeft(data.msLeft);
      } catch (error) {
        console.error("Ошибка загрузки таймера:", error);
      }
    };

    fetchTimer();

    // 2. Запускаем локальный интервал для обновления каждую секунду
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev !== null && prev > 0 ? prev - 1000 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Функция форматирования миллисекунд в Дни:Часы:Мин:Сек
  const formatTime = (ms: number) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));

    return {
      days,
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
    };
  };

  if (timeLeft === null) return <div>Загрузка...</div>;

  const t = formatTime(timeLeft);

  return (
    <div style={styles.container}>
      <span style={styles.label}>Resetting votes in...</span>
      <div style={styles.timer}>
        {t.days > 0 && <span>{t.days}d </span>}
        <span>{t.hours}:{t.minutes}:{t.seconds}</span>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '0 15px',
    color: '#fff',
    borderRadius: '8px',
    fontFamily: 'Nunito, sans-serif',
    height: '15px',
  },
  label: { fontSize: '14px', color: '#888' },
  timer: { fontWeight: 'bold', fontSize: '14px', color: '#4caf50' }
};

export default WeeklyTimer;