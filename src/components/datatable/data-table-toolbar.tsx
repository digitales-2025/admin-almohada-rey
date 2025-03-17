import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData, TValue> {
  table: Table<TData>;
  toolbarActions?: React.ReactNode;
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
}

export function DataTableToolbar<TData, TValue>({
  table,
  toolbarActions,
  filterPlaceholder = "Filter...",
  facetedFilters = [],
}: DataTableToolbarProps<TData, TValue>) {
  const isFiltered = table.getState().columnFilters.length > 0 || table.getState().globalFilter !== "";

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <Input
          placeholder={filterPlaceholder}
          value={table.getState().globalFilter ?? ""}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <div className="flex gap-x-2">
          {facetedFilters.map((filter) => {
            const column = table.getColumn(filter.column);
            return (
              column && (
                <DataTableFacetedFilter
                  key={filter.column}
                  column={column}
                  title={filter.title}
                  options={filter.options}
                />
              )
            );
          })}
        </div>
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              table.setGlobalFilter("");
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        {toolbarActions}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
