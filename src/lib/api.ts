// lib/api.ts
import axios from 'axios';
import Cookies from 'js-cookie';
import { refreshAccessToken } from '../lib/refresh';


const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true // Важно для передачи Refresh-куки на бэкенд
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
  async (error) => {
    const originalRequest = error.config;

    // Если 401 и мы еще не пытались обновить токен (retry)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();
        if (newToken) {
          // 1. Сохраняем новый токен
          localStorage.setItem('accessToken', newToken);
          Cookies.set('accessToken', newToken, { expires: 7 });
          
          // 2. Обновляем заголовок в упавшем запросе и повторяем его
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Если даже рефреш сдох — тогда полный логаут
        if (typeof window !== 'undefined') {
          localStorage.clear();
          Cookies.remove('accessToken');
          Cookies.remove('userRole');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;