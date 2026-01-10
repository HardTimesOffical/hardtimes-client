import axios from 'axios';
import { useState } from 'react';

const api = axios.create({
  // Берем URL из .env.local
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        const isLoginPage = window.location.pathname === '/login';
        const token = localStorage.getItem('accessToken');

        // Если токена и так нет, и мы на логине — ничего не делаем
        if (isLoginPage && !token) {
          return Promise.reject(error);
        }

        console.log("!!! API DETECTED 401 - REDIRECTING !!!");
        localStorage.clear();

        // Редирект только если мы НЕ на странице логина
        if (!isLoginPage) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);


export default api;

export const getMe = async () => {
  const { data } = await api.get('/users/me');
  return data; // Здесь будет твой IUser с полем balance
};