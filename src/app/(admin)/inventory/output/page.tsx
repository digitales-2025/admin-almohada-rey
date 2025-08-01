"use client";

import { useCallback, useState } from "react";

import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import ErrorGeneral from "@/components/errors/general-error";
import { MovementsTable } from "../movements/_components/table/MovementsTable";
import { usePaginatedMovements } from "../movements/_hooks/use-movements";
import { MovementsType } from "../movements/_types/movements";

export default function OutPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const type = MovementsType.OUTPUT;

  const { paginatedMovements, isLoadingPaginatedMovements } = usePaginatedMovements({
    page,
    pageSize,
    type,
  });

  const handlePaginationChange = useCallback((newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  }, []);

  if (isLoadingPaginatedMovements) {
    return (
      <div>
        <HeaderPage title="Salidas" description="Gestión de salidas registrados en el sistema" />
        <DataTableSkeleton columns={5} numFilters={1} />
      </div>
    );
  }

  if (!paginatedMovements) {
    return (
      <div>
        <HeaderPage title="Salidas" description="Gestión de salidas registrados en el sistema" />
        <ErrorGeneral />
      </div>
    );
  }

  return (
    <div>
      <HeaderPage title="Salidas" description="Gestión de salidas registrados en el sistema" />
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <MovementsTable
          data={paginatedMovements.data}
          type={type}
          pagination={{
            page: paginatedMovements.meta.page,
            pageSize: paginatedMovements.meta.pageSize,
            total: paginatedMovements.meta.total,
            totalPages: paginatedMovements.meta.totalPages,
          }}
          onPaginationChange={handlePaginationChange}
        />
      </div>
    </div>
  );
}
