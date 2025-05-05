"use client";

import { useMemo } from "react";
import { Table as TableInstance } from "@tanstack/react-table";

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
  refetchPaginatedExpenses: () => void;
}

export function ExpensesTable({ data, pagination, onPaginationChange, refetchPaginatedExpenses }: ExpensesTableProps) {
  const columns = useMemo(() => expensesColumns(refetchPaginatedExpenses), [refetchPaginatedExpenses]);

  return (
    <DataTable
      data={data}
      columns={columns}
      toolbarActions={(table: TableInstance<HotelExpense>) => (
        <ExpensesTableToolbarActions table={table} refetchPaginatedExpenses={refetchPaginatedExpenses} />
      )}
      filterPlaceholder="Buscar gastos..."
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
