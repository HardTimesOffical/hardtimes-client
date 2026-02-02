'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { HiDownload, HiX, HiOutlineDocumentText, HiUser } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

// --- ТИПИЗАЦИЯ ---
interface Version {
  _id: string;
  versionNumber: string;
  name?: string;
  fileUrl: string;
  fileSize: number;
  loaders: string[];
  gameVersions: string[];
  releaseType: 'release' | 'beta' | 'alpha';
}

interface Project {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  projectType: string;
  gameType: string;
  status: 'under_review' | 'approved' | 'rejected' | 'draft' | 'archived';
  iconUrl?: string;
  categories: string[];
  tags: string[];
  owner: {
    _id: string;
    username: string;
    avatarUrl?: string;
  };
  monetization: {
    isPaid: boolean;
    price: number;
  };
  license?: string;
  gallery: Array<{ url: string }>;
  versions: Version[];
  createdAt: string;
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // 1. Загрузка проектов "на рассмотрении"
const fetchProjects = async () => {
    try {
      // Обновленный путь согласно твоим требованиям
      const { data } = await api.get('/admin/projects/pending'); 
      setProjects(data);
    } catch (err) {
      console.error("Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  // 2. Функция принудительного скачивания (решает проблему открытия в новой вкладке)
  const downloadFile = async (url: string, fileName: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      // Если CORS блокирует fetch, просто открываем в новом окне
      window.open(url, '_blank');
    }
  };

  // 3. Функция смены статуса
 const handleAction = async (id: string, action: 'approve' | 'reject') => {
    if (action === 'reject' && !rejectReason) {
      alert("Пожалуйста, укажите причину отказа");
      return;
    }

    try {
      // ПУТЬ ИЗМЕНЕН НА /admin/projects/...
      await api.patch(`/admin/projects/${id}/status`, { 
        status: action === 'approve' ? 'approved' : 'rejected',
        moderationComment: action === 'reject' ? rejectReason : '' 
      });
      
      setProjects(prev => prev.filter(p => p._id !== id));
      setSelectedProject(null);
      setIsRejecting(false);
      setRejectReason('');
    } catch (err) {
      alert("Ошибка при обновлении статуса");
    }
  };

  const closeModal = () => {
    setSelectedProject(null);
    setIsRejecting(false);
    setRejectReason('');
  };

  return (
<div className="max-w-6xl mx-auto p-6">
  <header className="mb-8 flex justify-between items-end">
    <div>
      <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
        <span className="w-2 h-8 bg-orange-500"></span>
        Панель модерации
      </h1>
      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">
        Система управления контентом • Очередь: {projects.length}
      </p>
    </div>
    <div className="text-right">
       <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Server Status: Online</span>
    </div>
  </header>

  {/* ТАБЛИЦА */}
  <div className="bg-white border border-slate-200 shadow-sm overflow-hidden rounded-lg">
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-slate-50 border-b border-slate-200">
          <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Проект</th>
          <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Автор</th>
          <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Дата подачи</th>
          <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Тип / Игра</th>
          <th className="px-6 py-4 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Статус</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        <AnimatePresence mode="popLayout">
          {projects.map((project) => (
            <motion.tr
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key={project._id}
              onClick={() => setSelectedProject(project)}
              className="group hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded border border-slate-200 flex-shrink-0 overflow-hidden">
                    {project.iconUrl ? (
                      <img src={project.iconUrl} alt="" className="object-cover w-full h-full" />
                    ) : (
                      <HiOutlineDocumentText size={20} className="m-auto h-full text-slate-300" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{project.title}</div>
                    <div className="text-[9px] font-mono text-slate-400 uppercase tracking-tight">{project.slug}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                    <HiUser size={12} />
                  </div>
                  <span className="text-xs font-bold text-slate-600">{project.owner?.username}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-xs font-medium text-slate-500">
                  {new Date(project.createdAt).toLocaleDateString('ru-RU')}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-slate-700 uppercase">{project.projectType}</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{project.gameType}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-100 rounded text-amber-600 text-[9px] font-black uppercase tracking-widest">
                  <span className="w-1 h-1 bg-amber-500 rounded-full animate-pulse"></span>
                  На проверке
                </div>
              </td>
            </motion.tr>
          ))}
        </AnimatePresence>
      </tbody>
    </table>

    {projects.length === 0 && !loading && (
      <div className="py-20 text-center bg-white">
        <div className="inline-flex p-4 bg-slate-50 rounded-full mb-4">
            <HiOutlineDocumentText size={32} className="text-slate-300" />
        </div>
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">
          Очередь обработки пуста
        </p>
      </div>
    )}
  </div>


      {/* МОДАЛЬНОЕ ОКНО */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" 
            />
            
            <motion.div 
              initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }}
              className="relative bg-white w-full max-w-4xl rounded-[1.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <div className="flex gap-3 items-center">
                  <img src={selectedProject.iconUrl || '/placeholder.png'} className="w-10 h-10 rounded-lg object-cover" alt="" />
                  <div>
                    <h2 className="text-sm font-black uppercase tracking-tight leading-none">{selectedProject.title}</h2>
                    <p className="text-[9px] font-bold text-gray-400 uppercase mt-1">Автор: {selectedProject.owner?.username} • ID: {selectedProject.owner?._id}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedProject(null)} className="p-2 hover:bg-slate-50 rounded-lg transition-all">
                  <HiX size={18} className="text-gray-400"/>
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-3">
                <div className="lg:col-span-2 p-6 space-y-6 border-r border-gray-50 bg-white">
                  <section>
                    <h4 className="text-[9px] font-black uppercase text-gray-400 mb-3 tracking-widest">Описание проекта</h4>
                    <article 
                      className="prose prose-sm max-w-full text-[13px] text-slate-600 leading-relaxed break-words whitespace-pre-wrap prose-img:rounded-xl"
                      dangerouslySetInnerHTML={{ __html: selectedProject.description || '<i>Описание отсутствует</i>' }}
                    />
                  </section>

                  {selectedProject.gallery?.length > 0 && (
                    <section>
                      <h4 className="text-[9px] font-black uppercase text-gray-400 mb-3 tracking-widest">Галерея</h4>
                      <div className="grid grid-cols-4 gap-2">
                        {selectedProject.gallery.map((img, i) => (
                          <img key={i} src={img.url} className="aspect-video object-cover rounded-lg border border-gray-100" alt="" />
                        ))}
                      </div>
                    </section>
                  )}
                </div>

                <div className="p-6 bg-slate-50/30 space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-[9px] font-black uppercase text-gray-400 mb-2 tracking-widest">Техническая информация</h4>
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-gray-400 uppercase">Игра:</span>
                      <span className="text-slate-900 uppercase">{selectedProject.gameType}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-gray-400 uppercase">Коммерция:</span>
                      <span className={selectedProject.monetization?.isPaid ? "text-emerald-600" : "text-slate-900 uppercase"}>
                        {selectedProject.monetization?.isPaid ? `$${selectedProject.monetization.price}` : 'БЕСПЛАТНО'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <h4 className="text-[9px] font-black uppercase text-gray-400 mb-3 tracking-widest">Версии и файлы</h4>
                    <div className="space-y-2">
                      {selectedProject.versions?.map((v) => (
                        <div key={v._id} className="p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-black">v{v.versionNumber}</span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadFile(v.fileUrl, `${selectedProject.slug}-v${v.versionNumber}.jar`);
                              }}
                              className="p-1.5 bg-blue-50 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all"
                              title="Скачать файл"
                            >
                              <HiDownload size={14} />
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {v.loaders?.map(l => (
                              <span key={l} className="px-1.5 py-0.5 bg-slate-800 text-white text-[7px] font-black rounded-sm uppercase tracking-tighter">{l}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                      {(!selectedProject.versions || selectedProject.versions.length === 0) && (
                        <p className="text-[10px] text-gray-400 italic">Версии не загружены</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 py-6 border-t border-slate-100 bg-white">
                <AnimatePresence mode="wait">
                  {!isRejecting ? (
                    <motion.div 
                      key="actions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                      className="flex justify-end gap-4"
                    >
                      <button 
                        onClick={() => setIsRejecting(true)}
                        className="px-8 py-3.5 text-slate-400 hover:text-red-500 font-black text-[11px] uppercase tracking-widest transition-colors"
                      >
                        Отклонить проект
                      </button>
                      <button 
                        onClick={() => handleAction(selectedProject._id, 'approve')}
                        className="px-12 py-3.5 bg-slate-900 hover:bg-orange-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-200"
                      >
                        Одобрить публикацию
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="reject-form" 
                      initial={{ opacity: 0, scale: 0.95 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-red-50/50 border border-red-100 p-5 rounded-[1.5rem] space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-red-600">

                          <span className="text-[11px] font-black uppercase tracking-widest">Причина отклонения</span>
                        </div>
                        <span className="text-[9px] font-bold text-red-400 uppercase tracking-tighter">Обязательное поле</span>
                      </div>

                      <textarea 
                        autoFocus
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Опишите детально, что пользователю нужно исправить (например: 'Низкое качество проекта' или 'Файл содержит ошибки')..."
                        className="w-full p-4 bg-white border border-red-100 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-red-50 focus:border-red-200 outline-none transition-all min-h-[120px] resize-none shadow-inner"
                      />

                      <div className="flex justify-end gap-3 pt-2">
                        <button 
                          onClick={() => {
                            setIsRejecting(false);
                            setRejectReason('');
                          }}
                          className="px-6 py-2.5 text-[10px] font-black uppercase text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          Отмена
                        </button>
                        <button 
                          onClick={() => handleAction(selectedProject._id, 'reject')}
                          disabled={!rejectReason.trim()}
                          className="px-8 py-2.5 bg-red-600 disabled:bg-red-300 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-200 hover:bg-red-700 transition-all active:scale-95"
                        >
                          Подтвердить и отправить
                        </button>
                      </div>
                  </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}