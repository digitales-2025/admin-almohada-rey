"use client";

import { useMemo } from "react";
import { Table as TableInstance } from "@tanstack/react-table";

import { DataTable } from "@/components/datatable/data-table";
import { HotelExpense } from "../../_types/expenses";
import { facetedFilters } from "../../_utils/expenses.filter.utils";
import { expensesColumns } from "./ExpensesTableColumns";
import { ExpensesTableToolbarActions } from "./ExpensesTableToolbarActions";

export function ExpensesTable({ data }: { data: HotelExpense[] }) {
  const columns = useMemo(() => expensesColumns(), []);

  return (
    <DataTable
      data={data}
      columns={columns}
      toolbarActions={(table: TableInstance<HotelExpense>) => <ExpensesTableToolbarActions table={table} />}
      filterPlaceholder="Buscar gastos..."
      facetedFilters={facetedFilters}
    />
  );
}
