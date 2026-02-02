'use client';
import { HiOutlineExclamation, HiX } from 'react-icons/hi';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, title }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <HiOutlineExclamation size={32} />
          </div>
          
          <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">Удалить версию?</h3>
          <p className="text-sm text-gray-400 font-medium px-4 mb-8">
            Вы собираетесь удалить <span className="text-gray-900 font-bold">{title}</span>. Это действие нельзя отменить.
          </p>

          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-all"
            >
              Отмена
            </button>
            <button 
              onClick={() => { onConfirm(); onClose(); }}
              className="flex-1 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all"
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}