"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/api";
import { User } from "@/types/auth";
import Cookies from "js-cookie";

interface AuthContextValue {
  accessToken: string | null;
  user: User | null;
  setAccessToken: (token: string | null) => void;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (newData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const router = useRouter();

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

  // Вспомогательная функция для обновления и стейта, и хранилищ
  const updateUser = (newData: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      const updated = { ...prevUser, ...newData };
      localStorage.setItem("user", JSON.stringify(updated));
      // Если обновилась роль, синхронизируем куки
      if (newData.role) Cookies.set('userRole', newData.role, { expires: 7 });
      return updated;
    });
  };

  const clearAuthData = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    Cookies.remove('userRole');
    Cookies.remove('accessToken');
    setAccessTokenState(null);
    setUser(null);
  };

  // Эффект синхронизации токена
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      Cookies.set('accessToken', accessToken, { expires: 7 });
    } else {
      clearAuthData();
    }
  }, [accessToken]);

  // Проверка сессии при загрузке
  useEffect(() => {
    const checkSession = async () => {
      if (!accessToken) return;
      try {
        const { data } = await api.get('/users/me'); 
        setUser(data); 
        localStorage.setItem("user", JSON.stringify(data));
        if (data.role) Cookies.set('userRole', data.role, { expires: 7 });
      } catch (err: any) {
        if (err.response?.status === 401) {
          clearAuthData();
          router.push('/');
        }
      }
    };
    checkSession();
  }, [accessToken, router]);

  // Синхронизация логаута между вкладками
  useEffect(() => {
    const syncLogout = (event: StorageEvent) => {
      if (event.key === 'accessToken' && !event.newValue) {
        clearAuthData();
        router.push('/');
      }
    };
    window.addEventListener('storage', syncLogout);
    return () => window.removeEventListener('storage', syncLogout);
  }, [router]);

  const login = (token: string, userObj: User) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("user", JSON.stringify(userObj));
    Cookies.set('userRole', userObj.role, { expires: 7 });
    Cookies.set('accessToken', token, { expires: 7 });
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