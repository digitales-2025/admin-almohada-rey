"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Table as TableInstance } from "@tanstack/react-table";

import { useProfile } from "@/app/(admin)/profile/_hooks/use-profile";
import { DataTable } from "@/components/datatable/data-table";
import {
  CustomPaginationTableParams,
  ServerPaginationChangeEventCallback,
} from "@/types/tanstack-table/CustomPagination";
import { Customer } from "../../_types/customer";
import { facetedFilters } from "../../_utils/customers.filter.utils";
import { CustomerDescription } from "./CustomerDescription";
import { customersColumns } from "./CustomersTableColumns";
import { CustomersTableToolbarActions } from "./CustomersTableToolbarActions";

interface CustomersTableProps {
  data: Customer[];
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

export function CustomersTable({
  data,
  pagination,
  onPaginationChange,
  tableState,
  tableActions,
  filtersState,
  getFilterValueByColumn,
  localSearch,
}: CustomersTableProps) {
  const { user } = useProfile();
  const router = useRouter();

  const handleCustomerHistoryInterface = useCallback(
    (id: string) => {
      router.push(`/customers/${id}/history`);
    },
    [router]
  );

  const columns = useMemo(
    () => customersColumns(user?.isSuperAdmin || false, handleCustomerHistoryInterface),
    [user, handleCustomerHistoryInterface]
  );

  // Configuración de paginación del servidor
  const serverPagination = {
    pageIndex: tableState?.pagination.pageIndex ?? pagination.page - 1,
    pageSize: tableState?.pagination.pageSize ?? pagination.pageSize,
    pageCount: pagination.totalPages,
    total: pagination.total,
    onPaginationChange: (pageIndex: number, pageSize: number) => {
      if (tableActions) {
        tableActions.setPagination({ pageIndex, pageSize });
      }
      // También llamar al callback original para mantener compatibilidad
      onPaginationChange(pageIndex + 1, pageSize);
    },
  };

  return (
    <DataTable
      data={data}
      columns={columns}
      toolbarActions={(table: TableInstance<Customer>) => <CustomersTableToolbarActions table={table} />}
      filterPlaceholder="Buscar clientes por nombre, email, teléfono, documento..."
      facetedFilters={facetedFilters}
      enableExpansion={true}
      renderExpandedRow={(row) => <CustomerDescription row={row} />}
      serverPagination={serverPagination}
      externalGlobalFilter={localSearch}
      externalFilters={filtersState?.filters}
      getFilterValueByColumn={getFilterValueByColumn}
      // Funcionalidad de tachado para clientes en blacklist
      shouldStrikeRow={(customer) => customer.isBlacklist === true}
      strikeRowClassName="line-through opacity-60 text-red-500"
      // Integración con el hook avanzado (solo si está disponible)
      {...(tableActions && {
        onSortingChange: tableActions.setSorting,
        onColumnFiltersChange: (filters) => {
          tableActions.setColumnFilters(filters);
        },
        onGlobalFilterChange: tableActions.setGlobalFilter,
        onPaginationChange: tableActions.setPagination,
      })}
    />
  );
}
