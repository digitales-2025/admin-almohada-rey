import { useCallback, useMemo } from "react";

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
  const { filtersState, filtersActions, tableState, tableActions, localSearch } = useAdvancedPagination({
    initialPagination,
    initialFilters,
    initialSort,
    initialSearch,
  });

  // Mapear filtros de columnas a parámetros de API
  const mapFiltersToApiParams = (filters: Record<string, any>) => {
    const mappedFilters: Record<string, any> = {};

    Object.entries(filters).forEach(([key, value]) => {
      switch (key) {
        case "estado":
          mappedFilters.isActive = value;
          break;
        case "lista negra":
          mappedFilters.isBlacklist = value;
          break;
        case "e. civil":
          mappedFilters.maritalStatus = value;
          break;
        case "tipo":
          mappedFilters.documentType = value;
          break;
        default:
          mappedFilters[key] = value;
      }
    });

    return mappedFilters;
  };

  // Query específica para customers
  const {
    data: queryData,
    isLoading,
    error,
    refetch,
  } = useGetPaginatedCustomersQuery({
    pagination: filtersState.pagination,
    filters: {
      ...mapFiltersToApiParams(filtersState.filters),
      ...(filtersState.search && { search: filtersState.search }),
    },
    sort: filtersState.sort,
  });

  // Función para refetch manual
  const manualRefetch = useCallback(() => {
    refetch();
  }, [refetch]);

  // Acciones personalizadas de tabla para manejar filtros correctamente
  const customTableActions = useMemo(() => {
    if (!tableActions) return undefined;
    return {
      ...tableActions,
      setColumnFilters: (filters: Array<{ id: string; value: any }>) => {
        if (filters.length === 0) {
          // Limpiar todos los filtros
          filtersActions.setFilter("estado", undefined);
          filtersActions.setFilter("lista negra", undefined);
          filtersActions.setFilter("e. civil", undefined);
          filtersActions.setFilter("tipo", undefined);
          return;
        }
        filters.forEach((filter) => {
          filtersActions.setFilter(filter.id, filter.value);
        });
      },
    };
  }, [tableActions, filtersActions]);

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

    // Estado para TanStack Table (con acciones personalizadas)
    tableState,
    tableActions: customTableActions,

    // Función para obtener valores de filtros por columna (acceso directo al estado)
    getFilterValueByColumn: (columnId: string) => {
      return filtersState.filters[columnId];
    },

    // Estado local del input para mostrar en la UI (del hook genérico)
    localSearch,

    // Datos específicos de customers (alias para compatibilidad)
    customers: queryData?.data || [],
    customersMeta: queryData?.meta,
    isCustomersLoading: isLoading,
    customersError: error,
  };
}
