'use client';

import React, { useState, useEffect, useMemo, memo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { NewProject } from '../project/NewProject';
import { 
  HiOutlineHome, HiOutlineFire, HiOutlineCube, 
  HiOutlineDeviceMobile, HiOutlineLightningBolt,
  HiOutlineShoppingBag, HiOutlinePlusCircle,
  HiOutlineUser, HiOutlineLogout, 
  HiOutlineCollection, HiOutlineCode,
  HiChevronLeft
} from 'react-icons/hi';
import { 
  HiOutlineChatBubbleLeftRight, HiOutlinePlus, HiOutlineRss, HiOutlineMicrophone,
  HiOutlineQuestionMarkCircle, HiOutlineExclamationTriangle
} from 'react-icons/hi2';
import { FaTelegramPlane } from 'react-icons/fa';

// --- ДАННЫЕ ВНЕ КОМПОНЕНТА ДЛЯ ОПТИМИЗАЦИИ ---
const GAME_PLATFORMS = [
  { id: 'minecraft', label: 'Minecraft', icon: '⛏️' },
  { id: 'hytale', label: 'Hytale', icon: '💎' },
  { id: 'voxelcore', label: 'VoxelCore', icon: '🏗️' },
];

export const PROJECT_TYPES_BY_GAME: Record<string, { label: string; value: string }[]> = {
  'minecraft': [
    { label: 'Моды', value: 'mods' },
    { label: 'Плагины', value: 'plugins' },
    { label: 'Сборки серверов', value: 'server-packs' },
    { label: 'Сборки модов', value: 'modpacks' },
    { label: 'Переводы', value: 'translations' },
    { label: 'Конфигурации', value: 'configs' },
    { label: 'Шейдеры', value: 'shaders' },
    { label: 'Ресурспаки', value: 'resourcepacks' },
    { label: 'Карты', value: 'maps' },
    { label: 'Датапаки', value: 'datapacks' },
    { label: 'Схематики', value: 'schematics' },
  ],
  'hytale': [
    { label: 'Моды', value: 'mods' },
    { label: 'Скрипты (C#)', value: 'scripts' },
    { label: 'Сборки серверов', value: 'server-packs' },
    { label: 'Конфигурации', value: 'configs' },
    { label: 'Переводы', value: 'translations' },
    { label: 'Модели и Ассеты', value: 'models' },
    { label: 'Миры и Карты', value: 'maps' }, // В тегах используется 'maps'
    { label: 'Инструменты', value: 'tools' },
  ],
  'voxelcore': [
    { label: 'Моды', value: 'mods' },
    { label: 'Библиотеки', value: 'libraries' },
    { label: 'Текстурпаки', value: 'texture-packs' },
    { label: 'Схематики', value: 'schematics' },
    { label: 'Миры', value: 'worlds' },
    { label: 'Сборки модов', value: 'modpacks' },
    { label: 'Ядро', value: 'core' },
    { label: 'Инструменты', value: 'tools' },
    
  ]
};

const SidebarLink = memo(({ item, isExpanded, isActive, isForum }: any) => {
  const Icon = item.icon;
  return (
    <Link 
      href={item.href} 
      className={`flex items-center transition-all duration-200 group relative
        ${isExpanded ? 'h-9 px-3 gap-3 rounded-lg' : 'w-10 h-10 mx-auto justify-center rounded-lg mb-1'}
        ${isActive 
          ? (isForum ? 'bg-surface text-accent' : 'bg-foreground-bright text-contrast-text shadow-sm') 
          : 'text-muted hover:bg-surface hover:text-foreground-bright'}`}
    >
      {isActive && isForum && <div className="absolute left-0 w-0.5 h-4 bg-accent rounded-r-full" />}
      <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 will-change-transform
        ${isActive && !isForum ? 'text-contrast-text' : (isActive && isForum ? 'text-accent' : (item.color || ''))}`} />
      
      {isExpanded && (
        <div className="flex flex-1 items-center justify-between overflow-hidden">
          <span className="font-bold text-[10px] tracking-tight whitespace-nowrap uppercase">
            {item.name}
          </span>
          {item.count !== undefined && item.count > 0 && (
            <span className={`text-[8px] px-1.5 py-0.5 rounded-md font-black ${isActive ? 'bg-white/20' : 'bg-black/5 dark:bg-white/5'}`}>
              {item.count}
            </span>
          )}
        </div>
      )}
    </Link>
  );
});
SidebarLink.displayName = 'SidebarLink';

// --- ОСНОВНОЙ КОМПОНЕНТ ---
const Sidebar = ({ isMobileOpen, setIsMobileOpen }: any) => {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const { user, logout } = useAuth();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [counts, setCounts] = useState<Record<string, number>>({});
  
  const isForumPage = useMemo(() => pathname.startsWith('/forum'), [pathname]);
  const currentGameId = params?.game as string;
  const isInsideGame = useMemo(() => pathname.startsWith('/content/') && !!currentGameId, [pathname, currentGameId]);
  const isSidebarOpen = isExpanded || isMobileOpen;
  const forumLink = { name: 'Форум', href: '/forum', icon: HiOutlineChatBubbleLeftRight, color: 'text-accent' };

  const activeTab = useMemo(() => {
    if (isForumPage) return 'none';
    return pathname.startsWith('/content') ? 'content' : 'monitoring';
  }, [pathname, isForumPage]);

  // Загрузка счетчиков
  useEffect(() => {
    if (!isInsideGame || !currentGameId) {
      setCounts({});
      return;
    }
    const fetchCounts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/projects?gameType=${currentGameId}&limit=1000`);
        const data = await res.json();
        const projects = data.projects || [];
        const projectCounts: Record<string, number> = {};
        let total = 0;
        projects.forEach((p: any) => {
          if (p.gameType?.toLowerCase() === currentGameId.toLowerCase()) {
            projectCounts[p.projectType] = (projectCounts[p.projectType] || 0) + 1;
            total++;
          }
        });
        projectCounts['all'] = total;
        setCounts(projectCounts);
      } catch (e) {
        console.error("Sidebar stats error:", e);
      }
    };
    fetchCounts();
  }, [currentGameId, isInsideGame]);

  // Группы Форума
  const forumGroups = [
    { title: "Главное", items: [
      { name: 'Вся лента', href: '/forum', icon: HiOutlineChatBubbleLeftRight },
      { name: 'Новая тема', href: '/forum/create-post', icon: HiOutlinePlus },
    ]},
    { 
      title: "Поддержка", 
      items: [
        { 
          name: 'Поддержка', 
          href: 'https://t.me/megashield_quazar', // Укажите вашу ссылку
          icon: FaTelegramPlane, 
        },
      ]
    }
  ];

  // Элементы мониторинга
  const monitoringItems = {
    main: [
      { name: 'Все сервера', href: '/monitoring', icon: HiOutlineHome },
      { name: 'Новые сервера', href: '/monitoring/servers/new', icon: HiOutlineFire, color: 'text-orange-500' },
    ],
    games: [
      { name: 'Java Edition', href: '/monitoring/servers/java', icon: HiOutlineCube, color: 'text-green-500' },
      { name: 'Bedrock Edition', href: '/monitoring/servers/bedrock', icon: HiOutlineDeviceMobile, color: 'text-blue-500' },
      { name: 'Hytale', href: '/monitoring/servers/hytale', icon: HiOutlineLightningBolt, color: 'text-purple-500' },
    ]
  };

  // Контентные элементы (проекты)
  const contentSection = useMemo(() => {
    if (!isInsideGame) {
      return {
        title: "Игры",
        items: GAME_PLATFORMS.map(g => ({ name: g.label, href: `/content/${g.id}`, icon: HiOutlineCube, color: 'text-orange-500' }))
      };
    }
    const types = PROJECT_TYPES_BY_GAME[currentGameId] || [];
    return {
      title: currentGameId.toUpperCase(),
      items: [
        { name: 'Весь контент', href: `/content/${currentGameId}`, icon: HiOutlineCollection, count: counts['all'] },
        ...types.map(t => ({ name: t.label, href: `/content/${currentGameId}/${t.value}`, icon: HiOutlineCode, color: 'text-blue-500', count: counts[t.value] }))
      ]
    };
  }, [isInsideGame, currentGameId, counts]);

  return (
    <>
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-[110] md:hidden backdrop-blur-sm" onClick={() => setIsMobileOpen?.(false)} />
      )}

      <aside 
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
  className={`fixed top-0 left-0 bottom-0 flex flex-col z-[120] border-r border-border bg-card 
  transition-[width,transform] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-[width,transform]
  /* Логика трансформации (выезд на мобилках) */
  ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
  /* Логика ширины (адаптация под развернутое состояние) */
  ${isExpanded || isMobileOpen ? 'w-56' : 'w-20'}`}
      >
        {/* LOGO */}
        <Link href="/" className="h-14 flex items-center px-4 shrink-0 group">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-black text-sm transition-all shadow-lg 
            ${isForumPage ? 'bg-accent text-white rotate-3' : 'bg-foreground-bright text-contrast-text'}`}>H</div>
          <span className={`ml-3 font-black text-[11px] tracking-tighter uppercase transition-opacity duration-200 text-foreground-bright
            ${isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
            Hard<span className="text-accent">Times</span>
          </span>
        </Link>

        {/* TABS */}
        <div className="px-3 mb-4 mt-2">
          <div className={`p-0.5 rounded-xl flex gap-0.5 bg-surface ${!isSidebarOpen ? 'flex-col' : ''}`}>
            <button onClick={() => router.push('/monitoring')} className={`flex-1 flex items-center justify-center py-1.5 rounded-lg transition-all text-[9px] font-black uppercase
              ${activeTab === 'monitoring' ? 'bg-card shadow-sm text-foreground-bright' : 'text-muted hover:text-foreground'}`}>
              <HiOutlineFire className="w-4 h-4" />
              {isSidebarOpen && <span className="ml-1.5">Сервера</span>}
            </button>
            <button onClick={() => router.push('/content')} className={`flex-1 flex items-center justify-center py-1.5 rounded-lg transition-all text-[9px] font-black uppercase
              ${activeTab === 'content' ? 'bg-card shadow-sm text-foreground-bright' : 'text-muted hover:text-foreground'}`}>
              <HiOutlineCube className="w-4 h-4" />
              {isSidebarOpen && <span className="ml-1.5">Контент</span>}
            </button>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 flex flex-col gap-4 px-3 py-2 overflow-y-auto scrollbar-hide overflow-x-hidden">
          {isForumPage ? (
            forumGroups.map((group, idx) => (
              <div key={idx} className="space-y-0.5">
                {isSidebarOpen && <p className="text-[8px] font-black text-muted uppercase tracking-[0.2em] ml-2 mb-1 opacity-50">{group.title}</p>}
                {group.items.map((item) => (
                  <SidebarLink key={item.href} item={item} isExpanded={isSidebarOpen} isActive={pathname === item.href} isForum />
                ))}
              </div>
            ))
          ) : activeTab === 'monitoring' ? (
            <>
              <div className="space-y-0.5">
                {monitoringItems.main.map((item) => (
                  <SidebarLink key={item.href} item={item} isExpanded={isSidebarOpen} isActive={pathname === item.href} />
                ))}
                <SidebarLink item={{ name: 'Добавить сервер', href: '/monitoring/workbench', icon: HiOutlinePlusCircle }} isExpanded={isSidebarOpen} isActive={pathname === '/monitoring/workbench'} />
              </div>
              <div className="space-y-0.5">
                {isSidebarOpen && <p className="text-[8px] font-black text-muted uppercase tracking-widest ml-2 mb-1 opacity-50">Игры</p>}
                {monitoringItems.games.map((item) => (
                  <SidebarLink key={item.href} item={item} isExpanded={isSidebarOpen} isActive={pathname === item.href} />
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-0.5">
              <div className="flex items-center justify-between px-2 mb-1">
                {isSidebarOpen && <p className="text-[8px] font-black text-muted uppercase tracking-widest opacity-50">{contentSection.title}</p>}
                {isInsideGame && isSidebarOpen && (
                  <Link href="/content" className="text-[8px] font-black text-accent flex items-center gap-0.5"><HiChevronLeft className="w-2 h-2"/> НАЗАД</Link>
                )}
              </div>
              {contentSection.items.map((item: any) => (
                <SidebarLink key={item.href} item={item} isExpanded={isSidebarOpen} isActive={pathname === item.href} />
              ))}
              <div className="pt-2">
                <button onClick={(e) => { e.preventDefault(); if (!user) return router.push('/login'); setIsNewProjectModalOpen(true); }} className="w-full">
                  <SidebarLink item={{ name: 'Новый проект', href: '#', icon: HiOutlinePlusCircle }} isExpanded={isSidebarOpen} isActive={false} />
                </button>
              </div>
            </div>
          )}
          <div className="mt-auto pt-4 border-t border-border/50">
            <SidebarLink 
              item={{ name: 'Форум', href: '/forum', icon: HiOutlineChatBubbleLeftRight, color: 'text-accent' }} 
              isExpanded={isSidebarOpen} 
              isActive={pathname.startsWith('/forum')} 
            />
            <SidebarLink item={{ name: 'Магазин', href: '/shop', icon: HiOutlineShoppingBag }} isExpanded={isSidebarOpen} isActive={pathname === '/shop'} />
          </div>
        </nav>

        {/* USER PANEL */}
        <div className="p-2 border-t border-border mt-auto shrink-0">
          {user ? (
            <div className={`flex items-center gap-2 p-1.5 rounded-xl transition-all ${isSidebarOpen ? 'bg-surface' : 'justify-center'}`}>
              <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-[10px] text-white font-bold shrink-0 relative overflow-hidden">
                {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="" /> : user.username?.charAt(0).toUpperCase()}
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 border-2 border-card rounded-full" />
              </div>
              {isSidebarOpen && (
                <div className="flex flex-1 items-center justify-between min-w-0">
                  <div className="truncate pr-1">
                    <p className="text-[10px] font-black truncate uppercase text-foreground-bright leading-tight">{user.username}</p>
                    <p className="text-[8px] font-bold text-accent uppercase">{user.balance || 0} звезд</p>
                  </div>
                  <button onClick={() => logout()} className="text-muted hover:text-red-500 transition-colors shrink-0 p-1"><HiOutlineLogout className="w-3.5 h-3.5"/></button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="flex items-center gap-2 p-2 rounded-lg bg-accent text-white justify-center shadow-lg hover:opacity-90 active:scale-95 transition-all">
              <HiOutlineUser className="w-4 h-4 shrink-0" />
              {isSidebarOpen && <span className="font-black text-[9px] uppercase tracking-wider">Войти</span>}
            </Link>
          )}
        </div>
      </aside>

      <NewProject isOpen={isNewProjectModalOpen} onClose={() => setIsNewProjectModalOpen(false)} />
    </>
  );
};

export default memo(Sidebar);