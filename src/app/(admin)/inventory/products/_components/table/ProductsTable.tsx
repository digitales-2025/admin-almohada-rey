"use client";

import { useMemo } from "react";

import { useProfile } from "@/app/(admin)/profile/_hooks/use-profile";
import { DataTable } from "@/components/datatable/data-table";
import { Product } from "../../_types/products";
import { facetedFilters } from "../../_utils/products.filter.utils";
import { productsColumns } from "./ProductsTableColumns";
import { ProductsTableToolbarActions } from "./ProductsTableToolbarActions";

interface ProductsTableProps {
  data: Product[];
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

export function ProductsTable({
  data,
  meta,
  tableState: _tableState,
  tableActions,
  filtersState,
  getFilterValueByColumn,
  localSearch,
}: ProductsTableProps) {
  const { user } = useProfile();
  const columns = useMemo(() => productsColumns(user?.isSuperAdmin || false), [user]);

  return (
    <DataTable
      data={data as any}
      columns={columns as any}
      toolbarActions={(table: any) => <ProductsTableToolbarActions table={table} />}
      filterPlaceholder="Buscar productos..."
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
