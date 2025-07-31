"use client";

import { useCallback, useState } from "react";

import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import ErrorGeneral from "@/components/errors/general-error";
import { RoomTypesTable } from "./_components/table/RoomTypesTable";
import { usePaginatedRoomTypes } from "./_hooks/use-room-types";

export default function RoomTypesPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { paginatedRoomTypes, isLoadingPaginatedRoomTypes } = usePaginatedRoomTypes({ page, pageSize });

  const handlePaginationChange = useCallback((newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  }, []);
  if (isLoadingPaginatedRoomTypes) {
    return (
      <div>
        <HeaderPage title="Tipos de Habitación" description="Administración de tipos de habitación del hotel." />
        <DataTableSkeleton columns={7} numFilters={2} />
      </div>
    );
  }

  if (!paginatedRoomTypes) {
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
          data={paginatedRoomTypes.data}
          pagination={{
            page: paginatedRoomTypes.meta.page,
            pageSize: paginatedRoomTypes.meta.pageSize,
            total: paginatedRoomTypes.meta.total,
            totalPages: paginatedRoomTypes.meta.totalPages,
          }}
          onPaginationChange={handlePaginationChange}
        />
      </div>
    </div>
  );
}
