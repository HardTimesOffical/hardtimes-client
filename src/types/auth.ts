// src/types/auth.ts

export interface User {
  username: string;
  email: string;
  id: string;
  avatar?: string;
  bio?: string;
  // Добавьте сюда все остальные поля пользователя
}

export interface AuthContextType {
  user: User | null; // Пользователь либо объект User, либо null
  login: (userData: User) => void;
  logout: () => void;
  // Добавьте другие методы/свойства контекста
}