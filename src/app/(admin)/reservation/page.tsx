"use client";

import { useCallback, useState } from "react";

import { HeaderPage } from "@/components/common/HeaderPage";
import ErrorGeneral from "@/components/errors/general-error";
import { WebSocketConnectionIndicator } from "@/components/websocket-connection-indicator";
import { ReservationTable } from "./_components/table/ReservationTable";
import { useAdvancedReservations } from "./_hooks/useAdvancedReservations";
import { METADATA } from "./_statics/metadata";
import Loading from "./loading";

export default function ReservationPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Usar el hook avanzado
  const {
    data: reservationsData,
    meta: reservationsMeta,
    isLoading,
    error,
    tableState,
    tableActions,
    filtersState,
    getFilterValueByColumn,
    localSearch,
  } = useAdvancedReservations({
    initialPagination: { page, pageSize },
  });

  const handlePaginationChange = useCallback((newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  }, []);

  if (isLoading) {
    return <Loading></Loading>;
  }

  if (error) {
    return (
      <div>
        <HeaderPage title={METADATA.entityName} description={METADATA.description} />
        <ErrorGeneral />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <HeaderPage title={METADATA.entityPluralName} description={METADATA.description} />
        <WebSocketConnectionIndicator showDetails={true} />
      </div>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <ReservationTable
          data={reservationsData}
          pagination={{
            page: reservationsMeta?.page || page,
            pageSize: reservationsMeta?.pageSize || pageSize,
            total: reservationsMeta?.total || 0,
            totalPages: reservationsMeta?.totalPages || 0,
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
