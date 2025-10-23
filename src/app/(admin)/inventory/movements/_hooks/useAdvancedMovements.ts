import { useMemo } from "react";

import { useAdvancedPagination } from "@/hooks/useAdvancedPagination";
import { useGetMovementsByTypePaginatedQuery } from "../_services/movementsApi";
import { MovementsType } from "../_types/movements";

interface UseAdvancedMovementsProps {
  type: MovementsType;
  initialPagination?: { page: number; pageSize: number };
}

export function useAdvancedMovements({ type, initialPagination }: UseAdvancedMovementsProps) {
  const { filtersState, tableState, tableActions, localSearch, filtersActions } = useAdvancedPagination({
    initialPagination: initialPagination || { page: 1, pageSize: 10 },
  });

  // Mapeo específico para movements
  const movementColumnMapping = useMemo(
    () => ({
      "tipo de Almacén": "warehouseType", // Mapear "tipo de Almacén" a "warehouseType" para movements
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
          Object.keys(movementColumnMapping).forEach((columnId) => {
            const backendField = movementColumnMapping[columnId as keyof typeof movementColumnMapping];
            filtersActions.setFilter(backendField, undefined);
          });
          return;
        }

        filters.forEach((filter) => {
          // Usar el mapeo específico de movements o el ID original
          const backendField = movementColumnMapping[filter.id as keyof typeof movementColumnMapping] || filter.id;
          filtersActions.setFilter(backendField, filter.value);
        });
      },
    };
  }, [tableActions, filtersActions, movementColumnMapping]);

  const { data, isLoading, error, refetch } = useGetMovementsByTypePaginatedQuery({
    pagination: filtersState.pagination,
    fieldFilters: {
      type,
      ...filtersState.filters,
      ...(filtersState.search && { search: filtersState.search }),
    },
    sort: filtersState.sort,
  });

  return {
    data: data?.data || [],
    meta: data?.meta,
    isLoading,
    error,
    refetch,
    filtersState,
    tableState,
    tableActions: customTableActions,
    localSearch,
    getFilterValueByColumn: (columnId: string) => {
      const backendField = movementColumnMapping[columnId as keyof typeof movementColumnMapping] || columnId;
      return filtersState.filters[backendField];
    },
  };
}
