 'use client'
import DashboardLayout from "../components/dashboard/dashboard";
import Registration from "../components/auth/registration";

export default function LoginPage(){
	return (
		<DashboardLayout>
			<Registration />
		</DashboardLayout>
	)
}