import * as React from "react";
import { Column } from "@tanstack/react-table";
import { DateRange } from "react-day-picker";

import { CalendarDatePicker } from "@/components/ui/calendar-date-range-picker";

interface DataTableDateRangeFilterProps<TData> {
  column?: Column<TData, unknown>;
  title?: string;
  externalFilterValue?: { from: Date; to: Date } | DateRange | undefined;
  onFilterChange?: (value: { from: Date; to: Date } | undefined) => void;
  numberOfMonths?: 1 | 2;
}

export function DataTableDateRangeFilter<TData>({
  column,
  title,
  externalFilterValue,
  onFilterChange,
  numberOfMonths = 2,
}: DataTableDateRangeFilterProps<TData>) {
  // Usamos el valor externo si está disponible, sino el del column
  const filterValue = externalFilterValue !== undefined ? externalFilterValue : column?.getFilterValue();

  // Convertir el valor del filtro a DateRange
  const dateRange: DateRange = React.useMemo(() => {
    if (!filterValue) {
      return { from: undefined, to: undefined };
    }

    // Si es un objeto con from y to
    if (typeof filterValue === "object" && "from" in filterValue && "to" in filterValue) {
      return {
        from:
          filterValue.from instanceof Date ? filterValue.from : new Date(filterValue.from as string | number | Date),
        to: filterValue.to instanceof Date ? filterValue.to : new Date(filterValue.to as string | number | Date),
      };
    }

    return { from: undefined, to: undefined };
  }, [filterValue]);

  const handleDateSelect = React.useCallback(
    (range: { from: Date; to: Date }) => {
      const value = range.from && range.to ? { from: range.from, to: range.to } : undefined;

      if (onFilterChange) {
        onFilterChange(value);
      } else {
        column?.setFilterValue(value);
      }
    },
    [onFilterChange, column]
  );

  const handleClear = React.useCallback(() => {
    if (onFilterChange) {
      onFilterChange(undefined);
    } else {
      column?.setFilterValue(undefined);
    }
  }, [onFilterChange, column]);

  return (
    <CalendarDatePicker
      date={dateRange}
      variant="faceted"
      onDateSelect={handleDateSelect}
      numberOfMonths={numberOfMonths}
      closeOnSelect={true}
      facetedFilterStyle={true}
      title={title}
      onClear={handleClear}
    />
  );
}
