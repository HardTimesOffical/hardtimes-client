'use client'
import Registration from "../components/auth/registration";

export default function RegisterPage() {
    return (
        /* Используем системный фон для поддержки светлой и темной тем */
        <div className="flex min-h-screen bg-[var(--background)] transition-colors duration-300">
            

            {/* 2. Основная область контента */}
            <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-10 overflow-y-auto">
                
                {/* Мягкие градиенты на фоне для глубины (как в LoginPage) */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40 dark:opacity-10">
                    <div className="absolute top-[20%] right-[10%] w-[35%] h-[35%] bg-blue-600/10 blur-[100px] rounded-full" />
                    <div className="absolute bottom-[20%] left-[10%] w-[35%] h-[35%] bg-indigo-600/10 blur-[100px] rounded-full" />
                </div>

                {/* Контейнер для формы с плавной анимацией появления */}
                <div className="relative z-10 w-full flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                    
                    {/* Сама форма регистрации */}
                    <Registration />

                    {/* Подпись внизу */}
                    <div className="mt-8 flex flex-col items-center gap-1">
                        <p className="text-[10px] font-black text-[var(--muted)] uppercase tracking-[0.3em] opacity-60">
                            HardMonitoring &copy; 2026
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}