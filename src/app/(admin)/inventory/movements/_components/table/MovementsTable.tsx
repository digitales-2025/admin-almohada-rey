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
  tableState?: any;
  tableActions?: any;
  filtersState?: any;
  getFilterValueByColumn?: (columnId: string) => any;
  localSearch?: string;
}

export function MovementsTable({
  data,
  type,
  pagination,
  onPaginationChange,
  tableState,
  tableActions,
  filtersState,
  getFilterValueByColumn,
  localSearch,
}: MovementsTableProps) {
  const { user } = useProfile();

  const columns = useMemo(() => movementsColumns(user?.isSuperAdmin || false), [user]);

  const placeholderText = type === MovementsType.INPUT ? "Buscar ingresos..." : "Buscar salidas...";

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
      toolbarActions={<MovementsTableToolbarActions type={type} />}
      facetedFilters={facetedFilters}
      filterPlaceholder={placeholderText}
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
