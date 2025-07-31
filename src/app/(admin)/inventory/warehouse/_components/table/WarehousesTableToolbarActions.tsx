"use client";

import { type Table } from "@tanstack/react-table";

import { SummaryWarehouse } from "../../_types/warehouse";

export interface WarehousesTableToolbarActionsProps {
  table?: Table<SummaryWarehouse>;
}

export function WarehousesTableToolbarActions({ table }: WarehousesTableToolbarActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {table && table.getFilteredSelectedRowModel().rows.length > 0 ? <></> : null}
    </div>
  );
}
