# Implementación de Paginación Avanzada

## Resumen
Esta documentación describe cómo implementar paginación avanzada con filtros, búsqueda y sorting en el sistema, desde el backend hasta el frontend.

## 1. Backend - Base Repository

### 1.1 Interfaces Base
**Archivo:** `api-almohada-rey/src/prisma/src/interfaces/base.repository.interfaces.ts`

```typescript
export interface BaseFilterArrayOptions {
  [key: string]: any[];
}

export interface FilterOptions {
  search?: string;
  searchByField?: string[];
  searchByFieldsRelational?: string[];
  arrayByField?: BaseFilterArrayOptions;
}

export interface SortOptions {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
```

### 1.2 Base Repository
**Archivo:** `api-almohada-rey/src/prisma/src/abstract/base.repository.ts`

**Funcionalidad clave:**
- Método `findManyPaginated` que acepta `FilterOptions` y `SortOptions`
- Lógica especial para campos booleanos en `buildWhereClause`:
  ```typescript
  // Para campos booleanos, usar OR con equals
  if (key === 'isActive' || key === 'isBlacklist' || key === 'isPendingDeletePayment') {
    const booleanValues = Array.isArray(values) ? values : [values];
    if (booleanValues.length === 1) {
      whereClause[key] = booleanValues[0];
    } else {
      whereClause['OR'] = [
        ...(whereClause['OR'] || []),
        ...booleanValues.map((value) => ({ [key]: value })),
      ];
    }
  }
  ```

## 2. Backend - Servicios

### 2.1 Estructura del Servicio
**Patrón para todos los servicios:**

```typescript
async findAllPaginated(
  filterOptions: FilterOptions,
  sortOptions: SortOptions,
  user?: any
) {
  const baseWhere = {};
  
  // Filtros base específicos del módulo
  if (!user?.isSuperAdmin) {
    baseWhere['isActive'] = true;
  }

  // Definir campos para el repository
  const enumFields = ['status', 'type']; // Campos enum del módulo
  const dateFields = ['createdAt', 'updatedAt']; // Campos de fecha

  return this.repository.findManyPaginated({
    where: baseWhere,
    filterOptions,
    sortOptions,
    enumFields,
    dateFields,
  });
}
```

### 2.2 Controladores
**Patrón para todos los controladores:**

```typescript
@Get('paginated')
async findAllPaginated(
  @Query('search') search?: string,
  @Query('status') status?: string, // Comma-separated para arrays
  @Query('isActive') isActive?: string, // Comma-separated para booleanos
  @Query('sortBy') sortBy?: string,
  @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  @GetUser() user?: any
) {
  const filterOptions: FilterOptions = {
    search,
    searchByFieldsRelational: ['name', 'email'], // Campos de búsqueda
    arrayByField: {
      status: status ? status.split(',') : undefined,
      isActive: isActive ? isActive.split(',').map(v => v === 'true') : undefined,
    },
  };

  const sortOptions: SortOptions = {
    sortBy,
    sortOrder,
  };

  return this.service.findAllPaginated(filterOptions, sortOptions, user);
}
```

## 3. Frontend - Hook Genérico

### 3.1 Hook Base
**Archivo:** `admin-almohada-rey/src/hooks/useAdvancedPagination.ts`

**Funcionalidades:**
- Estado local del input para UX fluida
- Debounce de 300ms para búsquedas
- Mapeo de columnas a campos del backend
- Acciones para TanStack Table
- Gestión de filtros facetados

**Estructura del estado:**
```typescript
const [filtersState, setFiltersState] = useState({
  pagination: { page: number; pageSize: number },
  filters: AdvancedFilters,
  sort: SortParams,
  search: string,
});
```

### 3.2 Hook Específico del Módulo
**Archivo:** `admin-almohada-rey/src/app/(admin)/[module]/_hooks/useAdvanced[Module].ts`

