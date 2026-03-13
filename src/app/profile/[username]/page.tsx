
import LogoutButton from "@/app/profile/[username]/LogoutButton";
import ProfileTabs from "@/app/profile/[username]/profileTabs";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/${username}`, { cache: "no-store" });
  if (!res.ok) throw new Error("User not found");
  const user = await res.json();

  // Логика проверки владельца (примерная, зависит от вашей auth системы)
  // В идеале вы получаете сессию через cookie или заголовок
  const isOwner = true; // Замените на реальную проверку session.user.username === username

  return (
   <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
      {/* Sidebar: Уменьшаем ширину и аватар */}
      <aside className="w-full lg:w-64 shrink-0 flex flex-col items-center lg:items-start text-center lg:text-left">
        <div className="relative mb-4 w-32 h-32 lg:w-48 lg:h-48"> 
          <img 
            src={user.avatar || "/default-avatar.png"} 
            className="w-full h-full rounded-xl border border-border bg-card shadow-sm object-cover" 
            alt={user.username}
          />
        </div>
        <div className="w-full">
          <h1 className="text-xl lg:text-2xl font-bold text-foreground-bright break-words">{user.username}</h1>
          <p className="text-muted text-sm mt-2 line-clamp-3">{user.bio}</p>
          <div className="mt-6">
            <LogoutButton />
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0"> {/* min-w-0 важен для предотвращения распирания сетки */}
        <ProfileTabs user={user} isOwner={isOwner} />
      </main>
    </div>
  );
}