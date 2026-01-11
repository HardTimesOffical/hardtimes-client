import ServerList from "../ServersList";
import DashboardLayout from "@/app/components/dashboard/dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Сервера Майнкрафт Java Edition — ТОП мониторинг и IP адреса",
  description: "Список лучших серверов Minecraft Java Edition. Удобный поиск по версиям, актуальный онлайн, подробные описания и честный рейтинг. Найди свой идеальный сервер!",
  keywords: [
    "сервера майнкрафт java edition",
    "мониторинг серверов java",
    "ip адреса серверов майнкрафт",
    "minecraft java servers",
    "лучшие сервера майнкрафт"
  ],
  alternates: {
    canonical: "https://hardmonitoring.ru/servers/java", // Обновлено на твой домен
  },
  openGraph: {
    title: "Мониторинг серверов Minecraft Java Edition",
    description: "Рейтинг, онлайн и лучшие игровые проекты в одном списке.",
    url: "https://hardmonitoring.ru/servers/java",
    type: "website",
    siteName: "HardMonitoring"
  },
};

export default function JavaServersPage() {
  return (
    <DashboardLayout>
      {/* Центрируем всё содержимое по горизонтали */}
      <div className="list-con flex flex-col items-center w-full px-4">
        
        {/* Контейнер-ограничитель для заголовка (выровнен по левому краю списка) */}
        <div className="w-full max-w-[1000px]">
          <h1 className="text-2xl font-bold mb-4 tracking-tight text-white uppercase">
            Minecraft Java Edition Servers
          </h1>
        </div>
        
        {/* Контейнер для списка серверов */}
        <div className="w-full max-w-[1000px] flex justify-center">
          <ServerList game="java" />
        </div>
      </div>
    </DashboardLayout>
  );
}