"use client";

import { type Table } from "@tanstack/react-table";

import { Product } from "../../_types/products";
import { CreateProductsDialog } from "../create/CreateProductsDialog";
import { DeleteProductsDialog } from "../state-management/DeleteProductsDialog";
import { ReactivateProductsDialog } from "../state-management/ReactivateProductsDialog";

export interface CustomersTableToolbarActionsProps {
  table?: Table<Product>;
}

export function CustomersTableToolbarActions({ table }: CustomersTableToolbarActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {table && table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <>
          <>
            <DeleteProductsDialog
              products={table.getFilteredSelectedRowModel().rows.map((row) => row.original)}
              onSuccess={() => table.toggleAllRowsSelected(false)}
            />
            <ReactivateProductsDialog
              products={table.getFilteredSelectedRowModel().rows.map((row) => row.original)}
              onSuccess={() => table.toggleAllRowsSelected(false)}
            />
          </>
        </>
      ) : null}
      <CreateProductsDialog />
    </div>
  );
}
