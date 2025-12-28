
import ServerList from "../ServersList";
import DashboardLayout from "@/app/components/dashboard/dashboard";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { type: string } }): Promise<Metadata> {
  const type = params.type === 'bedrock' ? 'Java Edition' : 'Bedrock Edition';
  return {
    title: `Сервера Майнкрафт ${type}`,
    description: `Актуальный список серверов Minecraft ${type}. Рейтинг, онлайн, версии и описание лучших проектов.`,
  };
}

export default function JavaServersPage() {
  return (
    <DashboardLayout>
    <div className="list-con">
      <h1 className="text-xl mb-4">Minecraft Bedrock Servers</h1>  
      <ServerList game="bedrock" />
    </div>
    </DashboardLayout>
  );
}
