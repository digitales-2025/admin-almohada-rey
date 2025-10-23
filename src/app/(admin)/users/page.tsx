"use client";

import { useCallback, useState } from "react";

import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import ErrorGeneral from "@/components/errors/general-error";
import { UsersTable } from "./_components/table/UserTable";
import { useAdvancedUsers } from "./_hooks/useAdvancedUsers";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Usar el hook avanzado
  const {
    data: usersData,
    meta: usersMeta,
    isLoading,
    error,
    tableState,
    tableActions,
    filtersState,
    getFilterValueByColumn,
    localSearch,
  } = useAdvancedUsers({
    initialPagination: { page, pageSize },
  });

  const handlePaginationChange = useCallback((newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  }, []);

  if (isLoading) {
    return (
      <div>
        <HeaderPage title="Usuarios" description="Usuarios registrados en el sistema." />
        <DataTableSkeleton columns={6} />
      </div>
    );
  }

  if (error) {
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
          data={usersData}
          pagination={{
            page: usersMeta?.page || page,
            pageSize: usersMeta?.pageSize || pageSize,
            total: usersMeta?.total || 0,
            totalPages: usersMeta?.totalPages || 0,
          }}
          onPaginationChange={handlePaginationChange}
          tableState={tableState}
          tableActions={tableActions}
          filtersState={filtersState}
          getFilterValueByColumn={getFilterValueByColumn}
          localSearch={localSearch}
        />
      </div>
    </div>
  );
}
