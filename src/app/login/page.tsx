'use client'
import Sidebar from "../components/dashboard/dashboard";// Новый независимый Sidebar
import Login from "../components/auth/login";

export default function LoginPage(){
    return (
        /* Используем структуру Sidebar + Main */
        <div className="flex pt-10 min-h-screen bg-[#f4f7f9]">
            
            {/* 1. Боковое меню */}
            <Sidebar />

            {/* 2. Область контента с центрированием формы */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
                    <Login />
            </main>
        </div>
    )
}