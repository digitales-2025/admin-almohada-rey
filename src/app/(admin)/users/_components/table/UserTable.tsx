"use client";

import { useMemo } from "react";
import { CheckCircle2, XCircle } from "lucide-react"; // Importa los iconos

import { useProfile } from "@/app/(admin)/profile/_hooks/use-profile";
import { DataTable } from "@/components/datatable/data-table";
import { User } from "../../_types/user";
import { usersColumns } from "./UsersTableColumns";
import { UsersTableToolbarActions } from "./UsersTableToolbarActions";

export function UsersTable({ data }: { data: User[] }) {
  const { user } = useProfile();
  const columns = useMemo(() => usersColumns(user?.isSuperAdmin || false), [user]);

  const facetedFilters = [
    {
      column: "estado",
      title: "Estado",
      options: [
        {
          label: "Activo",
          value: true,
          icon: CheckCircle2,
        },
        {
          label: "Inactivo",
          value: false,
          icon: XCircle,
        },
      ],
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      toolBarActions={<UsersTableToolbarActions />}
      filterPlaceholder="Buscar usuarios..."
      facetedFilters={facetedFilters}
    />
  );
}
