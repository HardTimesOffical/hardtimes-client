'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiCollection, HiUsers, HiServer, HiChartBar, HiArrowLeft, HiMenuAlt2, HiX } from 'react-icons/hi';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from "@/context/AuthContext";
import api from '@/lib/api';
import { User } from '@/types/auth';

// --- МИНИ-КОМПОНЕНТ КАРТОЧКИ ПОЛЬЗОВАТЕЛЯ ---
function AdminUserCard() {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || !auth.user) return;
    const fetchUser = async () => {
      try {
        const res = await api.get(`/users/${auth.user!.username}`);
        setUser(res.data);
      } catch (error) { console.error(error); }
    };
    fetchUser();
  }, [mounted, auth.user]);

  if (!mounted || !auth.user) return null;

  if (!user) {
    return (
      <div className="flex items-center gap-3 p-3 animate-pulse">
        <div className="w-9 h-9 bg-gray-100 rounded-full" />
        <div className="space-y-2">
          <div className="w-20 h-2 bg-gray-100 rounded" />
          <div className="w-24 h-2 bg-gray-50 rounded" />
        </div>
      </div>
    );
  }

  return (
    <Link href={`/profile/${user.username}`} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-2xl transition-all group">
      {user.avatar ? (
        <img src={user.avatar} className="w-9 h-9 rounded-full object-cover border border-gray-100" alt="" />
      ) : (
        <div className="w-9 h-9 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
          {user.username.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-black text-gray-900 truncate uppercase tracking-tight">{user.username}</p>
        <p className="text-[9px] text-gray-400 truncate tracking-tighter">{user.email}</p>
      </div>
    </Link>
  );
}

// --- ОСНОВНОЙ ЛЕЙАУТ ---
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => { setIsMobileOpen(false); }, [pathname]);

  const menuItems = [
    { name: 'Дашборд', href: '/hard-stuff', icon: HiChartBar },
    { name: 'Проекты', href: '/hard-stuff/projects', icon: HiCollection },
    { name: 'Пользователи', href: '/hard-stuff/users', icon: HiUsers },
    { name: 'Серверы', href: '/hard-stuff/servers', icon: HiServer },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[110] lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside className={`
        fixed inset-y-0 left-0 z-[120] w-72 bg-white border-r border-gray-100 flex flex-col 
        transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-10">
            {/* ССЫЛКА НА ЛОГОТИПЕ */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 bg-gray-900 rounded-xl flex items-center justify-center text-white font-black text-xs group-hover:bg-orange-500 transition-colors">H</div>
              <span className="font-black text-[11px] uppercase tracking-[0.2em] text-gray-900">Hard Stuff</span>
            </Link>
            <button onClick={() => setIsMobileOpen(false)} className="lg:hidden p-2 text-gray-400">
              <HiX size={20} />
            </button>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-gray-900 text-white shadow-lg shadow-gray-200' 
                      : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="text-[11px] font-black uppercase tracking-widest">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* НИЖНЯЯ ЧАСТЬ САЙДБАРА С КАРТОЧКОЙ ПОЛЬЗОВАТЕЛЯ */}
        <div className="p-4 border-t border-gray-50 space-y-4">
          <AdminUserCard />
          <Link href="/" className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-orange-500 transition-colors">
            <HiArrowLeft /> Вернуться на сайт
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="lg:hidden bg-white border-b border-gray-100 p-4 flex items-center justify-between">
           <button onClick={() => setIsMobileOpen(true)} className="p-2 bg-gray-50 rounded-lg text-gray-900">
             <HiMenuAlt2 size={24} />
           </button>
           <span className="font-black text-[10px] uppercase tracking-widest text-gray-400">Админ-центр</span>
        </header>

        <main className="flex-1 p-4 lg:p-10 overflow-y-auto bg-[#F8F9FA]">
          {children}
        </main>
      </div>
    </div>
  );
}