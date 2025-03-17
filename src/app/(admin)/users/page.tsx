"use client";

import { HeaderPage } from "@/components/common/HeaderPage";
import { UsersTable } from "./_components/table/UserTable";
import { useUsers } from "./_hooks/use-users";

export default function UsersPage() {
  const { data, isLoading } = useUsers();

  console.log(data, isLoading);
  return (
    <div>
      <HeaderPage title="Usuarios" description="Usuarios registrados en el sistema." />
      <UsersTable data={data ?? []} />
    </div>
  );
}
