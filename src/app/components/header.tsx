'use client';

import React, { useState, useEffect, useMemo, useRef, memo, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { NewProject } from './project/NewProject';
import { HeaderBalance } from './header/HeaderBalance';
import { PROJECT_TYPES_BY_GAME } from '@/constants/projectTypes';

import { HiOutlineUser, HiMoon, HiSun, HiX, HiChevronDown } from 'react-icons/hi';

// ─── Minecraft-зелёный для активных кнопок ────────────────────────
// Фон: #3c8527, светлая грань сверху/слева: #5aac44, тёмная снизу/справа: #2a5e1a
const MC_ACTIVE_STYLE: React.CSSProperties = {
  background: '#69ad69',
  boxShadow: [
    'inset  1px  1px 0 #4b833c',   // светлая грань сверху-слева
    'inset -1px -1px 0 #2a5e1a',   // тёмная грань снизу-справа
    ' 0  1px 0 #2a5e1a',           // внешняя тень снизу
    ' 0 -1px 0 #4a9a30',           // внешняя подсветка сверху
  ].join(', '),
  color: '#fff',
};

const MC_ACTIVE_HOVER_CLASS = 'brightness-110';

// ─── Константы ────────────────────────────────────────────────────
const GAME_PLATFORMS = [
  { id: 'minecraft', label: 'Minecraft' },
  { id: 'voxelcore', label: 'VoxelCore' },
];

const MC_PLATFORMS = [
  { id: 'java',    label: 'Java Edition'    },
  { id: 'bedrock', label: 'Bedrock Edition' }
];

// ─── Утилита: клик вне элемента ───────────────────────────────────
function useClickOutside(ref: React.RefObject<HTMLElement | null>, cb: () => void) {
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) cb();
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [ref, cb]);
}

// ═══════════════════════════════════════════════════════════════════
// DROPDOWN
// ═══════════════════════════════════════════════════════════════════
interface DropdownItem {
  id: string;
  label: string;
  href: string;
  count?: number;
}

interface SectionDropdownProps {
  label: string;
  items: DropdownItem[];
  activeId?: string;
  onCreate?: () => void;
  createLabel?: string;
}

