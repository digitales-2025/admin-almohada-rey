"use client";

import { useMemo } from "react";

import { useProfile } from "@/app/(admin)/profile/_hooks/use-profile";
import { DataTable } from "@/components/datatable/data-table";
import {
  CustomPaginationTableParams,
  ServerPaginationChangeEventCallback,
} from "@/types/tanstack-table/CustomPagination";
import { MovementsType, SummaryMovements } from "../../_types/movements";
import { facetedFilters } from "../../_utils/movements.filter.utils";
import { movementsColumns } from "./MovementsTableColumns";
import { MovementsTableToolbarActions } from "./MovementsTableToolbarActions";

interface MovementsTableProps {
  data: SummaryMovements[];
  type: MovementsType;
  pagination: CustomPaginationTableParams;
  onPaginationChange: ServerPaginationChangeEventCallback;
}

export function MovementsTable({ data, type, pagination, onPaginationChange }: MovementsTableProps) {
  const { user } = useProfile();

  const columns = useMemo(() => movementsColumns(user?.isSuperAdmin || false), [user]);

  const placeholderText = type === MovementsType.INPUT ? "Buscar ingresos..." : "Buscar salidas...";

  return (
    <DataTable
      data={data}
      columns={columns}
      toolbarActions={<MovementsTableToolbarActions type={type} />}
      facetedFilters={facetedFilters}
      filterPlaceholder={placeholderText}
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
