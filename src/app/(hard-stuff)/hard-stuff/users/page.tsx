'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { HiUser, HiMail, HiChevronLeft, HiChevronRight, HiShieldCheck } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const limit = 25;

  const fetchUsers = async (currentPage: number) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/admin/users?page=${currentPage}&limit=${limit}`);
      setUsers(data.users || []);
      setTotalPages(data.pages || 1);
      setTotalUsers(data.total || 0);
    } catch (err) {
      console.error("Ошибка загрузки пользователей");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(page); }, [page]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* HEADER */}
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
            <span className="w-2 h-8 bg-orange-500"></span>
            База пользователей
          </h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">
            Управление участниками • Всего: {totalUsers}
          </p>
        </div>

        {/* ПАГИНАЦИЯ СВЕРХУ */}
        <div className="flex items-center gap-4 bg-white border border-slate-200 p-1.5 rounded-lg shadow-sm">
          <button 
            disabled={page === 1 || loading}
            onClick={() => setPage(p => p - 1)}
            className="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-md disabled:opacity-20 transition-all"
          >
            <HiChevronLeft size={20} />
          </button>
          
          <div className="px-2 flex flex-col items-center min-w-[80px]">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter leading-none">Страница</span>
            <span className="text-xs font-black text-slate-900 leading-none mt-1">{page} / {totalPages}</span>
          </div>

          <button 
            disabled={page === totalPages || loading}
            onClick={() => setPage(p => p + 1)}
            className="p-2 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded-md disabled:opacity-20 transition-all"
          >
            <HiChevronRight size={20} />
          </button>
        </div>
      </header>

      {/* ТАБЛИЦА */}
      <div className="bg-white border border-slate-200 shadow-sm overflow-hidden rounded-lg">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Пользователь</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Уникальный ID</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Дата регистрации</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">E-mail</th>
              <th className="px-6 py-4 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Роль</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <AnimatePresence mode="popLayout">
              {loading ? (
                <tr key="loading">
                  <td colSpan={5} className="py-20 text-center text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] animate-pulse">
                    Синхронизация данных...
                  </td>
                </tr>
              ) : users.map((user) => (
                <motion.tr
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  key={user._id}
                  className="group hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-500 group-hover:border-orange-200 transition-all">
                        <HiUser size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm uppercase">{user.username}</div>
                        <div className="text-[9px] font-mono text-slate-400 uppercase tracking-tight">Active User</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-[10px] bg-slate-50 px-2 py-1 rounded text-slate-400 font-mono">
                      {user._id}
                    </code>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-500">
                    {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <HiMail size={14} className="text-slate-300" />
                      <span className="text-xs font-bold">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${
                      user.role === 'admin' 
                        ? 'bg-purple-50 border-purple-100 text-purple-600' 
                        : 'bg-blue-50 border-blue-100 text-blue-600'
                    }`}>
                      {user.role === 'admin' && <HiShieldCheck size={12} />}
                      {user.role}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>

        {users.length === 0 && !loading && (
          <div className="py-20 text-center bg-white">
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">
              База данных пуста
            </p>
          </div>
        )}
      </div>
    </div>
  );
}