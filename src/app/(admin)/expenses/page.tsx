"use client";

import { useState } from "react";

import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import ErrorGeneral from "@/components/errors/general-error";
import { Button } from "@/components/ui/button";
import { DateFilterRoomCleaning } from "./_components/calendar/calendar-date-picker";
import { ExpensesTable } from "./_components/table/ExpensesTable";
import { defaultParamConfig, usePaginatedExpenses } from "./_hooks/use-expenses";
import { PaginatedExpenseParams } from "./_services/expensesApi";

export default function ExpensesPage() {
  // Estados para filtros
  const [selectedYear, setSelectedYear] = useState<string | undefined>(undefined);
  const [selectedMonth, setSelectedMonth] = useState<string | undefined>(undefined);
  const [filterConfig, setFilterConfig] = useState<PaginatedExpenseParams>(defaultParamConfig);

  // Hook paginado
  const { queryResponse, updateFilters } = usePaginatedExpenses();
  const { data: response, isLoading, isError } = queryResponse;

  // Función para filtrar
  const handleFilter = () => {
    const fieldFilters: Record<string, string> = {};
    if (selectedYear && selectedMonth) {
      fieldFilters.date = `${selectedYear}-${selectedMonth}`;
    } else if (selectedYear) {
      fieldFilters.date = `${selectedYear}`;
    }
    const newConfig: PaginatedExpenseParams = {
      pagination: { page: 1, pageSize: 10 },
      fieldFilters,
    };
    setFilterConfig(newConfig);
    updateFilters(newConfig);
  };

  // Función para mostrar todos
  const handleShowAll = () => {
    setSelectedMonth(undefined);
    setSelectedYear(undefined);
    setFilterConfig(defaultParamConfig);
    updateFilters(defaultParamConfig);
  };

  // Manejar cambios de paginación
  const handlePaginationChange = (page: number, pageSize: number) => {
    const newConfig: PaginatedExpenseParams = {
      ...filterConfig,
      pagination: {
        ...filterConfig.pagination,
        page,
        pageSize,
      },
    };
    setFilterConfig(newConfig);
    updateFilters(newConfig);
  };

  // Loading
  if (isLoading) {
    return (
      <div>
        <HeaderPage title="Gastos" description="Gastos registrados en el sistema." />
        <DataTableSkeleton columns={6} />
      </div>
    );
  }

  // Error
  if (isError || !response) {
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
          <Button onClick={handleShowAll} variant="secondary" className="w-full sm:w-auto">
            Mostrar todo
          </Button>
        </div>
      </div>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <ExpensesTable
          data={response.data}
          pagination={{
            page: response.meta.page,
            pageSize: response.meta.pageSize,
            total: response.meta.total,
            totalPages: response.meta.totalPages,
          }}
          onPaginationChange={handlePaginationChange}
        />
      </div>
    </div>
  );
}
