'use client';
import Login from "../components/auth/login";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-[#1a1a1a] transition-colors duration-300">
      
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-12 overflow-y-auto relative">
        
        {/* Фоновое свечение */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#5a6e60]/20 blur-[120px] rounded-full" />
            <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-[#5a6e60]/10 blur-[120px] rounded-full" />
        </div>

        <div className="relative z-10 w-full flex justify-center animate-in fade-in zoom-in-95 duration-500">
          <Login />
        </div>

      </main>
    </div>
  );
}