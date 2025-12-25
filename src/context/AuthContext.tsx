"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Для App Router
import api from "../lib/api";
import { User } from "@/types/auth";

interface AuthContextValue {
  accessToken: string | null;
  user: User | null;
  setAccessToken: (token: string | null) => void;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (newData: Partial<User>) => void; // Добавляем эту строку
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const router = useRouter();
  
  const updateUser = (newData: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      const updated = { ...prevUser, ...newData };
      // Сохраняем в localStorage, чтобы после перезагрузки данные остались
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  };
  
  const [accessToken, setAccessTokenState] = useState<string | null>(() => {
    if (typeof window !== "undefined") return localStorage.getItem("accessToken");
    return null;
  });

  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("user");
      try { return raw ? JSON.parse(raw) : null; } catch { return null; }
    }
    return null;
  });

  // Внутренняя функция для ПОЛНОЙ очистки (и стейта и хранилища)
  const clearAuthData = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setAccessTokenState(null);
    setUser(null);
  };

  useEffect(() => {
    if (accessToken) localStorage.setItem("accessToken", accessToken);
    else localStorage.removeItem("accessToken");
  }, [accessToken]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

useEffect(() => {
  const checkSession = async () => {
    if (!accessToken) return;

    try {
      await api.get('/users/me'); 
    } catch (err: any) {
      if (err.response?.status === 401) {
        console.log("Token is invalid, clearing state...");
        // ОБНУЛЯЕМ СОСТОЯНИЕ (Интерфейс сразу изменится)
        setAccessTokenState(null);
        setUser(null);
        localStorage.clear();
        router.push('/');
      }
    }
  };

  checkSession();
}, [accessToken]);

  // Синхронизация между вкладками
  useEffect(() => {
    const syncLogout = (event: StorageEvent) => {
      if (event.key === 'accessToken' && !event.newValue) {
        clearAuthData();
        router.push('/');
      }
    };
    window.addEventListener('storage', syncLogout);
    return () => window.removeEventListener('storage', syncLogout);
  }, []);

  const login = (token: string, userObj: User) => {
    setAccessTokenState(token);
    setUser(userObj);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) { /* ignore */ }
    clearAuthData();
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ accessToken, user, setAccessToken: setAccessTokenState, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};