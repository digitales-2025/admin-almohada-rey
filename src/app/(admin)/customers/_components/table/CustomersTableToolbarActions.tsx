"use client";

import { type Table } from "@tanstack/react-table";

import { Customer } from "../../_types/customer";
import { CreateCustomersDialog } from "../create/CreateCustomersDialog";
import { ImportCustomersDialog } from "../import/ImportCustomersDialog";
import { DeleteCustomersDialog } from "../state-management/DeleteCustomersDialog";
import { ReactivateCustomersDialog } from "../state-management/ReactivateCustomersDialog";

export interface CustomersTableToolbarActionsProps {
  table?: Table<Customer>;
}

export function CustomersTableToolbarActions({ table }: CustomersTableToolbarActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {table && table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <>
          <DeleteCustomersDialog
            customers={table.getFilteredSelectedRowModel().rows.map((row) => row.original)}
            onSuccess={() => table.toggleAllRowsSelected(false)}
          />
          <ReactivateCustomersDialog
            customers={table.getFilteredSelectedRowModel().rows.map((row) => row.original)}
            onSuccess={() => table.toggleAllRowsSelected(false)}
          />
        </>
      ) : null}
      <ImportCustomersDialog />
      <CreateCustomersDialog />
    </div>
  );
}
