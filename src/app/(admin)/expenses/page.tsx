"use client";

import { useEffect, useState } from "react";

import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import ErrorGeneral from "@/components/errors/general-error";
import { Button } from "@/components/ui/button";
import { DateFilterRoomCleaning } from "./_components/calendar/calendar-date-picker";
import { ExpensesTable } from "./_components/table/ExpensesTable";
import { defaultParamConfig, usePaginatedExpenses } from "./_hooks/use-expenses";
import { PaginatedExpenseParams } from "./_services/expensesApi";

// Utilidades para la fecha actual
const today = new Date();
const currentYear = today.getFullYear().toString();
const currentMonth = (today.getMonth() + 1).toString().padStart(2, "0");

export default function ExpensesPage() {
  // Estados para filtros (inicializan con la fecha actual)
  const [selectedYear, setSelectedYear] = useState<string | undefined>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<string | undefined>(currentMonth);
  const [filterConfig, setFilterConfig] = useState<PaginatedExpenseParams>(defaultParamConfig);

  // Hook paginado
  const { queryResponse, updateFilters } = usePaginatedExpenses();
  const { data: response, isLoading, isError } = queryResponse;

  // Al montar, aplica el filtro de la fecha actual
  useEffect(() => {
    if (selectedYear && selectedMonth) {
      const fieldFilters: Record<string, string> = {
        date: `${selectedYear}-${selectedMonth}`,
      };
      const newConfig: PaginatedExpenseParams = {
        pagination: { page: 1, pageSize: 10 },
        fieldFilters,
      };

      setFilterConfig(newConfig);
      updateFilters(newConfig);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Función para filtrar
  const handleFilter = () => {
    let date = "";
    if (selectedYear && selectedMonth) {
      date = `${selectedYear}-${selectedMonth}`;
    } else if (selectedYear && !selectedMonth) {
      date = `${selectedYear}-00`;
    } else if (!selectedYear && selectedMonth) {
      date = `0000-${selectedMonth}`;
    }

    const fieldFilters: Record<string, string> = {};
    if (date) {
      fieldFilters.date = date;
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
