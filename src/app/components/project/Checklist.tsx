'use client';

import { 
  HiChevronUp, HiChevronDown, HiArrowRight, HiPaperAirplane, 
  HiCheck, HiExclamationCircle, HiPhotograph, HiDocumentText, 
  HiHashtag, HiCube, HiClock, HiRefresh 
} from 'react-icons/hi';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useMemo, useEffect } from 'react';
import api from '@/lib/api';

export default function Checklist({ project, versionsCount = 0, isVisible, onToggle, onRefresh }: any) {
  const { slug } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Локальный статус для мгновенного обновления UI
  const [localStatus, setLocalStatus] = useState(project?.status);

  // Синхронизируем локальный статус, если пропсы изменились извне
  useEffect(() => {
    setLocalStatus(project?.status);
  }, [project?.status]);

 const { items, canSubmit, doneRequired, totalRequired } = useMemo(() => {
    const checks = {
      hasVersions: versionsCount > 0,
      hasDescription: !!(project?.description && project.description.replace(/<[^>]*>/g, '').length >= 200),
      summaryOk: !!(project?.summary && project.summary.trim().length >= 30),
      hasIcon: !!(project?.iconUrl || project?.icon),
      hasTags: !!(project?.tags && project.tags.length > 0),
    };

const data = [
      { 
        id: 'versions', 
        isDone: checks.hasVersions, 
        type: 'required', 
        icon: <HiCube />, 
        title: 'Файлы проекта', 
        desc: 'Загрузите рабочую сборку. Без файлов проект не пройдет модерацию.', 
        link: 'versions', 
        action: 'Загрузить' 
      },
      { 
        id: 'description', 
        isDone: checks.hasDescription, 
        type: 'required', 
        icon: <HiDocumentText />, 
        title: 'Полное описание', 
        desc: 'Минимум 200 символов чистого текста для ознакомления игроков.', 
        link: 'description', 
        action: 'Изменить' 
      },
      { 
        id: 'summary', 
        isDone: checks.summaryOk, 
        type: 'required', 
        icon: <HiExclamationCircle />, 
        title: 'Краткое описание', 
        desc: '30-100 символов для карточки в общем списке.', 
        link: 'settings', 
        action: 'Настроить' 
      },
      { 
        id: 'icon', 
        isDone: checks.hasIcon, 
        type: 'suggestion', 
        icon: <HiPhotograph />, 
        title: 'Иконка / Лого', 
        desc: 'Повышает кликабельность в 3 раза. Формат: PNG/JPG.', 
        link: 'settings', 
        action: 'Загрузить' 
      },
      { 
        id: 'tags', 
        isDone: checks.hasTags, 
        type: 'suggestion', 
        icon: <HiHashtag />, 
        title: 'Теги поиска', 
        desc: 'Выберите до 3 тегов, чтобы проект было легче найти.', 
        link: 'tags', 
        action: 'Выбрать' 
      }
    ];

    const req = data.filter(i => i.type === 'required');
    return {
      items: data,
      canSubmit: req.every(i => i.isDone),
      doneRequired: req.filter(i => i.isDone).length,
      totalRequired: req.length
    };
  }, [project, versionsCount]);

  const isUnderReview = localStatus === 'under_review';
  const isRejected = localStatus === 'rejected';

  const handleSubmit = async () => {
    if (!canSubmit || isSubmitting || isUnderReview) return;
    
    setIsSubmitting(true);
    // Мгновенно меняем статус в UI (оптимистично)
    setLocalStatus('under_review');

    try {
      await api.patch(`/projects/${slug}/submit`);
      if (onRefresh) await onRefresh(); 
    } catch (err: any) {
      // Если ошибка — возвращаем старый статус
      setLocalStatus(project?.status);
      console.error("Submit error:", err);
      alert(err.response?.data?.message || "Ошибка отправки");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[var(--surface)] rounded-[2rem] border border-[var(--border)] shadow-sm overflow-hidden transition-all duration-500">
      {/* HEADER */}
      <div className="px-8 py-5 border-b border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)]">Готовность к публикации</h2>
          <span className={`text-[10px] font-black px-2.5 py-1 rounded-md ${canSubmit ? 'bg-green-500/10 text-green-500' : 'bg-[var(--accent)]/10 text-[var(--accent)]'}`}>
            {doneRequired} / {totalRequired}
          </span>
        </div>
        <button onClick={onToggle} className="p-2 hover:bg-[var(--background)] rounded-full text-[var(--muted)] transition-colors">
          {isVisible ? <HiChevronUp size={20} /> : <HiChevronDown size={20} />}
        </button>
      </div>

      {isVisible && (
        <div className="p-8 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* GRID ITEMS */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
            {items.map((item) => (
              <div 
            key={item.id} 
            className={`relative p-5 rounded-2xl border transition-all flex flex-col h-full 
              ${item.isDone 
                ? 'bg-green-500/5 border-green-500/20' 
                : item.type === 'required' 
                  ? 'bg-[var(--background)] border-[var(--border)] shadow-sm' 
                  : 'bg-[var(--background)] border-[var(--border)] opacity-80'}`}
          >
            {/* Badge: Обязательно / Опционально */}
            <div className="absolute top-3 right-3">
              {item.isDone ? (
                <div className="bg-green-500 rounded-full p-0.5">
                  <HiCheck className="text-white" size={12} />
                </div>
              ) : (
                <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded border 
                  ${item.type === 'required' 
                    ? 'text-[var(--accent)] border-[var(--accent)]/30 bg-[var(--accent)]/5' 
                    : 'text-[var(--muted)] border-[var(--border)]'}`}>
                  {item.type === 'required' ? 'Важно' : 'Опционально'}
                </span>
              )}
            </div>

            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-4 
              ${item.isDone ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-[var(--surface)] text-[var(--muted)]'}`}>
              {item.icon}
            </div>

            <h3 className="text-[11px] font-black uppercase tracking-tight mb-2 pr-10">
              {item.title}
            </h3>
            
            <p className="text-[10px] text-[var(--muted)] font-bold leading-relaxed mb-4 flex-grow">
              {item.desc}
            </p>

            {item.action && !item.isDone && (
              <Link 
                href={`/content/project/${slug}/settings/${item.link === 'settings' ? '' : item.link}`} 
                className={`mt-auto inline-flex items-center gap-1.5 text-[9px] font-black uppercase transition-all hover:gap-2
                  ${item.type === 'required' ? 'text-[var(--accent)]' : 'text-[var(--foreground)] opacity-70'}`}
              >
                {item.action} <HiArrowRight size={12} />
              </Link>
            )}
          </div>
        ))}
          </div>

          {/* STATUS CARD */}
          <div className={`p-6 rounded-3xl border transition-all duration-700 flex items-center justify-between gap-6 
            ${isUnderReview ? 'bg-blue-500/10 border-blue-500/20' : 
              isRejected ? 'bg-red-500/10 border-red-500/20' : 
              canSubmit ? 'bg-[var(--foreground)] border-transparent' : 
              'bg-[var(--background)] border-[var(--border)]'}`}>
            
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-transform duration-500 ${isUnderReview ? 'scale-110 bg-blue-500 text-white animate-pulse' : isRejected ? 'bg-red-500 text-white' : canSubmit ? 'bg-green-500 text-white' : 'bg-[var(--border)] text-[var(--muted)]'}`}>
                 {isUnderReview ? <HiClock size={24} /> : isRejected ? <HiExclamationCircle size={24} /> : <HiPaperAirplane size={24} className="rotate-90" />}
              </div>
              <div>
                <h4 className={`text-sm font-black uppercase tracking-tight ${canSubmit && !isUnderReview && !isRejected ? 'text-[var(--background)]' : 'text-[var(--foreground)]'}`}>
                  {isUnderReview ? 'Проект на проверке' : isRejected ? 'Нужны правки' : canSubmit ? 'Готов к отправке' : 'Черновик'}
                </h4>
                <p className={`text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1 ${canSubmit && !isUnderReview && !isRejected ? 'text-[var(--background)]' : 'text-[var(--muted)]'}`}>
                  {isUnderReview ? 'Модераторы изучают ваш проект' : isRejected ? 'Исправьте замечания и отправьте снова' : canSubmit ? 'Нажмите кнопку для публикации' : 'Заполните обязательные поля'}
                </p>
              </div>
            </div>

            {/* КНОПКА: Скрывается если на проверке, иначе показывается */}
            {!isUnderReview && (
              <button 
                onClick={handleSubmit}
                disabled={!canSubmit || isSubmitting}
                className={`h-12 px-10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3
                  ${canSubmit ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-xl shadow-orange-500/20 active:scale-95' : 'bg-[var(--border)] text-[var(--muted)] cursor-not-allowed'}`}>
                {isSubmitting ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : isRejected ? <><HiRefresh size={16}/> Переотправить</> : 'Опубликовать'}
              </button>
            )}
          </div>

          {/* REJECTION REASON */}
          {isRejected && project?.rejectionReason && (
            <div className="mt-4 p-5 bg-red-500/5 border border-red-500/10 rounded-2xl animate-in slide-in-from-bottom-2">
              <div className="flex items-center gap-2 mb-2">
                <HiExclamationCircle className="text-red-500" />
                <span className="text-[10px] font-black uppercase text-red-500">Комментарий модератора</span>
              </div>
              <p className="text-xs text-[var(--foreground)] opacity-80 leading-relaxed italic">"{project.rejectionReason}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}