"use client";

import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import ErrorGeneral from "@/components/errors/general-error";
import { UsersTable } from "./_components/table/UserTable";
import { useUsers } from "./_hooks/use-users";

export default function UsersPage() {
  const { data, isLoading } = useUsers();

  if (isLoading) {
    return (
      <div>
        <HeaderPage title="Usuarios" description="Usuarios registrados en el sistema." />
        <DataTableSkeleton columns={6} />
      </div>
    );
  }

  if (!data) {
    return (
      <div>
        <HeaderPage title="Usuarios" description="Usuarios registrados en el sistema." />
        <ErrorGeneral />
      </div>
    );
  }

  return (
    <div>
      <HeaderPage title="Usuarios" description="Usuarios registrados en el sistema." />
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <UsersTable data={data} />
      </div>
    </div>
  );
}
