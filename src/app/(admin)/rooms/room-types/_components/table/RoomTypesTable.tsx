"use client";

import { useMemo } from "react";
import { Table as TableInstance } from "@tanstack/react-table";

import { useProfile } from "@/app/(admin)/profile/_hooks/use-profile";
import { DataTableExpanded } from "@/components/datatable/data-table-expanded";
import {
  CustomPaginationTableParams,
  ServerPaginationChangeEventCallback,
} from "@/types/tanstack-table/CustomPagination";
import { RoomType } from "../../_types/roomTypes";
import { RoomTypeDescription } from "./RoomTypesDescription";
import { roomTypesColumns } from "./RoomTypesTableColumns";
import { RoomTypesTableToolbarActions } from "./RoomTypesTableToolbarActions";

interface RoomTypesTableProps {
  data: RoomType[];
  pagination: CustomPaginationTableParams;
  onPaginationChange: ServerPaginationChangeEventCallback;
}

export function RoomTypesTable({ data, pagination, onPaginationChange }: RoomTypesTableProps) {
  const { user } = useProfile();
  const columns = useMemo(() => roomTypesColumns(user?.isSuperAdmin || false), [user]);

  return (
    <DataTableExpanded
      data={data}
      columns={columns}
      toolbarActions={(table: TableInstance<RoomType>) => <RoomTypesTableToolbarActions table={table} />}
      filterPlaceholder="Buscar tipos de habitación..."
      renderExpandedRow={(row) => <RoomTypeDescription row={row} />}
      serverPagination={{
        pageIndex: pagination.page - 1,
        pageSize: pagination.pageSize,
        pageCount: pagination.totalPages,
        total: pagination.total,
        onPaginationChange: (pageIndex, pageSize) => {
          // Convertir de 0-indexed a 1-indexed para el API
          onPaginationChange(pageIndex + 1, pageSize);
        },
      }}
    />
  );
}
