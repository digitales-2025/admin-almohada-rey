"use client";

import { useState } from "react";

import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import ErrorGeneral from "@/components/errors/general-error";
import { Button } from "@/components/ui/button";
import { DateFilterRoomCleaning } from "./_components/calendar/calendar-date-picker";
import { ExpensesTable } from "./_components/table/ExpensesTable";
import { useExpenses } from "./_hooks/use-expenses";

export default function ExpensesPage() {
  const { expensesList, isLoadingExpenses, useGetExpensesByDate, refetchExpenses } = useExpenses();

  // Fecha actual
  const today = new Date();
  const currentYear = today.getFullYear().toString();
  const currentMonth = (today.getMonth() + 1).toString().padStart(2, "0");
  const currentDay = today.getDate().toString().padStart(2, "0");

  // Estados para filtros
  const [selectedYear, setSelectedYear] = useState<string | undefined>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<string | undefined>(currentMonth);
  const [filteredData, setFilteredData] = useState<any[] | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);

  // Hook para obtener gastos por fecha
  const { expenses: filteredExpenses, isLoading: isLoadingFiltered } = useGetExpensesByDate(
    `${selectedYear}-${selectedMonth}-${currentDay}`
  );

  // Función para filtrar
  const handleFilter = () => {
    setIsFiltering(true);
    setFilteredData(filteredExpenses ?? []);
  };

  // Función para mostrar todos
  const handleShowAll = () => {
    setIsFiltering(false);
    setFilteredData(null);
    setSelectedMonth(undefined); // <-- Selecciona "Todos los meses"
    setSelectedYear(undefined); // <-- Selecciona "Todos los años"
    refetchExpenses();
  };

  // Loading
  if (isLoadingExpenses || (isFiltering && isLoadingFiltered)) {
    return (
      <div>
        <HeaderPage title="Gastos" description="Gastos registrados en el sistema." />
        <DataTableSkeleton columns={6} />
      </div>
    );
  }

  // Error
  if (!expensesList && !filteredData) {
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
          <Button onClick={handleFilter} className="w-full sm:w-auto">
            Filtrar fecha
          </Button>
          <Button onClick={handleShowAll} variant="secondary" disabled={!isFiltering} className="w-full sm:w-auto">
            Mostrar todo
          </Button>
        </div>
      </div>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <ExpensesTable data={isFiltering ? (filteredData ?? []) : (expensesList ?? [])} />
      </div>
    </div>
  );
}
