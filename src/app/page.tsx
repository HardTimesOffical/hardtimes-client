'use client'
import Image from "next/image";
import DashboardLayout from "./components/dashboard/dashboard";
import ServerList from "./servers/ServersList";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <DashboardLayout>
        <div style={{paddingTop:12}}>
          <ServerList game="java"/>
        </div>
      </DashboardLayout>
    </div>
  );
}
