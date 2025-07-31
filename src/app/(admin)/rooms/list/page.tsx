"use client";

import { useCallback, useState } from "react";

import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import ErrorGeneral from "@/components/errors/general-error";
import { RoomsTable } from "./_components/table/RoomsTable";
import { usePaginatedRooms } from "./_hooks/use-rooms";

export default function RoomsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { paginatedRooms, isLoadingPaginatedRooms, refetchPaginatedRooms } = usePaginatedRooms({ page, pageSize });

  const handlePaginationChange = useCallback((newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  }, []);

  if (isLoadingPaginatedRooms) {
    return (
      <div>
        <HeaderPage title="Habitaciones" description="Habitaciones registrados en el sistema." />
        <DataTableSkeleton columns={8} numFilters={3} />
      </div>
    );
  }

  if (!paginatedRooms) {
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
          data={paginatedRooms.data}
          pagination={{
            page: paginatedRooms.meta.page,
            pageSize: paginatedRooms.meta.pageSize,
            total: paginatedRooms.meta.total,
            totalPages: paginatedRooms.meta.totalPages,
          }}
          onPaginationChange={handlePaginationChange}
          refetchPaginatedRooms={refetchPaginatedRooms}
        />
      </div>
    </div>
  );
}
