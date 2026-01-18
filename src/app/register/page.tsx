 'use client'
import DashboardLayout from "../components/dashboard/dashboard";
import Registration from "../components/auth/registration";

export default function LoginPage(){
	return (
		<DashboardLayout showHero={false}>
			<div className="mt-25 p-10 background-color: #f4f7f9;">
			<Registration />
			</div>
		</DashboardLayout>
	)
}