const SectionDropdown = memo(({ label, items, activeId, onCreate, createLabel }: SectionDropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  useClickOutside(ref, () => setOpen(false));

  const isAnyActive = items.some(i => i.id === activeId);

  // Константы стилей Синегорск
  const BRAND_COLOR = "#84a98c";
  const TEXT_DIM = "#7d8581";
  const TEXT_BRIGHT = "#ffffff"; // Чистый белый для ховера

  return (
    <div ref={ref} className="relative flex items-stretch">
      <button
        onClick={() => setOpen(o => !o)}
        style={isAnyActive ? { 
          borderTop: `2px solid ${BRAND_COLOR}`, 
          backgroundColor: 'rgba(132, 169, 140, 0.1)',
          color: BRAND_COLOR 
        } : undefined}
        className={`flex items-center gap-1.5 h-full px-4 font-mc-pixel text-[10px] uppercase tracking-widest
          border-r border-white/5 transition-all duration-100 select-none
          ${isAnyActive
            ? 'hover:text-white'
            : 'text-[#7d8581] hover:text-white hover:bg-white/5'
          }`}
      >
        {label}
        <HiChevronDown className={`w-3 h-3 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 z-[200] min-w-[190px]
          bg-[#161817] border border-white/10
          shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
        >
          {/* Создать (Ховер: белый текст) */}
          {onCreate && (
            <button
              onClick={() => { onCreate(); setOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2.5
                font-mc-pixel text-[9px] uppercase border-b border-white/5
                transition-all group"
              style={{ color: BRAND_COLOR }}
              onMouseEnter={e => { 
                (e.currentTarget as HTMLElement).style.background = 'rgba(132, 169, 140, 0.1)'; 
                (e.currentTarget as HTMLElement).style.color = TEXT_BRIGHT; 
              }}
              onMouseLeave={e => { 
                (e.currentTarget as HTMLElement).style.background = ''; 
                (e.currentTarget as HTMLElement).style.color = BRAND_COLOR; 
              }}
            >
              <span className="text-[12px] leading-none font-bold">+</span>
              {createLabel ?? 'Создать'}
            </button>
          )}

          {items.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => { router.push(item.href); setOpen(false); }}
              style={item.id === activeId ? { color: BRAND_COLOR, backgroundColor: 'rgba(132, 169, 140, 0.05)' } : { color: '#aaaaaa' }}
              className={`w-full flex items-center justify-between px-3 py-2.5
                font-mc-pixel text-[9px] uppercase tracking-wider transition-all
                ${item.id === activeId
                  ? 'hover:text-white'
                  : 'hover:bg-white/5 hover:text-white' // Белый текст при наведении на обычный пункт
                }
                ${idx !== items.length - 1 ? 'border-b border-white/5' : ''}`}
              onMouseEnter={e => { 
                if (item.id !== activeId) (e.currentTarget as HTMLElement).style.color = TEXT_BRIGHT; 
              }}
              onMouseLeave={e => { 
                if (item.id !== activeId) (e.currentTarget as HTMLElement).style.color = '#aaaaaa'; 
              }}
            >
              <span>{item.label}</span>
              {item.count !== undefined && item.count > 0 && (
                <span className={`font-mc-pixel text-[8px] px-1 transition-colors
                  ${item.id === activeId ? 'text-[#84a98c]/60' : 'text-[#555555] group-hover:text-white/40'}`}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});
SectionDropdown.displayName = 'SectionDropdown';

// ─── NavLink ──────────────────────────────────────────────────────
const NavLink = memo(({ href, label, isActive, external }: {
  href: string; label: string; isActive: boolean; external?: boolean;
}) => {
  const props = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
  return (
   <Link
      href={href}
      {...props}
      style={isActive ? { 
        borderTop: '2px solid #84a98c', 
        backgroundColor: 'rgba(132, 169, 140, 0.1)' 
      } : undefined}
      className={`flex items-center h-full px-4 font-mc-pixel text-[10px] uppercase tracking-widest
        border-r border-white/5 transition-all duration-200 select-none
        ${isActive
          ? 'text-[#84a98c]'
          : 'text-[#7d8581] hover:text-[#f2f2f2] hover:bg-white/5'
        }`}
    >
      {label}
  </Link>
  );
});
NavLink.displayName = 'NavLink';

// ─── MobileMenu ───────────────────────────────────────────────────
const MobileMenu = memo(({ open, onClose, children }: {
  open: boolean; onClose: () => void; children: React.ReactNode;
}) => (
  <>
    {/* Затемнение фона с эффектом размытия */}
    {open && (
      <div 
        className="fixed inset-0 z-[105] bg-black/40 backdrop-blur-sm transition-opacity animate-fade-in" 
        onClick={onClose} 
      />
    )}

    {/* Панель меню */}
    <div className={`fixed top-14 left-0 right-0 z-[110] overflow-hidden transition-all duration-300 origin-top
      ${open ? 'max-h-[85vh] opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-4 pointer-events-none'}`}
      style={{ 
        backgroundColor: '#161817', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}
    >
      <div className="p-3 flex flex-col gap-1 overflow-y-auto max-h-[85vh]">
        {/* Здесь будут находиться твои ссылки, которые при наведении станут белыми */}
        {children}
      </div>
      
      {/* Декоративная оливковая полоска в самом низу меню для стиля */}
      <div className="h-[1px] w-full opacity-30" style={{ backgroundColor: '#84a98c' }} />
    </div>
  </>
));
MobileMenu.displayName = 'MobileMenu';

// ─── MobileLink ───────────────────────────────────────────────────
const MobileLink = memo(({ href, label, isActive, onClick, isCreate }: {
  href?: string; label: string; isActive?: boolean; onClick: () => void; isCreate?: boolean;
}) => {
  // Цвета Синегорск
  const BRAND = "#84a98c";
  const TEXT_DIM = "#7d8581";
  const BG_HOVER = "rgba(255, 255, 255, 0.05)";

  const base = `w-full flex items-center gap-3 px-4 py-3 border-l-2
    font-mc-pixel text-[10px] uppercase tracking-widest text-left transition-all duration-200`;
  
  const baseCreate = `w-full flex items-center gap-3 px-4 py-3 border border-dashed
    font-mc-pixel text-[9px] uppercase tracking-widest text-left transition-all duration-200`;

  // Стили для активного состояния и ховера
  const activeStyle = { 
    borderColor: BRAND, 
    backgroundColor: 'rgba(132, 169, 140, 0.1)', 
    color: BRAND 
  };

  // 1. Кнопка создания
  if (isCreate) {
    return (
      <button 
        onClick={onClick} 
        className={baseCreate}
        style={{ color: BRAND, borderColor: 'rgba(132, 169, 140, 0.3)', backgroundColor: 'rgba(132, 169, 140, 0.05)' }}
        onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = BRAND; }}
        onMouseLeave={e => { e.currentTarget.style.color = BRAND; e.currentTarget.style.borderColor = 'rgba(132, 169, 140, 0.3)'; }}
      >
        <span className="text-[12px]">+</span> {label}
      </button>
    );
  }

  // 2. Активная ссылка
  if (isActive) {
    const content = <>{label}</>;
    const props = { 
      onClick, 
      className: `${base} border-l-[3px]`, 
      style: activeStyle,
      onMouseEnter: (e: any) => e.currentTarget.style.color = '#fff',
      onMouseLeave: (e: any) => e.currentTarget.style.color = BRAND
    };

    return href ? <Link href={href} {...props}>{content}</Link> : <button {...props}>{content}</button>;
  }

  // 3. Обычная ссылка
  const normalProps = {
    onClick,
    className: `${base} border-transparent text-[#7d8581] hover:bg-white/5 hover:text-white hover:border-l-white/20`,
    onMouseEnter: (e: any) => e.currentTarget.style.color = '#fff',
    onMouseLeave: (e: any) => e.currentTarget.style.color = TEXT_DIM
  };

  return href 
    ? <Link href={href} {...normalProps}>{label}</Link> 
    : <button {...normalProps}>{label}</button>;
});
MobileLink.displayName = 'MobileLink';

// ═══════════════════════════════════════════════════════════════════
// HEADER
// ═══════════════════════════════════════════════════════════════════
const Header = () => {
  const pathname   = usePathname();
  const router     = useRouter();
  const params     = useParams();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [mobileOpen,       setMobileOpen]       = useState(false);
  const [isNewProjectOpen, setIsNewProjectOpen]  = useState(false);
  const [userMenuOpen,     setUserMenuOpen]      = useState(false);
  const [counts,           setCounts]            = useState<Record<string, number>>({});

  const userMenuRef = useRef<HTMLDivElement>(null);
  useClickOutside(userMenuRef, () => setUserMenuOpen(false));

  const isForumPage   = useMemo(() => pathname.startsWith('/forum'), [pathname]);
  const isLauncherPage   = useMemo(() => pathname.startsWith('/ru/launcher'), [pathname]);
  const currentGameId = params?.game as string | undefined;
  const isInsideGame  = useMemo(() => pathname.startsWith('/content/') && !!currentGameId, [pathname, currentGameId]);

  const activeSection = useMemo(() => {
    if (isForumPage) return 'forum';
    if (pathname.startsWith('/content')) return 'content';
    return 'monitoring';
  }, [pathname, isForumPage]);

  const activePlatformId = useMemo(() => {
    const m = pathname.match(/\/monitoring\/servers\/([^/]+)/);
    return m ? m[1] : (pathname === '/monitoring' ? 'all' : undefined);
  }, [pathname]);

  const activeContentTypeId = useMemo(() => {
    if (!isInsideGame) return currentGameId;
    const m = pathname.match(/\/content\/[^/]+\/([^/]+)/);
    return m ? m[1] : 'all';
  }, [pathname, isInsideGame, currentGameId]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Счётчики проектов
  useEffect(() => {
    if (!isInsideGame || !currentGameId) { setCounts({}); return; }
    (async () => {
      try {
        const res  = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/projects?gameType=${currentGameId}&limit=1000`);
        const data = await res.json();
        const projects = data.projects || [];
        const c: Record<string, number> = {};
        let total = 0;
        projects.forEach((p: any) => {
          if (p.gameType?.toLowerCase() === currentGameId.toLowerCase()) {
            c[p.projectType] = (c[p.projectType] || 0) + 1;
            total++;
          }
        });
        c['all'] = total;
        setCounts(c);
      } catch { /* silent */ }
    })();
  }, [currentGameId, isInsideGame]);

  // ── Данные дропдаунов ─────────────────────────────────────────
  const monitoringDropdownItems: DropdownItem[] = [
    { id: 'all',     label: 'Все сервера', href: '/monitoring' },
    { id: 'new',     label: 'Новые',       href: '/monitoring/servers/new' },
    ...MC_PLATFORMS.map(p => ({ id: p.id, label: p.label, href: `/monitoring/servers/${p.id}` })),
  ];

  const contentDropdownItems: DropdownItem[] = useMemo(() => {
    if (!isInsideGame) {
      return GAME_PLATFORMS.map(g => ({ id: g.id, label: g.label, href: `/content/${g.id}` }));
    }
    const types = PROJECT_TYPES_BY_GAME[currentGameId as keyof typeof PROJECT_TYPES_BY_GAME] || [];
    return [
      { id: 'all', label: 'Весь контент', href: `/content/${currentGameId}`, count: counts['all'] },
      ...types.map(t => ({ id: t.value, label: t.label, href: `/content/${currentGameId}/${t.value}`, count: counts[t.value] })),
    ];
  }, [isInsideGame, currentGameId, counts]);

  const monitoringLabel = useMemo(() => {
    if (!activePlatformId || activePlatformId === 'all') return 'Сервера';
    if (activePlatformId === 'new') return 'Новые';
    return MC_PLATFORMS.find(p => p.id === activePlatformId)?.label ?? 'Сервера';
  }, [activePlatformId]);

  const contentLabel = useMemo(() => {
    if (!isInsideGame) return GAME_PLATFORMS.find(g => g.id === currentGameId)?.label ?? 'Контент';
    if (!activeContentTypeId || activeContentTypeId === 'all') return 'Контент';
    const types = PROJECT_TYPES_BY_GAME[currentGameId as keyof typeof PROJECT_TYPES_BY_GAME] || [];
    return types.find(t => t.value === activeContentTypeId)?.label ?? 'Контент';
  }, [isInsideGame, currentGameId, activeContentTypeId]);

  const openNewProject = useCallback(() => { setIsNewProjectOpen(true); setMobileOpen(false); }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[100]
        bg-card/80 backdrop-blur-md border-b border-border/60 h-10 flex items-stretch">

        {/* ── Лого ────────────────────────────────────────────── */}
         <a href='/' className="flex items-center px-4 gap-2 no-underline">
            <img src="/icon.png" className="w-9 h-9  place-items-center text-black font-black text-sm"/>
        </a>

        {/* ── Навигация desktop ───────────────────────────────── */}
        <nav className="hidden md:flex items-stretch">
          <NavLink href="/forum" label="Форум" isActive={isForumPage} />

          <SectionDropdown
            label={activeSection === 'monitoring' ? monitoringLabel : 'Сервера'}
            items={monitoringDropdownItems}
            activeId={activeSection === 'monitoring' ? activePlatformId : undefined}
          />

          <SectionDropdown
            label={activeSection === 'content' ? contentLabel : 'Контент'}
            items={contentDropdownItems}
            activeId={activeSection === 'content' ? (isInsideGame ? activeContentTypeId : currentGameId) : undefined}
            onCreate={activeSection === 'content' ? openNewProject : undefined}
            createLabel="Создать проект"
          />

          <NavLink
            href="/monitoring/workbench"
            label="Добавить сервер"
            isActive={pathname === '/monitoring/workbench'}
          />
          <NavLink href="/ru/launcher" label="Майнкрафт Лаунчер" isActive={isLauncherPage} />
        </nav>

        <div className="flex-1" />

        {/* ── Правая часть ────────────────────────────────────── */}
        <div className="flex items-stretch border-l border-border/60">

          {user ? (
            <>
              {/* Баланс — font-standard для читаемости */}
              <div className="hidden sm:flex items-center px-3 border-r border-border">
                <HeaderBalance />
              </div>

              {/* Пользователь */}
              <div ref={userMenuRef} className="relative flex items-stretch">
               <button
                    onClick={() => setUserMenuOpen(o => !o)}
                    className="flex items-center gap-2.5 px-3 h-full hover:bg-white/5 transition-all group"
                  >
                    {/* Контейнер аватара */}
                    <div className="w-7 h-7 shrink-0 relative p-[1px] bg-white/10 group-hover:bg-[#84a98c]/50 transition-colors">
                      <div className="w-full h-full relative overflow-hidden bg-[#1a1c1a]">
                        {user.avatar ? (
                          <img src={user.avatar} alt="" className="w-full h-full object-cover pixelated" />
                        ) : (
                          <div 
                            className="w-full h-full flex items-center justify-center font-mc-pixel text-[10px]" 
                            style={{ backgroundColor: '#84a98c', color: '#161817' }}
                          >
                            {user.username?.[0].toUpperCase()}
                          </div>
                        )}
                      </div>
                      
                      {/* Индикатор статуса (Оливковый) */}
                      <div 
                        className="absolute -bottom-0.5 -right-0.5 w-2 h-2 border-2 border-[#0a0b0b] rounded-full"
                        style={{ background: '#84a98c', boxShadow: '0 0 4px rgba(132, 169, 140, 0.5)' }} 
                      />
                    </div>

                  {/* Никнейм */}
                  <span className="hidden md:block font-mc-pixel text-[10px] uppercase tracking-wider text-[#7d8581] group-hover:text-white transition-colors">
                    {user.username}
                  </span>

                  {/* Стрелочка */}
                  <HiChevronDown 
                    className={`w-3 h-3 transition-all duration-150 
                      ${userMenuOpen ? 'rotate-180 text-[#84a98c]' : 'text-[#555555] group-hover:text-white'}`} 
                  />
                </button>
                {/* Дропдаун пользователя */}
               {userMenuOpen && (
              <div className="absolute top-full right-0 z-[200] w-44
                bg-[#161817] border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                
                {/* Шапка меню с балансом */}
                <div className="px-3 py-2.5 border-b border-white/5 bg-white/[0.02]">
                  <p className="font-mc-pixel text-[10px] text-[#f2f2f2] uppercase tracking-wider">{user.username}</p>
                  <p className="font-mc-pixel text-[9px] mt-1 uppercase" style={{ color: '#84a98c' }}>
                    {user.balance ?? 0} звёзд
                  </p>
                </div>

                {/* Профиль */}
                <Link
                  href={`/profile/${user.username}`}
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center px-3 py-2.5 border-b border-white/5
                    font-mc-pixel text-[9px] text-[#7d8581] uppercase tracking-widest
                    hover:bg-white/5 hover:text-white transition-all">
                  Профиль
                </Link>

                {/* Выход (Красный акцент) */}
                <button
                  onClick={() => { logout(); setUserMenuOpen(false); }}
                  className="w-full flex items-center px-3 py-2.5 text-left
                    font-mc-pixel text-[9px] text-[#ff3333]/70 uppercase tracking-widest
                    hover:bg-[#ff3333]/10 hover:text-[#ff3333] transition-all">
                  Выйти
                </button>
              </div>
            )}
            </div>
            </>
            ) : (
  <div className="flex items-center h-full px-2">
    <Link 
      href="/login"
      className="flex items-center justify-center px-5 h-8 
                 font-mc-pixel text-[10px] uppercase tracking-[0.15em] 
                 transition-all duration-300 relative group overflow-hidden"
      style={{ 
        backgroundColor: '#49b664', 
        color: '#ffffff',
        boxShadow: 'inset 0 -2px 0 rgb(0, 0, 0), 0 4px 15px rgba(132, 169, 140, 0.2)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#49b664';
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = 'inset 0 -2px 0 rgba(0,0,0,0.2), 0 6px 20px rgba(132, 169, 140, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#52b96c';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'inset 0 -2px 0 rgba(0,0,0,0.2), 0 4px 15px rgba(132, 169, 140, 0.2)';
      }}
    >
      {/* Декоративный "блик" при наведении */}
      <div className="absolute inset-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      
      {/* Пиксельные уголки */}
      <div className="absolute top-0 left-0 w-1 h-1 bg-white/20" />
      <div className="absolute bottom-0 right-0 w-1 h-1 bg-black/10" />

      <span className="relative z-10 font-bold ">Войти</span>
    </Link>
  </div>
)}

          {/* Мобильный бургер */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            className="md:hidden w-12 flex flex-col items-center justify-center gap-[3px]
              border-l border-white/5 transition-all duration-200 group relative"
            style={{ backgroundColor: mobileOpen ? 'rgba(132, 169, 140, 0.1)' : 'transparent' }}
            aria-label="Меню"
          >
            {mobileOpen ? (
              // Крестик в пиксельном стиле через текст или иконку
              <span className="font-mc-pixel text-[14px] text-[#ff3333] transition-colors group-hover:text-white">
                ✕
              </span>
            ) : (
              // Самодельный "бургер" из полосок для контроля стиля
              <>
                <div className="w-4 h-[2px] bg-[#7d8581] group-hover:bg-[#84a98c] transition-colors" />
                <div className="w-4 h-[2px] bg-[#7d8581] group-hover:bg-[#84a98c] transition-colors" />
                <div className="w-4 h-[2px] bg-[#7d8581] group-hover:bg-[#84a98c] transition-colors" />
              </>
            )}

            {/* Нижняя подсветка при открытом меню */}
            {mobileOpen && (
              <div className="absolute bottom-0 left-0 w-full h-[2px]" style={{ backgroundColor: '#84a98c' }} />
            )}
          </button>
        </div>
      </header>

      {/* ── Мобильное меню ────────────────────────────────────── */}
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <p className="font-mc-pixel text-[9px] uppercase text-muted/50 tracking-widest px-1 mt-1">Разделы</p>
        <MobileLink href="/forum"       label="Форум"   isActive={isForumPage}                onClick={() => setMobileOpen(false)} />
        <MobileLink href="/monitoring"  label="Сервера" isActive={activeSection==='monitoring'} onClick={() => setMobileOpen(false)} />
        <MobileLink href="/content"     label="Контент" isActive={activeSection==='content'}   onClick={() => setMobileOpen(false)} />

        {activeSection === 'monitoring' && <>
          <p className="font-mc-pixel text-[9px] uppercase text-muted/50 tracking-widest px-1 mt-3">Платформа</p>
          {monitoringDropdownItems.map(item => (
            <MobileLink key={item.id} href={item.href} label={item.label}
              isActive={item.id === activePlatformId} onClick={() => setMobileOpen(false)} />
          ))}
          <MobileLink href="/monitoring/workbench" label="Добавить сервер"
            isActive={pathname === '/monitoring/workbench'} onClick={() => setMobileOpen(false)} />
        </>}

        {activeSection === 'content' && <>
          <p className="font-mc-pixel text-[9px] uppercase text-muted/50 tracking-widest px-1 mt-3">
            {isInsideGame ? currentGameId?.toUpperCase() : 'Игры'}
          </p>
          <MobileLink label="+ Создать проект" isCreate onClick={openNewProject} />
          {contentDropdownItems.map(item => (
            <MobileLink key={item.id} href={item.href}
              label={item.count !== undefined ? `${item.label} (${item.count})` : item.label}
              isActive={item.id === (isInsideGame ? activeContentTypeId : currentGameId)}
              onClick={() => setMobileOpen(false)} />
          ))}
        </>}

        {isForumPage && <>
          <p className="font-mc-pixel text-[9px] uppercase text-muted/50 tracking-widest px-1 mt-3">Форум</p>
          <MobileLink href="/forum"             label="Лента"      isActive={pathname === '/forum'}             onClick={() => setMobileOpen(false)} />
          <MobileLink href="/forum/create-post" label="Новая тема" isActive={pathname === '/forum/create-post'} onClick={() => setMobileOpen(false)} />
        </>}
      </MobileMenu>

      <NewProject isOpen={isNewProjectOpen} onClose={() => setIsNewProjectOpen(false)} />
    </>
  );
};

export default memo(Header);