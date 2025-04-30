"use client";

import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import ErrorGeneral from "@/components/errors/general-error";
import { ExpensesTable } from "./_components/table/ExpensesTable";
import { useExpenses } from "./_hooks/use-expenses";

export default function ExpensesPage() {
  // Usamos el hook personalizado para obtener todos los gastos
  const { expensesList, isLoadingExpenses } = useExpenses();

  if (isLoadingExpenses) {
    return (
      <div>
        <HeaderPage title="Gastos" description="Gastos registrados en el sistema." />
        <DataTableSkeleton columns={6} />
      </div>
    );
  }

  if (!expensesList) {
    return (
      <div>
        <HeaderPage title="Gastos" description="Gastos registrados en el sistema." />
        <ErrorGeneral />
      </div>
    );
  }

  return (
    <div>
      <HeaderPage title="Gastos" description="Gastos registrados en el sistema." />
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <ExpensesTable data={expensesList} />
      </div>
    </div>
  );
}
