import { useCallback, useMemo } from "react";

import { useAdvancedPagination } from "@/hooks/useAdvancedPagination";
import { AdvancedFilters, SortParams } from "@/types/query-filters/advanced-pagination";
import { useGetAdvancedPaginatedRoomsQuery } from "../_services/roomsApi";

interface UseAdvancedRoomsOptions {
  initialPagination?: { page?: number; pageSize?: number };
  initialFilters?: AdvancedFilters;
  initialSort?: SortParams;
  initialSearch?: string;
}

export function useAdvancedRooms({
  initialPagination,
  initialFilters = {},
  initialSort = {},
  initialSearch = "",
}: UseAdvancedRoomsOptions) {
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

  // Mapeo específico para rooms
  const roomColumnMapping = useMemo(
    () => ({
      estado: "isActive", // Mapear "estado" a "isActive" para rooms
      disponibilidad: "status", // Mapear "disponibilidad" a "status" para rooms
      piso: "floorType", // Mapear "piso" a "floorType" para rooms
    }),
    []
  );

  // Query específica para rooms
  const {
    data: queryData,
    isLoading,
    error,
    refetch,
  } = useGetAdvancedPaginatedRoomsQuery({
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

  // Acciones personalizadas de tabla para manejar filtros correctamente
  const customTableActions = useMemo(() => {
    if (!tableActions) return undefined;
    return {
      ...tableActions,
      setColumnFilters: (filters: Array<{ id: string; value: any }>) => {
        if (filters.length === 0) {
          // Limpiar todos los filtros
          Object.keys(roomColumnMapping).forEach((columnId) => {
            const backendField = roomColumnMapping[columnId as keyof typeof roomColumnMapping];
            filtersActions.setFilter(backendField, undefined);
          });
          return;
        }

        filters.forEach((filter) => {
          // Usar el mapeo específico de rooms o el ID original
          const backendField = roomColumnMapping[filter.id as keyof typeof roomColumnMapping] || filter.id;
          filtersActions.setFilter(backendField, filter.value);
        });
      },
    };
  }, [tableActions, filtersActions, roomColumnMapping]);

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

    // Función para obtener valores de filtros por columna (específica para rooms)
    getFilterValueByColumn: (columnId: string) => {
      const backendField = roomColumnMapping[columnId as keyof typeof roomColumnMapping] || columnId;
      return filtersState.filters[backendField];
    },

    // Estado local del input para mostrar en la UI (del hook genérico)
    localSearch,

    // Datos específicos de rooms (alias para compatibilidad)
    roomsData: queryData?.data || [],
    roomsMeta: queryData?.meta,
    isRoomsLoading: isLoading,
    roomsError: error,
  };
}
