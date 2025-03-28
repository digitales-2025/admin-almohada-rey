"use client";

import { type Table } from "@tanstack/react-table";

import { Room } from "../../_types/room";
import { CreateRoomsDialog } from "../create/CreateRoomsDialog";

export interface RoomsTableToolbarActionsProps {
  table?: Table<Room>;
}

export function RoomsTableToolbarActions({ table }: RoomsTableToolbarActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {table && table.getFilteredSelectedRowModel().rows.length > 0 ? <></> : null}
      <CreateRoomsDialog />
    </div>
  );
}
