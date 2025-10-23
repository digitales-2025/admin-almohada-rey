"use client";

import { useCallback, useState } from "react";

import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import ErrorGeneral from "@/components/errors/general-error";
import { MovementsTable } from "../movements/_components/table/MovementsTable";
import { useAdvancedMovements } from "../movements/_hooks/useAdvancedMovements";
import { MovementsType } from "../movements/_types/movements";

export default function OutPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const type = MovementsType.OUTPUT;

  const { data, meta, isLoading, error, tableState, tableActions, filtersState, getFilterValueByColumn, localSearch } =
    useAdvancedMovements({
      type,
      initialPagination: { page, pageSize },
    });

  const handlePaginationChange = useCallback((newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  }, []);

  if (isLoading) {
    return (
      <div>
        <HeaderPage title="Salidas" description="Gestión de salidas registrados en el sistema" />
        <DataTableSkeleton columns={5} numFilters={1} />
      </div>
    );
  }

  if (error) {
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
          data={data}
          type={type}
          pagination={{
            page: meta?.page || page,
            pageSize: meta?.pageSize || pageSize,
            total: meta?.total || 0,
            totalPages: meta?.totalPages || 0,
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
