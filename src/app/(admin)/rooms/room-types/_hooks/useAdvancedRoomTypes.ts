import { useCallback, useMemo } from "react";

import { useAdvancedPagination } from "@/hooks/useAdvancedPagination";
import { AdvancedFilters, SortParams } from "@/types/query-filters/advanced-pagination";
import { useGetAdvancedPaginatedRoomTypesQuery } from "../_services/roomTypesApi";

interface UseAdvancedRoomTypesOptions {
  initialPagination?: { page?: number; pageSize?: number };
  initialFilters?: AdvancedFilters;
  initialSort?: SortParams;
  initialSearch?: string;
}

export function useAdvancedRoomTypes({
  initialPagination,
  initialFilters = {},
  initialSort = {},
  initialSearch = "",
}: UseAdvancedRoomTypesOptions) {
  // Mapeo de IDs de columnas a campos del backend (constante)
  const columnToBackendMapping = useMemo(
    () => ({
      estado: "isActive",
    }),
    []
  );

  // Usar el hook genérico
  const { filtersState, filtersActions, tableState, tableActions, localSearch } = useAdvancedPagination({
    initialPagination: {
      page: initialPagination?.page || 1,
      pageSize: initialPagination?.pageSize || 10,
    },
    initialFilters,
    initialSort,
    initialSearch,
  });

  // Sobrescribir setColumnFilters para mantener los columnId originales
  const customTableActions = useMemo(() => {
    if (!tableActions) return undefined;

    return {
      ...tableActions,
      setColumnFilters: (filters: Array<{ id: string; value: any }>) => {
        if (filters.length === 0) {
          filtersActions.setFilter("estado", undefined);
          return;
        }

        // Mapear cada filtro manteniendo el columnId original
        filters.forEach((filter) => {
          filtersActions.setFilter(filter.id, filter.value);
        });
      },
    };
  }, [tableActions, filtersActions]);

  // Transformar filtros de IDs de columnas a campos del backend
  const transformedFilters = useMemo(() => {
    const backendFilters: any = {};

    // Mapear cada filtro de columna a campo del backend
    Object.entries(filtersState.filters).forEach(([columnId, value]) => {
      const backendField = columnToBackendMapping[columnId as keyof typeof columnToBackendMapping];
      if (backendField && value !== undefined) {
        // Para isActive, convertir strings a booleanos
        if (backendField === "isActive" && Array.isArray(value)) {
          backendFilters[backendField] = value.map((v) => v === "true");
        } else {
          backendFilters[backendField] = value;
        }
      }
    });

    // Agregar búsqueda si existe
    if (filtersState.search) {
      backendFilters.search = filtersState.search;
    }

    return backendFilters;
  }, [filtersState.filters, filtersState.search, columnToBackendMapping]);

  // Query específica para room types
  const queryParams = {
    pagination: {
      page: filtersState.pagination.page || 1,
      pageSize: filtersState.pagination.pageSize || 10,
    },
    filters: transformedFilters,
    sort: filtersState.sort,
  };

  const { data: queryData, isLoading, error, refetch } = useGetAdvancedPaginatedRoomTypesQuery(queryParams);

  // Función personalizada para obtener el valor del filtro por columna
  const getFilterValueByColumnRoomTypes = useCallback(
    (columnId: string) => {
      // Buscar directamente por el ID de la columna en los filtros
      const value = (filtersState.filters as any)[columnId];
      return value;
    },
    [filtersState.filters]
  );

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
    // Estado y acciones para la tabla
    filtersState,
    filtersActions,
    tableState,
    tableActions: customTableActions,
    localSearch,
    getFilterValueByColumn: getFilterValueByColumnRoomTypes,
  };
}
