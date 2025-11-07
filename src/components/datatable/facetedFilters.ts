export type FacetedFilter<TValue> = {
  column: string;
  title: string;
  options: {
    label: string;
    value: TValue;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  externalFilterValue?: TValue[] | TValue;
  onFilterChange?: (value: TValue[] | TValue | undefined) => void;
  // Opcional: tipo de filtro de fecha
  type?: "faceted" | "dateRange";
  // Opcional: configuración para filtros de fecha
  dateRangeConfig?: {
    numberOfMonths?: 1 | 2;
  };
};
