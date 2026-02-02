'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { NewProject } from '../project/NewProject';
import { 
  HiOutlineHome, HiOutlineFire, HiOutlineCube, 
  HiOutlineDeviceMobile, HiOutlineLightningBolt,
  HiOutlineShoppingBag, HiOutlinePlusCircle,
  HiOutlineUser, HiOutlineLogout, HiX,
  HiOutlineCollection, HiOutlinePhotograph, HiOutlineCode,
  HiChevronLeft
} from 'react-icons/hi';

// Твои константы (лучше импортировать из отдельного файла constants.ts)
const GAME_PLATFORMS = [
  { id: 'minecraft', label: 'Minecraft', icon: '⛏️' },
  { id: 'hytale', label: 'Hytale', icon: '💎' },
  { id: 'other', label: 'Другое', icon: '🎮' },
];

const PROJECT_TYPES_BY_GAME: Record<string, { label: string; value: string }[]> = {
  'minecraft': [
    { label: 'Моды', value: 'mod' },
    { label: 'Плагины', value: 'plugin' },
    { label: 'Шейдеры', value: 'shader' },
    { label: 'Ресурспаки', value: 'resourcepack' },
    { label: 'Карты', value: 'map' },
  ],
  'hytale': [
    { label: 'Моды', value: 'mod' },
    { label: 'Скрипты', value: 'script' },
    { label: 'Модели', value: 'model' },
    { label: 'Миры', value: 'world' },
  ],
  'default': [
    { label: 'Проекты', value: 'project' },
    { label: 'Дополнения', value: 'addon' },
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

  // Определяем игру из URL (например, из /content/minecraft/...)
  const currentGameId = params?.game as string;
  const isInsideGame = pathname.startsWith('/content/') && currentGameId;

  useEffect(() => {
    if (pathname.startsWith('/content')) {
      setActiveTab('content');
    } else {
      setActiveTab('monitoring');
    }
  }, [pathname]);

  const isSidebarOpen = isExpanded || isMobileOpen;

  // Данные для МОНИТОРИНГА
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

  // Логика получения элементов КОНТЕНТА
  const getContentItems = () => {
    if (!isInsideGame) {
      // Если игра не выбрана — список игр
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

    // Если игра выбрана — типы проектов для этой игры
    const types = PROJECT_TYPES_BY_GAME[currentGameId] || PROJECT_TYPES_BY_GAME['default'];
    return {
      title: currentGameId.toUpperCase(),
      items: [
        { name: 'Весь контент', href: `/content/${currentGameId}`, icon: HiOutlineCollection, color: 'text-gray-900' },
        ...types.map(t => ({
          name: t.label,
          href: `/content/${currentGameId}/${t.value}`,
          icon: HiOutlineCode,
          color: 'text-blue-500'
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
          fixed top-0 left-0 bottom-0 flex flex-col bg-white border-r border-gray-100 
          transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] z-[120]
          ${isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}
          ${isExpanded ? 'md:w-64 shadow-2xl shadow-gray-200' : 'md:w-20'}
        `}
      >
        {/* ЛОГОТИП */}
        <Link href="/" className="h-20 flex items-center px-5 shrink-0">
          <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center shrink-0 text-white font-black italic text-xl">H</div>
          <span className={`ml-4 font-black text-xl tracking-tighter text-gray-900 uppercase italic transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'}`}>
            Hard<span className="text-orange-500">Times</span>
          </span>
        </Link>

        {/* ТАБЫ (Сервера / Контент) */}
        <div className="px-3 mb-4">
          <div className={`bg-gray-100 p-1 rounded-2xl flex gap-1 ${!isSidebarOpen ? 'flex-col' : ''}`}>
            <button onClick={() => setActiveTab('monitoring')} className={`flex-1 flex items-center justify-center py-2 rounded-xl transition-all ${activeTab === 'monitoring' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
              <HiOutlineFire className="w-5 h-5" />
              {isSidebarOpen && <span className="ml-2 text-[10px] font-black uppercase">Сервера</span>}
            </button>
            <button onClick={() => setActiveTab('content')} className={`flex-1 flex items-center justify-center py-2 rounded-xl transition-all ${activeTab === 'content' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
              <HiOutlineCube className="w-5 h-5" />
              {isSidebarOpen && <span className="ml-2 text-[10px] font-black uppercase">Контент</span>}
            </button>
          </div>
        </div>

        {/* НАВИГАЦИЯ */}
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
                <p className={`text-[10px] font-black text-gray-300 uppercase tracking-widest ml-3 mb-2 ${isSidebarOpen ? 'block' : 'hidden'}`}>Игры</p>
                {monitoringItems.games.map((item) => (
                  <SidebarLink key={item.href} item={item} isExpanded={isSidebarOpen} isActive={pathname === item.href} />
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center justify-between px-3 mb-2">
                <p className={`text-[10px] font-black text-gray-300 uppercase tracking-widest ${isSidebarOpen ? 'block' : 'hidden'}`}>
                  {contentSection.title}
                </p>
                {isInsideGame && isSidebarOpen && (
                  <Link href="/content" className="text-[9px] font-black text-orange-500 hover:underline flex items-center gap-1">
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

          <div className="mt-auto pt-4 border-t border-gray-50 space-y-1">
            <SidebarLink item={{ name: 'Магазин', href: '/shop', icon: HiOutlineShoppingBag }} isExpanded={isSidebarOpen} isActive={pathname === '/shop'} />
          </div>
        </nav>

        {/* ПРОФИЛЬ */}
        <div className="p-3 border-t border-gray-50 bg-white shrink-0">
          {user ? (
            <div className={`flex items-center gap-3 p-2 rounded-2xl transition-all ${isSidebarOpen ? 'bg-gray-50' : ''}`}>
              <Link href={`/profile/${user.username}`} className="shrink-0">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-orange-500 flex items-center justify-center text-white font-bold uppercase">
                  {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.username?.charAt(0)}
                </div>
              </Link>
              {isSidebarOpen && (
                <div className="flex flex-1 items-center justify-between min-w-0">
                  <div className="truncate pr-2">
                    <p className="text-xs font-black text-gray-900 truncate uppercase">{user.username}</p>
                    <p className="text-[10px] font-bold text-orange-500 uppercase">{user.balance || 0} звезд</p>
                  </div>
                  <button onClick={() => logout()} className="text-gray-400 hover:text-red-500"><HiOutlineLogout className="w-5 h-5"/></button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className={`flex items-center gap-4 p-3 rounded-2xl text-gray-400 hover:bg-gray-50 transition-all ${isSidebarOpen ? 'px-4' : 'justify-center'}`}>
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
        ${isActive ? 'bg-gray-900 text-white shadow-lg shadow-gray-200' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'}
        ${isExpanded ? 'gap-4 px-4' : 'justify-center'}
      `}
    >
      <Icon className={`w-6 h-6 shrink-0 ${isActive ? 'text-white' : item.color || 'group-hover:text-gray-900'}`} />
      <span translate='no' className={`font-bold text-sm tracking-tight whitespace-nowrap transition-all duration-300 ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 absolute pointer-events-none'}`}>
        {item.name}
      </span>
    </Link>
  );
};

export default Sidebar;