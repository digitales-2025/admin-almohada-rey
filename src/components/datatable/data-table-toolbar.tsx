import { useRef } from "react";
import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { DateRange } from "react-day-picker";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { DataTableDateRangeFilter } from "./data-table-date-range-filter";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";
import { FacetedFilter } from "./facetedFilters";

interface DataTableToolbarProps<TData, TValue> {
  table: Table<TData>;
  toolbarActions?: React.ReactNode | ((table: Table<TData>) => React.ReactNode);
  filterPlaceholder?: string;
  facetedFilters?: (FacetedFilter<TValue> & {
    externalFilterValue?: TValue[] | TValue | DateRange | { from: Date; to: Date };
    onFilterChange?: (value: TValue[] | TValue | { from: Date; to: Date } | undefined) => void;
  })[];
  onGlobalFilterChange?: (filter: string) => void;
  externalGlobalFilter?: string;
  onColumnFiltersChange?: (filters: Array<{ id: string; value: any }>) => void;
}

export function DataTableToolbar<TData, TValue>({
  table,
  toolbarActions,
  filterPlaceholder = "Filter...",
  facetedFilters = [],
  onGlobalFilterChange,
  externalGlobalFilter,
  onColumnFiltersChange,
}: DataTableToolbarProps<TData, TValue>) {
  const isFiltered =
    table.getState().columnFilters.length > 0 ||
    (externalGlobalFilter !== undefined ? externalGlobalFilter !== "" : table.getState().globalFilter !== "");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Función para manejar el cambio del input sin perder el foco
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    // Si hay un callback externo, usarlo; sino usar table.setGlobalFilter
    if (onGlobalFilterChange) {
      onGlobalFilterChange(value);
    } else {
      table.setGlobalFilter(value);
    }

    // Mantener el foco en el input
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <Input
          ref={searchInputRef}
          type="search"
          placeholder={filterPlaceholder}
          value={externalGlobalFilter !== undefined ? externalGlobalFilter : (table.getState().globalFilter ?? "")}
          onChange={handleSearchChange}
          className="h-8 w-[150px] lg:w-[250px]"
          autoComplete="off"
          style={{
            transition: "none", // Eliminar transiciones que puedan causar lag
          }}
        />
        <div className="flex flex-wrap items-center gap-2">
          {facetedFilters.map((filter) => {
            const filterType = filter.type || "faceted";

            // Renderizar filtro de fecha si el tipo es "dateRange"
            if (filterType === "dateRange") {
              // Para filtros de fecha, no necesitamos una columna de la tabla
              return (
                <DataTableDateRangeFilter
                  key={filter.column}
                  column={undefined}
                  title={filter.title}
                  externalFilterValue={filter.externalFilterValue as DateRange | { from: Date; to: Date } | undefined}
                  onFilterChange={(value) => {
                    if (filter.onFilterChange) {
                      filter.onFilterChange(value);
                    }
                  }}
                  numberOfMonths={filter.dateRangeConfig?.numberOfMonths || 2}
                />
              );
            }

            // Renderizar filtro facetado por defecto (requiere columna)
            const column = table.getColumn(filter.column);
            return (
              column && (
                <DataTableFacetedFilter
                  key={filter.column}
                  column={column as any}
                  title={filter.title}
                  options={filter.options}
                  externalFilterValue={filter.externalFilterValue as TValue[] | TValue | undefined}
                  onFilterChange={filter.onFilterChange as (value: TValue[] | TValue | undefined) => void}
                />
              )
            );
          })}
        </div>
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              if (onColumnFiltersChange) {
                onColumnFiltersChange([]);
              } else {
                table.resetColumnFilters();
              }
              if (onGlobalFilterChange) {
                onGlobalFilterChange("");
              } else {
                table.setGlobalFilter("");
              }
            }}
            className="h-8 px-2 lg:px-3"
          >
            Limpiar
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        {typeof toolbarActions === "function" ? toolbarActions(table) : toolbarActions}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
