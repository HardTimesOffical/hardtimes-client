'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { HiOutlineCollection, HiPlus, HiOutlineTrash, HiOutlineCube, HiCheckCircle } from 'react-icons/hi';
import api from '@/lib/api';
import AddVersionModal from '@/app/components/project/AddVersionModal';
import ConfirmDeleteModal from '@/app/components/project/ConfirmDeleteModal';

export default function VersionsPage() {
  const { slug } = useParams();
  const [project, setProject] = useState<any>(null);
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteTitle, setDeleteTitle] = useState('');
  
  // Состояние для уведомления
  const [toast, setToast] = useState<{show: boolean, msg: string} | null>(null);

  const fetchData = async () => {
    try {
      const [projRes, versRes] = await Promise.all([
        api.get(`/projects/${slug}`),
        api.get(`/projects/${slug}/versions`).catch(() => ({ data: [] }))
      ]);
      setProject(projRes.data);
      setVersions(versRes.data);
    } catch (err) {
      console.error("Ошибка загрузки:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [slug]);

  // ФУНКЦИЯ УДАЛЕНИЯ
const confirmDelete = async () => {
    if (!deleteId) return;
    
    const id = deleteId;
    const oldVersions = [...versions];
    setVersions(versions.filter(v => v._id !== id));

    try {
      await api.delete(`/projects/versions/${id}`);
      setToast({ show: true, msg: "Версия удалена" });
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      setVersions(oldVersions);
      alert("Ошибка сервера");
    }
  };

  const askDelete = (id: string, name: string) => {
    setDeleteId(id);
    setDeleteTitle(name);
  };

  if (loading) return <div className="p-10 text-center text-orange-500 animate-pulse font-black uppercase tracking-widest">Загрузка...</div>;

  return (
    <div className="relative space-y-8 min-h-[500px]">
      
      {/* ВСплывающее уведомление (Toast) */}
      {toast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[200] animate-in fade-in slide-in-from-top-4">
          <div className="bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 backdrop-blur-md">
            <HiCheckCircle className="text-orange-500" size={20} />
            <span className="text-[11px] font-black uppercase tracking-wider">{toast.msg}</span>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-1 uppercase tracking-tight">Project Versions</h2>
          <p className="text-sm text-gray-400 font-semibold tracking-wide uppercase">Manage your releases</p>
        </div>
        
        {versions.length > 0 && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-gray-900 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-gray-200"
          >
            <HiPlus size={18} /> Add New Version
          </button>
        )}
      </div>

      {/* LIST */}
      {versions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 border-2 border-dashed border-gray-100 rounded-[3rem] animate-in fade-in">
          <HiOutlineCollection className="text-gray-200 mb-6" size={60} />
          <h3 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tight">No versions created</h3>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-5 rounded-[2rem] text-[12px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-orange-500/30 flex items-center gap-3"
          >
            <HiPlus size={20} /> Create version
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {versions.map((version) => (
            <div 
              key={version._id} 
              className="bg-white border-2 border-gray-50 p-6 rounded-[2.5rem] flex items-center justify-between group hover:border-orange-100 transition-all shadow-sm animate-in fade-in slide-in-from-bottom-2"
            >
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 group-hover:bg-orange-50 group-hover:text-orange-400 transition-colors">
                  <HiOutlineCube size={28} />
                </div>
                <div>
                  <h4 className="font-black text-gray-900 uppercase tracking-tight">{version.versionNumber}</h4>
                  <p className="text-[11px] text-gray-400 font-bold uppercase">
                    {new Date(version.createdAt).toLocaleDateString()} • {version.releaseType}
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => askDelete(version._id, version.versionNumber)} 
                className="p-4 text-gray-200 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
              >
                <HiOutlineTrash size={20} />
              </button>
            </div>
          ))}
        </div>
      )}

      <ConfirmDeleteModal 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title={deleteTitle}
      />

      {showAddModal && project && (
        <AddVersionModal 
          project={project} 
          onClose={() => setShowAddModal(false)} 
          onRefresh={fetchData}
        />
      )}
    </div>
  );
}