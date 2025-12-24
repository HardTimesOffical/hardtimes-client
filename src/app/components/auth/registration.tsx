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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        try {
            // Register
            await axios.post(
                'http://localhost:5000/auth/register',
                {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                },
                { withCredentials: true }
            );

            // Auto-login to receive tokens (refresh cookie) and accessToken
            const loginRes = await axios.post(
                'http://localhost:5000/auth/login',
                { email: formData.email, password: formData.password },
                { withCredentials: true }
            );

            const data = loginRes.data;
            if (data && data.accessToken) {
                // use context to set token and user
                try {
                    const user = data.user || { id: data.id, email: formData.email, username: formData.username };
                    auth.login(data.accessToken, user);
                } catch {
                    localStorage.setItem('accessToken', data.accessToken);
                }
            }

            setSuccess('Registration successful!');
            setFormData({ username: '', email: '', password: '', confirmPassword: '' });
            try {
                router.push('/');
            } catch {}
        } catch (err: any) {
            console.error('Registration error', err);
            if (err?.response) {
                console.error('Response status:', err.response.status);
                console.error('Response data:', err.response.data);
            }
            const message = err?.response?.data?.message || err.message || 'Unexpected error';
            setError(message);
        }
    };

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const auth = useAuth();
    const router = useRouter();

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Create Account</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div>
                    <label className={styles.label} htmlFor="username">Username:</label>
                    <input
                        className={styles.input}
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label className={styles.label} htmlFor="email">Email:</label>
                    <input
                        className={styles.input}
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label className={styles.label} htmlFor="password">Password:</label>
                    <div className={styles.inputWrap}>
                        <input
                            className={styles.input}
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            className={styles.eyeButton}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            onClick={() => setShowPassword(s => !s)}
                        >
                            {showPassword ? '👁️' : '👁'}
                        </button>
                    </div>
                </div>

                <div>
                    <label className={styles.label} htmlFor="confirmPassword">Confirm Password:</label>
                    <div className={styles.inputWrap}>
                        <input
                            className={styles.input}
                            type={showConfirm ? 'text' : 'password'}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            className={styles.eyeButton}
                            aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                            onClick={() => setShowConfirm(s => !s)}
                        >
                            {showConfirm ? '👁️' : '👁'}
                        </button>
                    </div>
                </div>

                {error && <p className={styles.error}>{error}</p>}
                {success && <p className={styles.footer}>{success}</p>}

                <div className={styles.actions}>
                    <div className={styles.oauth}>
                        <button type="button" aria-label="Sign in with Google" className={styles.oauthButton}>G</button>
                        <button type="button" aria-label="Sign in with Apple" className={styles.oauthButton}>A</button>
                    </div>

                    <div className={styles.signupWrap}>
                        <button className={styles.submit} type="submit">Sign Up</button>
                    </div>
                </div>
                <Link href="/login">Already have an account?</Link>
            </form>
        </div>
    );
}