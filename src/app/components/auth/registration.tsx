'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  HiOutlineUser,   
  HiOutlineLockClosed, 
  HiOutlineEye, 
  HiOutlineEyeSlash, 
  HiOutlineArrowRight 
} from "react-icons/hi2";
import { HiIdentification } from 'react-icons/hi';
import { FaGoogle, FaGithub } from "react-icons/fa";
// 1. Импорт капчи
import { Turnstile } from "@marsidev/react-turnstile";

const labelStyle = "text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-2 block ml-1";
const inputStyle = "w-full h-12 pl-12 pr-4 bg-[#1a1a1a] border border-white/5 rounded-none text-sm text-white outline-none focus:border-[#5a6e60]/50 transition-all placeholder:text-zinc-700 placeholder:opacity-50";
const iconStyle = "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-[#5a6e60] transition-colors";

export default function RegistrationCard() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    // 2. Стейт для токена
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);

    const auth = useAuth();
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Валидация капчи перед отправкой
        if (!captchaToken) {
            setError('ПОДТВЕРДИТЕ, ЧТО ВЫ НЕ РОБОТ');
            return;
        }

        setError('');
        setIsLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError('Пароли не совпадают');
            setIsLoading(false);
            return;
        }

        try {
            const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
            
            // 3. Передаем токен в запрос регистрации
            await axios.post(
                `${SERVER_URL}/auth/register`,
                {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    "cf-turnstile-response": captchaToken // Добавляем токен
                },
                { withCredentials: true }
            );

            const loginRes = await axios.post(
                `${SERVER_URL}/auth/login`,
                { email: formData.email, password: formData.password },
                { withCredentials: true }
            );

            const data = loginRes.data;
            if (data?.accessToken) {
                auth.login(data.accessToken, data.user);
                router.push('/');
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || err.message || 'Ошибка регистрации');
            setCaptchaToken(null); // Сбрасываем при ошибке
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[800px] max-h-[750px] min-h-[500px] bg-[#242424] border border-white/5 rounded-none shadow-[0_25px_70px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col md:flex-row mc-slide-up">
            
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
                            <HiOutlineUser className="w-7 h-7 text-[#5a6e60]" />
                        </div>
                        <h2 className="text-3xl font-bold text-white uppercase tracking-tight leading-none">
                            HARD<br /> <span className="text-[#5a6e60]">MONITORING</span>
                        </h2>
                        <p className="text-zinc-500 text-[11px] mt-4 leading-relaxed max-w-[240px] uppercase tracking-wider font-medium">
                            Присоединяйтесь к нашему комьюнити и начните управлять своими проектами прямо сейчас.
                        </p>
                    </div>
                    
                    <div className="font-mc-pixel text-[10px] text-zinc-700 uppercase tracking-widest">
                        HardTimes — Join Us
                    </div>
                </div>
            </div>

            {/* ПРАВАЯ ЧАСТЬ */}
            <div className="w-full md:w-[58%] flex flex-col p-10 md:p-14 bg-[#242424]">
                <header className="mb-8 space-y-2">
                    <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Регистрация</h1>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.25em]">Создайте свой аккаунт</p>
                </header>

                <form className="space-y-4 flex-1" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label className={labelStyle} htmlFor="username">Никнейм</label>
                        <div className="relative group">
                            <div className={iconStyle}><HiOutlineUser className="w-5 h-5" /></div>
                            <input className={inputStyle} type="text" id="username" name="username" placeholder="Steve_Mine" value={formData.username} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className={labelStyle} htmlFor="email">Email адрес</label>
                        <div className="relative group">
                            <div className={iconStyle}><HiIdentification className="w-5 h-5" /></div>
                            <input className={inputStyle} type="email" id="email" name="email" placeholder="steve@sinegarsk.ru" value={formData.email} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className={labelStyle}>Пароль</label>
                            <div className="relative group">
                                <div className={iconStyle}><HiOutlineLockClosed className="w-4 h-4" /></div>
                                <input className={inputStyle} type={showPassword ? "text" : "password"} name="password" placeholder="••••" value={formData.password} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className={labelStyle}>Повтор</label>
                            <div className="relative group">
                                <div className={iconStyle}><HiOutlineLockClosed className="w-4 h-4" /></div>
                                <input className={inputStyle} type={showPassword ? "text" : "password"} name="confirmPassword" placeholder="••••" value={formData.confirmPassword} onChange={handleChange} required />
                                <button type="button" className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-700 hover:text-white" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <HiOutlineEyeSlash className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 4. Виджет Turnstile */}
                    <div className="flex justify-center py-2 scale-90 sm:scale-100">
                        <Turnstile 
                            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
                            onSuccess={(token) => setCaptchaToken(token)}
                            onExpire={() => setCaptchaToken(null)}
                            options={{
                                theme: 'dark',
                                size: 'normal',
                            }}
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/5 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase p-4 text-center tracking-widest animate-shake">
                            {error}
                        </div>
                    )}

                    <button 
                        className="group w-full h-14 bg-white hover:bg-zinc-200 text-[#1a1a1a] font-bold text-sm uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 disabled:bg-zinc-800 disabled:text-zinc-600 active:scale-[0.98]" 
                        type="submit" 
                        disabled={isLoading || !captchaToken} // Блокируем до прохождения капчи
                    >
                        {isLoading ? "Создание..." : <>Зарегистрироваться <HiOutlineArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" /></>}
                    </button>
                </form>

                {/* Соцсети и Футер (без изменений) */}
                <div className="mt-6 pt-6 border-t border-white/5">
                    <div className="grid grid-cols-2 gap-4">
                        <button type="button" className="h-11 bg-[#1a1a1a] border border-white/5 text-zinc-500 hover:text-white text-[10px] uppercase font-bold flex items-center justify-center gap-2 transition-all opacity-50 hover:opacity-100">
                            <FaGoogle /> Google
                        </button>
                        <button type="button" className="h-11 bg-[#1a1a1a] border border-white/5 text-zinc-500 hover:text-white text-[10px] uppercase font-bold flex items-center justify-center gap-2 transition-all opacity-50 hover:opacity-100">
                            <FaGithub /> GitHub
                        </button>
                    </div>
                </div>

                <footer className="mt-8 pt-6 border-t border-white/5 flex justify-center md:justify-start gap-4">
                    <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">Уже есть аккаунт?</span>
                    <Link href="/login" className="text-[10px] font-bold text-white uppercase hover:text-[#5a6e60] transition-colors underline underline-offset-4 tracking-wider">Войти</Link>
                </footer>
            </div>
        </div>
    );
}