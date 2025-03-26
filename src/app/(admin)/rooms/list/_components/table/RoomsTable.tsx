"use client";

import { useMemo } from "react";
import { Table as TableInstance } from "@tanstack/react-table";

import { useProfile } from "@/app/(admin)/profile/_hooks/use-profile";
import { DataTable } from "@/components/datatable/data-table";
import { Room } from "../../_types/room";
import { facetedFilters } from "../../_utils/rooms.filter.utils";
import { roomsColumns } from "./RoomsTableColumns";
import { RoomsTableToolbarActions } from "./RoomsTableToolbarActions";

export function RoomsTable({ data }: { data: Room[] }) {
  const { user } = useProfile();
  const columns = useMemo(() => roomsColumns(user?.isSuperAdmin || false), [user]);

  return (
    <DataTable
      data={data}
      columns={columns}
      toolbarActions={(table: TableInstance<Room>) => <RoomsTableToolbarActions table={table} />}
      filterPlaceholder="Buscar habitaciones..."
      facetedFilters={facetedFilters}
    />
  );
}
