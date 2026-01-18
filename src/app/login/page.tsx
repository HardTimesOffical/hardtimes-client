 'use client'
import DashboardLayout from "../components/dashboard/dashboard";
import Login from "../components/auth/login";

export default function LoginPage(){
	return (
        <DashboardLayout>
            <div className="mt-16 background-color: #f4f7f9;">
                <Login />
            </div>
        </DashboardLayout>
	)
}
