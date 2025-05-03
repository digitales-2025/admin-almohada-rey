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
}

export function ExpensesTable({ data, pagination, onPaginationChange }: ExpensesTableProps) {
  const columns = useMemo(() => expensesColumns(), []);

  return (
    <DataTable
      data={data}
      columns={columns}
      toolbarActions={(table: TableInstance<HotelExpense>) => <ExpensesTableToolbarActions table={table} />}
      filterPlaceholder="Buscar gastos..."
      facetedFilters={facetedFilters}
      serverPagination={{
        pageIndex: pagination.page - 1, // TanStack Table usa 0-indexed, tu API usa 1-indexed
        pageSize: pagination.pageSize,
        pageCount: pagination.totalPages,
        total: pagination.total,
        onPaginationChange: (pageIndex, pageSize) => {
          onPaginationChange(pageIndex + 1, pageSize); // Convierte a 1-indexed para el API
        },
      }}
    />
  );
}
