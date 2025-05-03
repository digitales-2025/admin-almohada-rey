"use client";

import { useCallback, useState } from "react";
import { FilterX } from "lucide-react";
import { toast } from "sonner";

import { HeaderPage } from "@/components/common/HeaderPage";
import ErrorGeneral from "@/components/errors/general-error";
import { Button } from "@/components/ui/button";
import { processError } from "@/utils/process-error";
import { FilterReservationDialog } from "./_components/filter/FilterReservationDialog";
import { ReservationTable } from "./_components/table/ReservationTable";
import { defaultParamConfig, usePaginatedReservation } from "./_hooks/use-reservation";
import { PaginatedReservationParams } from "./_services/reservationApi";
import { METADATA } from "./_statics/metadata";
import Loading from "./loading";

export default function ReservationPage() {
  //This will be used to communicate page to the the pagination config
  const [currentFilterConfig, setCurrentFilterConfig] = useState<PaginatedReservationParams>(defaultParamConfig);

  const { queryResponse, updateFilters } = usePaginatedReservation();

  const { data: response, isLoading, isError, error, refetch, isSuccess } = queryResponse;

  const onSubmitFilter = useCallback(
    (filter?: PaginatedReservationParams) => {
      const localFilter = filter ?? defaultParamConfig;
      setCurrentFilterConfig(localFilter);
      updateFilters(localFilter);
      if (isError) {
        toast.error("Error al filtrar reservaciones");
      }
      if (response && isSuccess) {
        toast.success("Reservaciones filtradas correctamente");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [updateFilters]
  );

  // Manejar cambios de paginación
  const handlePaginationChange = useCallback(
    (page: number, pageSize: number) => {
      const newFilter: PaginatedReservationParams = {
        ...currentFilterConfig,
        pagination: {
          ...currentFilterConfig.pagination,
          page,
          pageSize,
        },
      };
      setCurrentFilterConfig(newFilter);
      updateFilters(newFilter);
    },
    [currentFilterConfig, updateFilters]
  );

  if (isLoading) {
    return <Loading></Loading>;
  }

  if (!response) {
    return (
      <div>
        <HeaderPage title={METADATA.entityName} description={METADATA.description} />
        <ErrorGeneral />
      </div>
    );
  }

  if (isError) {
    const localError = processError(error);
    toast.error(localError, {
      action: {
        label: "Reintentar",
        onClick: () => refetch,
      },
    });
    return (
      <div>
        <HeaderPage title={METADATA.entityName} description={METADATA.description} />
        <ErrorGeneral />
      </div>
    );
  }

  return (
    <div>
      <HeaderPage title={METADATA.entityPluralName} description={METADATA.description} />
      <div className="flex flex-col items-start space-x-2 space-y-2 py-2 sm:flex-row sm:space-x-1 lg:space-y-0">
        <FilterReservationDialog
          paginatedHookResponse={{
            queryResponse,
            updateFilters,
          }}
          onSaveFilter={(filters) => onSubmitFilter(filters)}
        ></FilterReservationDialog>
        <Button onClick={() => onSubmitFilter()} variant="outline" size="sm" className="flex items-center space-x-1">
          <FilterX></FilterX>
          <span>Limpiar Filtros</span>
        </Button>
      </div>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <ReservationTable
          data={response.data}
          pagination={{
            page: response.meta.page,
            pageSize: response.meta.pageSize,
            total: response.meta.total,
            totalPages: response.meta.totalPages,
          }}
          onPaginationChange={handlePaginationChange}
        />
      </div>
    </div>
  );
}
