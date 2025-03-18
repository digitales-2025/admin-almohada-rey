"use client";

import { useMemo } from "react";
import { Table as TableInstance } from "@tanstack/react-table";

import { useProfile } from "@/app/(admin)/profile/_hooks/use-profile";
import { DataTable } from "@/components/datatable/data-table";
import { User } from "../../_types/user";
import { facetedFilters } from "../../_utils/users.filter.utils";
import { usersColumns } from "./UsersTableColumns";
import { UsersTableToolbarActions } from "./UsersTableToolbarActions";

export function UsersTable({ data }: { data: User[] }) {
  const { user } = useProfile();
  const columns = useMemo(() => usersColumns(user?.isSuperAdmin || false), [user]);

  return (
    <DataTable
      data={data}
      columns={columns}
      toolbarActions={(table: TableInstance<User>) => <UsersTableToolbarActions table={table} />}
      filterPlaceholder="Buscar usuarios..."
      facetedFilters={facetedFilters}
    />
  );
}
