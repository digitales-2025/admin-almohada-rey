"use client";

import { useMemo } from "react";
import { Table as TableInstance } from "@tanstack/react-table";

import { useProfile } from "@/app/(admin)/profile/_hooks/use-profile";
import { DataTable } from "@/components/datatable/data-table";
import {
  CustomPaginationTableParams,
  ServerPaginationChangeEventCallback,
} from "@/types/tanstack-table/CustomPagination";
import { DetailedReservation } from "../../_schemas/reservation.schemas";
import { facetedFilters } from "../../_utils/reservation.filter.utils";
import { reservationColumns } from "./ReservationTableColumns";
import { ReservationTableToolbarActions } from "./ReservationTableToolbarActions";

interface ReservationTableProps {
  data: DetailedReservation[];
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

export function ReservationTable({
  data,
  pagination,
  onPaginationChange,
  tableState,
  tableActions,
  filtersState,
  getFilterValueByColumn,
  localSearch,
}: ReservationTableProps) {
  const { user } = useProfile();
  const columns = useMemo(() => reservationColumns(user?.isSuperAdmin || false), []);

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
      toolbarActions={(table: TableInstance<DetailedReservation>) => <ReservationTableToolbarActions table={table} />}
      filterPlaceholder="Buscar reservaciones..."
      facetedFilters={facetedFilters}
      enableExpansion={true}
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
