"use client";

import { useProfile } from "../profile/_hooks/use-profile";
import { UserRolType } from "../users/_types/user";
import { AdminDashboard } from "./_components/admin/AdminDashboard";
import { DashboardGreeting } from "./_components/DashboardGreeting";
import { ReceptionistDashboard } from "./_components/recepcionist/ReceptionistDashboard";

export default function DashboardPage() {
  const { user } = useProfile();
  if (user?.userRol === UserRolType.ADMIN)
    return (
      <div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <DashboardGreeting userName={user.name} />
          <div id="headerContent" className="mb-4 justify-items-end sm:mb-0"></div>
        </div>
        <AdminDashboard />
      </div>
    );
  if (user?.userRol === UserRolType.RECEPCIONIST)
    return (
      <div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <DashboardGreeting userName={user.name} />
          <div id="headerContent" className="mb-4 justify-items-end sm:mb-0"></div>
        </div>
        <ReceptionistDashboard />
      </div>
    );
}
