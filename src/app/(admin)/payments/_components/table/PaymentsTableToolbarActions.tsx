"use client";

import { type Table } from "@tanstack/react-table";

import { SummaryPayment } from "../../_types/payment";

export interface PaymentsTableToolbarActionsProps {
  table?: Table<SummaryPayment>;
}

export function PaymentsTableToolbarActions({ table }: PaymentsTableToolbarActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {table && table.getFilteredSelectedRowModel().rows.length > 0 ? <></> : null}
    </div>
  );
}
