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
}

export function ReservationTable({ data, pagination, onPaginationChange }: ReservationTableProps) {
  const { user } = useProfile();
  const columns = useMemo(() => reservationColumns(user?.isSuperAdmin || false), []);

  return (
    <DataTable
      data={data}
      columns={columns}
      toolbarActions={(table: TableInstance<DetailedReservation>) => <ReservationTableToolbarActions table={table} />}
      filterPlaceholder="Buscar clientes..."
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
