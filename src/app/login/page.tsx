'use client'
import Sidebar from "../components/dashboard/dashboard";
import Login from "../components/auth/login";

export default function LoginPage() {
  return (
    /* min-h-screen гарантирует, что фон будет на всю высоту.
       bg-[var(--background)] автоматически переключит цвет в темной теме.
    */
    <div className="flex min-h-screen bg-[var(--background)] transition-colors duration-300">
      
      {/* 1. Боковое меню 
          Убедись, что Sidebar имеет фиксированную ширину или корректно сжимается 
      */}
      <Sidebar />

      {/* 2. Область контента 
          Добавлен плавный скролл и центрирование. 
          pt-10 или pt-20 можно добавить, если у тебя есть верхняя панель (Navbar).
      */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-12 overflow-y-auto">
        
        {/* Декоративный элемент на фоне (опционально, для стиля) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50 dark:opacity-20">
            <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
            <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
        </div>

        {/* Обертка для компонента входа. 
            animate-in делает появление формы плавным.
        */}
        <div className="relative z-10 w-full flex justify-center animate-in fade-in zoom-in-95 duration-500">
          <Login />
        </div>
      </main>
    </div>
  );
}