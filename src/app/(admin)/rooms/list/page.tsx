"use client";

import { useCallback, useState } from "react";

import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import ErrorGeneral from "@/components/errors/general-error";
import { RoomsTable } from "./_components/table/RoomsTable";
import { useAdvancedRooms } from "./_hooks/useAdvancedRooms";

export default function RoomsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Usar el hook avanzado
  const {
    data: roomsData,
    meta: roomsMeta,
    isLoading,
    error,
    refetch,
    tableState,
    tableActions,
    filtersState,
    getFilterValueByColumn,
    localSearch,
  } = useAdvancedRooms({
    initialPagination: { page, pageSize },
  });

  const handlePaginationChange = useCallback((newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  }, []);

  if (isLoading) {
    return (
      <div>
        <HeaderPage title="Habitaciones" description="Habitaciones registrados en el sistema." />
        <DataTableSkeleton columns={8} numFilters={3} />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <HeaderPage title="Habitaciones" description="Habitaciones registrados en el sistema." />
        <ErrorGeneral />
      </div>
    );
  }

  return (
    <div>
      <HeaderPage title="Habitaciones" description="Habitaciones registrados en el sistema." />
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <RoomsTable
          data={roomsData}
          pagination={{
            page: roomsMeta?.page || page,
            pageSize: roomsMeta?.pageSize || pageSize,
            total: roomsMeta?.total || 0,
            totalPages: roomsMeta?.totalPages || 0,
          }}
          onPaginationChange={handlePaginationChange}
          refetchPaginatedRooms={refetch}
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
