"use client";

import { useMemo } from "react";
import { Table as TableInstance } from "@tanstack/react-table";

import { useProfile } from "@/app/(admin)/profile/_hooks/use-profile";
import { DataTable } from "@/components/datatable/data-table";
import { SummaryPayment } from "../../_types/payment";
import { facetedFilters } from "../../_utils/payments.filter.utils";
import { paymentsColumns } from "./PaymentsTableColumns";
import { PaymentsTableToolbarActions } from "./PaymentsTableToolbarActions";

export function PaymentsTable({ data }: { data: SummaryPayment[] }) {
  const { user } = useProfile();
  const columns = useMemo(() => paymentsColumns(user?.isSuperAdmin || false), [user]);

  return (
    <DataTable
      data={data}
      columns={columns}
      toolbarActions={(table: TableInstance<SummaryPayment>) => <PaymentsTableToolbarActions table={table} />}
      filterPlaceholder="Buscar pagos..."
      facetedFilters={facetedFilters}
    />
  );
}
