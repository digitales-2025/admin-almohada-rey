"use client";

import { useCallback, useState } from "react";

import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import ErrorGeneral from "@/components/errors/general-error";
import { RoomTypesTable } from "./_components/table/RoomTypesTable";
import { useAdvancedRoomTypes } from "./_hooks/useAdvancedRoomTypes";

export default function RoomTypesPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Usar el hook avanzado
  const {
    data: roomTypesData,
    meta: roomTypesMeta,
    isLoading,
    error,
    tableState,
    tableActions,
    filtersState,
    getFilterValueByColumn,
    localSearch,
  } = useAdvancedRoomTypes({
    initialPagination: { page, pageSize },
  });

  const handlePaginationChange = useCallback((newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  }, []);
  if (isLoading) {
    return (
      <div>
        <HeaderPage title="Tipos de Habitación" description="Administración de tipos de habitación del hotel." />
        <DataTableSkeleton columns={7} numFilters={1} />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <HeaderPage title="Tipos de Habitación" description="Administración de tipos de habitación del hotel." />
        <ErrorGeneral />
      </div>
    );
  }

  return (
    <div>
      <HeaderPage title="Tipos de Habitación" description="Administración de tipos de habitación del hotel." />
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <RoomTypesTable
          data={roomTypesData}
          pagination={{
            page: roomTypesMeta?.page || page,
            pageSize: roomTypesMeta?.pageSize || pageSize,
            total: roomTypesMeta?.total || 0,
            totalPages: roomTypesMeta?.totalPages || 0,
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
