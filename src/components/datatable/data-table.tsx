import * as React from "react";
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  ColumnPinningState,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  Row,
  SortingState,
  Table as TableInstance,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ServerPaginationTanstackTableConfig } from "@/types/tanstack-table/CustomPagination";
import { Empty } from "../common/Empty";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { FacetedFilter } from "./facetedFilters";

// Función de filtrado global correcta para TanStack Table v8
const globalFilterFn: FilterFn<any> = (row, columnId, value) => {
  const getValue = (row: Row<any>) => {
    // Accede a los valores originales de la fila
    const rowValue = columnId === "_all" ? Object.values(row.original).join(" ") : row.getValue(columnId);

    // Convierte a string para la comparación
    return typeof rowValue === "string" ? rowValue.toLowerCase() : String(rowValue).toLowerCase();
  };

  const searchValue = value.toLowerCase();
  return getValue(row).includes(searchValue);
};

interface DataTableProps<TData extends Record<string, unknown>, TValue = unknown> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  toolbarActions?: React.ReactNode | ((table: TableInstance<TData>) => React.ReactNode);
  filterPlaceholder?: string;
  facetedFilters?: FacetedFilter<TValue>[];
  // Nuevas props para paginación del servidor
  serverPagination?: ServerPaginationTanstackTableConfig;

  // Props opcionales para funcionalidad expandida (del DataTableExpanded)
  renderExpandedRow?: (row: TData) => React.ReactNode;
  onClickRow?: (row: TData) => void;
  columnVisibilityConfig?: Partial<Record<keyof TData, boolean>>;
  enableExpansion?: boolean;
  enableColumnPinning?: boolean;

  // Props para manejo de estado externo (para integración con hooks avanzados)
  onSortingChange?: (sorting: SortingState) => void;
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void;
  onGlobalFilterChange?: (filter: string) => void;
  onPaginationChange?: (pagination: PaginationState) => void;
  externalGlobalFilter?: string;
  externalFilters?: Record<string, any>;
  getFilterValueByColumn?: (columnId: string) => any;

  // Props para funcionalidad de tachado de filas
  shouldStrikeRow?: (row: TData) => boolean;
  strikeRowClassName?: string;
}

