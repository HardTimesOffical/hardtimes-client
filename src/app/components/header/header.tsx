'use client';

import React, { useState, useEffect, useMemo, useRef, memo, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { NewProject } from '../project/NewProject';
import { HeaderBalance } from './HeaderBalance';
import { PROJECT_TYPES_BY_GAME } from '@/constants/projectTypes';

import { HiOutlineUser, HiMoon, HiSun, HiX, HiChevronDown } from 'react-icons/hi';
import { HiOutlineArrowRightOnRectangle } from 'react-icons/hi2';

// ─── Minecraft-зелёный для активных кнопок ────────────────────────
// Фон: #3c8527, светлая грань сверху/слева: #5aac44, тёмная снизу/справа: #2a5e1a
const MC_ACTIVE_STYLE: React.CSSProperties = {
  background: '#3c8527',
  boxShadow: [
    'inset  1px  1px 0 #5aac44',   // светлая грань сверху-слева
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
  { id: 'hytale',    label: 'Hytale'    },
  { id: 'voxelcore', label: 'VoxelCore' },
];

const MC_PLATFORMS = [
  { id: 'java',    label: 'Java Edition'    },
  { id: 'bedrock', label: 'Bedrock Edition' },
  { id: 'hytale',  label: 'Hytale'         },
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

  return (
    <div ref={ref} className="relative flex items-stretch">
      <button
        onClick={() => setOpen(o => !o)}
        style={isAnyActive ? MC_ACTIVE_STYLE : undefined}
        className={`flex items-center gap-1.5 h-full px-4 font-mc-pixel font-bold text-[11px]
          border-x border-border/60 transition-all duration-100 select-none
          ${isAnyActive
            ? 'hover:brightness-110'
            : 'bg-transparent text-muted hover:text-foreground-bright hover:bg-white/5'
          }`}
      >
        {label}
        <HiChevronDown className={`w-3 h-3 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 z-[200] min-w-[190px]
          bg-card border-2 border-border
          shadow-[4px_4px_0_rgba(0,0,0,0.6)]"
        >
          {/* Создать */}
          {onCreate && (
            <button
              onClick={() => { onCreate(); setOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2.5
                font-mc-pixel text-[10px] uppercase border-b border-border
                transition-colors"
              style={{ color: '#5aac44' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#3c8527'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ''; (e.currentTarget as HTMLElement).style.color = '#5aac44'; }}
            >
              <span className="text-sm leading-none font-bold">+</span>
              {createLabel ?? 'Создать'}
            </button>
          )}

          {items.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => { router.push(item.href); setOpen(false); }}
              style={item.id === activeId ? MC_ACTIVE_STYLE : undefined}
              className={`w-full flex items-center justify-between px-3 py-2.5
                font-standard font-semibold text-[11px] transition-colors
                ${item.id === activeId
                  ? 'hover:brightness-110'
                  : 'text-foreground hover:bg-surface hover:text-foreground-bright'
                }
                ${idx !== items.length - 1 ? 'border-b border-border/30' : ''}`}
            >
              <span>{item.label}</span>
              {item.count !== undefined && item.count > 0 && (
                <span className={`font-mc-pixel text-[9px] px-1
                  ${item.id === activeId ? 'text-white/60' : 'text-muted'}`}>
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
      style={isActive ? MC_ACTIVE_STYLE : undefined}
      className={`flex items-center h-full px-4 font-mc-pixel font-bold text-[11px]
        border-x border-border/60 transition-all duration-100 select-none
        ${isActive
          ? 'hover:brightness-110'
          : 'text-muted hover:text-foreground-bright hover:bg-white/5'
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
    {open && <div className="fixed inset-0 z-[105] bg-black/60" onClick={onClose} />}
    <div className={`fixed top-14 left-0 right-0 z-[110] bg-card border-b-2 border-border
      overflow-hidden transition-all duration-200 origin-top
      ${open ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}
    >
      <div className="p-3 flex flex-col gap-1 overflow-y-auto max-h-[80vh]">
        {children}
      </div>
    </div>
  </>
));
MobileMenu.displayName = 'MobileMenu';

// ─── MobileLink ───────────────────────────────────────────────────
const MobileLink = memo(({ href, label, isActive, onClick, isCreate }: {
  href?: string; label: string; isActive?: boolean; onClick: () => void; isCreate?: boolean;
}) => {
  const base = `w-full flex items-center gap-3 px-3 py-2.5 border
    font-mc-pixel font-semibold text-[11px] text-left transition-all`;
  const baseCreate = `w-full flex items-center gap-3 px-3 py-2.5 border
    font-mc-title text-[10px] uppercase tracking-wide text-left transition-all`;

  if (isCreate) {
    return (
      <button onClick={onClick} className={`${baseCreate} border-dashed border-border`}
        style={{ color: '#5aac44' }}>
        {label}
      </button>
    );
  }
  if (isActive) {
    return href
      ? <Link href={href} onClick={onClick} className={`${base} border-transparent`} style={MC_ACTIVE_STYLE}>{label}</Link>
      : <button onClick={onClick} className={`${base} border-transparent`} style={MC_ACTIVE_STYLE}>{label}</button>;
  }
  return href
    ? <Link href={href} onClick={onClick} className={`${base} border-transparent text-muted hover:bg-surface hover:text-foreground-bright hover:border-border`}>{label}</Link>
    : <button onClick={onClick} className={`${base} border-transparent text-muted hover:bg-surface hover:text-foreground-bright hover:border-border`}>{label}</button>;
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
        bg-card/80 backdrop-blur-md border-b border-border/60 h-13 flex items-stretch">

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
                  className="flex items-center gap-2 px-3 hover:bg-surface transition-colors">
                  <div className="w-7 h-7 shrink-0 relative overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center
                        font-mc-title text-[11px]" style={MC_ACTIVE_STYLE}>
                        {user.username?.[0].toUpperCase()}
                      </div>
                    )}
                    <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border border-card"
                      style={{ background: '#5aac44' }} />
                  </div>
                  <span className="hidden md:block font-mc-title text-[10px] text-foreground-bright">
                    {user.username}
                  </span>
                  <HiChevronDown className={`w-3 h-3 text-muted transition-transform duration-150
                    ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Дропдаун пользователя */}
                {userMenuOpen && (
                  <div className="absolute top-full right-0 z-[200] w-44
                    bg-card border-2 border-border shadow-[4px_4px_0_rgba(0,0,0,0.6)]">
                    <div className="px-3 py-2.5 border-b border-border">
                      <p className="font-mc-title text-[11px] text-foreground-bright">{user.username}</p>
                      {/* font-standard — читаемый шрифт для баланса */}
                      <p className="font-standard text-[11px] font-bold mt-0.5" style={{ color: '#5aac44' }}>
                        {user.balance ?? 0} звёзд
                      </p>
                    </div>
                    <Link
                      href={`/profile/${user.username}`}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center px-3 py-2.5 border-b border-border/50
                        font-mc-title text-[10px] text-muted
                        hover:bg-surface hover:text-foreground-bright transition-colors">
                      Профиль
                    </Link>
                    <button
                      onClick={() => { logout(); setUserMenuOpen(false); }}
                      className="w-full flex items-center px-3 py-2.5 text-left
                        font-mc-title text-[10px] text-muted
                        hover:bg-surface hover:text-foreground-bright transition-colors">
                      Выйти
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link href="/login"
              className="flex items-center px-4 font-mc-title text-[10px] transition-all hover:brightness-110"
              style={MC_ACTIVE_STYLE}>
              Войти
            </Link>
          )}

          {/* Мобильный бургер */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            className="md:hidden w-10 flex items-center justify-center
              border-l border-border text-muted
              hover:text-foreground-bright hover:bg-surface transition-colors"
            aria-label="Меню">
            {mobileOpen
              ? <HiX className="w-4 h-4" />
              : <span className="font-mc-pixel text-sm leading-none">≡</span>}
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