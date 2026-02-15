'use client';
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeSlash, HiOutlineArrowRight } from "react-icons/hi2";
import { HiIdentification } from "react-icons/hi";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const auth = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      const data = res.data;
      if (!data?.accessToken) throw new Error("Токен не получен");

      auth.login(data.accessToken, data.user);
      router.push("/"); 
    } catch (err: any) {
      const message = err?.response?.data?.message || err.message || "Ошибка входа";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center py-6 px-4">
      {/* ИСПРАВЛЕНО: Убрал bg-white, теперь фон берется только из переменной --card */}
      <div className="w-full max-w-[400px] bg-[var(--card)] border border-[var(--border)] rounded-[2rem] shadow-xl overflow-hidden transition-colors duration-300">
        
        {/* Хедер */}
        <header className="pt-10 px-8 text-center space-y-1">
          <h2 className="text-2xl font-black text-[var(--foreground-bright)] uppercase italic tracking-tighter">
            Вход в систему
          </h2>
          <p className="text-[9px] font-bold text-[var(--muted)] uppercase tracking-[0.2em] opacity-70">
            Введите данные аккаунта
          </p>
        </header>

        <div className="p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-[var(--muted)] uppercase ml-1 tracking-widest" htmlFor="email">
                Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--muted)] group-focus-within:text-blue-500 transition-colors">
                  <HiIdentification className="w-4 h-4" />
                </div>
                <input
                  className="w-full h-11 pl-10 pr-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-sm text-[var(--foreground)] outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-[var(--muted)] placeholder:opacity-30"
                  type="email"
                  id="email"
                  placeholder="name@mail.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Пароль */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[9px] font-black text-[var(--muted)] uppercase ml-1 tracking-widest" htmlFor="password">
                  Пароль
                </label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--muted)] group-focus-within:text-blue-500 transition-colors">
                  <HiOutlineLockClosed className="w-4 h-4" />
                </div>
                <input
                  className="w-full h-11 pl-10 pr-11 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-sm text-[var(--foreground)] outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-[var(--muted)] placeholder:opacity-30"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[var(--muted)] hover:text-blue-500 transition-colors"
                  onClick={() => setShowPassword(s => !s)}
                >
                  {showPassword ? <HiOutlineEyeSlash className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Ошибка */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase p-3 rounded-xl text-center tracking-wider animate-shake">
                {error}
              </div>
            )}

            {/* Кнопка */}
            <button 
              className="group w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50 active:scale-[0.98]" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Обработка..." : (
                <>
                  Войти
                  <HiOutlineArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Футер */}
          <footer className="mt-8 pt-6 border-t border-[var(--border)] text-center">
            <span className="text-[9px] font-bold text-[var(--muted)] uppercase tracking-wider">
              Нет аккаунта?
            </span>
            <Link 
              href="/register" 
              className="ml-2 text-[9px] font-black text-blue-500 uppercase hover:text-blue-400 transition-colors tracking-widest"
            >
              Создать профиль
            </Link>
          </footer>
        </div>
      </div>
    </div>
  );
}