// src/types/auth.ts

export interface User {
  username: string;
  email: string;
  id: string;
  _id?: string;
  avatar?: string;
  bio?: string;
  balance: number;
  // Добавляем роль. Используем union type для строгости
  role: 'admin' | 'moderator' | 'user'; 
}

export interface AuthContextType {
  user: User | null; // Пользователь либо объект User, либо null
  login: (userData: User) => void;
  logout: () => void;
  // Добавьте другие методы/свойства контекста
}