export function DataTable<TData extends Record<string, unknown>, TValue = unknown>({
  columns,
  data,
  toolbarActions,
  filterPlaceholder,
  facetedFilters,
  serverPagination,
  renderExpandedRow,
  onClickRow,
  columnVisibilityConfig,
  enableExpansion = false,
  enableColumnPinning = false,
  onSortingChange,
  onColumnFiltersChange,
  onGlobalFilterChange,
  onPaginationChange,
  externalGlobalFilter,
  externalFilters,
  getFilterValueByColumn,
  shouldStrikeRow,
  strikeRowClassName = "line-through opacity-60",
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(
    (columnVisibilityConfig as VisibilityState) ?? {}
  );
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // Estados opcionales para funcionalidad expandida
  const [columnPinning, setColumnPinning] = React.useState<ColumnPinningState>({
    left: ["select"],
    right: ["actions"],
  });
  const [expanded, setExpanded] = React.useState({});

  // Estado de paginación local o del servidor
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: serverPagination?.pageIndex ?? 0,
    pageSize: serverPagination?.pageSize ?? 10,
  });

  // Manejar cambios de paginación
  const handlePaginationChange = React.useCallback(
    (updaterOrValue: PaginationState | ((old: PaginationState) => PaginationState)) => {
      const newPagination = typeof updaterOrValue === "function" ? updaterOrValue(pagination) : updaterOrValue;

      setPagination(newPagination);
      if (serverPagination?.onPaginationChange) {
        serverPagination.onPaginationChange(newPagination.pageIndex, newPagination.pageSize);
      }
      // Llamar callback externo si existe
      if (onPaginationChange) {
        onPaginationChange(newPagination);
      }
    },
    [pagination, serverPagination, onPaginationChange]
  );

  // Manejar cambios de sorting
  const handleSortingChange = React.useCallback(
    (updaterOrValue: SortingState | ((old: SortingState) => SortingState)) => {
      const newSorting = typeof updaterOrValue === "function" ? updaterOrValue(sorting) : updaterOrValue;
      setSorting(newSorting);
      if (onSortingChange) {
        onSortingChange(newSorting);
      }
    },
    [sorting, onSortingChange]
  );

  // Manejar cambios de column filters
  const handleColumnFiltersChange = React.useCallback(
    (updaterOrValue: ColumnFiltersState | ((old: ColumnFiltersState) => ColumnFiltersState)) => {
      const newFilters = typeof updaterOrValue === "function" ? updaterOrValue(columnFilters) : updaterOrValue;
      setColumnFilters(newFilters);
      if (onColumnFiltersChange) {
        onColumnFiltersChange(newFilters);
      }
    },
    [columnFilters, onColumnFiltersChange]
  );

  // Manejar cambios de global filter
  const handleGlobalFilterChange = React.useCallback(
    (updaterOrValue: string | ((old: string) => string)) => {
      const newFilter = typeof updaterOrValue === "function" ? updaterOrValue(globalFilter) : updaterOrValue;
      setGlobalFilter(newFilter);
      if (onGlobalFilterChange) {
        onGlobalFilterChange(newFilter);
      }
    },
    [globalFilter, onGlobalFilterChange]
  );

  const table = useReactTable({
    data,
    columns: columns as ColumnDef<unknown, unknown>[],
    filterFns: {
      global: globalFilterFn,
    },
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      // No aplicar filtros locales si es paginación del servidor
      ...(serverPagination ? {} : { columnFilters, globalFilter }),
      pagination,
      ...(enableColumnPinning && { columnPinning }),
      ...(enableExpansion && { expanded }),
    },
    // Configuración para expansión
    ...(enableExpansion && {
      onExpandedChange: setExpanded,
      getRowCanExpand: () => true,
    }),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: handleSortingChange,
    onColumnFiltersChange: handleColumnFiltersChange,
    onGlobalFilterChange: handleGlobalFilterChange,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: handlePaginationChange,
    ...(enableColumnPinning && { onColumnPinningChange: setColumnPinning }),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: serverPagination ? undefined : getPaginationRowModel(),
    // No aplicar modelos de filtrado si es paginación del servidor
    ...(serverPagination
      ? {}
      : {
          getFilteredRowModel: getFilteredRowModel(),
          getFacetedRowModel: getFacetedRowModel(),
          getFacetedUniqueValues: getFacetedUniqueValues(),
        }),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: globalFilterFn,
    // Configuración para paginación del servidor
    pageCount: serverPagination?.pageCount ?? -1,
    manualPagination: !!serverPagination,
  });

  // Estilos para columnas fijadas (solo si está habilitado)
  const getCommonPinningStyles = (column: Column<TData, TValue>): React.CSSProperties => {
    if (!enableColumnPinning) return {};

    const isPinned = column.getIsPinned();
    return {
      left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
      right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
      zIndex: isPinned ? 1 : 0,
    };
  };

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table as TableInstance<TData>}
        toolbarActions={toolbarActions}
        filterPlaceholder={filterPlaceholder}
        facetedFilters={facetedFilters?.map((filter) => {
          const enhancedFilter = {
            ...filter,
            externalFilterValue: getFilterValueByColumn
              ? getFilterValueByColumn(filter.column)
              : externalFilters?.[filter.column],
            onFilterChange: (value: any) => {
              if (onColumnFiltersChange) {
                // Obtener filtros existentes y actualizar solo el filtro específico
                const currentFilters = table.getState().columnFilters;
                const updatedFilters = currentFilters.filter((f) => f.id !== filter.column);

                if (value !== undefined) {
                  updatedFilters.push({ id: filter.column, value });
                }

                onColumnFiltersChange(updatedFilters);
              }
            },
          };
          return enhancedFilter;
        })}
        onGlobalFilterChange={onGlobalFilterChange}
        externalGlobalFilter={externalGlobalFilter}
        onColumnFiltersChange={onColumnFiltersChange}
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const { column } = header;
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      style={getCommonPinningStyles(column as Column<TData, TValue>)}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const shouldStrike = shouldStrikeRow ? shouldStrikeRow(row.original as TData) : false;
                return (
                  <React.Fragment key={row.id}>
                    <TableRow
                      data-state={row.getIsSelected() && "selected"}
                      onClick={() => {
                        if (onClickRow) onClickRow(row.original as TData);
                      }}
                      className={shouldStrike ? strikeRowClassName : undefined}
                    >
                      {row.getVisibleCells().map((cell) => {
                        const { column } = cell;
                        return (
                          <TableCell
                            key={cell.id}
                            style={getCommonPinningStyles(column as Column<TData, TValue>)}
                            className={shouldStrike ? strikeRowClassName : undefined}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                    {enableExpansion && row.getIsExpanded() && renderExpandedRow && (
                      <TableRow
                        data-state={row.getIsExpanded() ? "expanded" : "collapsed"}
                        className="animate-fade-down animate-duration-500 animate-ease-in-out animate-fill-forwards data-[state=collapsed]:animate-out data-[state=collapsed]:fade-out-0"
                      >
                        <TableCell colSpan={columns.length}>{renderExpandedRow(row.original as TData)}</TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <Empty />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} serverPagination={serverPagination} />
    </div>
  );
}
