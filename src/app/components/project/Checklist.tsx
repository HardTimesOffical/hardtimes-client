'use client';
import { HiChevronUp, HiChevronDown, HiArrowRight, HiPaperAirplane, HiCheck } from 'react-icons/hi';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function Checklist({ project, versionsCount = 0, isVisible, onToggle }: any) {
  const { slug } = useParams();
  const { accessToken: token, user } = useAuth();

  const isUnderReview = project?.status === 'under_review';
  const isDraft = project?.status === 'draft';
  const isRejected = project?.status === 'rejected';

  // Логика проверок
const checks = {
    hasVersions: versionsCount > 0, 
    hasDescription: project?.description && project.description.trim().length > 50,
    summaryOk: project?.summary?.trim().length >= 30,
    hasIcon: !!project?.iconUrl,
    hasTags: project?.tags && project.tags.length > 0,
    // Проверяем, есть ли хотя бы одна непустая ссылка
    hasLinks: project?.links && Object.values(project.links).some(link => 
      typeof link === 'string' && link.trim() !== ''
    ),
  };

  const items = [
    { 
      id: 'versions',
      isDone: checks.hasVersions,
      type: 'required', 
      title: 'Версии проекта', 
      desc: checks.hasVersions ? 'Минимум одна версия загружена.' : 'Требуется загрузить хотя бы одну версию файла.', 
      link: 'versions', 
      action: 'Загрузить версию' 
    },
    { 
      id: 'description',
      isDone: checks.hasDescription,
      type: 'required', 
      title: 'Описание проекта', 
      desc: checks.hasDescription ? 'Описание заполнено и готово.' : 'Добавьте подробное описание вашего проекта.', 
      link: 'description', 
      action: 'Настроить описание' 
    },
    { 
      id: 'summary',
      isDone: checks.summaryOk,
      type: 'warning', 
      title: 'Краткое содержание', 
      desc: checks.summaryOk ? 'Длина содержания оптимальна.' : 'Рекомендуется увеличить длину текста для лучшего SEO.', 
      value: `${project.summary?.length}/30` 
    },
    { 
      id: 'icon',
      isDone: checks.hasIcon,
      type: 'suggestion', 
      title: 'Иконка проекта', 
      desc: checks.hasIcon ? 'Иконка успешно установлена.' : 'Уникальная иконка поможет выделить ваш проект.', 
      link: 'settings', 
      action: 'Загрузить иконку' 
    },{ 
    id: 'tags',
    isDone: checks.hasTags,
    type: 'suggestion', 
    title: 'Теги проекта', 
    desc: checks.hasTags ? 'Теги добавлены.' : 'Вы можете добавить теги, чтобы проект было легче найти (необязательно).', 
    link: 'tags', 
    action: 'Настроить теги' 
},
{ 
    id: 'links',
    isDone: checks.hasLinks,
    type: 'suggestion', 
    title: 'Полезные ссылки', 
    desc: checks.hasLinks ? 'Ссылки настроены.' : 'Вы можете добавить ссылки на Discord или Wiki (необязательно).', 
    link: 'links', 
    action: 'Добавить ссылки' 
},
  ];

  // Проверка, все ли обязательные пункты выполнены
  const canSubmit = checks.hasVersions && checks.hasDescription;
  const totalRequired = items.filter(i => i.type === 'required').length;
  const doneRequired = items.filter(i => i.type === 'required' && i.isDone).length;
  const isFullyDone = doneRequired === totalRequired;

   let containerStyles = "bg-gray-50 border border-gray-100"; // По умолчанию
  if (isUnderReview) containerStyles = "bg-blue-50/50 border border-blue-100 shadow-sm shadow-blue-50";
  if (isRejected)    containerStyles = "bg-red-50/60 border border-red-100 shadow-sm shadow-red-50";
  if (canSubmit && !isUnderReview && !isRejected) containerStyles = "bg-gray-900 shadow-xl shadow-gray-200";


  const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmitForReview = async () => {
  // 1. Сначала проверяем, есть ли у нас вообще токен
  if (!token) {
    alert('Ошибка авторизации. Пожалуйста, войдите в систему заново.');
    return;
  }

  setIsSubmitting(true);
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/projects/${slug}/submit`, { 
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ status: 'under_review' })
    });

    // 2. Обрабатываем ответ более детально
    if (response.ok) {
      alert('Проект успешно отправлен на проверку! 🎉');
    } else if (response.status === 401) {
      alert('Ваша сессия истекла. Перезайдите в аккаунт.');
    } else {
      const errorData = await response.json();
      alert(`Ошибка: ${errorData.message || 'Что-то пошло не так'}`);
    }
  } catch (error) {
    console.error('Ошибка при отправке:', error);
    alert('Не удалось связаться с сервером. Проверьте интернет-соединение.');
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-200/60 shadow-sm overflow-hidden">
      {/* HEADER */}
      <div className="p-5 px-8 flex justify-between items-center border-b border-gray-100">
        <div className="flex items-center gap-6">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900">
            Чек-лист готовности
          </h2>
          <div className="hidden sm:flex gap-4">
            <span className="flex items-center gap-1.5 text-green-600 bg-green-50 px-2 py-1 rounded-md text-[9px] font-bold uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"/> Всё готово
            </span>
          </div>
        </div>
        <button onClick={onToggle} className="p-2 hover:bg-gray-50 rounded-xl text-gray-400">
          {isVisible ? <HiChevronUp size={20} /> : <HiChevronDown size={20} />}
        </button>
      </div>

      {isVisible && (
        <div className="p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((item, idx) => (
              <div 
                key={idx} 
                className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between group
                  ${item.isDone 
                    ? 'bg-green-50/30 border-green-100/50 hover:border-green-200' 
                    : 'bg-gray-50 border-gray-100 hover:border-orange-200 hover:bg-white'}
                `}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                        item.isDone ? 'bg-green-500' : 
                        item.type === 'required' ? 'bg-red-500' : 'bg-orange-500'
                      }`}>
                        {item.isDone ? <HiCheck className="text-white" size={12} /> : <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                      <h3 className={`text-[11px] font-black uppercase tracking-tight ${item.isDone ? 'text-green-700' : 'text-gray-700'}`}>
                        {item.title}
                      </h3>
                    </div>
                  </div>
                  <p className={`text-xs leading-relaxed font-medium ${item.isDone ? 'text-green-600/70' : 'text-gray-500'}`}>
                    {item.desc}
                  </p>
                </div>
                
                {item.action && !item.isDone && (
                  <Link 
                    href={`/content/project/${slug}/settings/${item.link === 'settings' ? '' : item.link}`}
                    className="mt-5 text-[10px] font-black uppercase tracking-widest text-orange-600 flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    {item.action} <HiArrowRight size={12} />
                  </Link>
                )}

                {item.isDone && (
                  <div className="mt-5 flex items-center gap-1.5 text-[9px] font-black uppercase text-green-500 tracking-widest">
                    Готово
                  </div>
                )}
              </div>
            ))}
            
            {/* БЛОК ОТПРАВКИ */}
{/* БЛОК ОТПРАВКИ / СТАТУСА */}
<div className={`p-6 rounded-[2rem] flex flex-col justify-between transition-all duration-500 ${containerStyles}`}>
      
      {/* Заголовок блока */}
      <div className={`text-[10px] font-black uppercase tracking-[0.2em] mb-3 
        ${isUnderReview ? 'text-blue-400' : isRejected ? 'text-red-400' : canSubmit ? 'text-white/40' : 'text-gray-400'}`}>
        {isUnderReview ? 'Статус' : isRejected ? 'Внимание' : 'Действие'}
      </div>

      <div className="flex-1">
        {isUnderReview ? (
          <div className="space-y-1">
            <p className="text-[13px] text-blue-700 font-bold tracking-tight flex items-center gap-2">
              На модерации
            </p>
            <p className="text-[10px] text-blue-600/70 leading-relaxed font-medium">
              Обычно проверка занимает до 24 часов. Мы пришлем уведомление.
            </p>
          </div>
        ) : isRejected ? (
          <div className="space-y-1">
            <p className="text-[13px] text-red-700 font-bold tracking-tight">Отклонено</p>
            <p className="text-[10px] text-red-600/70 leading-relaxed font-medium">
              Проект требует доработки. Пожалуйста, исправьте ошибки и отправьте снова.
            </p>
          </div>
        ) : !canSubmit ? (
          <p className="text-[10px] text-gray-400 font-bold leading-tight italic">
            Выполните обязательные шаги для разблокировки отправки.
          </p>
        ) : (
          <p className="text-[11px] text-green-400 font-bold italic">
            Проект готов к публикации!
          </p>
        )}
      </div>

      {/* НИЖНЯЯ ЧАСТЬ (КНОПКА ИЛИ ВИДЖЕТ) */}
      {isUnderReview ? (
        <div className="mt-5 py-3.5 px-4 rounded-2xl bg-white/80 border border-blue-100/50 flex items-center justify-between backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-blue-600">Ожидайте</span>
          </div>
          <HiCheck className="text-blue-300" size={16} />
        </div>
      ) : (
        <button 
          disabled={!canSubmit || isSubmitting}
          onClick={handleSubmitForReview}
          className={`w-full mt-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95
            ${isRejected 
              ? 'bg-red-500 hover:bg-red-400 text-white shadow-lg shadow-red-500/20' 
              : canSubmit && !isSubmitting
                ? 'bg-orange-500 hover:bg-orange-400 text-white shadow-lg shadow-orange-500/20' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
          `}
        >
          {isSubmitting ? (
            <span className="animate-pulse">Обработка...</span>
          ) : (
            <>
              <HiPaperAirplane className={isRejected ? "rotate-0" : "rotate-90"} />
              {isRejected ? 'Переотправить' : 'Отправить на проверку'}
            </>
          )}
        </button>
      )}
    </div>
          </div>
        </div>
      )}
    </div>
  );
}