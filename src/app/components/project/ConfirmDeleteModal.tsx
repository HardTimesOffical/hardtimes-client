'use client';
import { HiOutlineExclamation } from 'react-icons/hi';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, title }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[var(--card)] w-full max-w-sm rounded-2xl shadow-2xl border border-[var(--border)] overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 text-center">
          {/* Иконка предупреждения */}
          <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center mx-auto mb-6 border border-red-500/20">
            <HiOutlineExclamation size={32} />
          </div>
          
          <h3 className="text-xl font-black text-[var(--foreground-bright)] uppercase tracking-tight mb-2">
            Удалить версию?
          </h3>
          <p className="text-[11px] text-[var(--muted)] font-bold uppercase tracking-wide px-4 mb-8 leading-relaxed">
            Вы собираетесь удалить <span className="text-[var(--foreground)]">{title}</span>. 
            <br />Это действие нельзя отменить.
          </p>

          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] text-[var(--muted)] bg-[var(--surface)] hover:text-[var(--foreground)] hover:bg-[var(--border)] transition-all border border-[var(--border)]"
            >
              Отмена
            </button>
            <button 
              onClick={() => { onConfirm(); onClose(); }}
              className="flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all active:scale-95"
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}