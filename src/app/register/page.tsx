'use client'
import Sidebar from "../components/dashboard/dashboard";
import Registration from "../components/auth/registration";

export default function LoginPage() {
    return (
        /* Вся страница имеет чистый светлый фон */
        <div className="flex min-h-screen bg-[#f4f7f9]">
            
            {/* 1. Меню слева */}
            <Sidebar />

            {/* 2. Основная область */}
            <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-10">
                
                {/* Обертка для формы регистрации */}
                <div className="w-full max-w-[500px] bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-2 md:p-4 mt-[-5vh]">
                    {/* mt-[-5vh] визуально центрирует форму чуть выше математического центра, 
                        что выглядит эстетичнее 
                    */}
                    <Registration />
                </div>

                {/* Подпись внизу (опционально) */}
                <p className="mt-8 text-gray-400 text-sm font-medium">
                    HardMonitoring &copy; 2026 — Безопасная авторизация
                </p>

            </main>
        </div>
    )
}