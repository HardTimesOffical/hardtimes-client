import DashboardLayout from "../components/dashboard/dashboard";
import ServerList from "./ServersList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Мониторинг серверов Minecraft, Hytale & VoxelCore | Поиск игровых миров",
  description: "Единая платформа мониторинга воксельных игр. Найди лучшие сервера Minecraft (Java/Bedrock), готовься к выходу Hytale и тестируй проекты на VoxelCore. Статистика онлайна и удобный поиск.",
  keywords: [
    "сервера майнкрафт", 
    "мониторинг hytale", 
    "voxelcore сервера", 
    "список серверов hytale", 
    "игровой мониторинг воксельных игр"
  ],
  openGraph: {
    title: "Multi-Game Server Monitoring | Minecraft, Hytale, VoxelCore",
    description: "Рейтинг и онлайн серверов для самых популярных воксельных проектов.",
    type: "website",
  },
};

export default function ServersPage() {
  return (
    <DashboardLayout>
      <section>
        {/* Динамичный заголовок, подчеркивающий мультиплатформенность */}
        <h1 className="text-[24px] font-bold mb-[12px] text-white tracking-tight">
          Game Server Monitoring <span className="text-blue-500">&</span> Analytics
        </h1>
        
        <p className="text-gray-400 mb-6 text-sm">
          Explore the best servers for Minecraft, Hytale, VoxelCore, and other voxel-based universes.
        </p>

        <div className="list-con grid grid-cols-1 gap-4">
          <ServerList game="all" />
        </div>
      </section>
    </DashboardLayout>
  );
}