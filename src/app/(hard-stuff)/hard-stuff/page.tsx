'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { 
  HiCollection, HiUsers, HiLightningBolt, 
  HiCheckCircle, HiServer, HiExternalLink, HiStatusOnline 
} from 'react-icons/hi';
import Link from 'next/link';

interface DashboardStats {
  pendingProjects: number;
  totalProjects: number;
  totalUsers: number;
  totalServers: number;
  approvedToday: number;
}

interface RecentActivity {
  _id: string;
  title: string;
  owner: { username: string };
  createdAt: string;
  iconUrl?: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentProjects, setRecentProjects] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Загружаем статистику для карточек
      const { data: statsData } = await api.get('/admin/stats/overview');
      setStats(statsData);

      // 2. Загружаем последние проекты для очереди (берем первые 4)
      const { data: recentData } = await api.get('/admin/projects/pending');
      setRecentProjects(recentData.slice(0, 4));
      
    } catch (err) {
      console.error("Ошибка загрузки данных дашборда", err);
    } finally {
      setLoading(false);
    }
  };

  fetchDashboardData();
}, []);

  const statCards = [
    { name: 'На проверке', value: stats?.pendingProjects || 0, icon: HiLightningBolt, color: 'text-orange-500', bg: 'bg-orange-50' },
    { name: 'Проектов', value: stats?.totalProjects || 0, icon: HiCollection, color: 'text-blue-500', bg: 'bg-blue-50' },
    { name: 'Участников', value: stats?.totalUsers || 0, icon: HiUsers, color: 'text-purple-500', bg: 'bg-purple-50' },
    { name: 'Серверов', value: stats?.totalServers || 0, icon: HiServer, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* ПРИВЕТСТВИЕ */}
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
            System <span className="text-orange-500">Overview</span>
          </h1>
          <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mt-1">
            Контрольная панель • Мониторинг в реальном времени
          </p>
        </div>
        <div className="hidden md:block text-right">
          <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none">Last sync</div>
          <div className="text-xs font-mono text-gray-500">{new Date().toLocaleTimeString()}</div>
        </div>
      </header>

      {/* СЕТКА СТАТИСТИКИ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-10 h-10 ${item.bg} ${item.color} rounded-xl flex items-center justify-center`}>
                <item.icon size={20} />
              </div>
              <span className="text-[10px] font-black text-green-500 bg-green-50 px-2 py-1 rounded-md">Live</span>
            </div>
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">{item.name}</p>
            <h3 className="text-2xl font-black text-gray-900 leading-none">
              {loading ? "..." : item.value.toLocaleString()}
            </h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ЛЕВЫЙ БЛОК: Последние действия */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900">
                Очередь модерации
              </h3>
              <Link href="/hard-stuff/projects" className="text-[10px] font-black text-orange-500 uppercase hover:underline">
                Смотреть все
              </Link>
            </div>
            
            <div className="divide-y divide-gray-50">
              {recentProjects.length > 0 ? recentProjects.map((project) => (
                <div key={project._id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl overflow-hidden border border-gray-100">
                      {project.iconUrl && <img src={project.iconUrl} className="object-cover w-full h-full" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm uppercase">{project.title}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight mt-0.5">
                        От: {project.owner?.username} • {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Link 
                    href="/hard-stuff/projects" 
                    className="p-3 bg-gray-50 hover:bg-gray-900 hover:text-white rounded-xl transition-all"
                  >
                    <HiExternalLink size={18} />
                  </Link>
                </div>
              )) : (
                <div className="p-20 text-center text-gray-300 font-bold uppercase text-[10px] tracking-widest">
                  Нет новых заявок
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ПРАВЫЙ БЛОК: Статус системы */}
        <div className="space-y-6">
          <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-gray-200 relative overflow-hidden">
            {/* Декоративный элемент */}
            <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-orange-500/10 rounded-full blur-3xl"></div>
            
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-8 flex items-center gap-2">
              <HiStatusOnline className="text-orange-500" /> Инфраструктура
            </h3>
            
            <div className="space-y-6">
              {[
                { label: 'API Gateway', status: 'Operational', color: 'text-green-400' },
                { label: 'Asset Storage', status: 'Stable', color: 'text-green-400' },
                { label: 'Database Cluster', status: 'Stable', color: 'text-green-400' },
                { label: 'Auth Service', status: 'Stable', color: 'text-green-400' },
              ].map((sys, i) => (
                <div key={i} className="flex justify-between items-center border-b border-white/5 pb-4 last:border-0 last:pb-0">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-white/70">{sys.label}</span>
                  <span className={`text-[9px] font-black uppercase ${sys.color}`}>{sys.status}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/5">
              <p className="text-[9px] text-white/40 font-bold uppercase mb-2 tracking-widest">Сегодня одобрено</p>
              <div className="flex items-center gap-2">
                <HiCheckCircle className="text-emerald-500" size={16} />
                <span className="text-xl font-black">{stats?.approvedToday || 0}</span>
                <span className="text-[10px] text-white/30 uppercase ml-auto">проектов</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}