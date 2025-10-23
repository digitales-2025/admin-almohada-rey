"use client";

import React, { useCallback, useState } from "react";

import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import ErrorGeneral from "@/components/errors/general-error";
import { WarehousesTable } from "./_components/table/WarehousesTable";
import { useAdvancedWarehouse } from "./_hooks/useAdvancedWarehouse";

export default function WarehousePage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    data: warehousesData,
    meta: warehousesMeta,
    isLoading: isWarehousesLoading,
    error: warehousesError,
    tableState,
    tableActions,
    filtersState,
    getFilterValueByColumn,
    localSearch,
  } = useAdvancedWarehouse({
    initialPagination: { page, pageSize },
  });

  const _handlePaginationChange = useCallback((newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  }, []);

  if (isWarehousesLoading) {
    return (
      <div>
        <HeaderPage title="Almacén" description="Administra los diferentes tipos de almacenes del hotel." />
        <DataTableSkeleton columns={4} numFilters={1} />
      </div>
    );
  }

  if (warehousesError || !warehousesData) {
    return (
      <div>
        <HeaderPage title="Almacén" description="Administra los diferentes tipos de almacenes del hotel." />
        <ErrorGeneral />
      </div>
    );
  }

  return (
    <div>
      <HeaderPage title="Almacén" description="Administra los diferentes tipos de almacenes del hotel." />
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <WarehousesTable
          data={warehousesData}
          meta={warehousesMeta || { total: 0, page: 1, pageSize: 10, totalPages: 0 }}
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
