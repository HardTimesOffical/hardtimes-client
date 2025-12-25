"use client";
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import styles from "./dashboard.module.css";
import { User } from '@/types/auth';
import api from '@/lib/api';

export default function UserCard() { 
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !auth.user) return;

    const fetchUser = async () => {
      try {
        // api сам подставит токен и сам выкинет из аккаунта при 401
        const res = await api.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/${auth.user!.username}`);
        setUser(res.data);
      } catch (error) {
        console.error(error);
        // Если здесь упадет 401, handleGlobalLogout в api.ts сработает автоматически
      }
    };

    fetchUser();
  }, [mounted, auth.user]);

  if (!mounted || !auth.user) {
    return null;
  }

  // Теперь TypeScript не ругается
  const { username } = auth.user;

  if (!user) {
    return (
      <div className={styles.profile}>
        <div className={styles.avatar}></div>
        <div className={styles.infoSkeleton}>
          <div className={styles.line}></div>
          <div className={styles.lineShort}></div>
        </div>
      </div>
    );
  }

  const avatarSrc = user.avatar || "/avatar.png";
  const firstLetter = user.username ? user.username.charAt(0).toUpperCase() : "?";

  return (
    <Link href={`/profile/${user.username}`} className={styles.profileLink}>
      <div className={styles.profile}>
        {user.avatar ? (
          <img 
            src={user.avatar} 
            alt="User Avatar" 
            className={styles.avatar} 
          />
        ) : (
          <div className={styles.avatarPlaceholder}>
            {firstLetter}
          </div>
        )}
        <div className={styles.profileInfo}>
          <div className={styles.name}>{user.username}</div>
          <span className={styles.email}>{user.email}</span>
        </div>
      </div>
    </Link>
  );
}
