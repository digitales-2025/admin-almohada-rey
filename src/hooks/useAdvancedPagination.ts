import { useCallback, useMemo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import { AdvancedFilters, SortParams } from "@/types/query-filters/advanced-pagination";

interface UseAdvancedPaginationOptions {
  initialPagination: { page: number; pageSize: number };
  initialFilters?: AdvancedFilters;
  initialSort?: SortParams;
  initialSearch?: string;
}

export function useAdvancedPagination({
  initialPagination,
  initialFilters = {},
  initialSort = {},
  initialSearch = "",
}: UseAdvancedPaginationOptions) {
  // Estado principal
  const [filtersState, setFiltersState] = useState({
    pagination: initialPagination,
    filters: initialFilters,
    sort: initialSort,
    search: initialSearch,
  });

  // Estado local para el input (sin debounce)
  const [localSearch, setLocalSearch] = useState(initialSearch);

  // Debounced search
  const debouncedSearch = useDebouncedCallback((searchTerm: string) => {
    setFiltersState((prev) => ({
      ...prev,
      search: searchTerm,
      pagination: { ...prev.pagination, page: 1 },
    }));
  }, 300);

  // Acciones para actualizar filtros
  const filtersActions = useMemo(
    () => ({
      setSearch: (search: string) => {
        setLocalSearch(search);
        if (search.length === 0) {
          setFiltersState((prev) => ({ ...prev, search: "" }));
          return;
        }
        // Solo buscar si tiene al menos 2 caracteres, sino limpiar la búsqueda
        if (search.trim().length >= 2) {
          debouncedSearch(search);
        } else {
          // Si tiene menos de 2 caracteres, limpiar la búsqueda inmediatamente
          setFiltersState((prev) => ({ ...prev, search: "" }));
        }
      },

      setFilter: (key: string, value: string | string[] | undefined) => {
        setFiltersState((prev) => ({
          ...prev,
          filters: {
            ...prev.filters,
            [key]: value,
          },
          pagination: { ...prev.pagination, page: 1 },
        }));
      },

      setSort: (sort: SortParams) => {
        setFiltersState((prev) => ({
          ...prev,
          sort,
        }));
      },

      setPagination: (pagination: { page: number; pageSize: number }) => {
        setFiltersState((prev) => ({
          ...prev,
          pagination: {
            ...prev.pagination,
            page: pagination.page,
            pageSize: pagination.pageSize,
          },
        }));
      },

      resetFilters: () => {
        setFiltersState((prev) => ({
          ...prev,
          filters: initialFilters,
          pagination: initialPagination,
        }));
      },

      resetSearch: () => {
        setFiltersState((prev) => ({
          ...prev,
          search: "",
        }));
      },
    }),
    [debouncedSearch, initialFilters, initialPagination]
  );

  // Estado para TanStack Table
  const tableState = useMemo(
    () => ({
      pagination: {
        pageIndex: (filtersState.pagination.page || 1) - 1,
        pageSize: filtersState.pagination.pageSize || 10,
      },
      sorting: filtersState.sort.sortBy
        ? [
            {
              id: filtersState.sort.sortBy,
              desc: filtersState.sort.sortOrder === "desc",
            },
          ]
        : [],
      columnFilters: Object.entries(filtersState.filters)
        .filter(([_, value]) => value !== undefined)
        .map(([id, value]) => ({ id, value })),
      globalFilter: filtersState.search,
    }),
    [filtersState]
  );

  // Mapeo de columnas (constante) - se puede sobrescribir por módulo
  const columnToBackendMapping = useMemo(
    () => ({
      estado: "isActive",
      "e. civil": "maritalStatus",
      tipo: "documentType",
      isBlacklist: "isBlacklist",
      isActive: "isActive", // Para reservations - ID real de la columna
      "E. Reserva": "status", // Para reservations - ID real de la columna
      // Caso especial para "payment_to_delete" que mapea a isPendingDeletePayment
      payment_to_delete: "isPendingDeletePayment",
    }),
    []
  );

  // Acciones para TanStack Table
  const tableActions = useMemo(() => {
    return {
      setPagination: (pagination: { pageIndex: number; pageSize: number }) => {
        filtersActions.setPagination({
          page: pagination.pageIndex + 1,
          pageSize: pagination.pageSize,
        });
      },

      setSorting: (sorting: Array<{ id: string; desc: boolean }>) => {
        if (sorting.length > 0) {
          const sort = sorting[0];
          filtersActions.setSort({
            sortBy: sort.id,
            sortOrder: sort.desc ? "desc" : "asc",
          });
        } else {
          filtersActions.setSort({});
        }
      },

      setColumnFilters: (filters: Array<{ id: string; value: any }>) => {
        if (filters.length === 0) {
          setFiltersState((prev) => ({
            ...prev,
            filters: {},
            pagination: { ...prev.pagination, page: 1 },
          }));
          return;
        }

        const newFilters: AdvancedFilters = {};
        filters.forEach((filter) => {
          const backendField = columnToBackendMapping[filter.id as keyof typeof columnToBackendMapping] || filter.id;
          newFilters[backendField] = filter.value;
        });

        setFiltersState((prev) => ({
          ...prev,
          filters: {
            ...prev.filters,
            ...newFilters,
          },
          pagination: { ...prev.pagination, page: 1 },
        }));
      },

      setGlobalFilter: (filter: string) => {
        filtersActions.setSearch(filter);
      },
    };
  }, [filtersActions, columnToBackendMapping]);

  // Función para obtener el valor del filtro por columna
  const getFilterValueByColumn = useCallback(
    (columnId: string) => {
      const backendField = columnToBackendMapping[columnId as keyof typeof columnToBackendMapping];
      const value = (filtersState.filters as any)[backendField];
      return value;
    },
    [filtersState.filters, columnToBackendMapping]
  );

  return {
    // Estado
    filtersState,
    filtersActions,
    tableState,
    tableActions,
    localSearch,
    getFilterValueByColumn,
  };
}
