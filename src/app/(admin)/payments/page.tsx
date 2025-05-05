"use client";

import { useCallback, useState } from "react";

import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import ErrorGeneral from "@/components/errors/general-error";
import { PaymentsTable } from "./_components/table/PaymentsTable";
import { usePaginatedPayments } from "./_hooks/use-payments";

export default function PaymentsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { paginatedPayments, isLoadingPaginatedPayments } = usePaginatedPayments({ page, pageSize });

  const handlePaginationChange = useCallback((newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  }, []);

  if (isLoadingPaginatedPayments) {
    return (
      <div>
        <HeaderPage title="Pagos" description="Pagos registrados en el sistema." />
        <DataTableSkeleton columns={6} numFilters={1} />
      </div>
    );
  }

  if (!paginatedPayments) {
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
          data={paginatedPayments.data}
          pagination={{
            page: paginatedPayments.meta.page,
            pageSize: paginatedPayments.meta.pageSize,
            total: paginatedPayments.meta.total,
            totalPages: paginatedPayments.meta.totalPages,
          }}
          onPaginationChange={handlePaginationChange}
        />
      </div>
    </div>
  );
}
