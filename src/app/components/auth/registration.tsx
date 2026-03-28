'use client';
import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  HiOutlineUser, HiOutlineLockClosed,
  HiOutlineEye, HiOutlineEyeSlash,
  HiOutlineArrowRight, HiOutlineEnvelope,
  HiArrowLeft
} from "react-icons/hi2";
import { HiIdentification } from 'react-icons/hi';
import { FaGoogle, FaGithub } from "react-icons/fa";
import { Turnstile } from "@marsidev/react-turnstile";

const labelStyle = "text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-2 block ml-1";
const inputStyle = "w-full h-12 pl-12 pr-4 bg-[#1a1a1a] border border-white/5 rounded-none text-sm text-white outline-none focus:border-[#5a6e60]/50 transition-all placeholder:text-zinc-700 placeholder:opacity-50";
const iconStyle  = "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-[#5a6e60] transition-colors";

type Step = 'register' | 'verify';

export default function RegistrationCard() {
  const auth   = useAuth();
  const router = useRouter();
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
  const SITE_KEY   = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  // ── Шаг ─────────────────────────────────────────────────────────
  const [step, setStep] = useState<Step>('register');

  // ── Форма регистрации ────────────────────────────────────────────
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', confirmPassword: '',
  });
  const [showPassword,  setShowPassword]  = useState(false);
  const [captchaToken,  setCaptchaToken]  = useState<string | null>(null);

  // ── Шаг верификации ──────────────────────────────────────────────
  const [email,       setEmail]       = useState('');      // сохраняем email после регистрации
  const [otp,         setOtp]         = useState(['', '', '', '', '', '']); // 6 ячеек
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ── Общее ────────────────────────────────────────────────────────
  const [error,     setError]     = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendCd,  setResendCd]  = useState(0); // countdown для resend

  // ── Handlers: регистрация ────────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaToken) { setError('Подтвердите, что вы не робот'); return; }
    if (formData.password !== formData.confirmPassword) { setError('Пароли не совпадают'); return; }

    setError('');
    setIsLoading(true);
    try {
      await axios.post(`${SERVER_URL}/auth/register`, {
        username: formData.username,
        email:    formData.email,
        password: formData.password,
        "cf-turnstile-response": captchaToken,
      }, { withCredentials: true });

      // Переходим к шагу верификации
      setEmail(formData.email);
      setStep('verify');
      startResendCd();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Ошибка регистрации');
      setCaptchaToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Handlers: OTP ────────────────────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // только цифры
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    // Автопереход к следующей ячейке
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      otpRefs.current[5]?.focus();
    }
    e.preventDefault();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) { setError('Введите все 6 цифр'); return; }

    setError('');
    setIsLoading(true);
    try {
      const res = await axios.post(`${SERVER_URL}/auth/verify`,
        { email, code },
        { withCredentials: true }
      );
      const data = res.data;
      if (data?.accessToken) {
        auth.login(data.accessToken, data.user);
        router.push('/');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Неверный код');
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCd > 0) return;
    try {
      await axios.post(`${SERVER_URL}/auth/resend`, { email });
      startResendCd();
      setError('');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Ошибка отправки');
    }
  };

  const startResendCd = () => {
    setResendCd(60);
    const interval = setInterval(() => {
      setResendCd(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  // ── Левая колонка (одинакова для обоих шагов) ───────────────────
  const LeftPanel = () => (
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
            HARD<br /><span className="text-[#5a6e60]">MONITORING</span>
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
  );

  // ── ШАГ 1: Регистрация ──────────────────────────────────────────
  if (step === 'register') return (
    <div className="w-full max-w-[800px] max-h-[750px] min-h-[500px] bg-[#242424] border border-white/5 shadow-[0_25px_70px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col md:flex-row mc-slide-up">
      <LeftPanel />
      <div className="w-full md:w-[58%] flex flex-col p-10 md:p-14 bg-[#242424]">
        <header className="mb-8 space-y-2">
          <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Регистрация</h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.25em]">Создайте свой аккаунт</p>
        </header>

        <form className="space-y-4 flex-1" onSubmit={handleRegister}>
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

          <div className="flex justify-center py-2">
            {SITE_KEY ? (
              <Turnstile siteKey={SITE_KEY} onSuccess={setCaptchaToken} onExpire={() => setCaptchaToken(null)} options={{ theme: 'dark', size: 'normal' }} />
            ) : (
              <div className="text-[9px] text-zinc-600 uppercase border border-white/5 p-2">Загрузка CAPTCHA...</div>
            )}
          </div>

          {error && (
            <div className="bg-red-500/5 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase p-4 text-center tracking-widest">
              {error}
            </div>
          )}

          <button className="group w-full h-14 bg-white hover:bg-zinc-200 text-[#1a1a1a] font-bold text-sm uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 disabled:bg-zinc-800 disabled:text-zinc-600 active:scale-[0.98]"
            type="submit" disabled={isLoading || !captchaToken}>
            {isLoading ? "Создание..." : <>Зарегистрироваться <HiOutlineArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" /></>}
          </button>
        </form>

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

  // ── ШАГ 2: Верификация OTP ──────────────────────────────────────
  return (
    <div className="w-full max-w-[800px] min-h-[500px] bg-[#242424] border border-white/5 shadow-[0_25px_70px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col md:flex-row mc-slide-up">
      <LeftPanel />
      <div className="w-full md:w-[58%] flex flex-col p-10 md:p-14 bg-[#242424]">

        <button
          onClick={() => { setStep('register'); setError(''); setOtp(['','','','','','']); }}
          className="flex items-center gap-2 text-zinc-600 hover:text-white text-[10px] uppercase tracking-widest font-bold transition-colors mb-8 w-fit"
        >
          <HiArrowLeft className="w-3.5 h-3.5" /> Назад
        </button>

        <header className="mb-8 space-y-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-[#5a6e60]/20 p-2.5 border border-[#5a6e60]/30">
              <HiOutlineEnvelope className="w-5 h-5 text-[#5a6e60]" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Подтверждение</h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.15em] leading-relaxed">
            Код отправлен на<br />
            <span className="text-zinc-300">{email}</span>
          </p>
        </header>

        <form className="space-y-6 flex-1" onSubmit={handleVerify}>

          {/* 6 ячеек кода */}
          <div className="flex flex-col gap-3">
            <label className={labelStyle}>Код подтверждения</label>
            <div className="flex gap-2" onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => { otpRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(i, e)}
                  className="w-full h-14 text-center text-xl font-bold text-white bg-[#1a1a1a] border border-white/5 outline-none focus:border-[#5a6e60]/60 transition-all caret-[#5a6e60]"
                />
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-500/5 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase p-4 text-center tracking-widest">
              {error}
            </div>
          )}

          <button
            className="group w-full h-14 bg-white hover:bg-zinc-200 text-[#1a1a1a] font-bold text-sm uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 disabled:bg-zinc-800 disabled:text-zinc-600 active:scale-[0.98]"
            type="submit"
            disabled={isLoading || otp.join('').length < 6}
          >
            {isLoading ? "Проверка..." : <>Подтвердить <HiOutlineArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" /></>}
          </button>
        </form>

        {/* Повторная отправка */}
        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-zinc-600 text-[10px] uppercase tracking-widest font-bold mb-3">
            Не получили письмо?
          </p>
          <button
            onClick={handleResend}
            disabled={resendCd > 0}
            className="text-[10px] font-bold uppercase tracking-wider transition-colors disabled:text-zinc-700 enabled:text-white enabled:hover:text-[#5a6e60]"
          >
            {resendCd > 0 ? `Отправить снова (${resendCd}с)` : "Отправить снова"}
          </button>
        </div>
      </div>
    </div>
  );
}