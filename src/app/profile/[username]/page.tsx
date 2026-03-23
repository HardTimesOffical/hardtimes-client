import LogoutButton from "@/app/profile/[username]/LogoutButton";
import ProfileTabs from "@/app/profile/[username]/profileTabs";

interface ProfilePageProps {
  params: { username: string };
}

// Примечание: Если это Server Component в App Router, оставь async. 
// Если используешь 'use client', params передаются иначе. Оставил структуру для Server Component.
export default async function ProfilePage({ params }: any) {
  const { username } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/${username}`, { cache: "no-store" });
  if (!res.ok) throw new Error("User not found");
  const user = await res.json();

  const isOwner = true; // Замени на реальную проверку сессии

  return (
    <div className="min-h-screen bg-[#1a1a1a] pt-24 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      
      {/* Декоративное свечение на фоне (стиль Синегорск) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#5a6e60]/20 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-[1200px] mx-auto relative z-10 flex flex-col lg:flex-row gap-8 lg:gap-12">
        
        {/* Sidebar: Профиль игрока */}
        <aside className="w-full lg:w-72 shrink-0 flex flex-col items-center lg:items-start">
          
          {/* Аватар в стиле игрового интерфейса */}
          <div className="relative mb-6 group">
            <div className="absolute -inset-1 bg-[#5a6e60]/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative w-40 h-40 lg:w-56 lg:h-56 bg-[#242424] border-2 border-white/5 p-1 overflow-hidden">
              <img 
                src={user.avatar || "/default-avatar.png"} 
                className="w-full h-full object-cover grayscale-[0.3] hover:grayscale-0 transition-all duration-500" 
                alt={username}
              />
              {/* Пиксельный уголок */}
              <div className="absolute top-0 right-0 w-4 h-4 bg-[#5a6e60]/40 translate-x-2 -translate-y-2 rotate-45" />
            </div>
          </div>

          <div className="w-full text-center lg:text-left">
            
            <h1 className="text-2xl lg:text-3xl font-bold text-white uppercase tracking-tight break-words leading-none mb-3">
              {user.username}
            </h1>
            <div className="w-full pt-6 border-t border-white/5">
              <LogoutButton />
            </div>
          </div>
        </aside>

        {/* Основной контент: Вкладки и статистика */}
        <main className="flex-1 min-w-0 bg-[#242424]/50 border border-white/5 p-1">
          <div className="bg-[#242424] border border-white/5 h-full">
             <ProfileTabs user={user} isOwner={isOwner} />
          </div>
        </main>

      </div>
    </div>
  );
}