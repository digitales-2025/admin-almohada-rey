"use client";

import { useMemo } from "react";

import { DataTable } from "@/components/datatable/data-table";
import { SummaryWarehouse } from "../../_types/warehouse";
import { facetedFilters } from "../../_utils/warehouses.filter.utils";
import { warehousesColumns } from "./WarehousesColumns";
import { WarehousesTableToolbarActions } from "./WarehousesTableToolbarActions";

interface WarehousesTableProps {
  data: SummaryWarehouse[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  tableState: any;
  tableActions: any;
  filtersState: any;
  getFilterValueByColumn: (columnId: string) => any;
  localSearch: string;
}

export function WarehousesTable({
  data,
  meta,
  tableState: _tableState,
  tableActions,
  filtersState,
  getFilterValueByColumn,
  localSearch,
}: WarehousesTableProps) {
  const columns = useMemo(() => warehousesColumns(), []);

  return (
    <DataTable
      data={data as any}
      columns={columns as any}
      toolbarActions={(table: any) => <WarehousesTableToolbarActions table={table} />}
      filterPlaceholder="Buscar almacenes..."
      facetedFilters={facetedFilters}
      serverPagination={{
        pageIndex: meta.page - 1,
        pageSize: meta.pageSize,
        pageCount: meta.totalPages,
        total: meta.total,
        onPaginationChange: tableActions?.setPagination,
      }}
      externalGlobalFilter={localSearch}
      onGlobalFilterChange={tableActions?.setGlobalFilter}
      externalFilters={filtersState.filters}
      getFilterValueByColumn={getFilterValueByColumn}
      onSortingChange={tableActions?.setSorting}
      onColumnFiltersChange={tableActions?.setColumnFilters}
      onPaginationChange={tableActions?.setPagination}
    />
  );
}
