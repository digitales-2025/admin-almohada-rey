import { useCallback } from "react";

import { useAdvancedPagination } from "@/hooks/useAdvancedPagination";
import { AdvancedFilters, SortParams } from "@/types/query-filters/advanced-pagination";
import { useGetPaginatedCustomersQuery } from "../_services/customersApi";

interface UseAdvancedCustomersOptions {
  initialPagination: { page: number; pageSize: number };
  initialFilters?: AdvancedFilters;
  initialSort?: SortParams;
  initialSearch?: string;
}

export function useAdvancedCustomers({
  initialPagination,
  initialFilters = {},
  initialSort = {},
  initialSearch = "",
}: UseAdvancedCustomersOptions) {
  // Usar el hook genérico
  const { filtersState, filtersActions, tableState, tableActions, localSearch, getFilterValueByColumn } =
    useAdvancedPagination({
      initialPagination,
      initialFilters,
      initialSort,
      initialSearch,
    });

  // Query específica para customers
  const {
    data: queryData,
    isLoading,
    error,
    refetch,
  } = useGetPaginatedCustomersQuery({
    pagination: filtersState.pagination,
    filters: {
      ...filtersState.filters,
      ...(filtersState.search && { search: filtersState.search }),
    },
    sort: filtersState.sort,
  });

  // Función para refetch manual
  const manualRefetch = useCallback(() => {
    refetch();
  }, [refetch]);

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

    // Datos específicos de customers (alias para compatibilidad)
    customers: queryData?.data || [],
    customersMeta: queryData?.meta,
    isCustomersLoading: isLoading,
    customersError: error,
  };
}
