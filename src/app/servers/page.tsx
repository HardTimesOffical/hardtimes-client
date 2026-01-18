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
    url: "https://hardmonitoring.ru/servers",
    type: "website",
  },
};

export default function ServersPage() {
  return (
    <DashboardLayout>
      {/* Центрируем всю секцию */}
      <section className="flex flex-col items-center w-full px-4">
        
        {/* Ограничиваем ширину текстового блока, чтобы он совпадал с шириной списка */}
        <div className="w-full max-w-[1000px]">
          <h1 className="text-2xl font-bold mb-4 text-1 tracking-tight uppercase">
            Game Server Monitoring <span className="text-blue-500">&</span> Analytics
          </h1>
          
          <p className="text-gray-400 mb-6 text-sm">
            Explore the best servers for Minecraft, Hytale, VoxelCore, and other voxel-based universes.
          </p>
        </div>

        {/* Контейнер для списка серверов */}
        <div className="list-con w-full max-w-[1000px]">
          <ServerList game="all" />
        </div>
      </section>
    </DashboardLayout>
  );
}