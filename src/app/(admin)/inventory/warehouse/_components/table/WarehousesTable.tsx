"use client";

import { useMemo } from "react";
import { Table as TableInstance } from "@tanstack/react-table";

import { DataTable } from "@/components/datatable/data-table";
import {
  CustomPaginationTableParams,
  ServerPaginationChangeEventCallback,
} from "@/types/tanstack-table/CustomPagination";
import { SummaryWarehouse } from "../../_types/warehouse";
import { facetedFilters } from "../../_utils/warehouses.filter.utils";
import { warehousesColumns } from "./WarehousesColumns";
import { WarehousesTableToolbarActions } from "./WarehousesTableToolbarActions";

interface WarehousesTableProps {
  data: SummaryWarehouse[];
  pagination: CustomPaginationTableParams;
  onPaginationChange: ServerPaginationChangeEventCallback;
}

export function WarehousesTable({ data, pagination, onPaginationChange }: WarehousesTableProps) {
  const columns = useMemo(() => warehousesColumns(), []);

  return (
    <DataTable
      data={data}
      columns={columns}
      toolbarActions={(table: TableInstance<SummaryWarehouse>) => <WarehousesTableToolbarActions table={table} />}
      filterPlaceholder="Buscar almacenes..."
      facetedFilters={facetedFilters}
      serverPagination={{
        pageIndex: pagination.page - 1,
        pageSize: pagination.pageSize,
        pageCount: pagination.totalPages,
        total: pagination.total,
        onPaginationChange: (pageIndex, pageSize) => {
          // Convertir de 0-indexed a 1-indexed para el API
          onPaginationChange(pageIndex + 1, pageSize);
        },
      }}
    />
  );
}
