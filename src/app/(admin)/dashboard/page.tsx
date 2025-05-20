"use client";

import { useProfile } from "../profile/_hooks/use-profile";
import { UserRolType } from "../users/_types/user";
import { AdminDashboard } from "./_components/admin/AdminDashboard";

export default function DashboardPage() {
  const { user } = useProfile();
  console.log(user?.userRol);
  if (user?.userRol === UserRolType.ADMIN) return <AdminDashboard />;
  return <div></div>;
}
