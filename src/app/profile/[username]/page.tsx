import styles from "./profile.module.css";
import Link from "next/link";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;

  const res = await fetch(
    `http://localhost:5000/users/${username}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("User not found");
  }

  const user = await res.json();

  const joinedDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className={styles.container}>
      <div className={styles.headerBanner}>
        <div className={styles.bannerOverlay} />
      </div>

      <div className={styles.content}>
        <div className={styles.profileSidebar}>
          <div className={styles.avatarWrapper}>
            <img 
              src={user.avatar || "/default-avatar.png"} 
              alt={user.username} 
              className={styles.avatar}
            />
          </div>
          
          <div className={styles.mainInfo}>
            <h1 className={styles.username}>{user.username}</h1>
            <div className={styles.badge}>User</div>
            <p className={styles.bio}>{user.bio || "No bio yet"}</p>
          </div>
        </div>

        <div className={styles.mainContent}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Servers</span>
              <span className={styles.statValue}>{user.ownedServersCount || 0}</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Votes (Weekly)</span>
              <span className={styles.statValue}>{user.votesWeekly || 0}</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Total Votes</span>
              <span className={styles.statValue}>{user.votesTotal || 0}</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Joined</span>
              <span className={styles.statValue}>{joinedDate}</span>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>User Servers</h2>
            
            {user.servers && user.servers.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {user.servers.map((server: any) => (
                  <Link 
                    key={server._id} 
                    href={`/${server.slug}`}
                    className="group flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/[0.08] hover:border-blue-500/50 transition-all"
                  >
                    {/* Широкий GIF баннер (соотношение сторон примерно 3:1 или 4:1) */}
                    <div className="relative w-full h-20 sm:h-20 bg-gray-900 border-b border-white/5 overflow-hidden">
                      {server.imageUrl ? (
                        <img 
                          src={server.imageUrl} 
                          alt="" 
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/10 text-xs uppercase tracking-widest">
                          No Banner
                        </div>
                      )}
                      {/* Затемнение снизу для лучшей читаемости (опционально) */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
                    </div>
                    
                    {/* Контент под баннером */}
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex flex-col">
                        <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition">
                          {server.serverName}
                        </h3>
                        <p className="text-xs text-white/40 font-mono tracking-tighter">{server.ipAddress}</p>
                      </div>

                      <div className="flex items-center gap-6">
                        {/* Статус сервера */}
                        <div className="text-right hidden sm:flex flex-col items-end">
                          {server.status?.online ? (
                            <>
                              <div className="flex items-center gap-1.5 text-green-400 text-sm font-bold">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                ONLINE
                              </div>
                              <span className="text-[10px] text-white/40 font-medium">
                               {server.status.players}/{server.status.maxPlayers} PLAYERS
                              </span>
                            </>
                          ) : (
                            <div className="flex items-center gap-1.5 text-red-500 text-sm font-bold opacity-70">
                              <span className="h-2 w-2 rounded-full bg-red-600"></span>
                              OFFLINE
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                No servers added yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}