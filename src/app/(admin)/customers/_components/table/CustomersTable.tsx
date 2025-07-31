"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Table as TableInstance } from "@tanstack/react-table";

import { useProfile } from "@/app/(admin)/profile/_hooks/use-profile";
import { DataTableExpanded } from "@/components/datatable/data-table-expanded";
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
}

export function CustomersTable({ data, pagination, onPaginationChange }: CustomersTableProps) {
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

  return (
    <DataTableExpanded
      data={data}
      columns={columns}
      toolbarActions={(table: TableInstance<Customer>) => <CustomersTableToolbarActions table={table} />}
      filterPlaceholder="Buscar clientes..."
      facetedFilters={facetedFilters}
      renderExpandedRow={(row) => <CustomerDescription row={row} />}
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
