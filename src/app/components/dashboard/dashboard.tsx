'use client';

import React, { useState, useEffect } from 'react';
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

const Sidebar = ({ isMobileOpen, setIsMobileOpen }: any) => {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const { user, logout } = useAuth();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'monitoring' | 'content'>('monitoring');
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [counts, setCounts] = useState<Record<string, number>>({});

  const currentGameId = params?.game as string;
  const isInsideGame = pathname.startsWith('/content/') && currentGameId;
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  // Эффект для определения активного таба
  useEffect(() => {
    if (pathname.startsWith('/content')) {
      setActiveTab('content');
    } else {
      setActiveTab('monitoring');
    }
  }, [pathname]);

  // Эффект для загрузки количества проектов
useEffect(() => {
    const fetchCounts = async () => {
      // 1. Добавляем проверку: если мы не внутри игры, обнуляем счетчики
      if (!isInsideGame || !currentGameId) {
        setCounts({});
        return;
      }
      
      try {
        // Убедитесь, что бэкенд корректно обрабатывает query параметр gameType
        const res = await fetch(`${SERVER_URL}/projects?gameType=${currentGameId}&limit=1000`);
        const data = await res.json();
        const projects = data.projects || [];

        const projectCounts: Record<string, number> = {};
        let totalForCurrentGame = 0;

        projects.forEach((p: any) => {
          // 2. Дополнительная проверка на фронте (на случай если API вернуло лишнее)
          if (p.gameType?.toLowerCase() === currentGameId.toLowerCase()) {
            const type = p.projectType;
            projectCounts[type] = (projectCounts[type] || 0) + 1;
            totalForCurrentGame++;
          }
        });
        
        // 3. Записываем количество только для этой игры
        projectCounts['all'] = totalForCurrentGame;
        
        setCounts(projectCounts);
      } catch (e) {
        console.error("Sidebar stats error:", e);
      }
    };

    fetchCounts();
  }, [currentGameId, isInsideGame, SERVER_URL]);

  const isSidebarOpen = isExpanded || isMobileOpen;

  const monitoringItems = {
    main: [
      { name: 'Все сервера', href: '/monitoring', icon: HiOutlineHome },
      { name: 'Новые сервера', href: '/monitoring/servers/new', icon: HiOutlineFire, color: 'text-orange-500' },
    ],
    games: [
      { name: 'Java Edition', href: '/monitoring/servers/java', icon: HiOutlineCube, color: 'text-green-500' },
      { name: 'Bedrock Edition', href: '/monitoring/servers/bedrock', icon: HiOutlineDeviceMobile, color: 'text-blue-500' },
      { name: 'Hytale', href: '/monitoring/servers/hytale', icon: HiOutlineLightningBolt, color: 'text-purple-500' },
    ],
    action: { name: 'Добавить сервер', href: '/monitoring/workbench', icon: HiOutlinePlusCircle }
  };

  const getContentItems = () => {
    if (!isInsideGame) {
      return {
        title: "Выбор игры",
        items: GAME_PLATFORMS.map(game => ({
          name: game.label,
          href: `/content/${game.id}`,
          icon: HiOutlineCube,
          color: 'text-orange-500'
        }))
      };
    }

    const types = PROJECT_TYPES_BY_GAME[currentGameId] || [];
    return {
      title: currentGameId.toUpperCase(),
      items: [
        { 
          name: 'Весь контент', 
          href: `/content/${currentGameId}`, 
          icon: HiOutlineCollection, 
          color: 'text-foreground-bright',
          count: counts['all'] 
        },
        ...types.map(t => ({
          name: t.label,
          href: `/content/${currentGameId}/${t.value}`,
          icon: HiOutlineCode,
          color: 'text-blue-500',
          count: counts[t.value]
        }))
      ]
    };
  };

  const contentSection = getContentItems();

  const handleActionClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) return router.push('/login');
    setIsNewProjectModalOpen(true);
  };

  return (
    <>
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-[110] md:hidden backdrop-blur-sm" onClick={() => setIsMobileOpen?.(false)} />
      )}

      <aside 
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className={`
          fixed top-0 left-0 bottom-0 flex flex-col bg-card border-r border-border 
          transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] z-[120]
          ${isMobileOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full md:translate-x-0'}
          ${isExpanded ? 'md:w-64' : 'md:w-20'}
        `}
      >
        <Link href="/" className="h-20 flex items-center px-5 shrink-0">
          <div className="w-10 h-10 bg-foreground-bright rounded-xl flex items-center justify-center shrink-0 text-contrast-text font-black text-xl">
            H
          </div>
          <span className={`ml-4 font-black text-xl tracking-tighter text-foreground-bright uppercase transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
            Hard<span className="text-accent">Times</span>
          </span>
        </Link>

        <div className="px-3 mb-4">
          <div className={`bg-surface p-1 rounded-2xl flex gap-1 ${!isSidebarOpen ? 'flex-col' : ''}`}>
            <button onClick={() => setActiveTab('monitoring')} className={`flex-1 flex items-center justify-center py-2 rounded-xl transition-all ${activeTab === 'monitoring' ? 'bg-card shadow-sm text-foreground-bright' : 'text-muted hover:text-foreground'}`}>
              <HiOutlineFire className="w-5 h-5" />
              {isSidebarOpen && <span className="ml-2 text-[10px] font-black uppercase">Сервера</span>}
            </button>
            <button onClick={() => setActiveTab('content')} className={`flex-1 flex items-center justify-center py-2 rounded-xl transition-all ${activeTab === 'content' ? 'bg-card shadow-sm text-foreground-bright' : 'text-muted hover:text-foreground'}`}>
              <HiOutlineCube className="w-5 h-5" />
              {isSidebarOpen && <span className="ml-2 text-[10px] font-black uppercase">Контент</span>}
            </button>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-4 px-3 py-2 overflow-y-auto overflow-x-hidden scrollbar-hide">
          {activeTab === 'monitoring' ? (
            <>
              <div className="space-y-1">
                {monitoringItems.main.map((item) => (
                  <SidebarLink key={item.href} item={item} isExpanded={isSidebarOpen} isActive={pathname === item.href} />
                ))}
                <SidebarLink item={monitoringItems.action} isExpanded={isSidebarOpen} isActive={pathname === monitoringItems.action.href} />
              </div>
              <div className="space-y-1">
                <p className={`text-[10px] font-black text-muted uppercase tracking-widest ml-3 mb-2 ${isSidebarOpen ? 'block' : 'hidden'}`}>Игры</p>
                {monitoringItems.games.map((item) => (
                  <SidebarLink key={item.href} item={item} isExpanded={isSidebarOpen} isActive={pathname === item.href} />
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center justify-between px-3 mb-2">
                <p className={`text-[10px] font-black text-muted uppercase tracking-widest ${isSidebarOpen ? 'block' : 'hidden'}`}>
                  {contentSection.title}
                </p>
                {isInsideGame && isSidebarOpen && (
                  <Link href="/content" className="text-[9px] font-black text-accent hover:underline flex items-center gap-1">
                    <HiChevronLeft /> НАЗАД
                  </Link>
                )}
              </div>
              
              {contentSection.items.map((item) => (
                <SidebarLink key={item.href} item={item} isExpanded={isSidebarOpen} isActive={pathname === item.href} />
              ))}

              <div onClick={handleActionClick} className="pt-4">
                <SidebarLink item={{ name: 'Новый проект', href: '#', icon: HiOutlinePlusCircle }} isExpanded={isSidebarOpen} isActive={false} />
              </div>
            </div>
          )}

          <div className="mt-auto pt-4 border-t border-border space-y-1">
            <SidebarLink item={{ name: 'Магазин', href: '/shop', icon: HiOutlineShoppingBag }} isExpanded={isSidebarOpen} isActive={pathname === '/shop'} />
          </div>
        </nav>

        <div className="p-3 border-t border-border bg-card shrink-0">
          {user ? (
            <div className={`flex items-center gap-3 p-2 rounded-2xl transition-all ${isSidebarOpen ? 'bg-surface' : ''}`}>
              <Link href={`/profile/${user.username}`} className="shrink-0">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-accent flex items-center justify-center text-white font-bold uppercase">
                  {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="" /> : user.username?.charAt(0)}
                </div>
              </Link>
              {isSidebarOpen && (
                <div className="flex flex-1 items-center justify-between min-w-0">
                  <div className="truncate pr-2">
                    <p className="text-xs font-black text-foreground-bright truncate uppercase">{user.username}</p>
                    <p className="text-[10px] font-bold text-accent uppercase">{user.balance || 0} звезд</p>
                  </div>
                  <button onClick={() => logout()} className="text-muted hover:text-red-500"><HiOutlineLogout className="w-5 h-5"/></button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className={`flex items-center gap-4 p-3 rounded-2xl text-muted hover:bg-surface transition-all ${isSidebarOpen ? 'px-4' : 'justify-center'}`}>
              <HiOutlineUser className="w-6 h-6 shrink-0" />
              {isSidebarOpen && <span className="font-black text-sm uppercase">Войти</span>}
            </Link>
          )}
        </div>
      </aside>

      <NewProject isOpen={isNewProjectModalOpen} onClose={() => setIsNewProjectModalOpen(false)} />
    </>
  );
};

const SidebarLink = ({ item, isExpanded, isActive }: any) => {
  const Icon = item.icon;
  return (
    <Link 
      href={item.href} 
      className={`
        flex items-center p-3 rounded-2xl transition-all duration-200 group relative
        ${isActive 
          ? 'bg-foreground-bright shadow-md' 
          : 'text-muted hover:bg-surface hover:text-foreground-bright'}
        ${isExpanded ? 'gap-4 px-4' : 'justify-center'}
      `}
    >
      <Icon className={`w-6 h-6 shrink-0 transition-colors
        ${isActive ? 'text-contrast-text' : (item.color || 'group-hover:text-foreground-bright')}
      `} />
      
      <div className={`flex flex-1 items-center justify-between transition-all duration-300
        ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 absolute pointer-events-none'}
      `}>
        <span translate='no' className={`font-bold text-sm tracking-tight whitespace-nowrap
          ${isActive ? 'text-contrast-text' : ''}
        `}>
          {item.name}
        </span>

        {/* СЧЕТЧИК */}
        {item.count !== undefined && item.count > 0 && (
          <span className={`
            text-[9px] font-black px-1.5 py-0.5 rounded-lg min-w-[20px] text-center transition-colors
            ${isActive 
              ? 'bg-contrast-text/20 text-contrast-text' 
              : 'bg-surface text-muted group-hover:bg-background'}
          `}>
            {item.count}
          </span>
        )}
      </div>
    </Link>
  );
};

export default Sidebar;