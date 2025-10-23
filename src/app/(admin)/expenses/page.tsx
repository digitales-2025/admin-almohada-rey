"use client";

import { useCallback, useState } from "react";

import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import ErrorGeneral from "@/components/errors/general-error";
import { Button } from "@/components/ui/button";
import { DateFilterRoomCleaning } from "./_components/calendar/calendar-date-picker";
import { ExpensesTable } from "./_components/table/ExpensesTable";
import { useAdvancedExpenses } from "./_hooks/useAdvancedExpenses";

// Utilidades para la fecha actual
const today = new Date();
const currentYear = today.getFullYear().toString();
const currentMonth = (today.getMonth() + 1).toString().padStart(2, "0");

export default function ExpensesPage() {
  // Estados para filtros y paginación
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedYear, setSelectedYear] = useState<string | undefined>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<string | undefined>(currentMonth);

  // Usar el hook avanzado
  const {
    data: expensesData,
    meta: expensesMeta,
    isLoading,
    error,
    tableState,
    tableActions,
    filtersState,
    getFilterValueByColumn,
    localSearch,
  } = useAdvancedExpenses({
    initialPagination: { page, pageSize },
    year: selectedYear,
    month: selectedMonth,
  });

  // Manejar cambios de paginación
  const handlePaginationChange = useCallback((newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  }, []);

  // Función para mostrar todos los registros
  const handleShowAll = useCallback(() => {
    setSelectedYear(undefined);
    setSelectedMonth(undefined);
    setPage(1);
  }, []);

  // Loading
  if (isLoading) {
    return (
      <div>
        <HeaderPage title="Gastos" description="Gastos registrados en el sistema." />
        <DataTableSkeleton columns={7} numFilters={3} />
      </div>
    );
  }

  // Error
  if (error) {
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
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
        <DateFilterRoomCleaning
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onSelectMonth={setSelectedMonth}
          onSelectYear={setSelectedYear}
        />
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button onClick={handleShowAll} variant="secondary" className="w-full sm:w-auto">
            Mostrar todo
          </Button>
        </div>
      </div>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <ExpensesTable
          data={expensesData}
          pagination={{
            page: expensesMeta?.page || page,
            pageSize: expensesMeta?.pageSize || pageSize,
            total: expensesMeta?.total || 0,
            totalPages: expensesMeta?.totalPages || 0,
          }}
          onPaginationChange={handlePaginationChange}
          tableState={tableState}
          tableActions={tableActions}
          filtersState={filtersState}
          getFilterValueByColumn={getFilterValueByColumn}
          localSearch={localSearch}
        />
      </div>
    </div>
  );
}
