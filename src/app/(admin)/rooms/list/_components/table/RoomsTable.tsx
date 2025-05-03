"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Table as TableInstance } from "@tanstack/react-table";

import { useProfile } from "@/app/(admin)/profile/_hooks/use-profile";
import { DataTable } from "@/components/datatable/data-table";
import {
  CustomPaginationTableParams,
  ServerPaginationChangeEventCallback,
} from "@/types/tanstack-table/CustomPagination";
import { Room } from "../../_types/room";
import { facetedFilters } from "../../_utils/rooms.filter.utils";
import { roomsColumns } from "./RoomsTableColumns";
import { RoomsTableToolbarActions } from "./RoomsTableToolbarActions";

interface RoomsTableProps {
  data: Room[];
  pagination: CustomPaginationTableParams;
  onPaginationChange: ServerPaginationChangeEventCallback;
}

export function RoomsTable({ data, pagination, onPaginationChange }: RoomsTableProps) {
  const { user } = useProfile();

  const router = useRouter();

  const handleRoomCleaningLog = useCallback(
    (id: string) => {
      router.push(`/rooms/list/${id}/clean`);
    },
    [router]
  );

  const columns = useMemo(
    () => roomsColumns(user?.isSuperAdmin || false, handleRoomCleaningLog),
    [user, handleRoomCleaningLog]
  );

  return (
    <DataTable
      data={data}
      columns={columns}
      toolbarActions={(table: TableInstance<Room>) => <RoomsTableToolbarActions table={table} />}
      filterPlaceholder="Buscar habitaciones..."
      facetedFilters={facetedFilters}
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
