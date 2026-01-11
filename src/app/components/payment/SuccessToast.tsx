"use client";
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function SuccessNotification() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Проверяем, есть ли в URL ?success=true
    if (searchParams.get('success') === 'true') {
      setShow(true);
      
      // Скрываем уведомление через 5 секунд
      const timer = setTimeout(() => {
        setShow(false);
        // Очищаем URL, чтобы при обновлении страницы уведомление не вылезло снова
        router.replace('/'); 
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

  if (!show) return null;

  return (
    <div className="fixed bottom-10 right-10 z-[100] animate-bounce-in">
      <div className="bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-green-400">
        <div className="bg-white/20 p-2 rounded-full">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="font-black text-sm uppercase">Оплата прошла!</p>
          <p className="text-xs opacity-90">Звезды уже зачислены на ваш баланс.</p>
        </div>
        <button onClick={() => setShow(false)} className="ml-4 hover:opacity-70">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}