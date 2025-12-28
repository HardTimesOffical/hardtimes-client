
import ServerList from "../ServersList";
import DashboardLayout from "@/app/components/dashboard/dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Сервера Майнкрафт Java Edition",
  description: "Актуальный список серверов Minecraft Java Edition. Рейтинг, онлайн и лучшие проекты.",
};

export default function JavaServersPage() {
  return (
    <DashboardLayout>
    <div className="list-con">
      <h1 className="text-xl mb-4">Minecraft Java Servers</h1>
      <ServerList game="java" />
    </div>
    </DashboardLayout>  
  );
}
