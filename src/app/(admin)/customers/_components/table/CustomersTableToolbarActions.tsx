"use client";

import { type Table } from "@tanstack/react-table";

import { Customer } from "../../_types/customer";
import { CreateCustomersDialog } from "../create/CreateCustomersDialog";

export interface CustomersTableToolbarActionsProps {
  table?: Table<Customer>;
}

export function CustomersTableToolbarActions({ table }: CustomersTableToolbarActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {table && table.getFilteredSelectedRowModel().rows.length > 0 ? <></> : null}
      <CreateCustomersDialog />
    </div>
  );
}
