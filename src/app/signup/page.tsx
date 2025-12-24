'use client'
import DashboardLayout from "../components/dashboard/dashboard";

export default function SignupPage(){
  return (
    <DashboardLayout>
      <section>
        <h1 style={{fontSize:22, marginBottom:10}}>Sign Up</h1>
        <div style={{width:360, background:'#071228', padding:16, borderRadius:8}}>
          <label style={{display:'block', marginBottom:6}}>Username</label>
          <input style={{width:'100%', marginBottom:8, padding:8, borderRadius:6}} />
          <label style={{display:'block', marginBottom:6}}>Email</label>
          <input style={{width:'100%', marginBottom:8, padding:8, borderRadius:6}} />
          <label style={{display:'block', marginBottom:6}}>Password</label>
          <input type="password" style={{width:'100%', marginBottom:8, padding:8, borderRadius:6}} />
          <button style={{background:'#0b84ff', color:'#fff', padding:'8px 12px', borderRadius:6}}>Sign Up</button>
        </div>
      </section>
    </DashboardLayout>
  )
}
