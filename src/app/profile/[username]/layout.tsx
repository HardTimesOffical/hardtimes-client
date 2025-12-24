"use client";

import DashboardLayout from "@/app/components/dashboard/dashboard";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