```typescript
export function useAdvanced[Module](options) {
  const { filtersState, tableState, tableActions, localSearch, getFilterValueByColumn } =
    useAdvancedPagination(options);

  const { data, isLoading, error, refetch } = useGetPaginated[Module]Query({
    pagination: filtersState.pagination,
    filters: {
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
    tableActions,
    localSearch,
    getFilterValueByColumn,
  };
}
```

## 4. Frontend - Componentes

### 4.1 DataTable Genérico
**Archivo:** `admin-almohada-rey/src/components/datatable/data-table.tsx`

**Props clave:**
- `externalGlobalFilter`: Para controlar el input de búsqueda
- `externalFilters`: Para controlar filtros facetados
- `getFilterValueByColumn`: Función para obtener valores de filtros
- `onSortingChange`, `onColumnFiltersChange`, `onGlobalFilterChange`: Callbacks externos

### 4.2 DataTableToolbar
**Archivo:** `admin-almohada-rey/src/components/datatable/data-table-toolbar.tsx`

**Optimizaciones:**
- `transition: "none"` para eliminar lag visual
- `externalGlobalFilter` para sincronización con estado externo
- `onGlobalFilterChange` para callbacks externos

### 4.3 DataTableFacetedFilter
**Archivo:** `admin-almohada-rey/src/components/datatable/data-table-faceted-filter.tsx`

**Props clave:**
- `externalFilterValue`: Valor del filtro desde estado externo
- `onFilterChange`: Callback para cambios de filtro

### 4.4 Filtros Facetados
**Archivo:** `admin-almohada-rey/src/app/(admin)/[module]/_utils/[module].filter.utils.tsx`

```typescript
export const facetedFilters = [
  {
    column: "estado", // ID de la columna
    title: "Estado",
    options: [
      { label: "Activo", value: "true", icon: ActiveIcon },
      { label: "Inactivo", value: "false", icon: InactiveIcon },
    ],
  },
  // Más filtros...
];
```

## 5. Frontend - Páginas

### 5.1 Estructura de la Página
**Archivo:** `admin-almohada-rey/src/app/(admin)/[module]/page.tsx`

```typescript
export default function [Module]Page() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    data,
    meta,
    isLoading,
    error,
    tableState,
    tableActions,
    filtersState,
    getFilterValueByColumn,
    localSearch,
  } = useAdvanced[Module]({
    initialPagination: { page, pageSize },
  });

  const handlePaginationChange = useCallback((newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  }, []);

  return (
    <div>
      <HeaderPage title="[Module]" description="[Description]" />
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <[Module]Table
          data={data}
          pagination={{
            page: meta?.page || page,
            pageSize: meta?.pageSize || pageSize,
            total: meta?.total || 0,
            totalPages: meta?.totalPages || 0,
          }}
          onPaginationChange={handlePaginationChange}
          tableState={tableState}
          tableActions={tableActions}
          filtersState={filtersState}
          getFilterValueByColumn={getFilterValueByColumn}
          localSearch={localSearch}
        />
      </div>
    </div>
  );
}
```

### 5.2 Componente de Tabla
**Archivo:** `admin-almohada-rey/src/app/(admin)/[module]/_components/table/[Module]Table.tsx`

