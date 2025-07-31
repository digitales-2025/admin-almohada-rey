"use client";

import { useMemo } from "react";
import { Table as TableInstance } from "@tanstack/react-table";

import { useProfile } from "@/app/(admin)/profile/_hooks/use-profile";
import { DataTable } from "@/components/datatable/data-table";
import {
  CustomPaginationTableParams,
  ServerPaginationChangeEventCallback,
} from "@/types/tanstack-table/CustomPagination";
import { Product } from "../../_types/products";
import { facetedFilters } from "../../_utils/products.filter.utils";
import { productsColumns } from "./ProductsTableColumns";
import { ProductsTableToolbarActions } from "./ProductsTableToolbarActions";

interface ProductsTableProps {
  data: Product[];
  pagination: CustomPaginationTableParams;
  onPaginationChange: ServerPaginationChangeEventCallback;
}

export function ProductsTable({ data, pagination, onPaginationChange }: ProductsTableProps) {
  const { user } = useProfile();
  const columns = useMemo(() => productsColumns(user?.isSuperAdmin || false), [user]);

  return (
    <DataTable
      data={data}
      columns={columns}
      toolbarActions={(table: TableInstance<Product>) => <ProductsTableToolbarActions table={table} />}
      filterPlaceholder="Buscar productos..."
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
