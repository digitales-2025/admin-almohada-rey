import { useCallback, useMemo } from "react";

import { useAdvancedPagination } from "@/hooks/useAdvancedPagination";
import { AdvancedFilters, SortParams } from "@/types/query-filters/advanced-pagination";
import { useGetPaginatedWarehousesQuery } from "../_services/warehouseApi";

interface UseAdvancedWarehouseOptions {
  initialPagination: { page: number; pageSize: number };
  initialFilters?: AdvancedFilters;
  initialSort?: SortParams;
  initialSearch?: string;
}

export function useAdvancedWarehouse({
  initialPagination,
  initialFilters = {},
  initialSort = {},
  initialSearch = "",
}: UseAdvancedWarehouseOptions) {
  // Usar el hook genérico
  const { filtersState, filtersActions, tableState, tableActions, localSearch } = useAdvancedPagination({
    initialPagination,
    initialFilters,
    initialSort,
    initialSearch,
  });

  // Query específica para warehouses
  const {
    data: queryData,
    isLoading,
    error,
    refetch,
  } = useGetPaginatedWarehousesQuery({
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

  // Mapeo específico para warehouses
  const warehouseColumnMapping = useMemo(
    () => ({
      tipo: "type", // Mapear "tipo" a "type" para warehouses
    }),
    []
  );

  // Acciones personalizadas de tabla para manejar filtros correctamente
  const customTableActions = useMemo(() => {
    if (!tableActions) return undefined;
    return {
      ...tableActions,
      setColumnFilters: (filters: Array<{ id: string; value: any }>) => {
        if (filters.length === 0) {
          // Limpiar todos los filtros
          Object.keys(warehouseColumnMapping).forEach((columnId) => {
            const backendField = warehouseColumnMapping[columnId as keyof typeof warehouseColumnMapping];
            filtersActions.setFilter(backendField, undefined);
          });
          return;
        }

        filters.forEach((filter) => {
          // Usar el mapeo específico de warehouses o el ID original
          const backendField = warehouseColumnMapping[filter.id as keyof typeof warehouseColumnMapping] || filter.id;
          filtersActions.setFilter(backendField, filter.value);
        });
      },
    };
  }, [tableActions, filtersActions, warehouseColumnMapping]);

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
    tableActions: customTableActions,

    // Función para obtener valores de filtros por columna (específica para warehouses)
    getFilterValueByColumn: (columnId: string) => {
      const backendField = warehouseColumnMapping[columnId as keyof typeof warehouseColumnMapping] || columnId;
      return filtersState.filters[backendField];
    },

    // Estado local del input para mostrar en la UI (del hook genérico)
    localSearch,

    // Datos específicos de warehouses (alias para compatibilidad)
    warehousesData: queryData?.data || [],
    warehousesMeta: queryData?.meta,
    isWarehousesLoading: isLoading,
    warehousesError: error,
  };
}
