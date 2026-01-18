import ServerList from "../ServersList";
import DashboardLayout from "@/app/components/dashboard/dashboard";
import ServerFilters from "@/app/components/servercard/ServerFilters";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Новые сервера Майнкрафт — Свежие проекты",
  description: "Список только что добавленных серверов Minecraft. Будь первым на новом сервере!",
};

export default async function NewServersPage({ searchParams }: { searchParams: any }) {
  const filters = await searchParams;

  return (
    <DashboardLayout showHero={true}>
      <div className="list-con flex flex-col items-center w-full px-4">
        <div className="w-full max-w-[1000px]">
          <h1 className="text-2xl font-bold mb-4 text-1 tracking-tight uppercase">
            New Minecraft Servers
          </h1>
          <ServerFilters />
          {/* Добавляем пропс sort="new" */}
          <ServerList filters={filters} game="all" sort="new" />
        </div>
      </div>
    </DashboardLayout>
  );
}