"use client";

import ServerList from "../ServersList";
import DashboardLayout from "@/app/components/dashboard/dashboard";

export default function JavaServersPage() {
  return (
    <DashboardLayout>
    <div>
      <h1 className="text-xl mb-4">Minecraft Java Servers</h1>
      <ServerList game="java" />
    </div>
    </DashboardLayout>  
  );
}
