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
  refetchPaginatedRooms: () => void;
  tableState?: {
    sorting?: Array<{ id: string; desc: boolean }>;
    columnFilters?: Array<{ id: string; value: any }>;
    globalFilter?: string;
    pagination: { pageIndex: number; pageSize: number };
  };
  tableActions?: {
    setSorting: (sorting: Array<{ id: string; desc: boolean }>) => void;
    setColumnFilters: (filters: Array<{ id: string; value: any }>) => void;
    setGlobalFilter: (filter: string) => void;
    setPagination: (pagination: { pageIndex: number; pageSize: number }) => void;
  };
  filtersState?: {
    search: string;
    filters: Record<string, any>;
    sort: any;
    pagination: { page?: number; pageSize?: number };
  };
  getFilterValueByColumn?: (columnId: string) => any;
  localSearch?: string;
}

export function RoomsTable({
  data,
  pagination,
  onPaginationChange,
  refetchPaginatedRooms,
  tableState,
  tableActions,
  filtersState,
  getFilterValueByColumn,
  localSearch,
}: RoomsTableProps) {
  const { user } = useProfile();

  const router = useRouter();

  const handleRoomCleaningLog = useCallback(
    (id: string) => {
      router.push(`/rooms/list/${id}/clean`);
    },
    [router]
  );

  const columns = useMemo(
    () => roomsColumns(user?.isSuperAdmin || false, handleRoomCleaningLog, refetchPaginatedRooms),
    [user, handleRoomCleaningLog, refetchPaginatedRooms]
  );

  const serverPagination = {
    pageIndex: tableState?.pagination.pageIndex ?? pagination.page - 1,
    pageSize: tableState?.pagination.pageSize ?? pagination.pageSize,
    pageCount: pagination.totalPages,
    total: pagination.total,
    onPaginationChange: (pageIndex: number, pageSize: number) => {
      if (tableActions) {
        tableActions.setPagination({ pageIndex, pageSize });
      }
      onPaginationChange(pageIndex + 1, pageSize);
    },
  };

  return (
    <DataTable
      data={data}
      columns={columns}
      toolbarActions={(table: TableInstance<Room>) => <RoomsTableToolbarActions table={table} />}
      filterPlaceholder="Buscar habitaciones..."
      facetedFilters={facetedFilters}
      serverPagination={serverPagination}
      externalGlobalFilter={localSearch}
      externalFilters={filtersState?.filters}
      getFilterValueByColumn={getFilterValueByColumn}
      {...(tableActions && {
        onSortingChange: tableActions.setSorting,
        onColumnFiltersChange: tableActions.setColumnFilters,
        onGlobalFilterChange: tableActions.setGlobalFilter,
        onPaginationChange: tableActions.setPagination,
      })}
    />
  );
}
