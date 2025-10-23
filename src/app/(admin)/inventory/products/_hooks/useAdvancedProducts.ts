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

  // Mapeo específico para products
  const productColumnMapping = useMemo(
    () => ({
      estado: "isActive", // Mapear "estado" a "isActive" para products
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
          Object.keys(productColumnMapping).forEach((columnId) => {
            const backendField = productColumnMapping[columnId as keyof typeof productColumnMapping];
            filtersActions.setFilter(backendField, undefined);
          });
          return;
        }

        filters.forEach((filter) => {
          // Usar el mapeo específico de products o el ID original
          const backendField = productColumnMapping[filter.id as keyof typeof productColumnMapping] || filter.id;
          filtersActions.setFilter(backendField, filter.value);
        });
      },
    };
  }, [tableActions, filtersActions, productColumnMapping]);

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

    // Función para obtener valores de filtros por columna (específica para products)
    getFilterValueByColumn: (columnId: string) => {
      const backendField = productColumnMapping[columnId as keyof typeof productColumnMapping] || columnId;
      return filtersState.filters[backendField];
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
