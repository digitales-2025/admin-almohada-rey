import { useCallback, useMemo } from "react";

import { useAdvancedPagination } from "@/hooks/useAdvancedPagination";
import { AdvancedFilters, SortParams } from "@/types/query-filters/advanced-pagination";
import { useGetPaginatedProductsQuery } from "../_services/productsApi";
import { ProductType } from "../_types/products";

interface UseAdvancedProductsOptions {
  initialPagination: { page: number; pageSize: number };
  initialFilters?: AdvancedFilters;
  initialSort?: SortParams;
  initialSearch?: string;
  type?: ProductType;
}

export function useAdvancedProducts({
  initialPagination,
  initialFilters = {},
  initialSort = {},
  initialSearch = "",
  type,
}: UseAdvancedProductsOptions) {
  // Usar el hook genérico
  const { filtersState, filtersActions, tableState, tableActions, localSearch } = useAdvancedPagination({
    initialPagination,
    initialFilters,
    initialSort,
    initialSearch,
  });

  // Query específica para products
  const {
    data: queryData,
    isLoading,
    error,
    refetch,
  } = useGetPaginatedProductsQuery({
    pagination: filtersState.pagination,
    filters: {
      ...filtersState.filters,
      ...(filtersState.search && { search: filtersState.search }),
    },
    sort: filtersState.sort,
    ...(type && { type }), // Mantener el filtro de tipo existente
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
          filtersActions.setFilter("estado", undefined);
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

    // Estado para TanStack Table (del hook genérico)
    tableState,
    tableActions: customTableActions,

    // Función para obtener valores de filtros por columna (del hook genérico)
    getFilterValueByColumn: (columnId: string) => {
      return filtersState.filters[columnId];
    },

    // Estado local del input para mostrar en la UI (del hook genérico)
    localSearch,

    // Datos específicos de products (alias para compatibilidad)
    productsData: queryData?.data || [],
    productsMeta: queryData?.meta,
    isProductsLoading: isLoading,
    productsError: error,
  };
}
