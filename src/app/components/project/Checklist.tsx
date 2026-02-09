'use client';

import { 
  HiChevronUp, HiChevronDown, HiArrowRight, HiPaperAirplane, 
  HiCheck, HiExclamationCircle, HiPhotograph, HiDocumentText, 
  HiHashtag, HiCube 
} from 'react-icons/hi';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function Checklist({ project, versionsCount = 0, isVisible, onToggle }: any) {
  const { slug } = useParams();
  const { accessToken: token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { items, canSubmit, doneRequired, totalRequired } = useMemo(() => {
    const checks = {
      hasVersions: versionsCount > 0,
      hasDescription: !!(project?.description && project.description.trim().length > 50),
      summaryOk: !!(project?.summary && project.summary.trim().length >= 30),
      // Проверяем все варианты: iconUrl, icon (объект или строка)
      hasIcon: !!(project?.iconUrl || project?.icon),
      hasTags: !!(project?.tags && project.tags.length > 0),
    };

    const data = [
      { id: 'versions', isDone: checks.hasVersions, type: 'required', icon: <HiCube />, title: 'Файлы', desc: 'Загрузите файлы проекта.', link: 'versions', action: 'Загрузить' },
      { id: 'description', isDone: checks.hasDescription, type: 'required', icon: <HiDocumentText />, title: 'Описание', desc: 'Минимум 50 символов.', link: 'description', action: 'Изменить' },
      { id: 'summary', isDone: checks.summaryOk, type: 'warning', icon: <HiExclamationCircle />, title: 'Кратко', desc: 'Нужно от 30 симв.', value: `${project?.summary?.length || 0}/30` },
      { id: 'icon', isDone: checks.hasIcon, type: 'suggestion', icon: <HiPhotograph />, title: 'Иконка', desc: 'Логотип проекта.', link: 'settings', action: 'Загрузить' },
      { id: 'tags', isDone: checks.hasTags, type: 'suggestion', icon: <HiHashtag />, title: 'Теги', desc: 'Для поиска.', link: 'tags', action: 'Настроить' }
    ];

    const req = data.filter(i => i.type === 'required');
    return {
      items: data,
      canSubmit: req.every(i => i.isDone),
      doneRequired: req.filter(i => i.isDone).length,
      totalRequired: req.length
    };
  }, [project, versionsCount]);

  const isUnderReview = project?.status === 'under_review';
  const isRejected = project?.status === 'rejected';

  return (
    <div className="bg-white dark:bg-[#0f1115] rounded-[2rem] border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden transition-colors">
      {/* Шапка */}
      <div className="px-8 py-5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Готовность
          </h2>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${canSubmit ? 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400' : 'bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400'}`}>
            {doneRequired} / {totalRequired}
          </span>
        </div>
        <button onClick={onToggle} className="p-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-full text-gray-400 transition-colors">
          {isVisible ? <HiChevronUp size={22} /> : <HiChevronDown size={22} />}
        </button>
      </div>

      {isVisible && (
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {items.map((item) => (
              <div key={item.id} className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${item.isDone ? 'bg-green-50/50 dark:bg-green-500/5 border-green-100 dark:border-green-500/10' : 'bg-white dark:bg-[#161920] border-gray-100 dark:border-white/5'}`}>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-xl ${item.isDone ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-400'}`}>
                      {item.isDone ? <HiCheck size={18} /> : item.icon}
                    </div>
                  </div>
                  <h3 className={`text-sm font-bold mb-1 ${item.isDone ? 'text-green-800 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>{item.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
                {item.action && !item.isDone && (
                  <Link href={`/content/project/${slug}/settings/${item.link === 'settings' ? '' : item.link}`} className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-orange-600 dark:text-orange-400 hover:gap-3 transition-all">
                    {item.action} <HiArrowRight />
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Статус-карта */}
          <div className={`p-6 rounded-[2rem] border transition-all flex flex-col md:flex-row items-center justify-between gap-6 
            ${isUnderReview ? 'bg-blue-50 dark:bg-blue-500/5 border-blue-100 dark:border-blue-500/10' : 
              isRejected ? 'bg-red-50 dark:bg-red-500/5 border-red-100 dark:border-red-500/10' : 
              canSubmit ? 'bg-gray-900 dark:bg-white border-gray-800 dark:border-white text-white dark:text-black' : 
              'bg-gray-50 dark:bg-[#161920] border-gray-200 dark:border-white/5 text-gray-900 dark:text-white'}`}>
            <div className="flex items-center gap-5">
              <div className={`p-4 rounded-2xl ${isUnderReview ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600' : canSubmit ? 'bg-green-500 dark:bg-green-500 text-white' : 'bg-gray-200 dark:bg-white/10 text-gray-500'}`}>
                 {isUnderReview ? <HiCheck size={28} /> : <HiExclamationCircle size={28} />}
              </div>
              <div>
                <h4 className="text-lg font-bold">{isUnderReview ? 'На проверке' : canSubmit ? 'Готов к публикации' : 'Нужна доработка'}</h4>
                <p className="text-sm opacity-70">Заполните все данные для отправки проекта.</p>
              </div>
            </div>
            <button 
              disabled={!canSubmit || isSubmitting || isUnderReview}
              className={`w-full md:w-auto px-10 py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-3 transition-all
                ${canSubmit && !isSubmitting && !isUnderReview ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-gray-200 dark:bg-white/5 text-gray-400 cursor-not-allowed'}`}>
              <HiPaperAirplane className="rotate-90" /> {isUnderReview ? 'В очереди' : 'Опубликовать'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}