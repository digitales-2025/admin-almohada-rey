"use client";

import { useMemo } from "react";

import { DataTable } from "@/components/datatable/data-table";
import {
  CustomPaginationTableParams,
  ServerPaginationChangeEventCallback,
} from "@/types/tanstack-table/CustomPagination";
import { HotelExpense } from "../../_types/expenses";
import { facetedFilters } from "../../_utils/expenses.filter.utils";
import { expensesColumns } from "./ExpensesTableColumns";
import { ExpensesTableToolbarActions } from "./ExpensesTableToolbarActions";

interface ExpensesTableProps {
  data: HotelExpense[];
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

export function ExpensesTable({
  data,
  pagination,
  onPaginationChange,
  tableState,
  tableActions,
  filtersState,
  getFilterValueByColumn,
  localSearch,
}: ExpensesTableProps) {
  const columns = useMemo(() => expensesColumns(), []);

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
      toolbarActions={(table: any) => <ExpensesTableToolbarActions table={table} />}
      filterPlaceholder="Buscar gastos..."
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