```typescript
export function [Module]Table({
  data,
  pagination,
  onPaginationChange,
  tableState,
  tableActions,
  filtersState,
  getFilterValueByColumn,
  localSearch,
}: [Module]TableProps) {
  const serverPagination = {
    pageIndex: tableState?.pagination.pageIndex ?? pagination.page - 1,
    pageSize: tableState?.pagination.pageSize ?? pagination.pageSize,
    pageCount: pagination.totalPages,
    total: pagination.total,
    onPaginationChange: (pageIndex: number, pageSize: number) => {
      if (tableActions) {
        tableActions.setPagination({ pageIndex, pageSize });
      }
      onPaginationChange(pageIndex + 1, pageSize);
    },
  };

  return (
    <DataTable
      data={data}
      columns={columns}
      toolbarActions={(table) => <[Module]TableToolbarActions table={table} />}
      filterPlaceholder="Buscar [module]..."
      facetedFilters={facetedFilters}
      enableExpansion={true}
      renderExpandedRow={(row) => <[Module]Description row={row} />}
      serverPagination={serverPagination}
      externalGlobalFilter={localSearch}
      externalFilters={filtersState?.filters}
      getFilterValueByColumn={getFilterValueByColumn}
      {...(tableActions && {
        onSortingChange: tableActions.setSorting,
        onColumnFiltersChange: tableActions.setColumnFilters,
        onGlobalFilterChange: tableActions.setGlobalFilter,
        onPaginationChange: tableActions.setPagination,
      })}
    />
  );
}
```

## 6. Mapeo de Columnas

### 6.1 Backend a Frontend
**En el hook genérico:**
```typescript
const columnToBackendMapping = {
  estado: "isActive",
  "e. civil": "maritalStatus", 
  tipo: "documentType",
  isBlacklist: "isBlacklist",
};
```

### 6.2 Columnas de la Tabla
**En el archivo de columnas:**
```typescript
{
  id: "estado", // ID para el filtro en español
  accessorKey: "isActive", // Campo del objeto
  header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
  cell: ({ row }) => (
    <div>
      {row.getValue("isActive") ? (
        <Badge variant="secondary">Activo</Badge>
      ) : (
        <Badge variant="secondary">Inactivo</Badge>
      )}
    </div>
  ),
  filterFn: (row, id, value) => {
    // Lógica de filtrado
  },
  enableColumnFilter: true,
}
```

## 7. Optimizaciones de Performance

### 7.1 Input de Búsqueda
- **Estado local:** `localSearch` se actualiza inmediatamente
- **Debounce:** 300ms para evitar peticiones excesivas
- **Sin transiciones CSS:** `transition: "none"`

### 7.2 Filtros Facetados
- **Estado externo:** `externalFilterValue` para sincronización
- **Callbacks externos:** `onFilterChange` para cambios
- **Limpieza inmediata:** Cuando se borra todo

### 7.3 Re-renders
- **useMemo optimizado:** Dependencias correctas
- **useCallback estable:** Sin recreaciones innecesarias
- **Estado constante:** `columnToBackendMapping` con `useMemo`

## 8. Flujo Completo

1. **Usuario escribe** → `localSearch` se actualiza inmediatamente
2. **Después de 300ms** → `debouncedSearch` actualiza `filtersState.search`
3. **Query se ejecuta** → Backend recibe parámetros de búsqueda
4. **Datos se cargan** → Tabla se actualiza con resultados
5. **Filtros facetados** → Se sincronizan con `externalFilterValue`
6. **Paginación** → Se maneja con `serverPagination`

## 9. Checklist de Implementación

### Backend:
- [ ] Interfaces en `base.repository.interfaces.ts`
- [ ] Lógica en `base.repository.ts` (especialmente booleanos)
- [ ] Servicio con `findAllPaginated` que acepta `FilterOptions` y `SortOptions`
- [ ] Controlador con query parameters para filtros
- [ ] Mapeo de campos enum y booleanos

### Frontend:
- [ ] Hook genérico `useAdvancedPagination`
- [ ] Hook específico del módulo
- [ ] Filtros facetados en `[module].filter.utils.tsx`
- [ ] Columnas con `id` y `accessorKey` correctos
- [ ] Página que usa el hook específico
- [ ] Tabla que pasa `localSearch` y `externalFilters`

### Testing:
- [ ] Input de búsqueda fluido
- [ ] Filtros facetados muestran selecciones
- [ ] Una sola petición por búsqueda
- [ ] Paginación funciona correctamente
- [ ] Sorting funciona correctamente
