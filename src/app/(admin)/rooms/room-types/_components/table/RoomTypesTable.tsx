"use client";

import { useMemo } from "react";
import { Table as TableInstance } from "@tanstack/react-table";

import { useProfile } from "@/app/(admin)/profile/_hooks/use-profile";
import { DataTableExpanded } from "@/components/datatable/data-table-expanded";
import { RoomType } from "../../_types/roomTypes";
/* import { facetedFilters } from "../../_utils/roomTypes.filter.utils"; */
import { RoomTypeDescription } from "./RoomTypesDescription";
import { roomTypesColumns } from "./RoomTypesTableColumns";
import { RoomTypesTableToolbarActions } from "./RoomTypesTableToolbarActions";

export function RoomTypesTable({ data }: { data: RoomType[] }) {
  const { user } = useProfile();
  const columns = useMemo(() => roomTypesColumns(user?.isSuperAdmin || false), [user]);

  return (
    <DataTableExpanded
      data={data}
      columns={columns}
      toolbarActions={(table: TableInstance<RoomType>) => <RoomTypesTableToolbarActions table={table} />}
      filterPlaceholder="Buscar tipos de habitación..."
      /* facetedFilters={facetedFilters} */
      renderExpandedRow={(row) => <RoomTypeDescription row={row} />}
    />
  );
}
