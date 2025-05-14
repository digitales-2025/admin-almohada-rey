"use client";

import { useCallback, useState } from "react";

import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import ErrorGeneral from "@/components/errors/general-error";
import { CustomersTable } from "./_components/table/CustomersTable";
import { usePaginatedCustomers } from "./_hooks/use-customers";

export default function CustomersPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { paginatedCustomers, isLoadingPaginatedCustomers } = usePaginatedCustomers({ page, pageSize });

  const handlePaginationChange = useCallback((newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  }, []);

  if (isLoadingPaginatedCustomers) {
    return (
      <div>
        <HeaderPage title="Clientes" description="Clientes registrados en el sistema." />
        <DataTableSkeleton columns={7} numFilters={3} />
      </div>
    );
  }

  if (!paginatedCustomers) {
    return (
      <div>
        <HeaderPage title="Clientes" description="Clientes registrados en el sistema." />
        <ErrorGeneral />
      </div>
    );
  }

  return (
    <div>
      <HeaderPage title="Clientes" description="Clientes registrados en el sistema." />
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <CustomersTable
          data={paginatedCustomers.data}
          pagination={{
            page: paginatedCustomers.meta.page,
            pageSize: paginatedCustomers.meta.pageSize,
            total: paginatedCustomers.meta.total,
            totalPages: paginatedCustomers.meta.totalPages,
          }}
          onPaginationChange={handlePaginationChange}
        />
      </div>
    </div>
  );
}
