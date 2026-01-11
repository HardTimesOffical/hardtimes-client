"use client";
import React, { useState } from 'react';
import axios from 'axios';
import styles from './auth.module.css';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Registration() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
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

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
            
            // 1. Регистрация
            await axios.post(
                `${SERVER_URL}/auth/register`,
                {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                },
                { withCredentials: true }
            );

            // 2. Авто-логин
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

            setSuccess('Успешная Регистрация!');
            router.push('/');
        } catch (err: any) {
            const message = err?.response?.data?.message || err.message || 'Unexpected error';
            setError(message);
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h2 className={styles.heading}>Создать аккаунт</h2>
                <p className={styles.subheading}>Присоединяйся к нам прямо сейчас!</p>
            </header>

            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.field}>
                    <label className={styles.label} htmlFor="username">Логин</label>
                    <input
                        className={styles.input}
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Вася228"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label} htmlFor="email">Email</label>
                    <input
                        className={styles.input}
                        type="email"
                        id="email"
                        name="email"
                        placeholder="steve@minecraft.net"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label} htmlFor="password">Пароль</label>
                    <div className={styles.inputWrap}>
                        <input
                            className={styles.input}
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            className={styles.eyeButton}
                            onClick={() => setShowPassword(s => !s)}
                        >
                            {showPassword ? '🔒' : '👁️'}
                        </button>
                    </div>
                </div>

                <div className={styles.field}>
                    <label className={styles.label} htmlFor="confirmPassword">Подтвердите пароль</label>
                    <div className={styles.inputWrap}>
                        <input
                            className={styles.input}
                            type={showConfirm ? 'text' : 'password'}
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            className={styles.eyeButton}
                            onClick={() => setShowConfirm(s => !s)}
                        >
                            {showConfirm ? '🔒' : '👁️'}
                        </button>
                    </div>
                </div>

                {error && <div className={styles.errorBox}>{error}</div>}
                {success && <div className={styles.successBox}>{success}</div>}

                <button className={styles.submit} type="submit">
                   Продолжить
                </button>

                <footer className={styles.footer}>
                    <span>Уже есть аккаунт?</span>
                    <Link href="/login" className={styles.link}>Войти</Link>
                </footer>
            </form>
        </div>
    );
}