"use client";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeSlash, HiOutlineArrowRight } from "react-icons/hi2";
import { HiIdentification } from "react-icons/hi";
import { FaGoogle, FaGithub } from "react-icons/fa";
// 1. Импортируем Turnstile
import { Turnstile } from "@marsidev/react-turnstile";

const labelStyle = "text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-2 block ml-1";
const inputStyle = "w-full h-12 pl-12 pr-4 bg-[#1a1a1a] border border-white/5 rounded-none text-sm text-white outline-none focus:border-[#5a6e60]/50 transition-all placeholder:text-zinc-700 placeholder:opacity-50";
const iconStyle = "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-[#5a6e60] transition-colors";

export default function LoginCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // 2. Стейт для токена
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const auth = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaToken) return setError("ПОЖАЛУЙСТА, ПРОЙДИТЕ ПРОВЕРКУ БЕЗОПАСНОСТИ");
    
    setError("");
    setIsLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/login`,
        // 3. Отправляем токен на бэкенд
        { email, password, "cf-turnstile-response": captchaToken },
        { withCredentials: true }
      );
      const data = res.data;
      if (!data?.accessToken) throw new Error("Токен не получен");
      auth.login(data.accessToken, data.user);
      router.push("/"); 
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Ошибка входа");
      // Сбрасываем токен при ошибке, чтобы заставить юзера пройти проверку заново
      setCaptchaToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[800px] min-h-[580px] bg-[#242424] border border-white/5 rounded-none shadow-[0_25px_70px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col md:flex-row mc-slide-up">
      
      {/* ЛЕВАЯ ЧАСТЬ (без изменений) */}
      <div className="w-full md:w-[42%] border-b md:border-b-0 md:border-r border-white/5 relative flex-shrink-0">
        <div className="absolute inset-0 bg-[#1a1a1a]">
          <img 
            src="https://i.pinimg.com/736x/d3/f8/59/d3f859a7d1a92d0402cc8be47fdc23ba.jpg"
            alt="Синегарск"
            className="w-full h-full object-cover opacity-30 grayscale hover:grayscale-0 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 p-10 flex flex-col justify-between h-full min-h-[250px] md:min-h-full">
          <div>
            <div className="bg-[#5a6e60]/20 p-3 border border-[#5a6e60]/30 w-fit mb-6">
              <HiOutlineLockClosed className="w-7 h-7 text-[#5a6e60]" />
            </div>
            <h2 className="text-3xl font-bold text-white uppercase tracking-tight leading-none">
               HARD<br /> <span className="text-[#5a6e60]">MONITORING</span>
            </h2>
            <p className="text-zinc-500 text-[11px] mt-4 leading-relaxed max-w-[240px] uppercase tracking-wider font-medium">
               Авторизуйтесь для управления своими проектами и доступа к инструментам мониторинга.
            </p>
          </div>
        </div>
      </div>

      {/* ПРАВАЯ ЧАСТЬ */}
      <div className="w-full md:w-[58%] flex flex-col p-10 md:p-14 bg-[#242424]">
        
        <header className="mb-10 space-y-2">
          <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Вход в профиль</h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.25em]">Security Identification</p>
        </header>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Поля Email и Пароль (без изменений) */}
          <div className="space-y-2">
            <label className={labelStyle} htmlFor="email">Электронная почта</label>
            <div className="relative group">
              <div className={iconStyle}><HiIdentification className="w-5 h-5" /></div>
              <input className={inputStyle} type="email" id="email" placeholder="example@mail.ru" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
          </div>

          <div className="space-y-2">
            <label className={labelStyle} htmlFor="password">Пароль доступа</label>
            <div className="relative group">
              <div className={iconStyle}><HiOutlineLockClosed className="w-5 h-5" /></div>
              <input className={inputStyle} type={showPassword ? "text" : "password"} id="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
              <button type="button" className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-700 hover:text-white transition-colors" onClick={() => setShowPassword(s => !s)}>
                {showPassword ? <HiOutlineEyeSlash className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* 4. Виджет Turnstile */}
         <div className="flex justify-center py-2">
            {/* Рендерим капчу только если ключ существует */}
            {SITE_KEY ? (
              <Turnstile 
                siteKey={SITE_KEY}
                onSuccess={(token) => setCaptchaToken(token)}
                onExpire={() => setCaptchaToken(null)}
                options={{ theme: 'dark', size: 'normal' }}
              />
            ) : (
              <div className="text-[9px] text-zinc-600 uppercase border border-white/5 p-2">
                Загрузка CAPTHA...
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-500/5 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase p-4 text-center tracking-widest">
              {error}
            </div>
          )}

          <button 
            className="group w-full h-14 bg-white hover:bg-zinc-200 text-[#1a1a1a] font-bold text-sm uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 disabled:bg-zinc-800 disabled:text-zinc-600 active:scale-[0.98]" 
            type="submit" 
            disabled={isLoading || !captchaToken} // Блокируем кнопку, если капча не пройдена
          >
            {isLoading ? "Загрузка..." : <>Авторизоваться <HiOutlineArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" /></>}
          </button>
        </form>

        {/* Футер и соцсети (без изменений) */}
        <div className="mt-8 pt-8 border-t border-white/5">
          <div className="grid grid-cols-2 gap-4">
            <button type="button" className="h-11 bg-[#1a1a1a] border border-white/5 text-zinc-500 hover:text-white text-[10px] uppercase font-bold flex items-center justify-center gap-2 transition-all opacity-50 hover:opacity-100">
              <FaGoogle /> Google
            </button>
            <button type="button" className="h-11 bg-[#1a1a1a] border border-white/5 text-zinc-500 hover:text-white text-[10px] uppercase font-bold flex items-center justify-center gap-2 transition-all opacity-50 hover:opacity-100">
              <FaGithub /> GitHub
            </button>
          </div>
        </div>

        <footer className="mt-auto pt-8 border-t border-white/5 flex justify-center md:justify-start gap-4">
          <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">Нет аккаунта?</span>
          <Link href="/register" className="text-[10px] font-bold text-white uppercase hover:text-[#5a6e60] transition-colors underline underline-offset-4">Регистрация</Link>
        </footer>
      </div>
    </div>
  );
}