import axios from 'axios';
import Cookies from 'js-cookie'; // Не забудь установить: npm install js-cookie

const api = axios.create({
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
        
        console.log("!!! API DETECTED 401 - CLEARING SESSION !!!");
        
        // 1. Очищаем LocalStorage
        localStorage.clear();

        // 2. Очищаем Куки (важно для Middleware!)
        Cookies.remove('accessToken');
        Cookies.remove('userRole');

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
  return data;
};