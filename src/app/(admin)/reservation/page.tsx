"use client";

import { useCallback, useState } from "react";
import { FilterX } from "lucide-react";

import { HeaderPage } from "@/components/common/HeaderPage";
import ErrorGeneral from "@/components/errors/general-error";
import { Button } from "@/components/ui/button";
import { FilterReservationDialog } from "./_components/filter/FilterReservationDialog";
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
    refetch,
    tableState,
    tableActions,
    filtersState,
    filtersActions,
    getFilterValueByColumn,
    localSearch,
    updateFilters,
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

  // Pasar directamente el hook response
  const paginatedHookResponse = {
    data: reservationsData,
    meta: reservationsMeta,
    isLoading,
    error,
    refetch,
    updateFilters,
    // Incluir todas las propiedades que retorna useAdvancedReservations
    filtersState,
    filtersActions,
    tableState,
    tableActions,
    getFilterValueByColumn,
    localSearch,
    reservations: reservationsData,
    reservationsMeta,
    isReservationsLoading: isLoading,
    reservationsError: error,
  };

  return (
    <div>
      <HeaderPage title={METADATA.entityPluralName} description={METADATA.description} />
      <div className="flex flex-col items-start space-x-2 space-y-2 py-2 sm:flex-row sm:space-x-1 lg:space-y-0">
        <FilterReservationDialog paginatedHookResponse={paginatedHookResponse} />
        <Button onClick={() => {}} variant="outline" size="sm" className="flex items-center space-x-1">
          <FilterX></FilterX>
          <span>Limpiar Filtros</span>
        </Button>
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
