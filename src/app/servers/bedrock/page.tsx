"use client";

import ServerList from "../ServersList";
import DashboardLayout from "@/app/components/dashboard/dashboard";

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
