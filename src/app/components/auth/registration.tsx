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
  HiOutlineCheckCircle,
  HiOutlineArrowRight 
} from "react-icons/hi2";
import { HiIdentification } from 'react-icons/hi';

export default function Registration() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const auth = useAuth();
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError('Пароли не совпадают');
            setIsLoading(false);
            return;
        }

        try {
            const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
            
            await axios.post(
                `${SERVER_URL}/auth/register`,
                {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                },
                { withCredentials: true }
            );

            const loginRes = await axios.post(
                `${SERVER_URL}/auth/login`,
                { email: formData.email, password: formData.password },
                { withCredentials: true }
            );

            const data = loginRes.data;
            if (data && data.accessToken) {
                const user = data.user || { id: data.id, email: formData.email, username: formData.username };
                auth.login(data.accessToken, user);
            }

            setSuccess('Аккаунт создан!');
            setTimeout(() => router.push('/'), 1000);
        } catch (err: any) {
            const message = err?.response?.data?.message || err.message || 'Ошибка регистрации';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full flex justify-center py-6 px-4">
            {/* ИСПРАВЛЕНО: Заменили bg-white на bg-[var(--card)] */}
            <div className="w-full max-w-[420px] bg-[var(--card)] border border-[var(--border)] rounded-[2rem] shadow-xl overflow-hidden transition-colors duration-300">
                
                <header className="pt-10 px-8 text-center space-y-1">
                    <h2 className="text-2xl font-black text-[var(--foreground-bright)] uppercase italic tracking-tighter">
                        Регистрация
                    </h2>
                    <p className="text-[9px] font-bold text-[var(--muted)] uppercase tracking-[0.2em] opacity-70">
                        Станьте частью нашего комьюнити
                    </p>
                </header>

                <div className="p-8">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        
                        {/* Логин */}
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-[var(--muted)] uppercase ml-1 tracking-widest" htmlFor="username">
                                Логин
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--muted)] group-focus-within:text-blue-500 transition-colors">
                                    <HiOutlineUser className="w-4 h-4" />
                                </div>
                                <input
                                    className="w-full h-11 pl-10 pr-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-sm text-[var(--foreground)] outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-[var(--muted)] placeholder:opacity-30"
                                    type="text"
                                    id="username"
                                    name="username"
                                    placeholder="Ваш никнейм"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

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
                                    name="email"
                                    placeholder="steve@minecraft.net"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Пароли */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-[var(--muted)] uppercase ml-1" htmlFor="password">Пароль</label>
                                <div className="relative group">
                                    <input
                                        className="w-full h-11 pl-4 pr-10 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-sm text-[var(--foreground)] outline-none focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-[var(--muted)] placeholder:opacity-30"
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        placeholder="••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 text-[var(--muted)] hover:text-blue-500 transition-colors"
                                        onClick={() => setShowPassword(s => !s)}
                                    >
                                        {showPassword ? <HiOutlineEyeSlash className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-[var(--muted)] uppercase ml-1" htmlFor="confirmPassword">Повтор</label>
                                <div className="relative group">
                                    <input
                                        className="w-full h-11 pl-4 pr-10 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-sm text-[var(--foreground)] outline-none focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-[var(--muted)] placeholder:opacity-30"
                                        type={showConfirm ? 'text' : 'password'}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        placeholder="••••"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 text-[var(--muted)] hover:text-blue-500 transition-colors"
                                        onClick={() => setShowConfirm(s => !s)}
                                    >
                                        {showConfirm ? <HiOutlineEyeSlash className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Статус */}
                        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase p-3 rounded-xl text-center tracking-wider animate-shake">{error}</div>}
                        {success && <div className="bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-black uppercase p-3 rounded-xl text-center tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-green-500/5"><HiOutlineCheckCircle className="w-4 h-4" /> {success}</div>}

                        <button 
                            className="group w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50 mt-2 active:scale-[0.98]" 
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? "Создание..." : (
                                <>
                                    Продолжить
                                    <HiOutlineArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>

                        <footer className="mt-8 pt-6 border-t border-[var(--border)] text-center">
                            <span className="text-[9px] font-bold text-[var(--muted)] uppercase tracking-wider">
                                Уже есть аккаунт?
                            </span>
                            <Link 
                                href="/login" 
                                className="ml-2 text-[9px] font-black text-blue-500 uppercase hover:text-blue-400 transition-colors tracking-widest"
                            >
                                Войти
                            </Link>
                        </footer>
                    </form>
                </div>
            </div>
        </div>
    );
}