'use client';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { 
  HiOutlineAdjustments, HiOutlineHashtag, HiOutlineDocumentText, 
  HiOutlineCollection, HiOutlinePhotograph, 
  HiOutlineLink, HiOutlineUsers, HiOutlineChartBar 
} from 'react-icons/hi';

const menuItems = [
  { id: 'settings', label: 'Основные', icon: HiOutlineAdjustments },
  { id: 'tags', label: 'Теги', icon: HiOutlineHashtag },
  { id: 'description', label: 'Описание', icon: HiOutlineDocumentText },
  { id: 'versions', label: 'Версии', icon: HiOutlineCollection },
  { id: 'gallery', label: 'Галерея', icon: HiOutlinePhotograph },
  { id: 'links', label: 'Ссылки', icon: HiOutlineLink },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { slug } = useParams();

  return (
    <aside className="w-full md:w-64 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible gap-1.5 p-1 md:p-0 scrollbar-hide">
      {menuItems.map((item) => {
        const basePath = `/content/project/${slug}/settings`;
        const href = item.id === 'settings' ? basePath : `${basePath}/${item.id}`;
        const isActive = pathname === href;

        return (
          <Link 
            key={item.id} 
            href={href}
            className={`
              flex items-center gap-3 px-4 py-2.5 rounded-xl text-[12px] font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap
              border border-transparent
              
              ${isActive 
                ? 'bg-[var(--accent)] text-[var(--contrast-text)] shadow-lg shadow-[var(--accent)]/20' 
                : 'text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground-bright)] hover:border-[var(--border)]'}
            `}
          >
            <item.icon 
              size={20} 
              className={`transition-colors ${isActive ? 'text-[var(--contrast-text)]' : 'text-[var(--muted)]'}`} 
            />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </aside>
  );
}