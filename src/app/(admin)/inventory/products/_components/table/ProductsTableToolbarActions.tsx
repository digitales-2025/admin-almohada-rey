"use client";

import { type Table } from "@tanstack/react-table";

import { Product } from "../../_types/products";
import { CreateProductsDialog } from "../create/CreateProductsDialog";

export interface CustomersTableToolbarActionsProps {
  table?: Table<Product>;
}

export function CustomersTableToolbarActions({ table }: CustomersTableToolbarActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {table && table.getFilteredSelectedRowModel().rows.length > 0 ? <></> : null}
      <CreateProductsDialog />
    </div>
  );
}
