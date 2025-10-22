import { PaginationParams } from "../api/paginated-response";

// Tipos para filtros avanzados
export interface AdvancedFilters {
  search?: string;
  isActive?: string | string[]; // Array booleano: "true,false" o ["true", "false"]
  [key: string]: string | string[] | undefined; // Para filtros específicos de cada módulo
}

// Parámetros de ordenamiento
export interface SortParams {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Parámetros completos para paginación avanzada
export interface AdvancedPaginationParams {
  pagination: PaginationParams;
  filters?: AdvancedFilters;
  sort?: SortParams;
  // Para filtros específicos de cada módulo
  moduleFilters?: Record<string, any>;
}

// Configuración para filtros facetados
export interface FacetedFilterConfig {
  key: string;
  title: string;
  options: Array<{
    label: string;
    value: string;
    count?: number;
  }>;
}

// Configuración para búsqueda con debounce
export interface SearchConfig {
  debounceMs?: number;
  placeholder?: string;
  minLength?: number;
}

// Estado de filtros para el hook
export interface FiltersState {
  search: string;
  filters: AdvancedFilters;
  sort: SortParams;
  pagination: PaginationParams;
}

// Acciones para actualizar filtros
export interface FiltersActions {
  setSearch: (search: string) => void;
  setFilter: (key: string, value: string | string[] | undefined) => void;
  setSort: (sort: SortParams) => void;
  setPagination: (pagination: PaginationParams) => void;
  resetFilters: () => void;
  resetSearch: () => void;
}

// Hook return type
export interface UseAdvancedPaginationReturn<T> {
  data: T[] | undefined;
  meta:
    | {
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
        hasNext: boolean;
        hasPrevious: boolean;
      }
    | undefined;
  isLoading: boolean;
  error: any;
  refetch: () => void;
  filtersState: FiltersState;
  filtersActions: FiltersActions;
  // Para TanStack Table
  tableState: {
    pagination: {
      pageIndex: number;
      pageSize: number;
    };
    sorting: Array<{
      id: string;
      desc: boolean;
    }>;
    columnFilters: Array<{
      id: string;
      value: any;
    }>;
    globalFilter: string;
  };
  tableActions: {
    setPagination: (pagination: { pageIndex: number; pageSize: number }) => void;
    setSorting: (sorting: Array<{ id: string; desc: boolean }>) => void;
    setColumnFilters: (filters: Array<{ id: string; value: any }>) => void;
    setGlobalFilter: (filter: string) => void;
  };
}
