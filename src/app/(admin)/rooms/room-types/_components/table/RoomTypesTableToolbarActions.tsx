"use client";

import { type Table } from "@tanstack/react-table";

import { RoomType } from "../../_types/roomTypes";
import { CreateRoomTypeDialog } from "../create/CreateRoomTypesDialog";
import { DeleteRoomTypesDialog } from "../state-management/DeleteRoomTypesDialog";
import { ReactivateRoomTypesDialog } from "../state-management/ReactivateRoomTypesDialog";

export interface RoomTypesTableToolbarActionsProps {
  table?: Table<RoomType>;
}

export function RoomTypesTableToolbarActions({ table }: RoomTypesTableToolbarActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {table && table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <>
          <DeleteRoomTypesDialog
            roomTypes={table.getFilteredSelectedRowModel().rows.map((row) => row.original)}
            onSuccess={() => table.toggleAllRowsSelected(false)}
          />
          <ReactivateRoomTypesDialog
            roomTypes={table.getFilteredSelectedRowModel().rows.map((row) => row.original)}
            onSuccess={() => table.toggleAllRowsSelected(false)}
          />
        </>
      ) : null}
      <CreateRoomTypeDialog />
    </div>
  );
}
