"use client";

import { useCallback, useState } from "react";

import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import ErrorGeneral from "@/components/errors/general-error";
import { PaymentsTable } from "./_components/table/PaymentsTable";
import { useAdvancedPayments } from "./_hooks/useAdvancedPayments";

export default function PaymentsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Usar el hook avanzado
  const {
    data: paymentsData,
    meta: paymentsMeta,
    isLoading,
    error,
    tableState,
    tableActions,
    filtersState,
    getFilterValueByColumn,
    localSearch,
  } = useAdvancedPayments({
    initialPagination: { page, pageSize },
  });

  const handlePaginationChange = useCallback((newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  }, []);

  if (isLoading) {
    return (
      <div>
        <HeaderPage title="Pagos" description="Pagos registrados en el sistema." />
        <DataTableSkeleton columns={6} numFilters={1} />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <HeaderPage title="Pagos" description="Pagos registrados en el sistema." />
        <ErrorGeneral />
      </div>
    );
  }

  return (
    <div>
      <HeaderPage title="Pagos" description="Pagos registrados en el sistema." />
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <PaymentsTable
          data={paymentsData}
          pagination={{
            page: paymentsMeta?.page || page,
            pageSize: paymentsMeta?.pageSize || pageSize,
            total: paymentsMeta?.total || 0,
            totalPages: paymentsMeta?.totalPages || 0,
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
