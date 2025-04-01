"use client";

import { type Table } from "@tanstack/react-table";

import { Room } from "../../_types/room";
import { CreateRoomsDialog } from "../create/CreateRoomsDialog";
import { DeleteRoomsDialog } from "../state-management/DeleteRoomsDialog";
import { ReactivateRoomsDialog } from "../state-management/ReactivateRoomsDialog";

export interface RoomsTableToolbarActionsProps {
  table?: Table<Room>;
}

export function RoomsTableToolbarActions({ table }: RoomsTableToolbarActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {table && table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <>
          <DeleteRoomsDialog
            rooms={table.getFilteredSelectedRowModel().rows.map((row) => row.original)}
            onSuccess={() => table.toggleAllRowsSelected(false)}
          />
          <ReactivateRoomsDialog
            rooms={table.getFilteredSelectedRowModel().rows.map((row) => row.original)}
            onSuccess={() => table.toggleAllRowsSelected(false)}
          />
        </>
      ) : null}
      <CreateRoomsDialog />
    </div>
  );
}
