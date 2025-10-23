import { useCallback, useMemo } from "react";

import { useAdvancedPagination } from "@/hooks/useAdvancedPagination";
import { AdvancedFilters, SortParams } from "@/types/query-filters/advanced-pagination";
import { useGetPaginatedReservationsQuery } from "../_services/reservationApi";

interface UseAdvancedReservationsOptions {
  initialPagination: { page: number; pageSize: number };
  initialFilters?: AdvancedFilters;
  initialSort?: SortParams;
  initialSearch?: string;
}

export function useAdvancedReservations({
  initialPagination,
  initialFilters = {},
  initialSort = {},
  initialSearch = "",
}: UseAdvancedReservationsOptions) {
  // Usar el hook genérico
  const { filtersState, filtersActions, tableState, tableActions, localSearch, getFilterValueByColumn } =
    useAdvancedPagination({
      initialPagination,
      initialFilters,
      initialSort,
      initialSearch,
    });

  // Procesar filtros para manejar el caso especial de "payment_to_delete"
  const processedFilters = useMemo(() => {
    const filters = { ...filtersState.filters };

    // Si hay filtros en isActive que contengan "payment_to_delete"
    if (filters.isActive && Array.isArray(filters.isActive)) {
      const hasPaymentToDelete = filters.isActive.includes("payment_to_delete");
      const otherValues = filters.isActive.filter((v) => v !== "payment_to_delete");

      if (hasPaymentToDelete) {
        // Separar: otros valores van a isActive, payment_to_delete va a isPendingDeletePayment
        if (otherValues.length > 0) {
          filters.isActive = otherValues as any;
        } else {
          delete filters.isActive; // No hay otros valores para isActive
        }
        filters.isPendingDeletePayment = ["true"] as any; // Siempre true para payment_to_delete
      }
    }

    return filters;
  }, [filtersState.filters]);

  // Query específica para reservations
  const {
    data: queryData,
    isLoading,
    error,
    refetch,
  } = useGetPaginatedReservationsQuery({
    pagination: filtersState.pagination,
    filters: {
      ...processedFilters,
      ...(filtersState.search && { search: filtersState.search }),
    },
    sort: filtersState.sort,
  });

  // Función para refetch manual
  const manualRefetch = useCallback(() => {
    refetch();
  }, [refetch]);

  // Función para actualizar filtros desde el FilterReservationDialog
  const updateFilters = useCallback(
    (params: any) => {
      if (params.fieldFilters) {
        // Mapear filtros del dialog a filtros del sistema avanzado
        if (params.fieldFilters.customerId) {
          filtersActions.setFilter("customerId", params.fieldFilters.customerId);
        }
        if (params.fieldFilters.checkInDate) {
          filtersActions.setFilter("checkInDate", params.fieldFilters.checkInDate);
        }
        if (params.fieldFilters.checkOutDate) {
          filtersActions.setFilter("checkOutDate", params.fieldFilters.checkOutDate);
        }
      }
    },
    [filtersActions]
  );

  return {
    // Datos
    data: queryData?.data || [],
    meta: queryData?.meta,
    isLoading,
    error,
    refetch: manualRefetch,

    // Estado de filtros (del hook genérico)
    filtersState,
    filtersActions,

    // Estado para TanStack Table (del hook genérico)
    tableState,
    tableActions,

    // Función para obtener valores de filtros por columna (del hook genérico)
    getFilterValueByColumn,

    // Estado local del input para mostrar en la UI (del hook genérico)
    localSearch,

    // Función para actualizar filtros desde FilterReservationDialog
    updateFilters,

    // Datos específicos de reservations (alias para compatibilidad)
    reservations: queryData?.data || [],
    reservationsMeta: queryData?.meta,
    isReservationsLoading: isLoading,
    reservationsError: error,
  };
}
