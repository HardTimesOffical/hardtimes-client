'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; // Добавили useRouter
import { 
  HiOutlineCollection, HiPlus, HiOutlineTrash, 
  HiOutlineCube, HiCheckCircle, HiExclamationCircle 
} from 'react-icons/hi';
import api from '@/lib/api';
import AddVersionModal from '@/app/components/project/AddVersionModal';
import ConfirmDeleteModal from '@/app/components/project/ConfirmDeleteModal';
import { useProject } from  '../ProjectContext'; // Импортируем хук для доступа к контексту проектаы

export default function VersionsPage() {
  const { setVersionsCount } = useProject();
  const { slug } = useParams();
  const router = useRouter(); // Инициализируем роутер
  const { updateProject } = useProject();
  
  const [project, setProject] = useState<any>(null);
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteTitle, setDeleteTitle] = useState('');
  
  const [toast, setToast] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const fetchData = async () => {
    try {
      const [projRes, versRes] = await Promise.all([
        api.get(`/projects/${slug}`),
        api.get(`/projects/${slug}/versions`)
      ]);
      setProject(projRes.data);
      setVersions(versRes.data);
      setVersionsCount(versRes.data.length);

      // Синхронизируем данные проекта с контекстом лайаута
      updateProject(projRes.data);
      
      // ГОВОРИМ ЛАЙАУТУ ОБНОВИТЬСЯ (чтобы он пересчитал versions.length)
      router.refresh(); 
      
    } catch (err) {
      console.error("Ошибка загрузки:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [slug]);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

 const confirmDelete = async () => {
  if (!deleteId) return;
  
  const id = deleteId;
  const oldVersions = [...versions];
  const newVersions = versions.filter(v => v._id !== id); // Сохраняем новый массив
  
  setVersions(newVersions);
  setDeleteId(null);

  try {
    await api.delete(`/projects/versions/${id}`);
    showToast('success', 'Версия успешно удалена');

    setVersionsCount(newVersions.length);
 
    router.refresh(); 
    
  } catch (err: any) {
    // Если ошибка — возвращаем всё назад
    setVersions(oldVersions);
    setVersionsCount(oldVersions.length); 
    showToast('error', 'Ошибка при удалении версии');
  }
};

  const askDelete = (id: string, name: string) => {
    setDeleteId(id);
    setDeleteTitle(name);
  };

  // Этот метод будет вызываться из AddVersionModal после успешной загрузки
  const handleRefresh = () => {
    fetchData();
    setShowAddModal(false);
  };

  if (loading) return (
    <div className="p-20 text-center animate-pulse text-[var(--muted)] text-xs font-bold uppercase tracking-widest">
      Загрузка версий...
    </div>
  );

  return (
    <div className="relative space-y-10 min-h-screen pb-20 animate-in fade-in duration-500">
      
      {/* Toast */}
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300 px-4 w-full max-w-max">
          <div className={`px-5 py-2.5 rounded-lg shadow-2xl flex items-center gap-3 border backdrop-blur-md ${
            toast.type === 'success' ? 'bg-[var(--foreground)] border-[var(--border)] text-[var(--background)]' : 'bg-red-500 border-red-600 text-white'
          }`}>
            {toast.type === 'success' ? <HiCheckCircle className="text-[var(--accent)]" size={18} /> : <HiExclamationCircle size={18} />}
            <span className="text-[10px] font-black uppercase tracking-wider">{toast.msg}</span>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[var(--border)] pb-8">
        <div>
          <h2 className="text-2xl font-black text-[var(--foreground-bright)] mb-1 uppercase tracking-tight">Версии проекта</h2>
          <p className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-widest">Список всех релизов и обновлений</p>
        </div>
        
        {versions.length > 0 && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-[var(--foreground)] hover:bg-[var(--accent)] text-[var(--background)] px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
          >
            <HiPlus size={16} /> Новая версия
          </button>
        )}
      </header>

      {/* LIST */}
      {versions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-[var(--surface)] border border-dashed border-[var(--border)] rounded-3xl animate-in zoom-in-95 duration-500">
          <HiOutlineCollection className="text-[var(--muted)] opacity-20 mb-6" size={64} />
          <h3 className="text-sm font-black text-[var(--foreground)] mb-6 uppercase tracking-widest">Нет доступных версий</h3>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-[var(--accent)] hover:brightness-110 text-[var(--contrast-text)] px-10 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-[var(--accent)]/10 flex items-center gap-3 active:scale-95"
          >
            <HiPlus size={18} /> Создать новую версию
          </button>
        </div>
      ) : (
        <div className="grid gap-5">
          {versions.map((version) => (
            <div 
            key={version._id} 
            className="
              bg-[var(--card)] border border-[var(--border)] p-6 rounded-2xl 
              flex items-center justify-between 
              transition-all duration-300 ease-out
              hover:border-[var(--muted)]/30 
              hover:-translate-y-1 
              hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]
              group animate-in fade-in slide-in-from-bottom-2
            "
          >
            <div className="flex items-center gap-6">
              <div className="
                w-14 h-14 bg-[var(--surface)] border border-[var(--border)] rounded-xl 
                flex items-center justify-center text-[var(--muted)] 
                group-hover:text-[var(--accent)] group-hover:border-[var(--accent)]/30
                transition-all duration-300
              ">
                <HiOutlineCube size={28} />
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-black text-[var(--foreground-bright)] uppercase tracking-tight text-base">
                    {version.versionNumber}
                  </h4>
                  <span className={`text-[9px] px-2.5 py-0.5 rounded-md font-black uppercase ${
                      version.releaseType === 'release' ? 'bg-green-500/10 text-green-500' : 
                      version.releaseType === 'beta' ? 'bg-blue-500/10 text-blue-500' : 'bg-orange-500/10 text-orange-500'
                  }`}>
                      {version.releaseType}
                  </span>
                </div>
                <p className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-wider">
                  {new Date(version.createdAt).toLocaleDateString('ru-RU')}
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => askDelete(version._id, version.versionNumber)} 
              className="
                p-4 text-[var(--muted)] 
                hover:text-red-500 hover:bg-red-500/5 
                rounded-xl transition-all border border-transparent 
                hover:border-red-500/10
              "
              title="Удалить версию"
            >
              <HiOutlineTrash size={20} />
            </button>
          </div>
          ))}
        </div>
      )}

      {/* MODALS */}
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
          onRefresh={handleRefresh} // Используем обновленный метод
        />
      )}
    </div>
  );
}