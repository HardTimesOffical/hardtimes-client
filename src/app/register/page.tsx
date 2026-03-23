'use client';
import Registration from "../components/auth/registration";

export default function RegisterPage() {
    return (
        <div className="flex min-h-screen bg-[#1a1a1a] transition-colors duration-300">
            
            <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-10 overflow-y-auto relative">
                
                {/* Фоновое свечение в стиле Синегарск */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                    <div className="absolute top-[20%] right-[10%] w-[35%] h-[35%] bg-[#5a6e60]/20 blur-[100px] rounded-full" />
                    <div className="absolute bottom-[20%] left-[10%] w-[35%] h-[35%] bg-[#5a6e60]/10 blur-[100px] rounded-full" />
                </div>

                <div className="relative z-10 w-full flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                    
                    <Registration />
                </div>
            </main>
        </div>
    );
}