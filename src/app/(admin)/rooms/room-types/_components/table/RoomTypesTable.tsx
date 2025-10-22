"use client";

import { useMemo } from "react";

import { useProfile } from "@/app/(admin)/profile/_hooks/use-profile";
import { DataTable } from "@/components/datatable/data-table";
import {
  CustomPaginationTableParams,
  ServerPaginationChangeEventCallback,
} from "@/types/tanstack-table/CustomPagination";
import { RoomType } from "../../_types/roomTypes";
import { facetedFilters } from "../../_utils/room-types.filter.utils";
import { RoomTypeDescription } from "./RoomTypesDescription";
import { roomTypesColumns } from "./RoomTypesTableColumns";
import { RoomTypesTableToolbarActions } from "./RoomTypesTableToolbarActions";

interface RoomTypesTableProps {
  data: RoomType[];
  pagination: CustomPaginationTableParams;
  onPaginationChange: ServerPaginationChangeEventCallback;
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

export function RoomTypesTable({
  data,
  pagination,
  onPaginationChange,
  tableState,
  tableActions,
  filtersState,
  getFilterValueByColumn,
  localSearch,
}: RoomTypesTableProps) {
  const { user } = useProfile();
  const columns = useMemo(() => roomTypesColumns(user?.isSuperAdmin || false), [user]);

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
      data={data as any}
      columns={columns as any}
      toolbarActions={(table: any) => <RoomTypesTableToolbarActions table={table} />}
      filterPlaceholder="Buscar tipos de habitación..."
      facetedFilters={facetedFilters}
      enableExpansion={true}
      renderExpandedRow={(row: any) => <RoomTypeDescription row={row} />}
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
