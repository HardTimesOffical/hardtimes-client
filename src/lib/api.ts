import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}`,
  withCredentials: true,
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
    // Если сервер ответил 401 — это конец.
    if (error.response?.status === 401) {
      console.log("!!! API DETECTED 401 - KICKING USER !!!");
      
      if (typeof window !== 'undefined') {
        localStorage.clear(); // Удаляем ВСЁ
        window.location.href = '/login'; // Жесткая перезагрузка страницы
      }
    }
    return Promise.reject(error);
  }
);

export default api;