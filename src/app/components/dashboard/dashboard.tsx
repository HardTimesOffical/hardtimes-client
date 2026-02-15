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
  HiChevronLeft,
  HiPlus
} from 'react-icons/hi';
import { 
  HiOutlineChatBubbleLeftRight, HiOutlinePlus, HiOutlineRss, HiOutlineMicrophone,
  HiOutlineQuestionMarkCircle, HiOutlineExclamationTriangle
} from 'react-icons/hi2';
import { FaTelegramPlane } from 'react-icons/fa';
import UserSection from './UserSection';
import SidebarLink from './SidebarLink';
import { PROJECT_TYPES_BY_GAME } from '@/constants/projectTypes';

// --- ДАННЫЕ ВНЕ КОМПОНЕНТА ДЛЯ ОПТИМИЗАЦИИ ---
const GAME_PLATFORMS = [
  { id: 'minecraft', label: 'Minecraft', icon: '⛏️' },
  { id: 'hytale', label: 'Hytale', icon: '💎' },
  { id: 'voxelcore', label: 'VoxelCore', icon: '🏗️' },
];

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
      { name: 'Добавить', href: '/monitoring/workbench', icon: HiPlus },
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
        <nav className="flex-1 px-2 space-y-4 overflow-y-auto custom-scrollbar">
          {/* Ссылка на форум (всегда сверху) */}
          <div className="space-y-1">
             <SidebarLink 
                item={forumLink} 
                isExpanded={isSidebarOpen} 
                isActive={pathname.startsWith('/forum')} 
                isForum={true} 
             />
          </div>

          {/* Если мы в разделе ФОРУМА */}
          {isForumPage && forumGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              {isSidebarOpen && (
                <p className="px-3 text-[8px] font-black uppercase text-muted/50 tracking-widest mb-1">
                  {group.title}
                </p>
              )}
              {group.items.map((item) => (
                <SidebarLink 
                  key={item.href} 
                  item={item} 
                  isExpanded={isSidebarOpen} 
                  isActive={pathname === item.href} 
                  isForum={true} 
                />
              ))}
            </div>
          ))}

          {/* Если мы в разделе МОНИТОРИНГА */}
          {activeTab === 'monitoring' && !isForumPage && (
            <>
              <div className="space-y-1">
                {monitoringItems.main.map(item => (
                  <SidebarLink key={item.href} item={item} isExpanded={isSidebarOpen} isActive={pathname === item.href} />
                ))}
              </div>
              <div className="space-y-1">
                {isSidebarOpen && <p className="px-3 text-[8px] font-black uppercase text-muted/50 tracking-widest mb-1">Игры</p>}
                {monitoringItems.games.map(item => (
                  <SidebarLink key={item.href} item={item} isExpanded={isSidebarOpen} isActive={pathname === item.href} />
                ))}
              </div>
            </>
          )}

          {/* Если мы в разделе КОНТЕНТА */}
          {/* Если мы в разделе КОНТЕНТА */}
          {activeTab === 'content' && !isForumPage && (
            <div className="space-y-1">
              {isSidebarOpen && (
                <p className="px-3 text-[8px] font-black uppercase text-muted/50 tracking-widest mb-1">
                  {contentSection.title}
                </p>
              )}

              {/* КНОПКА СОЗДАНИЯ - ПОДСТРОЕНА ПОД ОСТАЛЬНЫЕ КНОПКИ */}
              <button
                onClick={() => setIsNewProjectModalOpen(true)}
                className={`w-full flex items-center rounded-xl transition-all mb-2
                  ${isSidebarOpen ? 'px-3 py-2' : 'justify-center py-2'} 
                  hover:bg-foreground/[0.04] text-muted hover:text-foreground-bright group`}
                title={!isSidebarOpen ? "Создать проект" : ""}
              >
                <HiPlus className="w-5 h-5 shrink-0 transition-transform group-active:scale-90" />
                {isSidebarOpen && (
                  <span className="ml-3 text-[11px] font-black uppercase tracking-tighter">
                    Создать проект
                  </span>
                )}
              </button>

              {contentSection.items.map((item) => (
                <SidebarLink 
                  key={item.href} 
                  item={item} 
                  isExpanded={isSidebarOpen} 
                  isActive={pathname === item.href} 
                />
              ))}
            </div>
          )}
        </nav>

        {/* USER PANEL */}
        <UserSection 
          user={user} 
          isSidebarOpen={isSidebarOpen} 
          logout={logout} 
        />
      </aside>

      <NewProject isOpen={isNewProjectModalOpen} onClose={() => setIsNewProjectModalOpen(false)} />
    </>
  );
};

export default memo(Sidebar);