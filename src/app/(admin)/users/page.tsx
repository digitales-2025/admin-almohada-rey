"use client";

import { useCallback, useState } from "react";

import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import ErrorGeneral from "@/components/errors/general-error";
import { UsersTable } from "./_components/table/UserTable";
import { usePaginatedUsers } from "./_hooks/use-users";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { paginatedUsers, isLoadingPaginatedUsers } = usePaginatedUsers({ page, pageSize });

  const handlePaginationChange = useCallback((newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  }, []);

  if (isLoadingPaginatedUsers) {
    return (
      <div>
        <HeaderPage title="Usuarios" description="Usuarios registrados en el sistema." />
        <DataTableSkeleton columns={6} />
      </div>
    );
  }

  if (!paginatedUsers) {
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
        <UsersTable
          data={paginatedUsers.data}
          pagination={{
            page: paginatedUsers.meta.page,
            pageSize: paginatedUsers.meta.pageSize,
            total: paginatedUsers.meta.total,
            totalPages: paginatedUsers.meta.totalPages,
          }}
          onPaginationChange={handlePaginationChange}
        />
      </div>
    </div>
  );
}
