'use client'
import DashboardLayout from "../components/dashboard/dashboard";
import ServerList from "./ServersList";

export default function ServersPage(){
  return (
    <DashboardLayout>
      <section>
        <h1 style={{fontSize:22, marginBottom:10}}>Servers</h1>
        <div style={{display:'grid', gridTemplateColumns:'1fr', gap:12}} className="list-con">
          <ServerList game="all"/>
        </div>
      </section>
    </DashboardLayout>
  )
}
