"use client";

import { useMemo } from "react";
import { Table as TableInstance } from "@tanstack/react-table";

import { useProfile } from "@/app/(admin)/profile/_hooks/use-profile";
import { DataTable } from "@/components/datatable/data-table";
import {
  CustomPaginationTableParams,
  ServerPaginationChangeEventCallback,
} from "@/types/tanstack-table/CustomPagination";
import { User } from "../../_types/user";
import { facetedFilters } from "../../_utils/users.filter.utils";
import { usersColumns } from "./UsersTableColumns";
import { UsersTableToolbarActions } from "./UsersTableToolbarActions";

interface UsersTableProps {
  data: User[];
  pagination: CustomPaginationTableParams;
  onPaginationChange: ServerPaginationChangeEventCallback;
}

export function UsersTable({ data, pagination, onPaginationChange }: UsersTableProps) {
  const { user } = useProfile();
  const columns = useMemo(() => usersColumns(user?.isSuperAdmin || false), [user]);

  return (
    <DataTable
      data={data}
      columns={columns}
      toolbarActions={(table: TableInstance<User>) => <UsersTableToolbarActions table={table} />}
      filterPlaceholder="Buscar usuarios..."
      facetedFilters={facetedFilters}
      serverPagination={{
        pageIndex: pagination.page - 1,
        pageSize: pagination.pageSize,
        pageCount: pagination.totalPages,
        total: pagination.total,
        onPaginationChange: (pageIndex, pageSize) => {
          // Convertir de 0-indexed a 1-indexed para el API
          onPaginationChange(pageIndex + 1, pageSize);
        },
      }}
    />
  );
}
