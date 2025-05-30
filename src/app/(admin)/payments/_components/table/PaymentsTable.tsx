"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Table as TableInstance } from "@tanstack/react-table";

import { DataTable } from "@/components/datatable/data-table";
import {
  CustomPaginationTableParams,
  ServerPaginationChangeEventCallback,
} from "@/types/tanstack-table/CustomPagination";
import { SummaryPayment } from "../../_types/payment";
import { facetedFilters } from "../../_utils/payments.filter.utils";
import { paymentsColumns } from "./PaymentsTableColumns";
import { PaymentsTableToolbarActions } from "./PaymentsTableToolbarActions";

interface PaymentsTableProps {
  data: SummaryPayment[];
  pagination: CustomPaginationTableParams;
  onPaginationChange: ServerPaginationChangeEventCallback;
}

export function PaymentsTable({ data, pagination, onPaginationChange }: PaymentsTableProps) {
  const router = useRouter();

  const handleManagementPaymentInterface = useCallback(
    (id: string) => {
      router.push(`/payments/${id}/update`);
    },
    [router]
  );
  const columns = useMemo(() => paymentsColumns(handleManagementPaymentInterface), [handleManagementPaymentInterface]);

  return (
    <DataTable
      data={data}
      columns={columns}
      toolbarActions={(table: TableInstance<SummaryPayment>) => <PaymentsTableToolbarActions table={table} />}
      filterPlaceholder="Buscar pagos..."
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
