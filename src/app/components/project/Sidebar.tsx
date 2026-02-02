'use client';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { 
  HiOutlineAdjustments, HiOutlineHashtag, HiOutlineDocumentText, 
  HiOutlineCollection, HiOutlineScale, HiOutlinePhotograph, 
  HiOutlineLink, HiOutlineUsers, HiOutlineChartBar 
} from 'react-icons/hi';

const menuItems = [
  { id: 'settings', label: 'Основные', icon: HiOutlineAdjustments },
  { id: 'tags', label: 'Теги', icon: HiOutlineHashtag },
  { id: 'description', label: 'Описание', icon: HiOutlineDocumentText },
  { id: 'versions', label: 'Версии', icon: HiOutlineCollection },
  { id: 'gallery', label: 'Галерея', icon: HiOutlinePhotograph },
  { id: 'links', label: 'Ссылки', icon: HiOutlineLink },
  { id: 'members', label: 'Участники', icon: HiOutlineUsers },
  { id: 'analytics', label: 'Аналитика', icon: HiOutlineChartBar },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { slug } = useParams();

  return (
    <aside className="w-full md:w-64 flex flex-col gap-2">
      {menuItems.map((item) => {
        const basePath = `/content/project/${slug}/settings`;
        const href = item.id === 'settings' ? basePath : `${basePath}/${item.id}`;
        
        const isActive = pathname === href;

        return (
          <Link 
            key={item.id} 
            href={href}
            className={`
              flex items-center gap-3 px-5 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-wider transition-all duration-300
              ${isActive 
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20 translate-x-1' 
                : 'text-gray-400 hover:bg-white hover:text-gray-600 hover:shadow-sm'}
            `}
          >
            <item.icon 
              size={20} 
              className={`transition-colors ${isActive ? 'text-white' : 'text-gray-300'}`} 
            />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </aside>
  );
}