"use client";

import React, { useCallback, useState } from "react";

import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import ErrorGeneral from "@/components/errors/general-error";
import { WarehousesTable } from "./_components/table/WarehousesTable";
import { usePaginatedWarehouse } from "./_hooks/use-warehouse";

export default function WarehousePage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { paginatedWarehouse, isLoadingPaginatedWarehouse } = usePaginatedWarehouse({ page, pageSize });

  const handlePaginationChange = useCallback((newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  }, []);

  if (isLoadingPaginatedWarehouse) {
    return (
      <div>
        <HeaderPage title="Almacén" description="Administra los diferentes tipos de almacenes del hotel." />
        <DataTableSkeleton columns={4} numFilters={1} />
      </div>
    );
  }

  if (!paginatedWarehouse) {
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
          data={paginatedWarehouse.data}
          pagination={{
            page: paginatedWarehouse.meta.page,
            pageSize: paginatedWarehouse.meta.pageSize,
            total: paginatedWarehouse.meta.total,
            totalPages: paginatedWarehouse.meta.totalPages,
          }}
          onPaginationChange={handlePaginationChange}
        />
      </div>
    </div>
  );
}
