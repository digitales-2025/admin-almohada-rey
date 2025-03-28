"use client";

import { useMemo } from "react";
import { Table as TableInstance } from "@tanstack/react-table";

import { useProfile } from "@/app/(admin)/profile/_hooks/use-profile";
import { DataTable } from "@/components/datatable/data-table";
import { Product } from "../../_types/products";
import { facetedFilters } from "../../_utils/products.filter.utils";
import { productsColumns } from "./ProductsTableColumns";
import { CustomersTableToolbarActions } from "./ProductsTableToolbarActions";

export function ProductsTable({ data }: { data: Product[] }) {
  const { user } = useProfile();
  const columns = useMemo(() => productsColumns(user?.isSuperAdmin || false), [user]);

  return (
    <DataTable
      data={data}
      columns={columns}
      toolbarActions={(table: TableInstance<Product>) => <CustomersTableToolbarActions table={table} />}
      filterPlaceholder="Buscar productos..."
      facetedFilters={facetedFilters}
    />
  );
}
