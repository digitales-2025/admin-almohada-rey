"use client";

import { useCallback, useState } from "react";

import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import ErrorGeneral from "@/components/errors/general-error";
import { CustomersTable } from "./_components/table/CustomersTable";
import { useAdvancedCustomers } from "./_hooks/useAdvancedCustomers";

export default function CustomersPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Usar el hook avanzado directamente
  const {
    data: customersData,
    meta: customersMeta,
    isLoading,
    error,
    tableState,
    tableActions,
    filtersState,
    getFilterValueByColumn,
    localSearch,
  } = useAdvancedCustomers({
    initialPagination: { page, pageSize },
  });

  const handlePaginationChange = useCallback((newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  }, []);

  if (isLoading) {
    return (
      <div>
        <HeaderPage title="Clientes" description="Clientes registrados en el sistema." />
        <DataTableSkeleton columns={7} numFilters={4} />
      </div>
    );
  }

  if (error || !customersData) {
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
          data={customersData}
          pagination={{
            page: customersMeta?.page || page,
            pageSize: customersMeta?.pageSize || pageSize,
            total: customersMeta?.total || 0,
            totalPages: customersMeta?.totalPages || 0,
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
