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
  Row,
  SortingState,
  Table as TableInstance,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Empty } from "../common/Empty";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";

// Función de filtrado global correcta para TanStack Table v8
const globalFilterFn: FilterFn<any> = (row, columnId, value) => {
  const getValue = (row: Row<any>) => {
    // Si es _all, busca en todos los valores concatenados
    if (columnId === "_all") {
      const allValues = Object.values(row.original)
        .filter((val) => val !== null && val !== undefined)
        .join(" ")
        .toLowerCase();
      return allValues;
    }

    // Busca en la columna específica
    const cellValue = row.getValue(columnId);
    return cellValue !== null && cellValue !== undefined ? String(cellValue).toLowerCase() : "";
  };

  const searchValue = value.toLowerCase();
  return getValue(row).includes(searchValue);
};

interface DataTableExpandedProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  toolbarActions?: React.ReactNode | ((table: TableInstance<TData>) => React.ReactNode);
  filterPlaceholder?: string;
  facetedFilters?: {
    column: string;
    title: string;
    options: {
      label: string;
      value: TValue;
      icon?: React.ComponentType<{ className?: string }>;
    }[];
  }[];
  renderExpandedRow?: (row: TData) => React.ReactNode; // Nueva prop para el contenido expandido
  onClickRow?: (row: TData) => void;
}

export function DataTableExpanded<TData, TValue>({
  columns,
  data,
  toolbarActions,
  filterPlaceholder,
  facetedFilters,
  renderExpandedRow,
  onClickRow,
}: DataTableExpandedProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnPinning, setColumnPinning] = React.useState<ColumnPinningState>({
    left: ["select"],
    right: ["actions"],
  });
  const [expandedRows, setExpandedRows] = React.useState<Record<string, boolean>>({}); // Estado para manejar filas expandidas

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      global: globalFilterFn,
    },
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter,
      columnPinning,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnPinningChange: setColumnPinning,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    globalFilterFn: globalFilterFn,
  });

  // Función para manejar la expansión de filas
  const toggleRowExpansion = (rowId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  // Estilos para columnas fijadas
  const getCommonPinningStyles = (column: Column<TData>): React.CSSProperties => {
    const isPinned = column.getIsPinned();

    return {
      left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
      right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
      position: isPinned ? "sticky" : "relative",
      zIndex: isPinned ? 1 : 0,
      backgroundColor: "white",
    };
  };

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        toolbarActions={toolbarActions}
        filterPlaceholder={filterPlaceholder}
        facetedFilters={facetedFilters}
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
                      style={{
                        ...getCommonPinningStyles(column),
                      }}
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
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => {
                      if (onClickRow) onClickRow(row.original);
                      toggleRowExpansion(row.id); // Alternar expansión al hacer clic
                    }}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const { column } = cell;
                      return (
                        <TableCell
                          key={cell.id}
                          className="text-slate-600"
                          style={{
                            ...getCommonPinningStyles(column),
                          }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                  {expandedRows[row.id] && renderExpandedRow && (
                    <TableRow>
                      <TableCell colSpan={columns.length}>{renderExpandedRow(row.original)}</TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
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
      <DataTablePagination table={table} />
    </div>
  );
}
