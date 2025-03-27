"use client";

import { type Table } from "@tanstack/react-table";

import { DetailedReservation } from "../../_schemas/reservation.schemas";
import { CreateReservationDialog } from "../create/CreateReservationDialog";

export interface ReservationTableToolbarActionsProps {
  table?: Table<DetailedReservation>;
}

export function ReservationTableToolbarActions(
  {
    // table
  }: ReservationTableToolbarActionsProps
) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {/* {table && table.getFilteredSelectedRowModel().rows.length > 0 ? (
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
      ) : null} */}
      <CreateReservationDialog />
    </div>
  );
}
